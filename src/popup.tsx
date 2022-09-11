import React, { FC, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import StoreProvider, { useHistory } from "./core";
import { observer } from "mobx-react-lite";
import { getCurrUrl, toMMSS } from "./helpers";
import clsx from "clsx";
import Button from "./components/Button";

type VideoListItemProp = {
  item: VideoHistoryItem;
  className?: string;
};

const getLast = (arr: any[]) => arr[arr.length - 1];

const derive = (item: VideoHistoryItem): VideoHistoryItemInfo => {
  const url = new URL(item.url);
  const info: VideoHistoryItemInfo = { ...item } as any;
  const shortDomain = url.hostname.split(".")[1] ?? "";
  const videoName = item.src
    ? decodeURI(getLast(item.src.split("/")).replace(/\.[^/.]+$/, ""))
    : ""; // decode uri to show chinese char
  info.title = `${shortDomain ? `${shortDomain}/` : ""}${videoName}`;
  info.caption = `${toMMSS(item.currentTime)}`;
  return info;
};

const VideoListItem: FC<VideoListItemProp> = ({ item, className }) => {
  const info = derive(item);
  const jumpToItem = () => {
    chrome.tabs.update({
      url: info.url,
    });
  };
  return (
    <div className={clsx("cvh-list-item flex", className)}>
      <div className="cvh-item-left flex column">
        <span className="title ">{info.title}</span>
        <span className="caption">{info.caption}</span>
      </div>
      <div className="cvh-item-right flex center">
        <Button onClick={jumpToItem}>Jump</Button>
      </div>
    </div>
  );
};

const Popup: FC = observer(() => {
  const history = useHistory();

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    history.checkItem(await getCurrUrl());
  };

  return (
    <div className="cvh-list-container flex column">
      {Boolean(history.prevItem) && (
        <VideoListItem className="active" item={history.prevItem as any} />
      )}
      {history.reversedHistory.map((item) => (
        <VideoListItem key={`${item.url}-${item.src}`} item={item} />
      ))}
    </div>
  );
});

const PopupContainer: FC = () => {
  return (
    <StoreProvider>
      <Popup />
    </StoreProvider>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <PopupContainer />
  </React.StrictMode>,
  document.getElementById("root")
);
