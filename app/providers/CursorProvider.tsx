"use client";

import { createContext, useContext, useState, useEffect } from "react";

type CursorContextType = {
  active: boolean;
  setActive: (active: boolean) => void;
};

const CursorContext = createContext<CursorContextType>({
  active: false,
  setActive: () => {},
});

export const useCursor = () => useContext(CursorContext);

export function CursorProvider({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState(false);

  return (
    <CursorContext.Provider value={{ active, setActive }}>
      {children}
    </CursorContext.Provider>
  );
}
