import { createContext, useContext, useState, type ReactNode } from 'react';

type LoadingMap = Record<string, boolean>;

interface LoadingContextProps {
  loadingMap: LoadingMap;
  setLoading: (key: string, value: boolean) => void;
}

const LoadingContext = createContext<LoadingContextProps | undefined>(undefined);

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [loadingMap, setMap] = useState<LoadingMap>({});
  const setLoading = (key: string, value: boolean) =>
    setMap(prev => ({ ...prev, [key]: value }));
  return (
    <LoadingContext.Provider value={{ loadingMap, setLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = (key?: string) => {
  const ctx = useContext(LoadingContext);
  if (!ctx) throw new Error('LoadingContext not found');
  return key ? ctx.loadingMap[key] ?? false : Object.values(ctx.loadingMap).some(Boolean);
};
