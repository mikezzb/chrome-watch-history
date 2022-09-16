import { makeObservable, observable } from "mobx";
import StoreManager from "./StoreManager";

const LOAD_KEYS = [
  "maxRecords",
  "syncInterval",
  "recordThreshold",
  "overwriteTimeout",
];

const DEFAULT_VALUES = {
  maxRecords: 18, // for Error: QUOTA_BYTES_PER_ITEM quota exceeded
  syncInterval: 3000,
  recordThreshold: 300, // in seconds = 5 mins, to ignore preview / commercial video
  overwriteTimeout: 6000,
};

export default class ConfigStore extends StoreManager {
  maxRecords: number = DEFAULT_VALUES.maxRecords;
  syncInterval: number = DEFAULT_VALUES.syncInterval;
  recordThreshold: number = DEFAULT_VALUES.recordThreshold;
  overwriteTimeout: number = DEFAULT_VALUES.overwriteTimeout;
  constructor() {
    super(LOAD_KEYS, LOAD_KEYS, DEFAULT_VALUES);
    makeObservable(this, {
      maxRecords: observable,
      syncInterval: observable,
      recordThreshold: observable,
      overwriteTimeout: observable,
    });
  }
}

export const configStore = new ConfigStore();
