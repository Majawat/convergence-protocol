// SpecialRule.js
class SpecialRule {
  constructor(data) {
    // Basic properties
    this.id = data.id || this.generateId();
    this.name = data.name || "Unknown Rule";
    this.rating = data.rating || null; // For rules with values like AP(1)

    // Display/UI
    this.label = data.label || this.formatLabel();
    this.description = data.description || "";

    // Optional: categorization properties
    this.type = data.type || "passive"; // e.g., passive, active, triggered
    this.phase = data.phase || "any"; // e.g., movement, shooting, melee
  }

  // Format a display label (e.g., "AP(1)")
  formatLabel() {
    if (this.rating !== null) {
      return `${this.name}(${this.rating})`;
    }
    return this.name;
  }

  // Check if this rule is equivalent to another rule
  isEquivalentTo(otherRule) {
    return this.name === otherRule.name && this.rating === otherRule.rating;
  }

  // Clone this rule (useful when applying to new contexts)
  clone() {
    return new SpecialRule({
      id: this.generateId(), // New ID for the clone
      name: this.name,
      rating: this.rating,
      label: this.label,
      description: this.description,
      type: this.type,
      phase: this.phase,
    });
  }

  // Apply this rule's effect (placeholder - implementation depends on your game logic)
  applyEffect(target, context = {}) {
    // This would implement the rule's effect on a target (unit, model, weapon, etc.)
    // Example:
    // if (this.name === 'AP' && target.defense) {
    //    return Math.max(target.defense - this.rating, 0);
    // }

    console.log(`Applying rule ${this.name} to target`);
    return target;
  }

  // Helper to generate a unique ID
  generateId() {
    return `rule_${Math.random().toString(36).substring(2, 11)}`;
  }
}

// Export the class
export { SpecialRule };
