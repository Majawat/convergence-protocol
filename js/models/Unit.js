// Unit.js
import { Model } from "./Model.js";
import { SpecialRule } from "./SpecialRule.js";
import { Weapon } from "./Weapon.js";

class Unit {
  constructor(data) {
    // Basic properties
    this.id = data.id || this.generateId();
    this.selectionId = data.selectionId || this.id;
    this.name = data.name || "Unknown Unit";
    this.customName = data.customName || this.name;
    this.cost = data.cost || 0;
    this.bases = this.processBasesData(data.bases);

    // Unit stats
    this.size = data.size || 1;
    this.quality = data.quality || 4;
    this.defense = data.defense || 4;
    this.xp = data.xp || 0;
    this.notes = data.notes || null;

    // Relationship flags
    this.combined = data.combined || false;
    this.joinToUnitId = data.joinToUnit || null;

    // Collections
    this.loadout = []; // Weapons
    this.weapons = data.weapons || [];
    this.models = []; // Models
    this.rules = []; // Special rules
    this.traits = data.traits || [];

    // Combined/Joined unit relationships
    this.combinedUnits = []; // Other units combined with this one
    this.joinedUnits = []; // Units joined to this unit
    this.joinedToUnit = null; // Unit this unit is joined to

    // Game state
    this.wounds = 0;
    this.activated = false;
    this.isDestroyed = false;
    this.isRouted = false;
    this.isFatigued = false;
    this.isShaken = false;

    // Parent reference
    this.armyId = data.armyId;

    this._weaponsToRemove = [];
    this._upgradedWeapons = [];

    // Initialize collections from data
    this.initializeRules(data.rules || []);
    this.initializeLoadout(data.loadout || []);
    this.createModels(data);

    // Process upgrades last, after base unit is set up
    if (data.selectedUpgrades && data.selectedUpgrades.length > 0) {
      this.processSelectedUpgrades(data.selectedUpgrades);
    }

    this.maxWounds = this.rules.find((rule) => rule.name === "Tough").rating;
  }

  // Initialize special rules
  initializeRules(rulesData) {
    // Convert rule data to SpecialRule objects
    this.rules = rulesData.map((ruleData) => new SpecialRule(ruleData));
    //this.rules = rulesData; // Simplified for now
  }

  // Initialize weapons loadout
  initializeLoadout(loadoutData) {
    // Convert loadout data to Weapon objects
    this.loadout = loadoutData.map((weaponData) => new Weapon(weaponData));
    // this.loadout = loadoutData;
  }

  // Initialize upgrades
  initializeUpgrades(upgradesData) {
    // Convert upgrade data to Upgrade objects
    /* this.upgrades = upgradesData.map(
      (upgradeData) => new Upgrade(upgradeData, this)
    ); */
    this.upgrades = upgradesData; // Simplified for now
  }

  // Process a single upgrade instance
  processUpgradeInstance(upgradeInstance) {
    const { upgrade, option } = upgradeInstance;

    // Handle different upgrade variants
    switch (upgrade.variant) {
      case "upgrade":
        this.applyUpgradeOption(option);
        break;
      case "replace":
        this.applyReplaceOption(upgrade, option);
        break;
      // Add other variant types as needed
    }

    // Apply cost changes
    this.applyCostChanges(option);
  }

  // Apply an upgrade option (adding new items)
  applyUpgradeOption(option) {
    // Add weapons
    if (option.gains) {
      option.gains.forEach((item) => {
        if (item.type === "ArmyBookWeapon") {
          // Add a copy of the weapon to a temporary array
          // We'll rebuild the loadout later
          this._upgradedWeapons.push({ ...item });
        } else if (item.type === "ArmyBookRule") {
          // Add rules if the option adds any
          this.rules.push(new SpecialRule(item));
        }
        // Handle other item types
      });
    }
  }

  // Apply a replace option (replacing existing items)
  applyReplaceOption(upgrade, option) {
    // Process weapon replacements
    if (upgrade.targets && upgrade.targets.length > 0) {
      upgrade.targets.forEach((targetName) => {
        // Mark weapons with this name for removal
        this._weaponsToRemove.push(targetName);
      });
    }

    // Add new weapons from the option
    this.applyUpgradeOption(option);
  }

  // Apply cost changes from an upgrade option
  applyCostChanges(option) {
    if (!option.costs) return;

    // Find costs relevant to this unit
    const unitCost = option.costs.find((cost) => cost.unitId === this.id);
    if (unitCost) {
      this.cost += unitCost.cost;
    }
  }

  // Rebuild the final loadout after applying all upgrades
  rebuildLoadout() {
    // Start with a copy of the original weapons
    const finalLoadout = [...this.weapons];

    // Remove weapons that have been replaced
    const filteredLoadout = finalLoadout.filter(
      (weapon) => !this._weaponsToRemove.includes(weapon.name)
    );

    // Add new weapons from upgrades
    const completeLoadout = [...filteredLoadout, ...this._upgradedWeapons];

    // Update the unit's loadout
    this.loadout = completeLoadout;
  }

