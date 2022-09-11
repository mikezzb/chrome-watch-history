import HistoryStore from "./HistoryStore";
import { VideoManager } from "./VideoManager";

export const historyStore = new HistoryStore();
export const videoManager = new VideoManager(historyStore);
