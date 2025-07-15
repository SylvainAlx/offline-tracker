// contexts/SessionContext.tsx
import { supabase } from "@/utils/supabase";
import { Session, User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";

type SessionContextType = {
  session: Session | null;
  user: User | null;
  totalSyncSeconds: number;
  setTotalSyncSeconds: (value: number) => void;
};

const SessionContext = createContext<SessionContextType>({
  session: null,
  user: null,
  totalSyncSeconds: 0,
  setTotalSyncSeconds: () => {},
});

export const SessionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [totalSyncSeconds, setTotalSyncSeconds] = useState<number>(0);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, []);

  return (
    <SessionContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        totalSyncSeconds,
        setTotalSyncSeconds,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);
