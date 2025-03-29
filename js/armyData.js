<<<<<<< HEAD
// js/armyData.js - Handles loading and parsing army data

/**
 * Army Data Manager Class
 * Handles loading and parsing army data from JSON files
 */
class ArmyDataManager {
  constructor() {
    this.armies = {};
    this.currentArmy = null;
    this.campaignData = null;
  }

  /**
   * Load army data by URL identifier
   * @param {string} armyUrl - The army URL identifier
   * @return {Promise<Object>} - The parsed army data
   */
  async loadArmy(armyUrl) {
    if (this.armies[armyUrl]) {
      this.currentArmy = this.armies[armyUrl];
      return this.currentArmy;
    }

    try {
      // First get the army info
      const armyInfo = await this.getArmyInfo(armyUrl);

      if (!armyInfo) {
        throw new Error(`Army with URL ${armyUrl} not found`);
      }

      // Now load the actual army data file
      const armyData = await dataManager.loadJsonData(`data/${armyUrl}.json`);

      // Process the army data
      this.armies[armyUrl] = this.processArmyData(armyData, armyInfo);
      this.currentArmy = this.armies[armyUrl];

      return this.currentArmy;
    } catch (error) {
      console.error("Error loading army data:", error);
      showToast("Failed to load army data", "danger");
      throw error;
    }
  }

  /**
   * Get information about a specific army
   * @param {string} armyUrl - The army URL identifier
   * @return {Promise<Object>} - Army information
   */
  async getArmyInfo(armyUrl) {
    // Load the campaign data directly
    const campaignData = await dataManager.loadJsonData("data/campaign.json");
    this.campaignData = campaignData;

    // Find the army in campaign data
    return campaignData.armies.find((army) => army.armyURL === armyUrl);
  }

  /**
   * Process raw army data to make it easier to work with
   * @param {Object} armyData - Raw army data from JSON
   * @param {Object} armyInfo - Army info from campaign data
   * @return {Object} - Processed army data
   */
  processArmyData(armyData, armyInfo) {
    // Add campaign info to army data
    const processedData = {
      ...armyData,
      campaignInfo: armyInfo,
      processed: true,
    };

    // Process units for easier access
    processedData.unitsById = {};

    if (armyData.units) {
      armyData.units.forEach((unit) => {
        // Store by ID for easy lookup
        processedData.unitsById[unit.id] = unit;

        // Calculate max wounds based on Tough value or size
        if (unit.rules) {
          const toughRule = unit.rules.find((rule) => rule.name === "Tough");
          if (toughRule) {
            unit.maxWounds = parseInt(toughRule.rating) || 1;
          } else {
            // If no Tough rule, use unit size (for multi-model units)
            unit.maxWounds = parseInt(unit.size) || 1;
          }
        } else {
          unit.maxWounds = parseInt(unit.size) || 1;
        }

        // Initialize current wounds to max
        unit.currentWounds = unit.maxWounds;

        // Initialize activation status
        unit.activated = false;

        // Process unit relationships (combined/joined)
        if (unit.combined === true) {
          unit.isCombined = true;
          // This is a combined unit leader, so we don't need to do anything else
        } else if (unit.joinToUnit) {
          unit.isJoined = true;
          unit.joinedToId = unit.joinToUnit;
        }

        // Add current special status
        unit.status = {
          shaken: false,
          stunned: false,
          pinned: false,
        };
      });
    }

    return processedData;
  }

  /**
   * Get all available army options
   * @return {Promise<Array>} - List of army options
   */
  async getArmyOptions() {
    // Load the campaign data directly instead of using global campaignData
    if (!this.campaignData) {
      this.campaignData = await dataManager.loadJsonData("data/campaign.json");
    }

    return this.campaignData.armies.map((army) => ({
      id: army.armyForgeID,
      name: army.armyName,
      url: army.armyURL,
      player: army.player,
    }));
  }

  /**
   * Get combined units (returns an array of arrays, where each inner array is a group of combined units)
   * @return {Array<Array>} - Combined unit groups
   */
  getCombinedUnits() {
    if (!this.currentArmy || !this.currentArmy.units) {
      return [];
    }

    const combinedUnits = [];
    const processedIds = new Set();

    this.currentArmy.units.forEach((unit) => {
      // Skip if already processed
      if (processedIds.has(unit.selectionId)) {
        return;
      }

      // Find combined units
      if (unit.combined) {
        const group = [unit];
        processedIds.add(unit.selectionId);

        // Find all units that join to this unit
        this.currentArmy.units.forEach((otherUnit) => {
          if (otherUnit.joinToUnit === unit.selectionId) {
            group.push(otherUnit);
            processedIds.add(otherUnit.selectionId);
          }
        });

        combinedUnits.push(group);
      }
    });

    return combinedUnits;
  }

  /**
   * Get joined units (returns an array of objects with hero and joinedTo)
   * @return {Array<Object>} - Joined unit pairs
   */
  getJoinedUnits() {
    if (!this.currentArmy || !this.currentArmy.units) {
      return [];
    }

    const joinedUnits = [];

    this.currentArmy.units.forEach((unit) => {
      if (unit.joinToUnit && !unit.combined) {
        const joinedToUnit = this.currentArmy.unitsById[unit.joinToUnit];
        if (joinedToUnit) {
          joinedUnits.push({
            hero: unit,
            joinedTo: joinedToUnit,
          });
        }
      }
    });

    return joinedUnits;
  }
}

