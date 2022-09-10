type StorageArea = "local" | "sync";

export const storeFactory = (
  storage: typeof chrome.storage,
  mode: StorageArea
) => {
  const store = storage[mode];
  const getItem = async (name: string | string[], parse = true) => {
    const value = await store.get(name);
    return parse ? JSON.parse(value[name as string]) : value;
  };
  const removeItem = async (name: string | string[]) => {
    await store.remove(name);
  };
  const setItem = async (name: string, value: any, stringify = true) => {
    await store.set({
      [name]: stringify ? JSON.stringify(value) : value,
    });
  };
  const setItems = async (items: Record<string, any>) => {
    await store.set(items);
  };
  return {
    getItem,
    removeItem,
    setItem,
    setItems,
  };
};

const { getItem, setItem, removeItem, setItems } = storeFactory(
  chrome.storage,
  "local"
);

export { getItem, setItem, removeItem, setItems };
