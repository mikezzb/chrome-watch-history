import React, { FC, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { reaction } from "mobx";
import { observer } from "mobx-react-lite";
import Snackbar from "./components/Snackbar";
import StoreProvider, { useHistory } from "./core";
import { videoManager } from "./core/VideoManager";
import { safeGetUrl, toMMSS } from "./helpers";

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
        if (prevItem && prevItem.src !== prevItemRef.current?.src) {
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
          setTimeout(() => {
            setMsg(null);
          }, 4000);
        }
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
