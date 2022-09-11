export const getCurrUrl = async () => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs[0].url as string;
};

export const prefix = (d: number) => (d > 9 ? `${d}` : `0${d}`);

export const toMMSS = (seconds: number) => {
  const min = prefix(Math.floor(seconds / 60));
  const sec = prefix(+(seconds % 60).toFixed(0));
  return `${min}:${sec}`;
};
