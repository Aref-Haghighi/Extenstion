chrome.runtime.onInstalled.addListener(() => {
  // Default schedule: Dark mode from 7 PM to 7 AM
  chrome.storage.sync.set({
    darkModeStart: "19:00",
    darkModeEnd: "07:00"
  });
});

function checkDarkMode() {
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();

  chrome.storage.sync.get(["darkModeStart", "darkModeEnd"], (settings) => {
    const [startHour, startMin] = settings.darkModeStart.split(':').map(Number);
    const [endHour, endMin] = settings.darkModeEnd.split(':').map(Number);

    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;

    let isDarkMode = false;

    if (startTime < endTime) {
      // Dark mode is within a single day (e.g., 19:00 to 07:00)
      isDarkMode = currentTime >= startTime && currentTime <= endTime;
    } else {
      // Dark mode spans overnight (e.g., 22:00 to 06:00)
      isDarkMode = currentTime >= startTime || currentTime <= endTime;
    }

    // Get the currently active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];

      // Check if the tab URL is restricted (chrome://, chrome-extension://)
      if (!currentTab || currentTab.url.startsWith('chrome://') || currentTab.url.startsWith('chrome-extension://')) {
        console.log("Cannot access chrome:// or chrome-extension:// URLs");
        return;
      }

      // Execute the script on allowed pages
      chrome.scripting.executeScript({
        target: { tabId: currentTab.id },
        func: toggleDarkMode,
        args: [isDarkMode]
      });
    });
  });
}

function toggleDarkMode(isDarkMode) {
  chrome.storage.sync.set({ isDarkMode });
}

// Create an alarm to check every minute if dark mode should be enabled
chrome.alarms.create("darkModeCheck", { periodInMinutes: 1 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "darkModeCheck") {
    checkDarkMode();
  }
});
