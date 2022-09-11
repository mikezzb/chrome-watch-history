import React, { FC, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import StoreProvider, { useHistory } from "./core";
import { observer } from "mobx-react-lite";
import { getCurrUrl } from "./helpers";

type VideoListItemProp = {
  item: VideoHistoryItem;
};

const VideoListItem: FC<VideoListItemProp> = ({ item }) => {
  return <div>{item.url}</div>;
};

const Popup: FC = observer(() => {
  const history = useHistory();

  useEffect(() => {
    console.log(history);
  }, [history]);

  return (
    <>
      {history.videoHistory.map((item) => (
        <VideoListItem key={`${item.url}-${item.src}`} item={item} />
      ))}
    </>
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
