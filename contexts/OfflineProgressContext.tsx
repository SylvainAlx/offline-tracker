import { getTotalOfflineSeconds } from "@/utils/getOfflineTime";
import React, { createContext, useContext, useEffect, useState } from "react";

type OfflineProgressContextType = {
  totalSeconds: number;
};

const OfflineProgressContext = createContext<OfflineProgressContextType>({
  totalSeconds: 0,
});

export const OfflineProgressProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [totalSeconds, setTotalSeconds] = useState(0);

  useEffect(() => {
    const update = async () => {
      const seconds = await getTotalOfflineSeconds();
      setTotalSeconds(seconds);
    };

    update(); // Initial fetch

    const interval = setInterval(update, 1000); // Refresh every second
    return () => clearInterval(interval);
  }, []);

  return (
    <OfflineProgressContext.Provider value={{ totalSeconds }}>
      {children}
    </OfflineProgressContext.Provider>
  );
};

export const useOfflineProgress = () => useContext(OfflineProgressContext);
