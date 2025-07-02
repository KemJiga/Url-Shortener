// DOM elements
const shortenForm = document.getElementById("shortenForm");
const longUrlInput = document.getElementById("longUrl");
const resultDiv = document.getElementById("result");
const shortUrlInput = document.getElementById("shortUrl");
const copyBtn = document.getElementById("copyBtn");
const loadingDiv = document.getElementById("loading");
const errorDiv = document.getElementById("error");
const errorMessage = document.getElementById("errorMessage");
const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");
const visitCount = document.getElementById("visitCount");
const updateAnalyticsBtn = document.getElementById("updateAnalyticsBtn");

// API base URL - adjust this to match your backend URL
const API_BASE_URL = "https://url-shortener-t9jh.onrender.com";

// Utility functions
function showElement(element) {
  element.classList.remove("hidden");
}

function hideElement(element) {
  element.classList.add("hidden");
}

function showToast(message, type = "success") {
  toastMessage.textContent = message;
  toast.className = `toast ${type}`;
  showElement(toast);

  setTimeout(() => {
    hideElement(toast);
  }, 3000);
}

function validateUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// URL shortening functionality
async function shortenUrl(longUrl) {
  try {
    const response = await fetch(`${API_BASE_URL}/shorten`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ longUrl }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to shorten URL");
    }

    const data = await response.json();
    return data.shortUrl;
  } catch (error) {
    throw error;
  }
}

// Analytics functionality
async function getAnalytics(shortCode) {
  try {
    const response = await fetch(`${API_BASE_URL}/analytics/${shortCode}`);

    if (!response.ok) {
      throw new Error("Failed to fetch analytics");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return { visits: 0, details: [] };
  }
}

// Copy to clipboard functionality
async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const result = document.execCommand("copy");
      textArea.remove();
      return result;
    }
  } catch (error) {
    console.error("Failed to copy:", error);
    return false;
  }
}

// Extract short code from URL
function extractShortCode(shortUrl) {
  const url = new URL(shortUrl);
  return url.pathname.substring(1); // Remove leading slash
}

// Update analytics display
function updateAnalytics(analytics) {
  visitCount.textContent = analytics.visits || 0;
}

// Form submission handler
shortenForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const longUrl = longUrlInput.value.trim();

  // Validate URL
  if (!longUrl) {
    showToast("Please enter a URL", "error");
    return;
  }

  if (!validateUrl(longUrl)) {
    showToast("Please enter a valid URL", "error");
    return;
  }

  // Show loading state
  hideElement(resultDiv);
  hideElement(errorDiv);
  showElement(loadingDiv);

  try {
    // Shorten the URL
    const shortUrl = await shortenUrl(longUrl);

    // Display result
    shortUrlInput.value = shortUrl;
    showElement(resultDiv);

    // Fetch and display analytics
    const shortCode = extractShortCode(shortUrl);
    const analytics = await getAnalytics(shortCode);
    updateAnalytics(analytics);

    // Show success message
    showToast("URL shortened successfully!");

    // Clear input
    longUrlInput.value = "";
  } catch (error) {
    console.error("Error shortening URL:", error);
    errorMessage.textContent =
      error.message || "An error occurred while shortening the URL";
    showElement(errorDiv);
    showToast("Failed to shorten URL", "error");
  } finally {
    hideElement(loadingDiv);
  }
});

// Copy button handler
copyBtn.addEventListener("click", async () => {
  const shortUrl = shortUrlInput.value;

  if (!shortUrl) {
    showToast("No URL to copy", "error");
    return;
  }

  const success = await copyToClipboard(shortUrl);

  if (success) {
    showToast("URL copied to clipboard!");

    // Visual feedback
    copyBtn.innerHTML = '<i class="fas fa-check"></i>';
    setTimeout(() => {
      copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
    }, 2000);
  } else {
    showToast("Failed to copy URL", "error");
  }
});

// Update analytics button handler
updateAnalyticsBtn.addEventListener("click", async () => {
  const shortCode = extractShortCode(shortUrlInput.value);
  const analytics = await getAnalytics(shortCode);
  updateAnalytics(analytics);
});

// Input focus handler for better UX
longUrlInput.addEventListener("focus", () => {
  hideElement(errorDiv);
});

// Auto-resize input for better mobile experience
longUrlInput.addEventListener("input", () => {
  // Reset any previous error states
  hideElement(errorDiv);
});

// Keyboard shortcuts
document.addEventListener("keydown", (e) => {
  // Ctrl/Cmd + Enter to submit form
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
    shortenForm.dispatchEvent(new Event("submit"));
  }

  // Escape to clear input
  if (e.key === "Escape") {
    longUrlInput.value = "";
    longUrlInput.focus();
  }
});

// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
  // Focus on input for better UX
  longUrlInput.focus();

  // Add some example URLs for demonstration
  const exampleUrls = [
    "https://www.google.com",
    "https://github.com",
    "https://stackoverflow.com",
  ];

  // Add placeholder text with example
  longUrlInput.placeholder = `Enter your long URL here... (e.g., ${exampleUrls[0]})`;

  // Add click handler to placeholder for easy testing
  longUrlInput.addEventListener("click", () => {
    if (longUrlInput.value === "") {
      // Show a subtle hint
      showToast("Try entering a URL like https://www.google.com", "info");
    }
  });
});

// Add some visual enhancements
document.addEventListener("DOMContentLoaded", () => {
  // Add smooth scrolling for better UX
  document.documentElement.style.scrollBehavior = "smooth";

  // Add loading animation for better perceived performance
  const featureCards = document.querySelectorAll(".feature-card");
  featureCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
    card.style.animation = "fadeInUp 0.6s ease forwards";
  });
});

// Add CSS animation for feature cards
const style = document.createElement("style");
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .feature-card {
        opacity: 0;
    }
`;
document.head.appendChild(style);
