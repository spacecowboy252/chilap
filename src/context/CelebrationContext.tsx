import React, { createContext, useState, useContext } from 'react';

export interface CelebrationData {
  visible: boolean;
  taskTitle: string;
  points: number;
  childName: string;
}

interface CelebrationContextShape {
  celebration: CelebrationData;
  show: (d: Omit<CelebrationData, 'visible'>) => void;
  hide: () => void;
}

const CelebrationContext = createContext<CelebrationContextShape | undefined>(undefined);

export const CelebrationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [celebration, setCelebration] = useState<CelebrationData>({
    visible: false,
    taskTitle: '',
    points: 0,
    childName: '',
  });

  const show = (data: Omit<CelebrationData, 'visible'>) =>
    setCelebration({ ...data, visible: true });

  const hide = () =>
    setCelebration((prev) => ({ ...prev, visible: false }));

  return (
    <CelebrationContext.Provider value={{ celebration, show, hide }}>
      {children}
    </CelebrationContext.Provider>
  );
};

export const useCelebration = () => {
  const ctx = useContext(CelebrationContext);
  if (!ctx) throw new Error('useCelebration must be used within CelebrationProvider');
  return ctx;
}; 