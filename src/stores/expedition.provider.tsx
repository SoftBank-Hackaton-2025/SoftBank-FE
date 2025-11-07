// src/stores/expedition.provider.tsx

import React, { useState } from 'react'; 
// 👇 2. types.ts와 context.ts에서 각각 import
import { ExpeditionContext } from './expedition.context';
import { type ExpeditionState, type CloudOption } from './expedition.types';

// 4. Provider 컴포넌트
export const ExpeditionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sizingOptions, setSizingOptions] = useState<ExpeditionState['sizingOptions']>({});
  const [selectedCloud, setSelectedCloud] = useState<string | undefined>();
  const [generationResults, setGenerationResults] = useState<CloudOption[]>([]);

  const value = {
    sizingOptions,
    setSizingOptions,
    selectedCloud,
    setSelectedCloud,
    generationResults,
    setGenerationResults,
  };

  return (
    <ExpeditionContext.Provider value={value}>
      {children}
    </ExpeditionContext.Provider>
  );
};