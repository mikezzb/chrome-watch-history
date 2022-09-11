import HistoryStore from "./HistoryStore";
import { throttle } from "lodash";

// update store only ready

export class VideoManager {
  private itemIndex!: number;
  private store!: HistoryStore;
  private _video: HTMLVideoElement | undefined | null; // null: no video in dom
  private _videoSrc!: string;
  private onTimeUpdate = throttle(this._onTimeUpdate, 1000);
  private url?: string;
  private source?: HTMLSourceElement;
  constructor(store: HistoryStore) {
    this.store = store;
    this.onTimeUpdate = this.onTimeUpdate.bind(this);
    this.init();
  }
  async init() {
    await this.store.init();
    // for file:// videos, the DOM wont update, so call here after init
    this.initValues();
    this.checkVideo(window.location.toString());
  }
  private static validVideo(el: HTMLVideoElement) {
    return Boolean(el);
  }
  get video(): HTMLVideoElement | null | undefined {
    if (this._video || this._video === null) return this._video;
    console.log("prev video:");
    console.log(this._video);
    console.log("checking for video");
    const videoNodes = document.getElementsByTagName("video");
    console.log(videoNodes);
    for (let i = 0; i < videoNodes.length; i++) {
      const node = videoNodes[i];
      if (VideoManager.validVideo(node)) {
        console.log("Found video node");
        this._video = node;
        const sources = node.getElementsByTagName("source");
        this.source = sources ? sources[0] : undefined;
        return this._video;
      } else {
        console.log("Invalid video node");
      }
    }
    console.log("Video node not found");
    this._video = null;
    return this._video;
  }
  get videoSrc(): string {
    if (this._videoSrc) return this._videoSrc;
    this._videoSrc = this.video?.src || this.source?.src || "";
    return this._videoSrc;
  }
  checkVideo(url: string) {
    // if same url, then skip checking if got video already, otherwise keep checking
    if (url === this.url) {
      if (this.video) return;
      console.log("Same url check");
    }
    // if swapped url, then clear and check
    else if (this.url !== undefined) {
      this.clearVideo();
      console.log("diff url check");
    } else {
      console.log(`Check init url: ${url}`);
    }
    this.url = url;
    console.log("final:");
    console.log(this.video);
    if (!this.video) return;
    // eventlistener for playback and update item history
    this.observeVideo();
  }
  _onTimeUpdate(event: Event) {
    if (this.video?.currentTime === undefined) return;
    if (this.itemIndex === -1) {
      this.itemIndex = this.store.addItem(this.url as string);
    }
    this.store.updateItem(this.itemIndex, {
      currentTime: this.video?.currentTime,
      duration: this.video?.duration,
      src: this.videoSrc,
    });
  }
  observeVideo() {
    this.video?.addEventListener("timeupdate", this.onTimeUpdate);
  }
  clearVideo() {
    console.log("clearing");
    if (!this.video) return this.initValues(true);
    this.video?.removeEventListener("timeupdate", this.onTimeUpdate);
    this.initValues();
  }
  initValues(skipVideo = false) {
    this.itemIndex = -1;
    if (skipVideo) return;
    this._video = undefined;
    this._videoSrc = "";
  }
}
