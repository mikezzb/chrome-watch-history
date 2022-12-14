import React, { FC, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import StoreProvider, { useHistory } from "./core";
import { observer } from "mobx-react-lite";
import { getCurrUrl, getMMMDDYY, toMMSS } from "./helpers";
import clsx from "clsx";
import { MdDeleteOutline, MdOpenInNew } from "react-icons/md";
import IconButton from "./components/IconButton";
import { broadcastAll } from "./helpers/message";

const getLast = (arr: any[]) => arr[arr.length - 1];

const derive = (item: VideoHistoryItem): VideoHistoryItemInfo => {
  const url = new URL(item.url);
  const info: VideoHistoryItemInfo = { ...item } as any;
  const shortDomain = url.hostname.split(".")[1] ?? "";
  const name = item.src
    ? decodeURI(getLast(item.src.split("/")).replace(/\.[^/.]+$/, ""))
    : ""; // decode uri to show chinese char
  info.title ||= name || item.url;
  const progress = ((item.currentTime * 100) / item.duration).toFixed(0);
  info.caption = [
    `${toMMSS(item.currentTime)} (${progress}%)`,
    getMMMDDYY(item.updatedAt),
    shortDomain || "local",
  ]
    .filter((s) => s)
    .join(" • ");
  return info;
};

type VideoListItemProp = {
  item: VideoHistoryItem;
  className?: string;
  onDelete?: (url: string) => any;
  hideLink?: boolean;
};

const VideoListItem: FC<VideoListItemProp> = ({
  item,
  className,
  onDelete,
  hideLink,
}) => {
  const info = derive(item);
  const jumpToItem = () => {
    chrome.tabs.create({
      url: info.url,
    });
  };
  return (
    <div className={clsx("cvh-list-item cvh-flex", className)}>
      <div className="cvh-item-left cvh-flex cvh-column">
        <span className="cvh-title ">{info.title}</span>
        <span className="cvh-caption">{info.caption}</span>
      </div>
      <div className="cvh-item-right cvh-flex cvh-center">
        {Boolean(onDelete) && (
          <IconButton onClick={() => (onDelete as any)(item.url)}>
            <MdDeleteOutline />
          </IconButton>
        )}
        {!hideLink && (
          <IconButton onClick={jumpToItem}>
            <MdOpenInNew />
          </IconButton>
        )}
      </div>
    </div>
  );
};

const Popup: FC = observer(() => {
  const history = useHistory();
  const [hideId, setHideId] = useState<string | null>();

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    history.checkItem(await getCurrUrl());
  };

  const onDelete = async (url: string) => {
    // pause update -> delete -> sync content script history
    setHideId(url);
    await broadcastAll({
      type: "PAUSE",
    });
    await history.deleteItem(url);
    history.checkItem(await getCurrUrl()); // update curr index
    await broadcastAll({
      type: "SYNC",
    });
    setHideId(null);
  };

  return (
    <div className="cvh-list-container cvh-flex cvh-column">
      {Boolean(history.prevItem) && (
        <VideoListItem hideLink item={history.prevItem as any} />
      )}
      {(hideId
        ? history.reversedHistory.filter((item) => item.url !== hideId)
        : history.reversedHistory
      ).map((item) => (
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
