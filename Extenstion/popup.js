document.addEventListener("DOMContentLoaded", () => {
    const startInput = document.getElementById("start");
    const endInput = document.getElementById("end");
    const saveBtn = document.getElementById("saveBtn");
  
    chrome.storage.sync.get(["darkModeStart", "darkModeEnd"], (data) => {
      startInput.value = data.darkModeStart;
      endInput.value = data.darkModeEnd;
    });
  
    saveBtn.addEventListener("click", () => {
      const darkModeStart = startInput.value;
      const darkModeEnd = endInput.value;
  
      chrome.storage.sync.set({ darkModeStart, darkModeEnd }, () => {
        alert("Schedule saved!");
      });
    });
  });
  