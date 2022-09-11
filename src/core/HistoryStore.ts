import { MAX_RECORDS } from "../config";
import StoreManager from "./StoreManager";

const LOAD_KEYS = ["videoHistory"];

export default class HistoryStore extends StoreManager {
  videoHistory!: VideoHistoryItem[];
  length!: number;
  constructor() {
    super(LOAD_KEYS, LOAD_KEYS);
    this.init();
  }
  async init() {
    await this.loadStore();
    this.videoHistory ??= [];
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
  addItem(url: string, item?: VideoHistoryItemBase): number {
    let idx = this.findItemIndex(url);
    item ??= { url };
    if (idx === null) {
      idx = this.initItem(item);
    }
    return idx;
  }
  initItem(item: VideoHistoryItemBase) {
    this.videoHistory.push(item);
    const index = this.shiftLength(1) - 1;
    return index;
  }
  saveHistory() {
    console.log("saving");
    this.save("videoHistory", this.videoHistory);
  }
  updateItem(itemIndex: number, delta: Partial<VideoHistoryItem>) {
    console.log(`update ${itemIndex}: ${JSON.stringify(delta)}`);
    console.log(this.videoHistory);
    Object.assign(this.videoHistory[itemIndex], delta);
    this.saveHistory();
  }
}
