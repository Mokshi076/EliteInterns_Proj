let currentTab = null;
let startTime = null;

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const now = Date.now();

  if (currentTab && startTime) {
    saveTime(currentTab, now - startTime);
  }

  const tab = await chrome.tabs.get(activeInfo.tabId);
  currentTab = new URL(tab.url).hostname;
  startTime = now;
});

chrome.windows.onFocusChanged.addListener(async () => {
  const now = Date.now();
  if (currentTab && startTime) {
    saveTime(currentTab, now - startTime);
  }
  startTime = now;
});

function saveTime(site, time) {
  chrome.storage.local.get([site], (result) => {
    const prev = result[site] || 0;
    chrome.storage.local.set({
      [site]: prev + time
    });
  });
}
