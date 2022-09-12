import React, { FC, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import StoreProvider, { useHistory } from "./core";
import { observer } from "mobx-react-lite";
import { download, getCurrUrl, getMMMDDYY, toMMSS } from "./helpers";
import clsx from "clsx";
import {
  MdDeleteOutline,
  MdDownload,
  MdDownloadForOffline,
  MdOpenInNew,
  MdOutlineFileDownload,
} from "react-icons/md";
import Button from "./components/Button";
import IconButton from "./components/IconButton";

type VideoListItemProp = {
  item: VideoHistoryItem;
  className?: string;
  onDelete: (url: string) => any;
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
  const progress = ((item.currentTime * 100) / item.duration).toFixed(0);
  info.caption = `${toMMSS(item.currentTime)} (${progress}%) • ${getMMMDDYY(
    item.updatedAt
  )}`;
  return info;
};

const VideoListItem: FC<VideoListItemProp> = ({
  item,
  className,
  onDelete,
}) => {
  const info = derive(item);
  const jumpToItem = () => {
    chrome.tabs.create({
      url: info.url,
    });
  };
  const downloadItem = () => {
    download(info.src);
  };
  return (
    <div className={clsx("cvh-list-item cvh-flex", className)}>
      <div className="cvh-item-left cvh-flex cvh-column">
        <span className="cvh-title ">{info.title}</span>
        <span className="cvh-caption">{info.caption}</span>
      </div>
      <div className="cvh-item-right cvh-flex cvh-center">
        <IconButton onClick={() => onDelete(item.url)}>
          <MdDeleteOutline />
        </IconButton>
        <IconButton onClick={downloadItem}>
          <MdOutlineFileDownload />
        </IconButton>
        <IconButton onClick={jumpToItem}>
          <MdOpenInNew />
        </IconButton>
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

  const onDelete = (url: string) => history.deleteItem(url);

  return (
    <div className="cvh-list-container cvh-flex cvh-column">
      {Boolean(history.prevItem) && (
        <VideoListItem
          className="active"
          item={history.prevItem as any}
          onDelete={onDelete}
        />
      )}
      {history.reversedHistory.map((item) => (
        <VideoListItem
          key={`${item.url}-${item.src}`}
          item={item}
          onDelete={onDelete}
        />
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
