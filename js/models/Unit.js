// Unit.js

import { Model } from "./Model.js";
import { SpecialRule } from "./SpecialRule.js";
import { Upgrade } from "./Upgrade.js";
import { Weapon } from "./Weapon.js";

class Unit {
  constructor(data, armyID) {
    // Basic properties
    this.id = data.id || this.generateId();
    this.selectionId = data.selectionId || this.id;
    this.name = data.name || "Unknown Unit";
    this.customName = data.customName || this.name;
    this.cost = data.cost || 0;

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
    this.models = []; // Models
    this.rules = []; // Special rules
    this.upgrades = []; // Upgrades
    this.traits = data.traits || [];

    // Combined/Joined unit relationships
    this.combinedUnits = []; // Other units combined with this one
    this.joinedUnits = []; // Units joined to this unit
    this.joinedToUnit = null; // Unit this unit is joined to

    // Game state
    this.wounds = 0;
    this.maxWounds = this.size;
    this.activated = false;
    this.isDestroyed = false;
    this.isRouted = false;
    this.isFatigued = false;
    this.isShaken = false;

    // Parent reference
    this.army = armyID;

    // Initialize collections from data
    this.initializeRules(data.rules || []);
    this.initializeLoadout(data.loadout || []);
    this.createModels(data);
    this.initializeUpgrades(data.selectedUpgrades || []);
  }

  // Initialize special rules
  initializeRules(rulesData) {
    // Convert rule data to SpecialRule objects
    // this.rules = rulesData.map(ruleData => new SpecialRule(ruleData));
    this.rules = rulesData; // Simplified for now
  }

  // Initialize weapons loadout
  initializeLoadout(loadoutData) {
    // Convert loadout data to Weapon objects
    // this.loadout = loadoutData.map(weaponData => new Weapon(weaponData));
    this.loadout = loadoutData; // Simplified for now
  }

  // Initialize upgrades
  initializeUpgrades(upgradesData) {
    // Convert upgrade data to Upgrade objects
    // this.upgrades = upgradesData.map(upgradeData => new Upgrade(upgradeData, this));
    this.upgrades = upgradesData; // Simplified for now
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
        quality: this.quality,
        defense: this.defense,
        isHero: this.hasRule("Hero"),
        isCaster: this.hasRule("Caster"),
        unitName: this.customName,
      };

      // Create model instance
      // const model = new Model(modelData, this);
      const model = modelData; // Simplified for now

      this.models.push(model);
    }

    // Assign weapons to models
    this.assignWeaponsToModels();
  }

  // Assign weapons to models based on loadout
  assignWeaponsToModels() {
    // This is a placeholder - implementation will depend on your weapon assignment logic
    console.log(`Assigning weapons to models in unit ${this.name}`);

    // Example implementation would distribute weapons to models
    // based on your game's rules and weapon availability
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
      this.isDestroyed = true;
    } else {
      this.isDestroyed = false;
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

  // Change morale state
  setMorale(newState) {
    this.morale = newState;

    // Apply to combined units
    if (this.combined && this.combinedUnits.length > 0) {
      this.combinedUnits.forEach((unit) => {
        unit.morale = newState;
      });
    }
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
    return `unit_ + ${Math.random().toString(36).substring(2, 11)}`;
  }
}

// Export the class
export { Unit };
