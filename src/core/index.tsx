import React, {
  createContext,
  FC,
  useContext,
  useEffect,
  useState,
} from "react";
import ConfigStore, { configStore } from "./ConfigStore";
import HistoryStore from "./HistoryStore";

export const historyStore = new HistoryStore(configStore);

export const HistoryContext = createContext<HistoryStore>(null as any);
export const ConfigContext = createContext<ConfigStore>(null as any);

export const useHistory = () => useContext(HistoryContext);
export const useConfig = () => useContext(ConfigContext);

const StoreProvider: FC = ({ children }) => {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    init();
  }, []);
  const init = async () => {
    await configStore.loadStore();
    await historyStore.init();
    setReady(true);
  };
  if (!ready) return null;
  return (
    <ConfigContext.Provider value={configStore}>
      <HistoryContext.Provider value={historyStore}>
        {children}
      </HistoryContext.Provider>
    </ConfigContext.Provider>
  );
};

export default StoreProvider;
