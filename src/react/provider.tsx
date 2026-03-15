import React, { createContext, useContext, ReactNode } from 'react';
import { HieroContext } from '../core/context.js';
import { MirrorClient } from '../mirror/client.js';
import { ScheduledTxHelper } from '../scheduled/helper.js';

interface HieroState {
  context: HieroContext;
  mirror: MirrorClient;
  scheduled: ScheduledTxHelper;
}

const HieroReactContext = createContext<HieroState | undefined>(undefined);

/**
 * HieroProvider shares the library instances across your React application.
 */
export const HieroProvider: React.FC<{ context: HieroContext; children: ReactNode }> = ({ context, children }: { context: HieroContext; children: ReactNode }) => {
  const mirror = new MirrorClient(context);
  const scheduled = new ScheduledTxHelper(context);

  return (
    <HieroReactContext.Provider value={{ context, mirror, scheduled }}>
      {children}
    </HieroReactContext.Provider>
  );
};

/**
 * Hook to access the Hiero library instances.
 */
export const useHiero = () => {
  const state = useContext(HieroReactContext);
  if (!state) {
    throw new Error('useHiero must be used within a HieroProvider');
  }
  return state;
};
