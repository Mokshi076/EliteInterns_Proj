let activeTabId = null;
let startTime = null;

/**
 * Save time spent on the currently active tab
 */
function saveTime() {
  if (activeTabId === null || startTime === null) return;

  chrome.tabs.get(activeTabId, (tab) => {
    if (!tab || !tab.url) return;

    // Ignore chrome internal pages
    if (tab.url.startsWith("chrome://")) return;

    const now = Date.now();
    const timeSpent = now - startTime;

    startTime = now; // reset timer after saving

    let domain;
    try {
      domain = new URL(tab.url).hostname;
    } catch {
      return;
    }

    chrome.storage.local.get([domain], (result) => {
      const oldTime = result[domain] || 0;

      chrome.storage.local.set({
        [domain]: oldTime + timeSpent
      });
    });
  });
}

/**
 * When user switches tabs
 */
chrome.tabs.onActivated.addListener((activeInfo) => {
  saveTime(); // save time for previous tab

  activeTabId = activeInfo.tabId;
  startTime = Date.now(); // start timing new tab
});

/**
 * When active tab URL changes (same tab, new website)
 */
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.active && changeInfo.status === "complete") {
    saveTime();
    activeTabId = tabId;
    startTime = Date.now();
  }
});

/**
 * Create periodic alarm to keep saving time
 * (VERY IMPORTANT for Manifest V3)
 */
chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create("trackTime", {
    periodInMinutes: 0.1 // every 6 seconds
  });
});

/**
 * Alarm listener (keeps service worker alive)
 */
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "trackTime") {
    saveTime();
  }
});
