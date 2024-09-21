chrome.storage.sync.get("isDarkMode", ({ isDarkMode }) => {
  applyDarkMode(isDarkMode);
});

function applyDarkMode(isDarkMode) {
  if (isDarkMode) {
    // Apply dark mode styles
    document.body.style.backgroundColor = "#000"; // Set body background to black
    document.body.style.color = "#fff"; // Set text color to white

    // Invert colors for all elements
    document.documentElement.style.filter = "invert(1) hue-rotate(180deg)";
  } else {
    // Reset to light mode styles
    document.body.style.backgroundColor = "#fff"; // Set body background to white
    document.body.style.color = "#000"; // Set text color to black
    document.documentElement.style.filter = "none"; // Reset filter
  }
}

// Listen for changes in storage
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "sync" && changes.isDarkMode) {
    applyDarkMode(changes.isDarkMode.newValue);
  }
});
