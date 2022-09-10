import HistoryStore from "./HistoryStore";

export class VideoManager {
  private itemIndex: number = -1;
  private store: HistoryStore = null as any;
  private _video: HTMLVideoElement | undefined = undefined;
  constructor(store: HistoryStore) {
    this.store = store;
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
    this._video = undefined;
    if (this.video) {
      this.itemIndex = this.store.addItem(url);
    }
    // eventlistener for playback and update item history
  }
}
