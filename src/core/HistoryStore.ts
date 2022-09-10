import StoreManager from "./StoreManager";

const LOAD_KEYS = ["videoHistory"];

export default class HistoryStore extends StoreManager {
  videoHistory: VideoHistoryItem[];
  length: number;
  constructor() {
    super(LOAD_KEYS, LOAD_KEYS);
    this.videoHistory ??= [];
    this.length = this.videoHistory.length;
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
    this.length += 1;
    return this.length;
  }
  saveHistory() {
    this.save("videoHistory", this.videoHistory);
  }
  updateItem(itemIndex: number, delta: Partial<VideoHistoryItem>) {
    Object.assign(this.videoHistory[itemIndex], delta);
    this.saveHistory();
  }
}
