import React, { createContext, useContext, ReactNode } from 'react';
import { porto } from './porto';
import type { Porto } from 'porto';

interface PortoContextValue {
  porto: typeof porto;
}

const PortoContext = createContext<PortoContextValue | undefined>(undefined);

interface PortoProviderProps {
  children: ReactNode;
}

export function PortoProvider({ children }: PortoProviderProps) {
  return (
    <PortoContext.Provider value={{ porto }}>
      {children}
    </PortoContext.Provider>
  );
}

export function usePorto() {
  const context = useContext(PortoContext);
  if (context === undefined) {
    throw new Error('usePorto must be used within a PortoProvider');
  }
  return context.porto;
}


