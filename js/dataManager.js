// js/dataManager.js - Handles data fetching, caching, and management

/**
 * Data Manager Class to handle loading and caching data
 */
class DataManager {
  constructor() {
    this.cacheExpiration = 30 * 60 * 1000; // 30 minutes in milliseconds
    this.cachedData = {};
    this.isLoading = false;
  }

  /**
   * Loads JSON data from a file with caching
   * @param {string} url - Path to JSON file
   * @param {boolean} forceRefresh - Whether to bypass cache
   * @return {Promise<Object>} Parsed JSON data
   */
  async loadJsonData(url, forceRefresh = false) {
    const cacheKey = `data_${url}`;

    // Check if data is cached and not expired
    if (!forceRefresh) {
      const cachedItem = this.getCachedItem(cacheKey);
      if (cachedItem) {
        return cachedItem.data;
      }
    }

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `Failed to load data from ${url}: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      // Cache the data
      this.setCachedItem(cacheKey, data);

      return data;
    } catch (error) {
      console.error("Error loading data:", error);

      // In case of error, try to use cached data even if expired
      const expiredCache = localStorage.getItem(cacheKey);
      if (expiredCache) {
        try {
          return JSON.parse(expiredCache).data;
        } catch (e) {
          // If parsing fails, rethrow the original error
          throw error;
        }
      }

      throw error;
    }
  }

  /**
   * Get cached item if not expired
   * @param {string} key - Cache key
   * @return {Object|null} Cached item or null if expired/not found
   */
  getCachedItem(key) {
    const cachedString = localStorage.getItem(key);

    if (!cachedString) return null;

    try {
      const cached = JSON.parse(cachedString);
      const now = new Date().getTime();

      if (now - cached.timestamp < this.cacheExpiration) {
        return cached;
      }

      // Return null if expired (will trigger a refresh)
      return null;
    } catch (e) {
      console.error("Error parsing cached data:", e);
      return null;
    }
  }

  /**
   * Set item in cache with timestamp
   * @param {string} key - Cache key
   * @param {Object} data - Data to cache
   */
  setCachedItem(key, data) {
    const cacheObject = {
      timestamp: new Date().getTime(),
      data: data,
    };

    try {
      localStorage.setItem(key, JSON.stringify(cacheObject));
    } catch (e) {
      console.error("Error caching data:", e);
      // If localStorage is full, clear it and try again
      if (e.name === "QuotaExceededError") {
        localStorage.clear();
        localStorage.setItem(key, JSON.stringify(cacheObject));
      }
    }
  }

  /**
   * Clear all cached data
   */
  clearCache() {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("data_")) {
        localStorage.removeItem(key);
      }
    });

    this.cachedData = {};
    showToast("Cache cleared successfully", "success");
  }

  /**
   * Check if there's an in-progress game saved
   * @return {boolean} True if a game is in progress
   */
  hasActiveGame() {
    return localStorage.getItem("activeGame") !== null;
  }

  /**
   * Get active game data
   * @return {Object|null} Game data or null if no active game
   */
  getActiveGame() {
    const gameData = localStorage.getItem("activeGame");
    if (!gameData) return null;

    try {
      return JSON.parse(gameData);
    } catch (e) {
      console.error("Error parsing active game data:", e);
      return null;
    }
  }
}

// Create global data manager instance
const dataManager = new DataManager();
