// Weapon.js
import { SpecialRule } from './SpecialRule.js';

class Weapon {
  constructor(data) {
    // Basic properties
    this.id = data.id || this.generateId();
    this.name = data.name || "Unknown Weapon";
    this.type = data.type || "Melee";

    // Combat stats
    this.range = data.range || 0;
    this.attacks = data.attacks || 1;
    this.count = data.count || 1;

    // Display/UI
    this.label = data.label || this.generateLabel();

    // Relations
    this.specialRules = []; // Will hold SpecialRule instances
    this.dependencies = data.dependencies || []; // For tracking upgrade effects

    // Initialize special rules if provided
    if (data.specialRules && Array.isArray(data.specialRules)) {
      // We'll populate this in a separate method
      this.initializeSpecialRules(data.specialRules);
    }
  }

  // Initialize special rules (handle conversion from data to objects)
  initializeSpecialRules(rulesData) {
    // This is a placeholder - in actual implementation,
    // you would import and use the SpecialRule class
    this.specialRules = rulesData.map((ruleData) => {
      // Create SpecialRule instance from data
      // return new SpecialRule(ruleData);

      // For now, just return the data
      return ruleData;
    });
  }

  // Generate a display label if none provided
  generateLabel() {
    // Start with the weapon name
    let label = this.name;

    // Collect label parts
    const parts = [];

    // Add range if greater than 0
    if (this.range > 0) {
      parts.push(`${this.range}"`);
    }

    // Add attacks
    parts.push(`A${this.attacks}`);

    // Add special rules
    if (this.specialRules && this.specialRules.length > 0) {
      for (const rule of this.specialRules) {
        if (rule.rating !== null && rule.rating !== undefined) {
          parts.push(`${rule.name}(${rule.rating})`);
        } else {
          parts.push(rule.name);
        }
      }
    }

    // Join parts with commas and proper spacing
    if (parts.length > 0) {
      label += ` (${parts.join(", ")})`;
    }

    return label;
  }

  // Check if this weapon has a specific special rule
  hasRule(ruleName) {
    return this.specialRules.some((rule) => rule.name === ruleName);
  }

  // Get a rule's value (e.g., AP(1) would return 1)
  getRuleValue(ruleName) {
    const rule = this.specialRules.find((rule) => rule.name === ruleName);
    return rule ? rule.rating : null;
  }

  // Helper to generate a unique ID
  generateId() {
    return `weapon_ + ${Math.random().toString(36).substring(2, 11)}`;
  }
}

// Export the class
export { Weapon };
