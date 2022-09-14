import { makeObservable, observable } from "mobx";
import StoreManager from "./StoreManager";

const LOAD_KEYS = [
  "maxRecords",
  "syncInterval",
  "recordThreshold",
  "overwriteTimeout",
];

const DEFAULT_VALUES = {
  maxRecords: 15,
  syncInterval: 3000,
  recordThreshold: 360, // in seconds = 6 mins, to ignore preview / commercial video
  overwriteTimeout: 10000,
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
