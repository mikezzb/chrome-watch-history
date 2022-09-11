import { videoManager } from "./core";

const domObserver = new MutationObserver((mutations) => {
  requestIdleCallback(
    () => {
      mutations.forEach(async (mutation) => {
        if (mutation.type === "childList") {
          const url = window.location.toString();
          videoManager.checkVideo(url);
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
