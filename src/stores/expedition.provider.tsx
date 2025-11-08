// src/stores/expedition.provider.tsx
import React, { useMemo, useState, useCallback } from "react";
import { ExpeditionContext } from "./expedition.context";
import type {
  ExpeditionState,
  SizingOptions,
  CloudOption,
} from "./expedition.types";

const initialSizingOptions: SizingOptions = {
  purpose: [],
  region: [],
  availability: [],
  security: [],
};

export const ExpeditionProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [sizingOptions, _setSizingOptions] =
    useState<SizingOptions>(initialSizingOptions);
  const [selectedCloud, setSelectedCloud] = useState<string | undefined>(
    undefined
  );
  const [generationResults, setGenerationResults] = useState<CloudOption[]>([]);
  const [completedSteps, _setCompletedSteps] = useState<Set<string>>(new Set());

  // 그대로 노출
  const setSizingOptions = _setSizingOptions;

  // ✅ 참조 안정화 + 중복 추가 방지
  const setCompletedSteps = useCallback((path: string) => {
    _setCompletedSteps((prev) => {
      if (prev.has(path)) return prev; // 이미 있으면 그대로 반환 → 렌더/루프 방지
      const next = new Set(prev);
      next.add(path);
      return next;
    });
  }, []);

  // ✅ 참조 안정화
  const resetSizingOptions = useCallback(() => {
    _setSizingOptions(initialSizingOptions);
  }, []);

  const value = useMemo<ExpeditionState>(
    () => ({
      sizingOptions,
      setSizingOptions,
      selectedCloud,
      setSelectedCloud,
      generationResults,
      setGenerationResults,
      completedSteps,
      setCompletedSteps,
      resetSizingOptions,
    }),
    [
      sizingOptions,
      selectedCloud,
      generationResults,
      completedSteps,
      setSizingOptions,
      setCompletedSteps,
      resetSizingOptions,
    ]
  );

  return (
    <ExpeditionContext.Provider value={value}>
      {children}
    </ExpeditionContext.Provider>
  );
};
