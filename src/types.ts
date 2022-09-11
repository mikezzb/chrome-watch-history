/** Initial hist item */
interface VideoHistoryItemBase {
  url: string;
}

/** Runtime attrs */
interface VideoHistoryItem extends VideoHistoryItemBase {
  currentTime: number;
  duration: number;
  src: string;
}

/** Extended */
interface VideoHistoryItemInfo extends VideoHistoryItem {
  title: string;
  caption: string;
}

type MsgType = "JUMP";

type CustomRequest = {
  type: MsgType;
  data: Record<string, any>;
};
