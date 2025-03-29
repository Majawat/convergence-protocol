// js/index.js - Page specific JavaScript for index.html

/**
 * Initializes the homepage
 */
async function initializeHomepage() {
  // Load all campaign data
  await campaignData.loadAllData();

  // Populate the page with data
  populateCampaignBanner();
  populateLeaderboard();
  populateArmyGallery();
  populateCurrentMission();
  checkForActiveGame();
  populateRecentActivity();
  populateArmiesDropdown();
}

/**
 * Populates the campaign status banner
 */
function populateCampaignBanner() {
  if (!campaignData.isLoaded) return;

  const campaignTitle = document.getElementById("campaignTitle");
  const campaignSummary = document.getElementById("campaignSummary");
  const campaignProgress = document.getElementById("campaignProgress");
  const missionStatus = document.getElementById("missionStatus");

  // Set campaign title
  campaignTitle.textContent = campaignData.campaign.campaignName;

  // Set campaign summary
  const currentMission = campaignData.getCurrentMission();
  const missionText = currentMission
    ? `Current Mission: ${currentMission.name}`
    : "No active missions";

  campaignSummary.textContent = `Campaign in progress. ${missionText}`;

  // Set progress bar
  const progress = campaignData.getCampaignProgress();
  campaignProgress.style.width = `${progress}%`;
  campaignProgress.setAttribute("aria-valuenow", progress);

  // Set mission status
  if (currentMission) {
    missionStatus.textContent = currentMission.completed
      ? "Mission Status: Completed"
      : "Mission Status: In Progress";

    missionStatus.className = `badge ${
      currentMission.completed ? "bg-success" : "bg-warning"
    } fs-6 d-inline-block mb-2`;
  } else {
    missionStatus.textContent = "Mission Status: N/A";
    missionStatus.className = "badge bg-secondary fs-6 d-inline-block mb-2";
  }
}

/**
 * Populates the leaderboard table
 */
function populateLeaderboard() {
  if (!campaignData.isLoaded) return;

  const leaderboardTable = document.getElementById("leaderboardTable");
  const leaderboardData = campaignData.getLeaderboardData();

  // Clear loading state
  leaderboardTable.innerHTML = "";

  // Add each player to the table
  leaderboardData.forEach((player, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
            <td>${index + 1}</td>
            <td>
                <div class="d-flex align-items-center">
                    <span class="badge bg-secondary me-2">${
                      player.playerTitle
                    }</span>
                    ${player.player}
                </div>
            </td>
            <td>
                <a href="armies/${
                  player.armyURL
                }.html" class="text-decoration-none">
                    ${player.armyName}
                </a>
            </td>
            <td>${player.wins}W / ${player.losses}L</td>
            <td>${player.objectives}</td>
        `;

    leaderboardTable.appendChild(row);
  });

  // If no players, show message
  if (leaderboardData.length === 0) {
    leaderboardTable.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-3">
                    <span class="text-muted">No leaderboard data available</span>
                </td>
            </tr>
        `;
  }
}

/**
 * Populates the army gallery
 */
function populateArmyGallery() {
  if (!campaignData.isLoaded) return;

  const armyGallery = document.getElementById("armyGallery");

  // Clear loading state
  armyGallery.innerHTML = "";

  // Add each army card
  campaignData.armies.forEach((army) => {
    const armyCard = document.createElement("div");
    armyCard.className = "col-sm-6 col-lg-3";

    armyCard.innerHTML = `
            <div class="card h-100">
                <div class="card-img-top" style="height: 140px; background: url('${
                  army.image
                }') no-repeat center; background-size: cover; background-position: ${
      army.imagePosition || "center"
    };"></div>
                <div class="card-body">
                    <h5 class="card-title">${army.armyName}</h5>
                    <p class="card-text small text-muted">${army.player} · ${
      army.wins
    }W / ${army.losses}L</p>
                </div>
                <div class="card-footer d-flex">
                    <a href="armies/${
                      army.armyURL
                    }.html" class="btn btn-sm btn-outline-primary me-2">View Army</a>
                    <a href="tracker.html?army=${
                      army.armyURL
                    }" class="btn btn-sm btn-danger">Start Game</a>
                </div>
            </div>
        `;

    armyGallery.appendChild(armyCard);
  });

  // If no armies, show message
  if (campaignData.armies.length === 0) {
    armyGallery.innerHTML = `
            <div class="col-12 text-center py-4">
                <span class="text-muted">No armies available</span>
            </div>
        `;
  }
}

