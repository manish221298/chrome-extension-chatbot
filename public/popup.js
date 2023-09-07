// popup.js
document.addEventListener("DOMContentLoaded", async function (event) {
  // Attaches listener for click event on search button
  document.querySelector("#chatButton").addEventListener("click", function (e) {
    return search();
  });

  document
    .querySelector("#voiceButton")
    .addEventListener("click", function (e) {
      return voiceSearch();
    });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    
    chrome.tabs.sendMessage(tabId, { type: "urlChange", url: changeInfo.url });
    

    // chrome.scripting.executeScript({
    //   target: { tabId: tabId },
    //   function: clickedUrl,
    //   args: [""],
    // });

    // Inject the clickedUrl function into the page
    // chrome.tabs.executeScript(tabId, { code: clickedUrl });
  }
});

// Listen for messages from the content script
chrome.runtime.onMessage.addListener(async (message, sender) => {

  if (message.type === "tooltipURL" || message.type === "Image URL Clicked") {
    let capturedUrl = JSON.parse(localStorage.getItem("clickedUrl")) || [];
    console.log("check captured url message", message)
    capturedUrl.push({ type: message.type, value: message.value });
    localStorage.setItem("clickedUrlData", JSON.stringify(capturedUrl));
  }

  const response = localStorage.getItem("submit");

  console.log("response coming correctly", response)
 
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (response === "submit") {
    console.log("response === submit inside", response)
   
    // const activeTabId = tab.id; // Retrieve the active tab ID from the message if needed
    const updatedTabId = sender.tab.id; // Retrieve the active tab ID
   
    // Trigger the clickedUrl function again and pass an argument
    chrome.scripting.executeScript({
      target: { tabId: updatedTabId },
      function: clickedUrl,
      args: [response], // Pass the response as an argument
    });
    localStorage.removeItem("submit");
    localStorage.removeItem("clickedUrlData")
  }
});

async function clickedUrl(responseFromBackground) {
  try {
    // const capturedUrl = [];
    let clickedUrl = JSON.parse(localStorage.getItem("clickedUrl")) || [];
    

    if (responseFromBackground === "submit") {
     
      clickedUrl = [];
      localStorage.removeItem("clickedUrl", []);
   
    }
    

    document.addEventListener("mouseover", function (e) {
     
      const target = e.target;

      if (target.tagName === "A") {
        // Anchor elements
        const tooltipURL = target.getAttribute("href");
        // capturedUrl.push({ type: 'tooltipURL', value: tooltipURL })
        
      } else if (target.tagName === "IMG") {
        // Image elements
        const imageURL = target.getAttribute("src");
        clickedUrl.push({ type: "Image URL Clicked", value: imageURL });
        // Send the captured URL to the background script
        chrome.runtime.sendMessage({ type: "Image URL Clicked", value: clickedUrl });
      }
                                      
      const tooltipText = target.getAttribute("title");
      if (tooltipText) {

      }
      localStorage.setItem("clickedUrl", JSON.stringify(clickedUrl));
    });
    return clickedUrl;
  } catch (err) {
    console.log(err);
  }
}

async function checkFun() {
  try {
    const capturedUrl = [];

    document.addEventListener("mouseover", function (e) {
      const target = e.target;

      if (target.tagName === "A") {
        // Anchor elements
        const tooltipURL = target.getAttribute("href");
        // capturedUrl.push({ type: 'tooltipURL', value: tooltipURL })
        
      } else if (target.tagName === "IMG") {
        // Image elements
        const imageURL = target.getAttribute("src");
        capturedUrl.push({ type: "Image URL", value: imageURL });
        // Send the captured URL to the background script
        chrome.runtime.sendMessage({
          type: "Image URL",
          value: capturedUrl,
        });
        console.log("Image URL: check fun", imageURL);
      }

      const tooltipText = target.getAttribute("title");
      if (tooltipText) {
        // console.log('Tooltip Text:', tooltipText);
      }
      localStorage.setItem("capturedUrl", JSON.stringify(capturedUrl));
    });
    return capturedUrl;
  } catch (err) {
    console.log(err);
  }
}

