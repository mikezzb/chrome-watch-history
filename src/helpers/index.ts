export const getCurrUrl = async () => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs[0].url as string;
};