/**
 * Populates the current mission card
 */
function populateCurrentMission() {
  if (!campaignData.isLoaded) return;

  const currentMissionCard = document.getElementById("currentMissionCard");
  const currentMission = campaignData.getCurrentMission();

  if (!currentMission) {
    currentMissionCard.innerHTML = `
            <div class="text-center py-4">
                <p class="text-muted">No active mission</p>
            </div>
        `;
    return;
  }

  // Display mission info
  currentMissionCard.innerHTML = `
        <h4 class="card-title">${currentMission.name}</h4>
        <p class="card-text">${
          currentMission.summary || "No mission description available."
        }</p>
        <div class="d-flex justify-content-between align-items-center mt-3">
            <span class="badge ${
              currentMission.completed ? "bg-success" : "bg-warning"
            }">
                ${currentMission.completed ? "Completed" : "In Progress"}
            </span>
            <a href="missions.html#mission-${
              currentMission.id
            }" class="btn btn-primary">
                View Details
            </a>
        </div>
    `;
}

/**
 * Checks for active game and updates the resume button
 */
function checkForActiveGame() {
  const resumeGameButton = document.getElementById("resumeGameButton");

  if (dataManager.hasActiveGame()) {
    const gameData = dataManager.getActiveGame();

    resumeGameButton.innerHTML = `
            <a href="tracker.html?action=resume" class="btn btn-lg btn-warning">
                <i class="bi bi-arrow-clockwise me-2"></i>Resume Game
                <small class="d-block mt-1">${formatDate(
                  gameData.timestamp
                )}</small>
            </a>
        `;
  } else {
    resumeGameButton.innerHTML = `
            <button class="btn btn-lg btn-outline-secondary" disabled>
                <i class="bi bi-arrow-clockwise me-2"></i>No Game In Progress
            </button>
        `;
  }
}

/**
 * Populates the recent activity feed
 */
function populateRecentActivity() {
  const recentActivity = document.getElementById("recentActivity");

  // This would need to be implemented with actual battle reports
  // For now, we'll show a placeholder

  recentActivity.innerHTML = `
        <div class="list-group">
            <div class="list-group-item">
                <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1">Campaign Started</h5>
                    <small class="text-muted">3 days ago</small>
                </div>
                <p class="mb-1">The Convergence Protocol campaign has begun!</p>
            </div>
            <div class="list-group-item">
                <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1">Army Registration Complete</h5>
                    <small class="text-muted">2 days ago</small>
                </div>
                <p class="mb-1">All players have registered their armies for the campaign.</p>
            </div>
        </div>
    `;
}

/**
 * Populates the armies dropdown in the navigation
 */
function populateArmiesDropdown() {
  if (!campaignData.isLoaded) return;

  const armiesDropdown = document.getElementById("armiesDropdown");

  // Clear loading state
  armiesDropdown.innerHTML = "";

  // Add each army link
  campaignData.armies.forEach((army) => {
    const armyItem = document.createElement("li");

    armyItem.innerHTML = `
            <a class="dropdown-item" href="armies/${army.armyURL}.html">
                ${army.armyName}
            </a>
        `;

    armiesDropdown.appendChild(armyItem);
  });

  // If no armies, show message
  if (campaignData.armies.length === 0) {
    armiesDropdown.innerHTML = `
            <li><div class="dropdown-item text-muted">No armies available</div></li>
        `;
  }
}

// Initialize the page when DOM content is loaded
document.addEventListener("DOMContentLoaded", initializeHomepage);
