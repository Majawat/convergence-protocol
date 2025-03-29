// js/tracker.js - Main functionality for the tracker page

/**
 * Game Tracker Class
 * Manages the game state and UI interaction for the tracker
 */
class GameTracker {
  constructor() {
    this.round = 1;
    this.commandPoints = 3;
    this.phase = "movement";
    this.selectedArmy = null;
    this.gameNotes = "";
    this.initialized = false;
    this.activeRandomEvent = null;

    // UI element references
    this.armySelector = document.getElementById("armySelector");
    this.armyName = document.getElementById("armyName");
    this.armyMeta = document.getElementById("armyMeta");
    this.unitContainer = document.getElementById("unitContainer");
    this.currentRound = document.getElementById("currentRound");
    this.roundCounter = document.getElementById("roundCounter");
    this.phaseIndicator = document.getElementById("phaseIndicator");
    this.cpCounter = document.getElementById("cpCounter");
    this.gameNotes = document.getElementById("gameNotes");
    this.randomEventDisplay = document.getElementById("randomEventDisplay");
    this.unitSearch = document.getElementById("unitSearch");
    this.hideActivatedBtn = document.getElementById("hideActivatedBtn");

    // Initialize
    this.init();
  }

  /**
   * Initialize the tracker
   */
  async init() {
    if (this.initialized) return;

    try {
      // Load page parameters
      this.parseUrlParams();

      // Populate army selector
      await this.populateArmySelector();

      // Initialize UI elements
      this.initUI();

      // Load saved game state if available
      this.loadGameState();

      this.initialized = true;
    } catch (error) {
      console.error("Error initializing game tracker:", error);
      showToast("Failed to initialize game tracker", "danger");
    }
  }

