type ResponseCallback = (response: any) => void;

export const broadcastAll = (
  msg: Record<string, any>,
  filterFn?: (tab: any) => boolean,
  callback?: ResponseCallback
) => {
  return new Promise((resolve, reject) => {
    try {
      chrome.tabs.query({}, (tabs) => {
        /* return Promise.all(
          tabs.map((tab) => broadcast(tab.id as number, msg, callback))
        ); */
        (filterFn ? tabs.filter(filterFn) : tabs).forEach((tab) =>
          broadcast(tab.id as number, msg, callback)
        );
        resolve(undefined);
      });
    } catch (e) {
      reject(e);
    }
  });
};

export const broadcast = (
  tabId: number,
  msg: Record<string, any>,
  callback?: ResponseCallback
) => {
  try {
    chrome.tabs.sendMessage(tabId, msg, callback);
  } catch (e) {
    return;
  }
};
