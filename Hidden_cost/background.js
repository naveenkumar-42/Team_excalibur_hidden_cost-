let isHighlighting = false;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'toggleHighlighting') {
    isHighlighting = !isHighlighting; 

    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      const activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, { action: 'toggleHighlighting', isHighlighting });
      chrome.storage.local.set({ isHighlighting: isHighlighting });
    });
  } else if (request.action === 'setIcon') {
    console.log('Received message:', request);
    chrome.action.setIcon({ path: request.path }, () => {
      if (chrome.runtime.lastError) {
        console.log('Error setting icon:', chrome.runtime.lastError);
        sendResponse({ success: false });
      } else {
        console.log('Icon set');
        sendResponse({ success: true });
      }
    });
    
  } else if (request.action === 'backButtonClicked') {
    chrome.browserAction.setIcon({path: 'images/default.png'}, function() {
      if (!isHighlighting) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.runtime.reload();
        });
      }
    });
  }
  return true;  // Will respond asynchronously.
});

chrome.storage.local.get(['isHighlighting'], function(result) {
  isHighlighting = result.isHighlighting || false;
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete') {
    isHighlighting = true;
    chrome.storage.local.set({ isHighlighting: isHighlighting });
    chrome.tabs.sendMessage(tabId, { action: 'toggleHighlighting', isHighlighting });

    isHighlighting = false;
    chrome.storage.local.set({ isHighlighting: isHighlighting });
    chrome.tabs.sendMessage(tabId, { action: 'toggleHighlighting', isHighlighting });
  }
});

chrome.runtime.onInstalled.addListener(function () {
  console.log("Dark Pattern Extension installed");
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "openNewTab") {
    const mlUrl = "http://127.0.0.1:5001/";  // Replace with your ML server URL
    const newTabUrl = mlUrl + "?url=" + encodeURIComponent(message.url);
    chrome.tabs.create({ url: newTabUrl });
  }
});

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  chrome.tabs.sendMessage(tabs[0].id, {alert: "Comparison Result: " + comparisonResult});
});


// background.js
chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed");
});
