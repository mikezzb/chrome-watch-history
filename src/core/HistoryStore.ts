import { makeObservable, observable, action } from "mobx";
import { MAX_RECORDS } from "../config";
import StoreManager from "./StoreManager";

const LOAD_KEYS = ["videoHistory"];

export default class HistoryStore extends StoreManager {
  videoHistory!: VideoHistoryItem[];
  length: number = 0;
  currIndex: number = -1;
  prevItem?: VideoHistoryItem = undefined;
  constructor() {
    super(LOAD_KEYS, LOAD_KEYS);
    makeObservable(this, {
      length: observable,
      currIndex: observable,
      prevItem: observable,
      checkItem: action,
      addItem: action,
    });
  }
  get reversedHistory() {
    console.log("getter called");
    console.log(this.prevItem);
    const arr = [...this.videoHistory];
    if (this.prevItem && this.currIndex > -1) {
      console.log("removing prev item");
      arr.splice(this.currIndex, 1);
    }
    return arr.reverse();
  }
  async init() {
    await this.loadStore();
    this.videoHistory ??= [];
    observable.array(this.videoHistory, { deep: true });
    this.length = this.videoHistory.length;
    console.log(this.videoHistory);
  }
  shiftLength(delta: number) {
    let length = this.length + delta;
    if (length > MAX_RECORDS) {
      this.videoHistory.shift(); // remove oldest record (assume length delta <= 1)
      length = MAX_RECORDS;
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
      this.currIndex = idx;
    }
  }
  addItem(url: string, item?: VideoHistoryItemBase): number {
    let idx = this.findItemIndex(url);
    item ??= { url };
    if (idx === null) {
      idx = this.initItem(item);
    } else {
      // if has hist: make prev item for user to jump to prev playback time
      this.prevItem = this.videoHistory[idx];
      console.log("prev record: ", JSON.stringify(this.prevItem));
    }
    this.currIndex = idx;
    return idx;
  }
  initItem(item: VideoHistoryItemBase) {
    this.videoHistory.push(item as any);
    const index = this.shiftLength(1) - 1;
    return index;
  }
  saveHistory() {
    this.save("videoHistory", this.videoHistory);
  }
  updateItem(itemIndex: number, delta: Partial<VideoHistoryItem>) {
    console.log(`update ${itemIndex}: ${JSON.stringify(delta)}`);
    Object.assign(this.videoHistory[itemIndex], delta);
    this.saveHistory();
  }
}
