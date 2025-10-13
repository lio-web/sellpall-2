// Runs automatically when the extension is first installed
chrome.runtime.onInstalled.addListener(() => {
  console.log("✅ Sellpal Escrow Extension installed and running!");
});

// You can add more listeners later, such as:
// - Detecting when the user visits specific domains
// - Handling messages between popup.js and contentScript.js
// - Logging API requests or performance data

// Example placeholder for future features
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "escrow_created") {
    console.log("New escrow created:", request.data);
  }
});
