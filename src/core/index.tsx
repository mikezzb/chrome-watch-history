import React, {
  createContext,
  FC,
  useContext,
  useEffect,
  useState,
} from "react";
import HistoryStore from "./HistoryStore";
import { VideoManager } from "./VideoManager";

export const historyStore = new HistoryStore();
export const videoManager = new VideoManager(historyStore);

export const HistoryContext = createContext<HistoryStore>(null as any);

export const useHistory = () => useContext(HistoryContext);

const StoreProvider: FC = ({ children }) => {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    init();
  }, []);
  const init = async () => {
    await historyStore.init();
    setReady(true);
  };
  if (!ready) return null;
  return (
    <HistoryContext.Provider value={historyStore}>
      {children}
    </HistoryContext.Provider>
  );
};

export default StoreProvider;
