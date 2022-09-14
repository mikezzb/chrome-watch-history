export const getTitle = () => document.title;

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

export const download = (uri: string, filename?: string) => {
  const link = document.createElement("a");
  if (typeof link.download === "string") {
    link.href = uri;
    if (filename) {
      link.download = filename;
    }
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    window.open(uri);
  }
};

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const getMMMDDYY = (timestamp: string | number) => {
  const currentYear = new Date().getFullYear();
  const date = new Date(+timestamp);
  const timestampYear = date.getFullYear();
  const hideYear = currentYear === timestampYear;
  return `${MONTHS[date.getMonth()]} ${date.getDate()}${
    hideYear ? "" : `, ${date.getFullYear()}`
  }`;
};

const isPopup = (url: string) => url.startsWith("chrome-extension://");

export const safeGetUrl = async () => {
  let url = window.location.toString();
  if (isPopup(url)) {
    return await getCurrUrl();
  } else return url;
};
