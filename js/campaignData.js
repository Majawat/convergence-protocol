// js/campaignData.js - Handles campaign specific data

/**
 * Campaign Data Manager
 */
class CampaignDataManager {
  constructor() {
    this.campaign = null;
    this.armies = [];
    this.missions = [];
    this.doctrines = [];
    this.isLoaded = false;
  }

  /**
   * Load all campaign data
   */
  async loadAllData() {
    if (this.isLoaded) return;

    try {
      // Load campaign data
      const campaignData = await dataManager.loadJsonData("data/campaign.json");
      this.campaign = campaignData;

      // Load doctrines data
      const doctrinesData = await dataManager.loadJsonData(
        "data/doctrines.json"
      );
      this.doctrines = doctrinesData.doctrines;

      // Load armies data (assuming each army has its own JSON file)
      this.armies = campaignData.armies;

      // Load missions data (if we have a missions.json file)
      try {
        const missionsData = await dataManager.loadJsonData(
          "data/missions.json"
        );
        this.missions = missionsData.missions;
      } catch (error) {
        console.warn("No missions data found:", error);
        this.missions = [];
      }

      this.isLoaded = true;

      // Dispatch event to notify components that data is loaded
      document.dispatchEvent(new CustomEvent("campaign-data-loaded"));
    } catch (error) {
      console.error("Error loading campaign data:", error);
      showToast("Failed to load campaign data", "danger");
    }
  }

  /**
   * Get sorted leaderboard data
   * @return {Array} Sorted array of players by wins
   */
  getLeaderboardData() {
    if (!this.isLoaded || !this.armies) {
      return [];
    }

    // Sort by wins, then objectives
    return [...this.armies].sort((a, b) => {
      if (b.wins !== a.wins) {
        return b.wins - a.wins; // Sort by wins (descending)
      }
      return b.objectives - a.objectives; // Then by objectives
    });
  }

  /**
   * Get current mission data
   * @return {Object|null} Current mission or null if none
   */
  getCurrentMission() {
    if (!this.isLoaded || !this.missions || this.missions.length === 0) {
      return null;
    }

    // Find the first incomplete mission
    const currentMission = this.missions.find((mission) => !mission.completed);

    return currentMission || this.missions[this.missions.length - 1];
  }

  /**
   * Get campaign progress percentage
   * @return {number} Progress as percentage
   */
  getCampaignProgress() {
    if (!this.isLoaded || !this.missions || this.missions.length === 0) {
      return 0;
    }

    const completedMissions = this.missions.filter(
      (mission) => mission.completed
    ).length;
    return Math.round((completedMissions / this.missions.length) * 100);
  }
}

// Create global campaign data manager instance
const campaignData = new CampaignDataManager();