  // Helper method to process bases sizes
  processBasesData(basesData) {
    if (basesData === "none") {
      return null;
    } else if (basesData && typeof basesData === "object") {
      // Optional: validate object structure
      if (basesData.round || basesData.square) {
        return basesData;
      }
    }
    // Default return if not valid
    return null;
  }

  // Process all selected upgrades
  processSelectedUpgrades(selectedUpgrades) {
    if (!selectedUpgrades || !Array.isArray(selectedUpgrades)) return;

    // Process each upgrade instance
    selectedUpgrades.forEach((upgradeInstance) => {
      this.processUpgradeInstance(upgradeInstance);
    });

    // Rebuild the final loadout
    this.rebuildLoadout();
  }

  // Create individual models with assigned weapons
  createModels(data) {
    // Clear existing models
    this.models = [];

    // Create models based on unit size
    for (let i = 0; i < this.size; i++) {
      const modelData = {
        unitId: this.selectionId,
        modelIndex: i,
        isHero: this.hasRule("Hero"),
        isCaster: this.hasRule("Caster"),
        name: this.createModelName(i, this.size),
        casterRating: this.hasRule("Caster") ? getCasterRating() : 0,
        maxWounds: this.rules.find((rule) => rule.name === "Tough").rating,
      };

      // Create model instance
      const model = new Model(modelData);

      this.models.push(model);
    }

    // Assign weapons to models
    this.assignWeaponsToModels();
  }

  // Find the caster rating for the unit
  getCasterRating(rules) {
    if (hasRule("Caster")) {
      return rules.find((rule) => rule.name === "Caster").rating;
    }
    return 0;
  }

  // Create model name
  createModelName(index, size) {
    if (size === 1) {
      return this.customName;
    } else {
      return `${this.name} ${index + 1}`;
    }
  }

  // Assign weapons to models based on loadout
  assignWeaponsToModels() {
    // This is a placeholder - implementation will depend on your weapon assignment logic
    console.log(`Assigning weapons to models in unit: ${this.name}`);
    // Assigning all weapons if there is only one model
    if (this.models.length === 1) {
      this.models[0].weapons = this.loadout;
      return;
    }

    // Assigning weapons to each model
    this.loadout.forEach((weapon, index) => {
      this.models[index % this.models.length].weapons.push(weapon);
    });
  }

  // Check if unit has a specific rule
  hasRule(ruleName) {
    return this.rules.some((rule) => rule.name === ruleName);
  }

  // Take damage on the unit
  takeDamage(wounds) {
    const originalWounds = this.wounds;
    this.wounds += wounds;

    // Cap at max wounds
    if (this.wounds > this.maxWounds) {
      this.wounds = this.maxWounds;
    }

    // Handle healing
    if (this.wounds < 0) {
      this.wounds = 0;
    }

    // Update model health
    this.updateModelHealth();

    // Handle combined units - damage is shared
    if (this.combined && this.combinedUnits.length > 0) {
      this.combinedUnits.forEach((unit) => {
        unit.wounds = this.wounds;
        unit.updateModelHealth();
      });
    }

    // Check if destroyed
    if (this.wounds >= this.maxWounds) {
      this.setDestroyed(true);
    } else {
      this.setDestroyed(false);
    }

    return this.wounds - originalWounds;
  }

  // Update individual model health based on unit wounds
  updateModelHealth() {
    // This is a placeholder - implementation will depend on your health tracking system
    console.log(`Updating model health for unit ${this.name}`);

    // Example implementation would distribute damage among models
    // based on your game's rules for casualty allocation
  }

  // Set Shaken state
  setShaken(newState) {
    this.isShaken = newState;
  }

  // Set Fatigued state
  setFatigued(newState) {
    this.isFatigued = newState;
  }

  // Set Routed state
  setRouted(newState) {
    this.isRouted = newState;
  }

  // Set Destroyed State
  setDestroyed(newState) {
    this.isDestroyed = newState;
  }

  // Get total size including combined units
  getTotalSize() {
    let totalSize = this.size;

    // Add combined units
    if (this.combined && this.combinedUnits.length > 0) {
      totalSize += this.combinedUnits.reduce((sum, unit) => sum + unit.size, 0);
    }

    // Add joined heroes
    if (this.joinedUnits.length > 0) {
      totalSize += this.joinedUnits.reduce((sum, unit) => sum + unit.size, 0);
    }

    return totalSize;
  }

  // Get all models including from combined units and joined units
  getAllModels() {
    let allModels = [...this.models];

    // Add models from combined units
    if (this.combined && this.combinedUnits.length > 0) {
      this.combinedUnits.forEach((unit) => {
        allModels = allModels.concat(unit.models);
      });
    }

    // Add models from joined units
    if (this.joinedUnits.length > 0) {
      this.joinedUnits.forEach((unit) => {
        allModels = allModels.concat(unit.models);
      });
    }

    return allModels;
  }

  // Reset the unit for a new game round
  resetForNewRound() {
    this.activated = false;
  }

  // Helper to generate a unique ID
  generateId() {
    return `unit_${Math.random().toString(36).substring(2, 11)}`;
  }
}

// Export the class
export { Unit };
