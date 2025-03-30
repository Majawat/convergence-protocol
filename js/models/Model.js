// Model.js
class Model {
  constructor(data) {
    // Initialize basic properties
    this.id = data.id || this.generateId(); // Unique ID for this model
    this.unitId = data.unitId; // ID of the unit this model belongs to
    this.modelIndex = data.modelIndex; // Index of this model in its unit
    this.name = data.name; // Custom name of this model
    this.quality = data.quality;
    this.defense = data.defense;
    this.maxWounds = data.maxWounds || 1;
    this.wounds = 0;

    // Iniialize model type properties
    this.isHero = data.isHero || false;
    this.isCaster = data.isCaster || false;
    this.spellTokens = data.spellTokens || 0;

    // Initialize state properties
    this.isDestroyed = false;

    // Initialize empty collections
    this.weapons = [];
  }

  // Add a weapon to this model
  addWeapon(weapon) {
    this.weapons.push(weapon);
  }

  addSpellToken(amount) {
    this.spellTokens += amount;
    if (this.spellTokens >= 6) {
      this.spellTokens = 6;
    }
    return amount;
  }

  spendSpellToken(amount) {
    this.spellTokens -= amount;
    if (this.spellTokens <= 0) {
      this.spellTokens = 0;
    }
    return amount;
  }

  // Take damage
  takeDamage(amount) {
    this.wounds += amount;
    if (this.wounds >= this.maxWounds) {
      this.wounds = this.maxWounds;
      this.isDestroyed = true;
    }
    return amount;
  }

  // Heal wounds
  heal(amount) {
    this.wounds -= amount;

    if (this.wounds < 0) {
      this.wounds = 0;
    }

    if (this.wounds < this.maxWounds) {
      this.isDestroyed = false;
    }

    return amount;
  }

  // Helper to generate a unique ID
  generateId() {
    return `model_${Math.random().toString(36).substring(2, 11)}`;
  }
}

// You can use this in a module system or as a standalone class
export { Model };
