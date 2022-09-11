import React, { FC } from "react";
import ReactDOM from "react-dom";
import { observer } from "mobx-react-lite";
import Snackbar from "./components/Snackbar";
import StoreProvider, { useHistory } from "./core";
import { videoManager } from "./core/VideoManager";
import { getCurrUrl, safeGetUrl, toMMSS } from "./helpers";

const domObserver = new MutationObserver((mutations) => {
  requestIdleCallback(
    async () => {
      mutations.forEach(async (mutation) => {
        if (mutation.type === "childList") {
          videoManager.checkVideo(await safeGetUrl());
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

chrome.runtime.onMessage.addListener(
  (request: CustomRequest, sender, sendResponse) => {
    switch (request.type) {
      case "JUMP":
        const { time } = request.data;
        videoManager.jumpTo(time);
        break;
    }
  }
);

const JumpSnackbar: FC = observer(() => {
  const history = useHistory();
  if (!history.prevItem) return null;
  const msg = `Last watched ${toMMSS(history.prevItem.currentTime)}`;
  return (
    <Snackbar
      message={msg}
      action={{
        name: "jump",
        onClick: () =>
          videoManager.jumpTo(history.prevItem?.currentTime as number),
      }}
    />
  );
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
  if (body) {
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
