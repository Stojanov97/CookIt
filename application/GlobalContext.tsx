import React, { createContext, useState, ReactNode, useContext } from "react";

// Define your global state shape
interface GlobalState {
  checkDB: boolean;
  setCheckDB: (value: boolean) => void;
}

// Create context with initial undefined
const GlobalContext = createContext<GlobalState | undefined>(undefined);

// Provider component
interface Props {
  children: ReactNode;
}

export const GlobalProvider: React.FC<Props> = ({ children }) => {
  const [checkDB, setCheckDB] = useState<boolean>(false);

  return (
    <GlobalContext.Provider value={{ checkDB, setCheckDB }}>
      {children}
    </GlobalContext.Provider>
  );
};

// Custom hook
export const useGlobal = (): GlobalState => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobal must be used within a GlobalProvider");
  }
  return context;
};
