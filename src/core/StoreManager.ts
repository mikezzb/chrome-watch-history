import { makeObservable, action } from "mobx";
import { setItem, removeItem, getItems, getItem } from "../helpers/store";

export default class StoreManager {
  onLoadKeys?: string[];
  onResetKeys?: string[];
  defaultValues: Record<string, any>;
  storageConfig: Record<string, boolean>;

  constructor(
    onLoadKeys?: string[],
    onResetKeys?: string[],
    defaultValues?: Record<string, any>,
    storageConfig?: Record<string, any>
  ) {
    this.onLoadKeys = onLoadKeys;
    this.onResetKeys = onResetKeys;
    this.defaultValues = defaultValues || {};
    this.storageConfig = storageConfig || {};
    makeObservable(this, {
      updateStore: action,
      setStore: action,
      save: action,
      removeStore: action,
      loadStore: action,
      resetStore: action,
      initStore: action,
    });
  }
  updateStore(k: string, v: any) {
    (this as any)[k] = v;
  }
  async setStore(k: string, v: any) {
    this.updateStore(k, v);
    await this.save(k, v);
  }
  async save(k: string, v: any) {
    await setItem(k, v);
  }
  async loadItem(k: string) {
    return await getItem(k);
  }
  async removeStore(k: string) {
    this.updateStore(k, undefined);
    await removeItem(k);
  }
  async loadStore() {
    const defaultValues = { ...this.defaultValues };
    if (this.onLoadKeys) {
      const loadedValues = await getItems(this.onLoadKeys);
      Object.entries(loadedValues).forEach(([k, v]) => {
        this.updateStore(k, v === null ? this.defaultValues[k] : v);
        delete defaultValues[k];
      });
    }
    // If there are some unloaded keys in default values, load it
    this.initStore(defaultValues);
  }
  async resetStore() {
    const defaultValues = { ...this.defaultValues };
    if (this.onResetKeys) {
      this.onResetKeys.forEach(async (key) => {
        await removeItem(key);
        this.updateStore(key, this.defaultValues[key] || null);
        delete defaultValues[key];
      });
    }
    this.initStore(defaultValues);
  }
  initStore(defaultValues?: Record<string, any>) {
    Object.entries(defaultValues || this.defaultValues).forEach(([k, v]) => {
      this.updateStore(k, v);
    });
  }
}