  /**
   * Parse URL parameters
   */
  parseUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);

    // Check for army parameter
    const armyParam = urlParams.get("army");
    if (armyParam) {
      this.armyToLoad = armyParam;
    }

    // Check for action parameter
    const actionParam = urlParams.get("action");
    if (actionParam) {
      this.initialAction = actionParam;
    }
  }

  /**
   * Populate the army selector dropdown
   */
  async populateArmySelector() {
    try {
      const armies = await armyData.getArmyOptions();

      // Clear existing options
      this.armySelector.innerHTML =
        '<option value="" selected disabled>Choose an army...</option>';

      // Add army options
      armies.forEach((army) => {
        const option = document.createElement("option");
        option.value = army.url;
        option.textContent = `${army.name} (${army.player})`;
        this.armySelector.appendChild(option);
      });

      // If there's an army to load from URL, select it
      if (this.armyToLoad) {
        this.armySelector.value = this.armyToLoad;
        this.loadArmy(this.armyToLoad);
      }
    } catch (error) {
      console.error("Error populating army selector:", error);
      showToast("Failed to load army options", "danger");
    }
  }

  /**
   * Initialize UI elements and event listeners
   */
  initUI() {
    // Army selector change event
    this.armySelector.addEventListener("change", () => {
      const selectedArmy = this.armySelector.value;
      if (selectedArmy) {
        this.loadArmy(selectedArmy);
      }
    });

    // CP increment/decrement buttons
    document.getElementById("cpIncrementBtn").addEventListener("click", () => {
      this.commandPoints++;
      this.updateCommandPoints();
    });

    document.getElementById("cpDecrementBtn").addEventListener("click", () => {
      if (this.commandPoints > 0) {
        this.commandPoints--;
        this.updateCommandPoints();
      }
    });

    // Round controls
    document.getElementById("nextRoundBtn").addEventListener("click", () => {
      this.nextRound();
    });

    document.getElementById("prevRoundBtn").addEventListener("click", () => {
      this.previousRound();
    });

    // Reset activations button
    document
      .getElementById("resetActivationsBtn")
      .addEventListener("click", () => {
        this.resetActivations();
      });

    // Random event button
    document
      .getElementById("generateEventBtn")
      .addEventListener("click", () => {
        this.generateRandomEvent();
      });

    // Game notes textarea
    this.gameNotes.addEventListener("input", () => {
      this.saveGameState();
    });

    // Search units
    this.unitSearch.addEventListener("input", () => {
      this.filterUnits();
    });

    // Clear search button
    document.getElementById("clearSearchBtn").addEventListener("click", () => {
      this.unitSearch.value = "";
      this.filterUnits();
    });

    // Hide activated units toggle
    this.hideActivatedBtn.addEventListener("change", () => {
      this.toggleActivatedUnits();
    });

    // Save game button
    document.getElementById("saveGameBtn").addEventListener("click", () => {
      this.saveGameState();
      showToast("Game state saved", "success");
    });

    // Mobile menu toggle
    document.getElementById("menuToggleBtn").addEventListener("click", () => {
      document.getElementById("gameControlsPanel").classList.add("show");
    });

    document.getElementById("closeMenuBtn").addEventListener("click", () => {
      document.getElementById("gameControlsPanel").classList.remove("show");
    });

    // Initialize current values in UI
    this.updateRoundDisplay();
    this.updateCommandPoints();
  }

  /**
   * Load army data and build UI
   * @param {string} armyUrl - The army URL identifier
   */
  async loadArmy(armyUrl) {
    try {
      const army = await armyData.loadArmy(armyUrl);
      this.selectedArmy = army;

      // Update UI
      this.buildArmyUI();

      // Update URL
      const url = new URL(window.location);
      url.searchParams.set("army", armyUrl);
      window.history.replaceState({}, "", url);

      // Save game state
      this.saveGameState();
    } catch (error) {
      console.error("Error loading army:", error);
      showToast("Failed to load army data", "danger");
    }
  }

  /**
   * Build the army UI
   */
  buildArmyUI() {
    if (!this.selectedArmy) return;

    // Set army name
    this.armyName.textContent = this.selectedArmy.name;

    // Set army metadata
    this.armyMeta.innerHTML = `
            <div class="small text-muted">
                <div>Player: ${this.selectedArmy.campaignInfo.player}</div>
                <div>Points: ${this.selectedArmy.listPoints} / ${this.selectedArmy.pointsLimit}</div>
                <div>Units: ${this.selectedArmy.units.length}</div>
            </div>
        `;

    // Clear unit container
    this.unitContainer.innerHTML = "";

    // Get template
    const template = document.getElementById("unitCardTemplate");

    // Add each unit
    this.selectedArmy.units.forEach((unit) => {
      // Skip units that are part of combined units (not the leader)
      if (unit.joinToUnit && unit.combined) {
        return;
      }

      // Clone template
      const unitCard = template.content.cloneNode(true);

      // Set unit data
      unitCard.querySelector(".unit-name").textContent =
        unit.customName || unit.name;
      unitCard.querySelector(".quality-stat .stat-value").textContent =
        unit.quality;
      unitCard.querySelector(".defense-stat .stat-value").textContent =
        unit.defense;

      // Check if unit has Tough rule
      const toughRule = unit.rules?.find((rule) => rule.name === "Tough");
      if (toughRule) {
        unitCard.querySelector(".tough-stat .stat-value").textContent =
          toughRule.rating;
      } else {
        unitCard.querySelector(".tough-stat").style.display = "none";
      }

      // Set unit size
      unitCard.querySelector(".size-value").textContent = unit.size;

      // Set wounds
      unitCard.querySelector(".current-wounds").textContent =
        unit.currentWounds;
      unitCard.querySelector(".max-wounds").textContent = unit.maxWounds;

      // Update wound progress bar
      const woundPercentage = (unit.currentWounds / unit.maxWounds) * 100;
      unitCard.querySelector(
        ".wound-progress"
      ).style.width = `${woundPercentage}%`;

      // Set activation state
      unitCard.querySelector(".unit-activated").checked = unit.activated;

      // Add rules
      const rulesContainer = unitCard.querySelector(".rules-container");
      if (unit.rules && unit.rules.length > 0) {
        unit.rules.forEach((rule) => {
          const ruleElement = document.createElement("span");
          ruleElement.className = "badge bg-info text-dark";
          ruleElement.textContent = rule.label || rule.name;
          rulesContainer.appendChild(ruleElement);
        });
      } else {
        rulesContainer.innerHTML =
          '<span class="text-muted">No special rules</span>';
      }

      // Add weapons (just a summary for the card view)
      const weaponsContainer = unitCard.querySelector(".weapons-container");
      if (unit.weapons && unit.weapons.length > 0) {
        unit.weapons.forEach((weapon) => {
          const weaponElement = document.createElement("span");
          weaponElement.className = "badge bg-secondary";
          weaponElement.textContent = weapon.name;
          weaponsContainer.appendChild(weaponElement);
        });
      } else {
        weaponsContainer.innerHTML =
          '<span class="text-muted">No weapons</span>';
      }

      // Add event listeners
      const card = unitCard.querySelector(".unit-card");

      // Set unit ID as data attribute
      card.dataset.unitId = unit.id;

      // Wounds decrement button
      unitCard
        .querySelector(".wound-decrement")
        .addEventListener("click", () => {
          this.decrementWounds(unit.id);
        });

      // Wounds increment button
      unitCard
        .querySelector(".wound-increment")
        .addEventListener("click", () => {
          this.incrementWounds(unit.id);
        });

      // Activation toggle
      unitCard
        .querySelector(".unit-activated")
        .addEventListener("change", (e) => {
          this.toggleActivation(unit.id, e.target.checked);
        });

      // View details button
      unitCard
        .querySelector(".view-details-btn")
        .addEventListener("click", () => {
          this.showUnitDetails(unit.id);
        });

      // Add card to container
      this.unitContainer.appendChild(unitCard);
    });
  }

  /**
   * Increment wounds for a unit
   * @param {string} unitId - The unit ID
   */
  incrementWounds(unitId) {
    const unit = this.selectedArmy.unitsById[unitId];
    if (!unit) return;

    // Increment wounds (but don't exceed max)
    if (unit.currentWounds < unit.maxWounds) {
      unit.currentWounds++;
      this.updateUnitDisplay(unitId);
      this.saveGameState();
    }
  }

  /**
   * Decrement wounds for a unit
   * @param {string} unitId - The unit ID
   */
  decrementWounds(unitId) {
    const unit = this.selectedArmy.unitsById[unitId];
    if (!unit) return;

    // Decrement wounds (but not below 0)
    if (unit.currentWounds > 0) {
      unit.currentWounds--;
      this.updateUnitDisplay(unitId);
      this.saveGameState();
    }
  }

  /**
   * Toggle unit activation
   * @param {string} unitId - The unit ID
   * @param {boolean} activated - Whether the unit is activated
   */
  toggleActivation(unitId, activated) {
    const unit = this.selectedArmy.unitsById[unitId];
    if (!unit) return;

    unit.activated = activated;

    // Update UI
    this.updateUnitDisplay(unitId);

    // Apply CSS based on hide activated filter
    if (this.hideActivatedBtn.checked && activated) {
      document
        .querySelector(`.unit-card[data-unit-id="${unitId}"]`)
        .classList.add("hide-activated");
    } else {
      document
        .querySelector(`.unit-card[data-unit-id="${unitId}"]`)
        .classList.remove("hide-activated");
    }

    this.saveGameState();
  }

  /**
   * Update unit display based on current state
   * @param {string} unitId - The unit ID
   */
  updateUnitDisplay(unitId) {
    const unit = this.selectedArmy.unitsById[unitId];
    if (!unit) return;

    const unitCard = document.querySelector(
      `.unit-card[data-unit-id="${unitId}"]`
    );
    if (!unitCard) return;

    // Update wounds display
    unitCard.querySelector(".current-wounds").textContent = unit.currentWounds;

    // Update wound progress bar
    const woundPercentage = (unit.currentWounds / unit.maxWounds) * 100;
    unitCard.querySelector(
      ".wound-progress"
    ).style.width = `${woundPercentage}%`;

    // Update activation state
    unitCard.querySelector(".unit-activated").checked = unit.activated;

    // Apply activated class
    if (unit.activated) {
      unitCard.classList.add("activated");
    } else {
      unitCard.classList.remove("activated");
    }
  }

  /**
   * Show detailed information about a unit
   * @param {string} unitId - The unit ID
   */
  showUnitDetails(unitId) {
    const unit = this.selectedArmy.unitsById[unitId];
    if (!unit) return;

    const modalTitle = document.getElementById("unitDetailTitle");
    const modalContent = document.getElementById("unitDetailContent");

    // Set title
    modalTitle.textContent = unit.customName || unit.name;

    // Build content
    let content = `
            <div class="row">
                <div class="col-md-6">
                    <h5>Stats</h5>
                    <div class="d-flex gap-3 mb-3">
                        <div class="stat-item quality-stat" title="Quality">
                            ${icons.quality}
                            <span class="stat-value">${unit.quality}</span>
                        </div>
                        <div class="stat-item defense-stat" title="Defense">
                            ${icons.defense}
                            <span class="stat-value">${unit.defense}</span>
                        </div>
                    `;

    // Add tough stat if unit has it
    const toughRule = unit.rules?.find((rule) => rule.name === "Tough");
    if (toughRule) {
      content += `
                <div class="stat-item tough-stat" title="Tough">
                    ${icons.tough}
                    <span class="stat-value">${toughRule.rating}</span>
                </div>
            `;
    }

    content += `
                    </div>
                    <p><strong>Size:</strong> ${unit.size}</p>
                    <p><strong>Cost:</strong> ${unit.cost} points</p>
                </div>
                <div class="col-md-6">
                    <h5>Unit Status</h5>
                    <div class="form-check form-switch mb-2">
                        <input class="form-check-input modal-unit-activated" type="checkbox" role="switch" id="modalActivated" ${
                          unit.activated ? "checked" : ""
                        }>
                        <label class="form-check-label" for="modalActivated">Unit Activated</label>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Wounds (${
                          unit.currentWounds
                        }/${unit.maxWounds})</label>
                        <div class="d-flex gap-2 align-items-center">
                            <button class="btn btn-sm btn-outline-danger modal-wound-decrement">
                                <i class="bi bi-dash"></i>
                            </button>
                            <div class="progress flex-grow-1">
                                <div class="progress-bar bg-danger modal-wound-progress" role="progressbar" style="width: ${
                                  (unit.currentWounds / unit.maxWounds) * 100
                                }%"></div>
                            </div>
                            <button class="btn btn-sm btn-outline-success modal-wound-increment">
                                <i class="bi bi-plus"></i>
                            </button>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Special Conditions</label>
                        <div class="d-flex gap-2">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="modalShaken" ${
                                  unit.status?.shaken ? "checked" : ""
                                }>
                                <label class="form-check-label" for="modalShaken">Shaken</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="modalStunned" ${
                                  unit.status?.stunned ? "checked" : ""
                                }>
                                <label class="form-check-label" for="modalStunned">Stunned</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="modalPinned" ${
                                  unit.status?.pinned ? "checked" : ""
                                }>
                                <label class="form-check-label" for="modalPinned">Pinned</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <hr>
        `;

    // Add rules section
    content += `<div class="row mb-3">
            <div class="col-12">
                <h5>Special Rules</h5>
                <div class="d-flex flex-wrap gap-2">
        `;

    if (unit.rules && unit.rules.length > 0) {
      unit.rules.forEach((rule) => {
        content += `<span class="badge bg-info text-dark">${
          rule.label || rule.name
        }</span>`;
      });
    } else {
      content += `<span class="text-muted">No special rules</span>`;
    }

    content += `
                </div>
            </div>
        </div>`;

    // Add weapons section
    content += `<div class="row">
            <div class="col-12">
                <h5>Weapons</h5>
                <div class="table-responsive">
                    <table class="table table-sm">
                        <thead>
                            <tr>
                                <th>Weapon</th>
                                <th>Range</th>
                                <th>Attacks</th>
                                <th>Special Rules</th>
                            </tr>
                        </thead>
                        <tbody>
        `;

    if (unit.weapons && unit.weapons.length > 0) {
      unit.weapons.forEach((weapon) => {
        content += `
                    <tr>
                        <td>${weapon.name}</td>
                        <td>${weapon.range || "-"}</td>
                        <td>${weapon.attacks}</td>
                        <td>
                `;

        if (weapon.specialRules && weapon.specialRules.length > 0) {
          weapon.specialRules.forEach((rule) => {
            content += `<span class="badge bg-secondary">${
              rule.label || rule.name
            }</span> `;
          });
        } else {
          content += "-";
        }

        content += `
                        </td>
                    </tr>
                `;
      });
    } else {
      content += `
                <tr>
                    <td colspan="4" class="text-center">No weapons</td>
                </tr>
            `;
    }

    content += `
                        </tbody>
                    </table>
                </div>
            </div>
        </div>`;

    // Add unit notes section
    content += `
            <div class="row mt-3">
                <div class="col-12">
                    <h5>Unit Notes</h5>
                    <textarea class="form-control" id="unitNotes" rows="3" placeholder="Add notes about this unit...">${
                      unit.notes || ""
                    }</textarea>
                </div>
            </div>
        `;

    // Set modal content
    modalContent.innerHTML = content;

    // Add event listeners
    modalContent
      .querySelector(".modal-unit-activated")
      .addEventListener("change", (e) => {
        this.toggleActivation(unitId, e.target.checked);
      });

    modalContent
      .querySelector(".modal-wound-decrement")
      .addEventListener("click", () => {
        this.decrementWounds(unitId);
        // Update modal display
        this.updateModalDisplay(unitId);
      });

    modalContent
      .querySelector(".modal-wound-increment")
      .addEventListener("click", () => {
        this.incrementWounds(unitId);
        // Update modal display
        this.updateModalDisplay(unitId);
      });

    // Status checkboxes
    modalContent
      .querySelector("#modalShaken")
      .addEventListener("change", (e) => {
        unit.status.shaken = e.target.checked;
        this.saveGameState();
      });

    modalContent
      .querySelector("#modalStunned")
      .addEventListener("change", (e) => {
        unit.status.stunned = e.target.checked;
        this.saveGameState();
      });

    modalContent
      .querySelector("#modalPinned")
      .addEventListener("change", (e) => {
        unit.status.pinned = e.target.checked;
        this.saveGameState();
      });

    // Unit notes
    modalContent.querySelector("#unitNotes").addEventListener("input", (e) => {
      unit.notes = e.target.value;
      this.saveGameState();
    });

    // Show modal
    const unitModal = new bootstrap.Modal(
      document.getElementById("unitDetailModal")
    );
    unitModal.show();
  }

  /**
   * Update modal display when values change
   * @param {string} unitId - The unit ID
   */
  updateModalDisplay(unitId) {
    const unit = this.selectedArmy.unitsById[unitId];
    if (!unit) return;

    const modalContent = document.getElementById("unitDetailContent");

    // Update wounds display
    modalContent.querySelector(
      ".form-label"
    ).textContent = `Wounds (${unit.currentWounds}/${unit.maxWounds})`;

    // Update wound progress bar
    const woundPercentage = (unit.currentWounds / unit.maxWounds) * 100;
    modalContent.querySelector(
      ".modal-wound-progress"
    ).style.width = `${woundPercentage}%`;

    // Update activation toggle
    modalContent.querySelector(".modal-unit-activated").checked =
      unit.activated;
  }

  /**
   * Generate a random event
   */
  generateRandomEvent() {
    // This would normally pull from a list of events
    // For now, we'll just generate a placeholder

    const eventTypes = [
      "Reinforcements",
      "Hostile Environment",
      "Supply Drop",
      "Ambush",
      "Civilian Presence",
      "Terrain Collapse",
    ];

    const eventDescriptions = [
      "Additional forces arrive on the battlefield.",
      "Weather conditions worsen, affecting visibility and movement.",
      "Valuable supplies have been spotted nearby.",
      "Enemy forces have been detected hiding nearby.",
      "Civilians are caught in the crossfire.",
      "Part of the battlefield has become unstable.",
    ];

    const randomIndex = Math.floor(Math.random() * eventTypes.length);

    this.activeRandomEvent = {
      type: eventTypes[randomIndex],
      description: eventDescriptions[randomIndex],
    };

    // Update display
    this.randomEventDisplay.innerHTML = `
            <div class="alert alert-warning mb-0">
                <h6>${this.activeRandomEvent.type}</h6>
                <p class="mb-0">${this.activeRandomEvent.description}</p>
            </div>
        `;

    // Save game state
    this.saveGameState();

    // Show toast
    showToast(`Random Event: ${this.activeRandomEvent.type}`, "warning");
  }

  /**
   * Filter units based on search input
   */
  filterUnits() {
    const searchTerm = this.unitSearch.value.toLowerCase();
    const unitCards = document.querySelectorAll(".unit-card");

    unitCards.forEach((card) => {
      const unitName = card
        .querySelector(".unit-name")
        .textContent.toLowerCase();

      if (unitName.includes(searchTerm)) {
        card.parentElement.style.display = "";
      } else {
        card.parentElement.style.display = "none";
      }
    });
  }

  /**
   * Toggle display of activated units
   */
  toggleActivatedUnits() {
    const hideActivated = this.hideActivatedBtn.checked;
    const unitCards = document.querySelectorAll(".unit-card");

    unitCards.forEach((card) => {
      const activated = card.querySelector(".unit-activated").checked;

      if (hideActivated && activated) {
        card.classList.add("hide-activated");
      } else {
        card.classList.remove("hide-activated");
      }
    });
  }

  /**
   * Move to the next round
   */
  nextRound() {
    this.round++;
    this.updateRoundDisplay();

    // Add command points at the start of each round
    this.commandPoints += 1;
    this.updateCommandPoints();

    // Reset activations
    this.resetActivations();

    // Save game state
    this.saveGameState();

    // Show toast
    showToast(`Round ${this.round} started`, "primary");
  }

  /**
   * Move to the previous round
   */
  previousRound() {
    if (this.round > 1) {
      this.round--;
      this.updateRoundDisplay();

      // Save game state
      this.saveGameState();

      // Show toast
      showToast(`Moved back to Round ${this.round}`, "secondary");
    }
  }

  /**
   * Reset all unit activations
   */
  resetActivations() {
    if (!this.selectedArmy || !this.selectedArmy.units) return;

    // Reset activation on all units
    this.selectedArmy.units.forEach((unit) => {
      unit.activated = false;
    });

    // Update UI
    const activationToggles = document.querySelectorAll(".unit-activated");
    activationToggles.forEach((toggle) => {
      toggle.checked = false;
    });

    const unitCards = document.querySelectorAll(".unit-card");
    unitCards.forEach((card) => {
      card.classList.remove("activated");
      card.classList.remove("hide-activated");
    });

    // Save game state
    this.saveGameState();

    // Show toast
    showToast("All unit activations reset", "success");
  }

  /**
   * Update the round display in the UI
   */
  updateRoundDisplay() {
    this.currentRound.textContent = `Round ${this.round}`;
    this.roundCounter.textContent = `Round ${this.round}`;
  }

  /**
   * Update the command points display
   */
  updateCommandPoints() {
    this.cpCounter.textContent = this.commandPoints;
  }

  /**
   * Save current game state to localStorage
   */
  saveGameState() {
    if (!this.selectedArmy) return;

    const gameState = {
      timestamp: new Date().toISOString(),
      round: this.round,
      commandPoints: this.commandPoints,
      phase: this.phase,
      armyId: this.selectedArmy.id,
      armyUrl: this.selectedArmy.campaignInfo.armyURL,
      gameNotes: document.getElementById("gameNotes").value,
      activeRandomEvent: this.activeRandomEvent,
      units: {},
    };

    // Save unit states
    this.selectedArmy.units.forEach((unit) => {
      gameState.units[unit.id] = {
        activated: unit.activated,
        currentWounds: unit.currentWounds,
        status: unit.status,
        notes: unit.notes,
      };
    });

    // Save to localStorage
    localStorage.setItem("activeGame", JSON.stringify(gameState));
  }

  /**
   * Load saved game state from localStorage
   */
  loadGameState() {
    // If action=new was specified, don't load saved state
    if (this.initialAction === "new") {
      localStorage.removeItem("activeGame");
      return;
    }

    // If action=resume was specified, try to load saved state
    if (this.initialAction === "resume" || !this.armyToLoad) {
      const savedState = localStorage.getItem("activeGame");

      if (savedState) {
        try {
          const gameState = JSON.parse(savedState);

          // Load basic game state
          this.round = gameState.round || 1;
          this.commandPoints = gameState.commandPoints || 3;
          this.phase = gameState.phase || "movement";
          this.activeRandomEvent = gameState.activeRandomEvent || null;

          // Update displays
          this.updateRoundDisplay();
          this.updateCommandPoints();

          // Set game notes
          document.getElementById("gameNotes").value =
            gameState.gameNotes || "";

          // Update random event display
          if (this.activeRandomEvent) {
            this.randomEventDisplay.innerHTML = `
                            <div class="alert alert-warning mb-0">
                                <h6>${this.activeRandomEvent.type}</h6>
                                <p class="mb-0">${this.activeRandomEvent.description}</p>
                            </div>
                        `;
          }

          // Load the saved army if not already specified
          if (!this.armyToLoad && gameState.armyUrl) {
            this.armyToLoad = gameState.armyUrl;
            this.armySelector.value = gameState.armyUrl;

            // Load the army
            this.loadArmy(gameState.armyUrl).then(() => {
              // Now apply the saved unit states
              if (gameState.units && this.selectedArmy) {
                Object.keys(gameState.units).forEach((unitId) => {
                  const unit = this.selectedArmy.unitsById[unitId];
                  const savedUnit = gameState.units[unitId];

                  if (unit && savedUnit) {
                    unit.activated = savedUnit.activated;
                    unit.currentWounds = savedUnit.currentWounds;
                    unit.status = savedUnit.status;
                    unit.notes = savedUnit.notes;

                    // Update UI
                    this.updateUnitDisplay(unitId);
                  }
                });
              }
            });
          } else if (this.selectedArmy) {
            // Apply saved unit states to already loaded army
            if (gameState.units) {
              Object.keys(gameState.units).forEach((unitId) => {
                const unit = this.selectedArmy.unitsById[unitId];
                const savedUnit = gameState.units[unitId];

                if (unit && savedUnit) {
                  unit.activated = savedUnit.activated;
                  unit.currentWounds = savedUnit.currentWounds;
                  unit.status = savedUnit.status;
                  unit.notes = savedUnit.notes;

                  // Update UI
                  this.updateUnitDisplay(unitId);
                }
              });
            }
          }

          showToast("Game state loaded", "success");
        } catch (error) {
          console.error("Error loading saved game state:", error);
          showToast("Failed to load saved game state", "danger");
        }
      }
    }
  }
}

// Initialize the game tracker when DOM content is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Define SVG icons
  window.icons = {
    quality: `<svg class="stat-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
            <path style="fill: #ad3e25" d="m8 0 1.669.864 1.858.282.842 1.68 1.337 1.32L13.4 6l.306 1.854-1.337 1.32-.842 1.68-1.858.282L8 12l-1.669-.864-1.858-.282-.842-1.68-1.337-1.32L2.6 6l-.306-1.854 1.337-1.32.842-1.68L6.331.864z"/>
            <path style="fill: #f9ddb7" d="M4 11.794V16l4-1 4 1v-4.206l-2.018.306L8 13.126 6.018 12.1z"/>
        </svg>`,
    defense: `<svg class="stat-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
            <path style="fill: #005f83" d="M5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.8 11.8 0 0 1-2.517 2.453 7 7 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7 7 0 0 1-1.048-.625 11.8 11.8 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 63 63 0 0 1 5.072.56"/>
        </svg>`,
    tough: `<svg class="stat-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
            <path style="fill: #dc3545" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
        </svg>`,
  };

  // Initialize game tracker
  const gameTracker = new GameTracker();
});
