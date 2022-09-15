type ResponseCallback = (response: any) => void;

export const broadcastAll = async (
  msg: Record<string, any>,
  callback?: ResponseCallback
) => {
  console.log("BC All");
  const tabs = await chrome.tabs.query({});
  console.log("Tabs:");
  console.log(tabs);
  /* return Promise.all(
    tabs.map((tab) => broadcast(tab.id as number, msg, callback))
  ); */
  tabs.forEach((tab) => broadcast(tab.id as number, msg, callback));
};

export const broadcast = async (
  tabId: number,
  msg: Record<string, any>,
  callback?: ResponseCallback
) => {
  chrome.tabs.sendMessage(tabId, msg, callback);
};
