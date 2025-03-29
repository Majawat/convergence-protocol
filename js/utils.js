// js/utils.js - Utility functions

/**
 * Formats a date string to a readable format
 * @param {string} dateString - ISO date string
 * @return {string} Formatted date
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

/**
 * Creates and shows a toast notification
 * @param {string} message - The message to display
 * @param {string} type - Bootstrap color class (success, danger, etc.)
 */
function showToast(message, type = "primary") {
  const toastContainer = document.querySelector(".toast-container");
  const toastId = `toast-${Date.now()}`;

  const toastEl = document.createElement("div");
  toastEl.className = `toast align-items-center text-white bg-${type} border-0`;
  toastEl.id = toastId;
  toastEl.setAttribute("role", "alert");
  toastEl.setAttribute("aria-live", "assertive");
  toastEl.setAttribute("aria-atomic", "true");

  toastEl.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;

  toastContainer.appendChild(toastEl);

  const toast = new bootstrap.Toast(toastEl, {
    delay: 5000,
  });

  toast.show();

  // Remove the toast from DOM after it's hidden
  toastEl.addEventListener("hidden.bs.toast", () => {
    toastEl.remove();
  });
}

/**
 * Toggle between light and dark theme
 */
function toggleTheme() {
  const html = document.documentElement;
  const themeToggleBtn = document.getElementById("themeToggle");
  const currentTheme = html.getAttribute("data-bs-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";

  html.setAttribute("data-bs-theme", newTheme);

  // Update button icon
  themeToggleBtn.innerHTML =
    newTheme === "dark"
      ? '<i class="bi bi-sun-fill"></i>'
      : '<i class="bi bi-moon-fill"></i>';

  // Save preference to localStorage
  localStorage.setItem("theme", newTheme);
}

/**
 * Load user's theme preference
 */
function loadThemePreference() {
  const savedTheme = localStorage.getItem("theme");
  const themeToggleBtn = document.getElementById("themeToggle");

  if (savedTheme) {
    document.documentElement.setAttribute("data-bs-theme", savedTheme);
    themeToggleBtn.innerHTML =
      savedTheme === "dark"
        ? '<i class="bi bi-sun-fill"></i>'
        : '<i class="bi bi-moon-fill"></i>';
  }

  // Add click event listener
  themeToggleBtn.addEventListener("click", toggleTheme);
}

// Initialize theme when DOM is loaded
document.addEventListener("DOMContentLoaded", loadThemePreference);
