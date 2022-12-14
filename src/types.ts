/** Initial hist item */
interface VideoHistoryItemBase {
  url: string;
  title?: string;
}

/** Runtime attrs */
interface VideoHistoryItem extends VideoHistoryItemBase {
  currentTime: number;
  duration: number;
  src: string;
  updatedAt: number;
}

/** Extended */
interface VideoHistoryItemInfo extends VideoHistoryItem {
  title: string;
  caption: string;
  name: string;
}

type MsgType = "JUMP" | "SYNC" | "PAUSE";

type CustomRequest = {
  type: MsgType;
  data: Record<string, any>;
};
