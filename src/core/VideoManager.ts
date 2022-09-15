import HistoryStore from "./HistoryStore";
import { DebouncedFunc, throttle } from "lodash";
import { safeGetUrl } from "../helpers";
import { historyStore } from ".";
import ConfigStore, { configStore } from "./ConfigStore";

// update store only ready

enum VideoManagerState {
  READY,
  PAUSE,
}

export class VideoManager {
  private itemIndex!: number;
  private store!: HistoryStore;
  private _video: HTMLVideoElement | undefined | null; // null: no video in dom
  private _videoSrc!: string;
  private onTimeUpdate!: DebouncedFunc<any>;
  private url?: string;
  private source?: HTMLSourceElement;
  private jumpTimeout?: NodeJS.Timeout; // allow time for user to jump b4 override hist if have prevItem
  private config: ConfigStore;
  private state: VideoManagerState = VideoManagerState.READY;
  constructor(store: HistoryStore, config: ConfigStore) {
    this.store = store;
    this.config = config;
    this.onTimeUpdate = throttle(this._onTimeUpdate, config.syncInterval);
    this.onTimeUpdate = this.onTimeUpdate.bind(this);
    this.init();
  }
  async init() {
    await this.store.init();
    // for file:// videos, the DOM wont update, so call here after init
    this.initValues();
    this.checkVideo(await safeGetUrl());
  }
  private static validVideo(el: HTMLVideoElement) {
    return Boolean(el);
  }
  get validRecord() {
    if (!this.video) return false;
    return (
      this.video.currentTime !== undefined &&
      this.video.duration > this.config.recordThreshold
    );
  }
  get video(): HTMLVideoElement | null | undefined {
    if (this._video || this._video === null) return this._video;
    console.log("prev video:");
    console.log(this._video);
    console.log(`checking for video ${this.url}`);
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
    }
    // if swapped url, then clear and check
    else if (this.url !== undefined) {
      this.clearVideo();
      this.url = url;
    } else {
      this._video = undefined;
      this.url = url;
    }
    if (!this.video) return;
    // eventlistener for playback and update item history
    this.observeVideo();
  }
  async _onTimeUpdate(event: Event) {
    if (
      !this.validRecord ||
      this.jumpTimeout ||
      this.state === VideoManagerState.PAUSE
    )
      return;
    // lazy append history only if valid record
    if (this.itemIndex === -1) {
      const lazy = await this.lazyMount();
      if (lazy) return;
    }
    this.store.updateItem(this.itemIndex, {
      currentTime: this.video?.currentTime,
      duration: this.video?.duration,
      src: this.videoSrc,
    });
  }
  async lazyMount() {
    await this.store.init();
    this.itemIndex = this.store.addItem(this.url as string);
    if (!this.store.prevItem) return false;
    console.log("set timeout then mount");
    this.jumpTimeout = setTimeout(() => {
      console.log("Jump interval passed, now overwriting");
      this.jumpTimeout = undefined;
    }, this.config.overwriteTimeout);
    return true;
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
    this._video = undefined;
    if (skipVideo) return;
    this._videoSrc = "";
    if (this.jumpTimeout) clearTimeout(this.jumpTimeout);
    this.jumpTimeout = undefined;
  }
  jumpTo(time: number) {
    if (!this.video) return;
    this.video.currentTime = time;
  }
  pause() {
    console.log("pause");
    this.state = VideoManagerState.PAUSE;
  }
  resume() {
    console.log("resume");
    this.state = VideoManagerState.READY;
  }
  async sync() {
    console.log(`Sync: ${this.itemIndex}`);
    this.pause();
    console.log(this.store.videoHistory);
    await this.store.init();
    this.itemIndex = this.store.addItem(this.url as string); // reassign index
    console.log(`After sync: ${this.itemIndex}`);
    console.log(this.store.videoHistory);
    console.log(this.itemIndex);
    this.resume();
  }
}

export const videoManager = new VideoManager(historyStore, configStore);
