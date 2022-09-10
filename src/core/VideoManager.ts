import HistoryStore from "./HistoryStore";
import { debounce } from "lodash";

export class VideoManager {
  private itemIndex: number = -1;
  private store: HistoryStore = null as any;
  private _video: HTMLVideoElement | undefined = undefined;
  private onTimeUpdate = debounce(this._onTimeUpdate, 5000);
  constructor(store: HistoryStore) {
    this.store = store;
    this.onTimeUpdate = this.onTimeUpdate.bind(this);
  }
  private static validVideo(el: HTMLVideoElement) {
    return !!(
      el &&
      !isNaN(el.duration) &&
      el.currentTime > 0 &&
      !el.paused &&
      !el.ended &&
      el.readyState > 2
    );
  }
  get video(): HTMLVideoElement | undefined {
    if (this._video || this._video === null) return this._video;
    const videoNodes = document.getElementsByTagName("video");
    for (let i = 0; i < videoNodes.length; i++) {
      const node = videoNodes[i];
      this._video = node || null;
      if (VideoManager.validVideo(node)) return this._video;
    }
  }
  switchVideo(url: string) {
    this.clear();
    if (!this.video) return;
    this.itemIndex = this.store.addItem(url);
    // eventlistener for playback and update item history
    this.observeVideo();
  }
  _onTimeUpdate(event: Event) {
    this.store.updateItem(this.itemIndex, {
      currentTime: this.video?.currentTime,
    });
  }
  observeVideo() {
    this.video?.addEventListener("timeupdate", this.onTimeUpdate);
  }
  clear() {
    this.video?.removeEventListener("timeupdate", this.onTimeUpdate);
    this._video = undefined;
  }
}
