import { getItem, setItem, removeItem } from "../helpers/store";

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
  async removeStore(k: string) {
    this.updateStore(k, undefined);
    await removeItem(k);
  }
  async loadStore() {
    const defaultValues = { ...this.defaultValues };
    if (this.onLoadKeys) {
      const loadedValues = await getItem(this.onLoadKeys);
      Object.entries(loadedValues).forEach(([k, v]) => {
        const parse = this.storageConfig[k] === undefined;
        if (parse) {
          v = JSON.parse(v as string);
        }
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
