/** Initial hist item */
interface VideoHistoryItemBase {
  url: string;
}

/** Runtime attrs */
interface VideoHistoryItem extends VideoHistoryItemBase {
  currentTime?: number;
}
