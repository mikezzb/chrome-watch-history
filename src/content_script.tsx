import React, { FC, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { reaction } from "mobx";
import { observer } from "mobx-react-lite";
import Snackbar from "./components/Snackbar";
import StoreProvider, { useHistory } from "./core";
import { videoManager } from "./core/VideoManager";
import { getWindowUrl, toMMSS } from "./helpers";

/** Monitor dom update & find video node */
const domObserver = new MutationObserver((mutations) => {
  requestIdleCallback(
    () => {
      mutations.forEach(async (mutation) => {
        if (mutation.type === "childList") {
          videoManager.checkVideo(getWindowUrl());
        }
      });
    },
    {
      timeout: 2000,
    }
  );
});

domObserver.observe(document, {
  attributeFilter: ["aria-hidden"],
  childList: true,
  subtree: true,
});

/** Sync history array when have focus */
document.addEventListener("visibilitychange", function () {
  if (document.visibilityState === "visible") {
    videoManager.sync();
  }
});

/** Monitor popup events */
chrome.runtime.onMessage.addListener(
  (request: CustomRequest, sender, sendResponse) => {
    switch (request.type) {
      case "JUMP": {
        const { time } = request.data;
        videoManager.jumpTo(time);
        break;
      }
      case "SYNC": {
        const { url } = request.data || {};
        if (url && getWindowUrl() !== url) return; // if url dun match, skip sync
        videoManager.sync();
        break;
      }
      case "PAUSE":
        videoManager.pause();
        break;
    }
    return true;
  }
);

const JumpSnackbar: FC = observer(() => {
  const [msg, setMsg] = useState<any>();
  const prevItemRef = useRef<any>();
  const history = useHistory();
  useEffect(() => {
    const disposer = reaction(
      () => ({
        prevItem: history.prevItem,
      }),
      (data) => {
        const { prevItem } = data;
        if (!prevItem || prevItem.src === prevItemRef.current?.src) return;
        prevItemRef.current = prevItem;
        setMsg({
          message: `Last watched ${toMMSS(prevItem.currentTime)}`,
          action: {
            name: "jump",
            onClick: () => {
              videoManager.jumpTo(prevItem.currentTime as number);
              setMsg(null);
            },
          },
        });
        setTimeout(() => setMsg(null), 4000);
      },
      {
        fireImmediately: true,
      }
    );
    // end sync b4 unmount
    return () => disposer();
  }, []);
  if (!msg) return null;
  return <Snackbar message={msg.message} action={msg.action} />;
});

const App: FC = observer(() => {
  return (
    <StoreProvider>
      <JumpSnackbar />
    </StoreProvider>
  );
});

const inject = () => {
  const body = document.querySelector("body");
  const app = document.createElement("div");
  app.id = "cvh-root";
  app.style.fontFamily = `-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif`;
  if (body) {
    videoManager.checkVideo(getWindowUrl());
    body.prepend(app);
    ReactDOM.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
      app
    );
  }
};

inject();
