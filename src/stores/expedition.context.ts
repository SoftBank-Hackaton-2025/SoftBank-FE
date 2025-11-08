// src/stores/expedition.context.ts

import { createContext, useContext } from 'react';
import { type ExpeditionState } from './expedition.types'; // 👈 1. 방금 만든 types.ts에서 import

// 2. Context 생성
export const ExpeditionContext = createContext<ExpeditionState | undefined>(undefined);

// 3. 커스텀 훅 (이제 stores 폴더에 Context와 함께 둡니다)
export function useExpedition() {
  const context = useContext(ExpeditionContext);
  if (context === undefined) {
    throw new Error('useExpedition must be used within an ExpeditionProvider');
  }
  return context;
}