// Create global army data manager instance
const armyData = new ArmyDataManager();
=======
// js/armyData.js - Handles loading and parsing army data

/**
 * Army Data Manager Class
 * Handles loading and parsing army data from JSON files
 */
class ArmyDataManager {
  constructor() {
    this.armies = {};
    this.currentArmy = null;
    this.campaignData = null;
  }

  /**
   * Load army data by URL identifier
   * @param {string} armyUrl - The army URL identifier
   * @return {Promise<Object>} - The parsed army data
   */
  async loadArmy(armyUrl) {
    if (this.armies[armyUrl]) {
      this.currentArmy = this.armies[armyUrl];
      return this.currentArmy;
    }

    try {
      // First get the army info
      const armyInfo = await this.getArmyInfo(armyUrl);

      if (!armyInfo) {
        throw new Error(`Army with URL ${armyUrl} not found`);
      }

      // Now load the actual army data file
      const armyData = await dataManager.loadJsonData(`data/${armyUrl}.json`);

      // Process the army data
      this.armies[armyUrl] = this.processArmyData(armyData, armyInfo);
      this.currentArmy = this.armies[armyUrl];

      return this.currentArmy;
    } catch (error) {
      console.error("Error loading army data:", error);
      showToast("Failed to load army data", "danger");
      throw error;
    }
  }

  /**
   * Get information about a specific army
   * @param {string} armyUrl - The army URL identifier
   * @return {Promise<Object>} - Army information
   */
  async getArmyInfo(armyUrl) {
    // Load the campaign data directly
    const campaignData = await dataManager.loadJsonData("data/campaign.json");
    this.campaignData = campaignData;

    // Find the army in campaign data
    return campaignData.armies.find((army) => army.armyURL === armyUrl);
  }

  /**
   * Process raw army data to make it easier to work with
   * @param {Object} armyData - Raw army data from JSON
   * @param {Object} armyInfo - Army info from campaign data
   * @return {Object} - Processed army data
   */
  processArmyData(armyData, armyInfo) {
    // Add campaign info to army data
    const processedData = {
      ...armyData,
      campaignInfo: armyInfo,
      processed: true,
    };

    // Process units for easier access
    processedData.unitsById = {};

    if (armyData.units) {
      armyData.units.forEach((unit) => {
        // Store by ID for easy lookup
        processedData.unitsById[unit.id] = unit;

        // Calculate max wounds based on Tough value or size
        if (unit.rules) {
          const toughRule = unit.rules.find((rule) => rule.name === "Tough");
          if (toughRule) {
            unit.maxWounds = parseInt(toughRule.rating) || 1;
          } else {
            // If no Tough rule, use unit size (for multi-model units)
            unit.maxWounds = parseInt(unit.size) || 1;
          }
        } else {
          unit.maxWounds = parseInt(unit.size) || 1;
        }

        // Initialize current wounds to max
        unit.currentWounds = unit.maxWounds;

        // Initialize activation status
        unit.activated = false;

        // Process unit relationships (combined/joined)
        if (unit.combined === true) {
          unit.isCombined = true;
          // This is a combined unit leader, so we don't need to do anything else
        } else if (unit.joinToUnit) {
          unit.isJoined = true;
          unit.joinedToId = unit.joinToUnit;
        }

        // Add current special status
        unit.status = {
          shaken: false,
          stunned: false,
          pinned: false,
        };
      });
    }

    return processedData;
  }

  /**
   * Get all available army options
   * @return {Promise<Array>} - List of army options
   */
  async getArmyOptions() {
    // Load the campaign data directly instead of using global campaignData
    if (!this.campaignData) {
      this.campaignData = await dataManager.loadJsonData("data/campaign.json");
    }

    return this.campaignData.armies.map((army) => ({
      id: army.armyForgeID,
      name: army.armyName,
      url: army.armyURL,
      player: army.player,
    }));
  }

  /**
   * Get combined units (returns an array of arrays, where each inner array is a group of combined units)
   * @return {Array<Array>} - Combined unit groups
   */
  getCombinedUnits() {
    if (!this.currentArmy || !this.currentArmy.units) {
      return [];
    }

    const combinedUnits = [];
    const processedIds = new Set();

    this.currentArmy.units.forEach((unit) => {
      // Skip if already processed
      if (processedIds.has(unit.selectionId)) {
        return;
      }

      // Find combined units
      if (unit.combined) {
        const group = [unit];
        processedIds.add(unit.selectionId);

        // Find all units that join to this unit
        this.currentArmy.units.forEach((otherUnit) => {
          if (otherUnit.joinToUnit === unit.selectionId) {
            group.push(otherUnit);
            processedIds.add(otherUnit.selectionId);
          }
        });

        combinedUnits.push(group);
      }
    });

    return combinedUnits;
  }

  /**
   * Get joined units (returns an array of objects with hero and joinedTo)
   * @return {Array<Object>} - Joined unit pairs
   */
  getJoinedUnits() {
    if (!this.currentArmy || !this.currentArmy.units) {
      return [];
    }

    const joinedUnits = [];

    this.currentArmy.units.forEach((unit) => {
      if (unit.joinToUnit && !unit.combined) {
        const joinedToUnit = this.currentArmy.unitsById[unit.joinToUnit];
        if (joinedToUnit) {
          joinedUnits.push({
            hero: unit,
            joinedTo: joinedToUnit,
          });
        }
      }
    });

    return joinedUnits;
  }
}

// Create global army data manager instance
const armyData = new ArmyDataManager();
>>>>>>> refs/remotes/origin/main
