import { broadcast } from "./helpers/message";

/** Sync history when active changed (still cannot prevent simultaneous video overwrite) */
chrome.tabs.onActivated.addListener((activeInfo) => {
  try {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
      broadcast(activeInfo.tabId, {
        type: "SYNC",
        data: {
          url: tab.url,
        },
      });
    });
  } catch (e) {
    return;
  }
});
