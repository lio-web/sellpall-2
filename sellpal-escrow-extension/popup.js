// When the popup "Activate Escrow Button" is clicked
document.getElementById("enable").addEventListener("click", async () => {
  // Get the current active browser tab
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Inject the contentScript.js into the current page
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["contentScript.js"]
  });

  // Confirm activation
  alert("✅ Escrow button activated on this page!");
});
