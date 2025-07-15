import { config } from "@/config/env";
import { addPeriod, closeLastPeriod } from "@/storage/offlineStorage";
import { getTotalOfflineSeconds } from "@/utils/getOfflineTime";
import NetInfo from "@react-native-community/netinfo";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSession } from "./SessionContext";

type OfflineProgressContextType = {
  totalUnsync: number;
  setTotalUnsync: (value: number) => void; // Optional setter for testing
  isOnline: boolean;
};

const OfflineProgressContext = createContext<OfflineProgressContextType>({
  totalUnsync: 0,
  setTotalUnsync: () => {},
  isOnline: true,
});

export const OfflineProgressProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [totalUnsync, setTotalUnsync] = useState<number>(0);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const { session } = useSession();
  const wasOffline = useRef(false);
  const isInitialized = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Detect connectivity
  useEffect(() => {
    const timeout = setTimeout(() => {
      isInitialized.current = true;
    }, config.startupDelayMs);

    const unsubscribe = NetInfo.addEventListener(async (state) => {
      const connected = state.isConnected && state.isInternetReachable;
      if (!isInitialized.current) return;

      setIsOnline(!!connected);
    });

    return () => {
      clearTimeout(timeout);
      unsubscribe();
    };
  }, []);

  // Increment counter every second if offline
  useEffect(() => {
    const loadInitial = async () => {
      const seconds = await getTotalOfflineSeconds(true);
      setTotalUnsync(seconds);
    };
    loadInitial();

    const addNewPeriod = async () => {
      await addPeriod({ from: new Date().toISOString() });
    };
    if (!isOnline && !wasOffline.current) {
      wasOffline.current = true;
      addNewPeriod();
    }

    if (isOnline && wasOffline.current) {
      wasOffline.current = false;
      closeLastPeriod(new Date().toISOString());
    }

    if (!isOnline) {
      intervalRef.current = setInterval(() => {
        setTotalUnsync((prev) => prev + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isOnline, session]);

  return (
    <OfflineProgressContext.Provider
      value={{ totalUnsync, setTotalUnsync, isOnline }}
    >
      {children}
    </OfflineProgressContext.Provider>
  );
};

export const useOfflineProgress = () => useContext(OfflineProgressContext);
