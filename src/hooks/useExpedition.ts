// src/hooks/useExpedition.ts (수정)

import { useContext } from 'react';
// 👇 [수정] 'ExpeditionContext'가 아닌 'expedition.context' 파일에서 import
import { ExpeditionContext } from '../stores/expedition.context';

export function useExpedition() {
  const context = useContext(ExpeditionContext);
  if (context === undefined) {
    throw new Error('useExpedition must be used within an ExpeditionProvider');
  }
  return context;
}