async function search() {
  localStorage.removeItem("name");
  localStorage.setItem("name", "normalChat");

  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Listen for messages from the content script
  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "tooltipURL" || message.type === "Image URL") {
      const capturedUrl = JSON.parse(localStorage.getItem("capturedUrl")) || [];
      capturedUrl.push({ type: message.type, value: message.value });
      localStorage.setItem("capturedUrlData", JSON.stringify(capturedUrl));
    }
  });

  // Execute checkFun script and wait for it to complete
  const injectionResults = await new Promise((resolve) => {
    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        function: checkFun,
      },
      (results) => {
        resolve(results);
      }
    );
  });

  chrome.windows.getCurrent((tabWindow) => {
    // https://developer.chrome.com/docs/extensions/reference/windows/#type-Window
    const targetURL = "index.html";
    chrome.windows.getAll(
      { populate: true, windowTypes: ["popup"] },
      (windowArray) => {
       
        const queryURL = `chrome-extension://${chrome.runtime.id}/${targetURL}`;
        const target = windowArray.find(
          (item) => item.tabs[0].url === queryURL
        ); // ❗ make sure manifest.json => permissions including "tabs"
        if (windowArray.length > 0 && target !== undefined) {
          // Show the window that you made before.
          chrome.windows.update(target.id, { focused: true }); // https://developer.chrome.com/docs/extensions/reference/windows/#method-update
          return;
        }

        // Otherwise, Create
        const width = Math.round(tabWindow.width * 0.3);
        // const height = Math.round(tabWindow.height * 1)
        const height = Math.round(tabWindow.height * 0.6);
        const left = Math.round(
          (tabWindow.width - width) * 1.2 + tabWindow.left
        );
        // const top = Math.round((tabWindow.height - height) * 0.2 + tabWindow.top)
        const top = Math.round(
          (tabWindow.height - height) * 0.9 + tabWindow.top
        );
        

        chrome.windows.create(
          // https://developer.chrome.com/docs/extensions/reference/windows/#method-create
          {
            focused: true,
            url: targetURL,
            type: "popup", // https://developer.chrome.com/docs/extensions/reference/windows/#type-WindowType
            width,
            height,
            left,
            top,
          },
          (subWindow) => {
           
            // Send data to index.html once the popup window is created
            chrome.tabs.sendMessage(subWindow.tabs[0].id, {
              data: "Hello from popup.js!",
            });

            
          }
        );
      }
    );
  });
}

// voice chat

async function voiceSearch() {
  localStorage.removeItem("name");
  localStorage.setItem("name", "voiceChat");

  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Listen for messages from the content script
  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "tooltipURL" || message.type === "Image URL") {
      const capturedUrl = JSON.parse(localStorage.getItem("capturedUrl")) || [];
      capturedUrl.push({ type: message.type, value: message.value });
      localStorage.setItem("capturedUrlData", JSON.stringify(capturedUrl));
    }
  });

  // Execute checkFun script and wait for it to complete
  const injectionResults = await new Promise((resolve) => {
    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        function: checkFun,
      },
      (results) => {
        resolve(results);
      }
    );
  });

  chrome.windows.getCurrent((tabWindow) => {
    // https://developer.chrome.com/docs/extensions/reference/windows/#type-Window
    const targetURL = "index.html";
    chrome.windows.getAll(
      { populate: true, windowTypes: ["popup"] },
      (windowArray) => {
        
        const queryURL = `chrome-extension://${chrome.runtime.id}/${targetURL}`;
        const target = windowArray.find(
          (item) => item.tabs[0].url === queryURL
        ); // ❗ make sure manifest.json => permissions including "tabs"
        if (windowArray.length > 0 && target !== undefined) {
          // Show the window that you made before.
          chrome.windows.update(target.id, { focused: true }); // https://developer.chrome.com/docs/extensions/reference/windows/#method-update
          return;
        }

        // Otherwise, Create
        const width = Math.round(tabWindow.width * 0.3);
        // const height = Math.round(tabWindow.height * 1)
        const height = Math.round(tabWindow.height * 0.1);
        const left = Math.round(
          (tabWindow.width - width) * 1.2 + tabWindow.left
        );
        // const top = Math.round((tabWindow.height - height) * 0.2 + tabWindow.top)
        const top = Math.round(
          (tabWindow.height - height) * 0.9 + tabWindow.top
        );
        

        chrome.windows.create(
          // https://developer.chrome.com/docs/extensions/reference/windows/#method-create
          {
            focused: true,
            url: targetURL,
            type: "popup", // https://developer.chrome.com/docs/extensions/reference/windows/#type-WindowType
            width,
            height,
            left,
            top,
          },
          (subWindow) => {
            
            // Send data to index.html once the popup window is created
            chrome.tabs.sendMessage(subWindow.tabs[0].id, {
              data: "Hello from popup.js!",
            });

            
          }
        );
      }
    );
  });
}
