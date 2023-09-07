// background.js
chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "popup-open") {
    console.log("Popup opened");
  }
});





// chrome.runtime.onMessage.addListener(async (message, sender) => {
//   if (message.type === "tooltipURL" || message.type === "Image URL Clicked") {
//     let capturedUrl = JSON.parse(localStorage.getItem("clickedUrl")) || [];
//     console.log("check captured url message message", message);
//     capturedUrl.push({ type: message.type, value: message.value });
//     localStorage.setItem("clickedUrlData", JSON.stringify(capturedUrl));
//   }

  
  
//   // Listen for changes in localStorage
//   window.addEventListener("storage", (event) => {
//     if (event.key === "submit") {
//       // Get the current tab ID
//       chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
//         const tabId = tabs[0].id;

//         // Inject and execute the clickedUrl function in the main tab
//         chrome.scripting.executeScript({
//           target: { tabId: sender.tab.id },
//           function: clickedUrl,
//           args: ["submit"], // Pass the response as an argument
//         });
//       });

//       localStorage.removeItem("submit");
//       localStorage.removeItem("clickedUrlData");
//     }
//   });
// });
