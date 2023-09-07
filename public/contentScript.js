// contentScript.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // console.log("message data message : message", message);
    if (message.data) {
      // Handle the received data here
      const receivedData = message.data;
      console.log("Received data:", receivedData);
      // You can update your HTML or perform any other actions with the data
    }
  });
  