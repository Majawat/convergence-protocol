// Army.js

import { Unit } from "./Unit.js";

class Army {
  constructor(data) {
    // Basic properties
    this.id = data.id || this.generateId();
    this.name = data.name || "Unnamed Army";
    this.gameSystem = data.gameSystem || "gf"; // Default to Grimdark Future
    this.pointsLimit = data.pointsLimit || 0;
    this.pointsUsed = 0;
    this.modelCount = data.modelCount || 0;
    this.activationCount = data.activationCount || 0;

    // Game modes
    this.campaignMode = data.campaignMode || false;
    this.narrativeMode = data.narrativeMode || false;

    // Collections
    this.units = [];
    this.specialRules = data.specialRules || [];
    this.activations = []; // Units that activate independently

    // Process units if provided
    if (data.units && Array.isArray(data.units)) {
      this.processUnits(data.units);
    }
  }

  // Process units from API data and establish relationships
  processUnits(unitDataArray) {
    // First pass: create all unit instances
    const unitMap = new Map();

    unitDataArray.forEach((unitData) => {
      // Create the unit with a reference to this army
      const unit = new Unit(unitData, this);
      this.units.push(unit);
      unitMap.set(unit.selectionId, unit);
      this.pointsUsed += unit.cost;
    });

    // Second pass: establish combined unit and joined unit relationships
    this.units.forEach((unit) => {
      // Handle combined units
      if (unit.combined) {
        const connectedUnits = this.units.filter(
          (u) =>
            u.customName === unit.customName &&
            u.selectionId !== unit.selectionId &&
            u.combined
        );
        unit.combinedUnits = connectedUnits;
      }

      // Handle joined units
      if (unit.joinToUnitId) {
        const parentUnit = unitMap.get(unit.joinToUnitId);
        if (parentUnit) {
          unit.joinedToUnit = parentUnit;
          parentUnit.joinedUnits.push(unit);
        }
      }
    });

    // Build activations list (units that activate independently)
    this.activations = this.units.filter(
      (unit) =>
        !unit.joinedToUnit &&
        (!unit.combined ||
          unit.combinedUnits.length === 0 ||
          (unit.combinedUnits.length > 0 && !unit.joinToUnitId))
    );
  }

  // Add a new unit to the army
  addUnit(unitData) {
    const unit = new Unit(unitData, this);
    this.units.push(unit);
    this.pointsUsed += unit.cost;

    // Update activations if needed
    this.refreshActivations();

    return unit;
  }

  // Remove a unit from the army
  removeUnit(unitId) {
    const unitIndex = this.units.findIndex(
      (unit) => unit.selectionId === unitId
    );

    if (unitIndex !== -1) {
      const unit = this.units[unitIndex];

      // Remove cost from army total
      this.pointsUsed -= unit.cost;

      // Remove the unit
      this.units.splice(unitIndex, 1);

      // Update activations
      this.refreshActivations();

      return true;
    }

    return false;
  }

  // Refresh the activations list
  refreshActivations() {
    this.activations = this.units.filter(
      (unit) =>
        !unit.joinedToUnit &&
        (!unit.combined ||
          unit.combinedUnits.length === 0 ||
          (unit.combinedUnits.length > 0 && !unit.joinToUnitId))
    );
  }

  // Get a specific unit by its selection ID
  getUnitById(selectionId) {
    return this.units.find((unit) => unit.selectionId === selectionId);
  }

  // Calculate remaining points
  getRemainingPoints() {
    return this.pointsLimit - this.pointsUsed;
  }

  // Get all models in the army
  getAllModels() {
    return this.units.flatMap((unit) => unit.models);
  }

  // Reset all units for a new game round
  resetForNewRound() {
    this.units.forEach((unit) => {
      unit.activated = false;
    });
  }

  // Remove all wounds and reset morale states
  resetHealth() {
    this.units.forEach((unit) => {
      unit.wounds = 0;
      unit.isShaken = false;
      unit.isRouted = false;
      unit.isFatigued = false;
      unit.isDestroyed = false;
      unit.updateModelHealth();
    });
  }

  // Save army state (for localStorage)
  toJSON() {
    // Create a simplified version for storage
    return {
      id: this.id,
      name: this.name,
      gameSystem: this.gameSystem,
      pointsLimit: this.pointsLimit,
      pointsUsed: this.pointsUsed,
      modelCount: this.modelCount,
      activationCount: this.activationCount,
      campaignMode: this.campaignMode,
      narrativeMode: this.narrativeMode,

      // Store unit state (wounds, morale, etc.)
      units: this.units.map((unit) => ({
        id: unit.id,
        selectionId: unit.selectionId,
        name: unit.name,
        customName: unit.customName,
        wounds: unit.wounds,
        morale: unit.morale,
        activated: unit.activated,
        isDestroyed: unit.isDestroyed,

        // Store model states
        models: unit.models.map((model) => ({
          modelIndex: model.modelIndex,
          wounds: model.wounds,
          isDestroyed: model.isDestroyed,
        })),
      })),
    };
  }

  // Helper to generate a unique ID
  generateId() {
    return `army_${Math.random().toString(36).substring(2, 11)}`;
  }
}

// Export the class
export { Army };
