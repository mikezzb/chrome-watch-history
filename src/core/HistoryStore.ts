import { makeObservable, observable, action, toJS, computed } from "mobx";
import { getTitle } from "../helpers";
import ConfigStore from "./ConfigStore";
import StoreManager from "./StoreManager";

const LOAD_KEYS = ["videoHistory"];

export default class HistoryStore extends StoreManager {
  videoHistory: VideoHistoryItem[] = [];
  length: number = 0;
  currIndex: number = -1;
  currUrl: string = "";
  prevItem?: VideoHistoryItem = undefined;
  private config: ConfigStore;
  constructor(config: ConfigStore) {
    super(LOAD_KEYS, LOAD_KEYS);
    this.config = config;
    makeObservable(this, {
      length: observable,
      currIndex: observable,
      prevItem: observable,
      videoHistory: observable,
      checkItem: action,
      addItem: action,
      deleteItem: action,
      setCurrItem: action,
    });
  }
  async init() {
    await this.loadStore();
    this.videoHistory ??= [];
    this.length = this.videoHistory.length;
  }
  get showPrevRecord() {
    return Boolean(this.prevItem && this.currIndex > -1);
  }
  get reversedHistory() {
    if (!this.videoHistory) return [];
    const arr = this.videoHistory.slice();
    // remove curr item from arr, cuz it's always on top
    if (this.showPrevRecord) {
      arr.splice(this.currIndex, 1);
    }
    return arr.sort((a, b) => b.updatedAt - a.updatedAt);
  }
  setCurrItem(idx: number, url: string) {
    this.currIndex = idx;
    this.currUrl = url;
  }
  shiftLength(delta: number) {
    let length = this.length + delta;
    if (length > this.config.maxRecords) {
      this.videoHistory.shift(); // remove oldest record (assume length delta <= 1)
      length = this.config.maxRecords;
    }
    this.length = length;
    return this.length;
  }
  findItemIndex(url: string): number | null {
    const result = this.videoHistory.findIndex((item) => item.url === url);
    return result > -1 ? result : null;
  }
  /**
   * For popup to see if curr url has prev hist, and mount the hist
   * @param url
   */
  checkItem(url: string) {
    let idx = this.findItemIndex(url);
    if (idx !== null) {
      this.prevItem = this.videoHistory[idx];
      this.setCurrItem(idx, url);
    }
  }
  addItem(url: string, item?: VideoHistoryItemBase): number {
    let idx = this.findItemIndex(url);
    item ??= { url };
    if (idx === null) {
      item.title = getTitle();
      idx = this.initItem(item);
    } else {
      // if has hist: make prev item for user to jump to prev playback time
      this.prevItem = this.videoHistory[idx];
      console.log("prev record: ", JSON.stringify(this.prevItem));
    }
    this.setCurrItem(idx, url);
    return idx;
  }
  async deleteItem(url: string) {
    const idx = this.findItemIndex(url);
    if (idx === null) return;
    const arr = [...this.videoHistory];
    arr.splice(idx, 1);
    this.videoHistory = arr;
    this.shiftLength(-1);
    await this.saveHistory();
  }
  initItem(item: VideoHistoryItemBase) {
    this.videoHistory.push(item as any);
    const index = this.shiftLength(1) - 1;
    return index;
  }
  async saveHistory() {
    await this.save("videoHistory", toJS(this.videoHistory));
  }
  updateItem(itemIndex: number, delta: Partial<VideoHistoryItem>) {
    if (itemIndex === -1 || !this.videoHistory[itemIndex]) return;
    delta.updatedAt = +new Date();
    console.log(`update ${itemIndex}: ${JSON.stringify(delta)}`);
    Object.assign(this.videoHistory[itemIndex], delta);
    this.saveHistory();
  }
}
