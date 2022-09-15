/** Sync history when active changed (still cannot prevent simultaneous video overwrite) */
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  chrome.tabs.sendMessage(activeInfo.tabId, {
    type: "SYNC",
    data: {
      url: tab.url,
    },
  });
});
