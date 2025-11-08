import React, { useMemo, useState } from "react";
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

  // ✅ 타입 가드 없이도 OK (표준 시그니처라 그대로 노출)
  const setSizingOptions = _setSizingOptions;

  const setCompletedSteps = (path: string) => {
    _setCompletedSteps((prev) => {
      const copy = new Set(prev);
      copy.add(path);
      return copy;
    });
  };

  const resetSizingOptions = () => _setSizingOptions(initialSizingOptions);

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
    [sizingOptions, selectedCloud, generationResults, completedSteps]
  );

  return (
    <ExpeditionContext.Provider value={value}>
      {children}
    </ExpeditionContext.Provider>
  );
};

// // src/stores/expedition.provider.tsx

// import React, { useState } from 'react';
// import { ExpeditionContext } from './expedition.context';
// import { type ExpeditionState, type CloudOption } from './expedition.types';

// export const ExpeditionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [sizingOptions, setSizingOptions] = useState<ExpeditionState['sizingOptions']>({});
//   const [selectedCloud, setSelectedCloud] = useState<string | undefined>();
//   const [generationResults, setGenerationResults] = useState<CloudOption[]>([]);

//   // 👇 [신규] 완료된 단계를 저장할 Set (초기값은 비어있음)
//   const [completedSteps, setCompleted] = useState<Set<string>>(new Set());

//   // 👇 [신규] Set에 완료된 경로를 추가하는 함수
//   const setCompletedSteps = (path: string) => {
//     setCompleted((prevSteps) => {
//       const newSteps = new Set(prevSteps);
//       newSteps.add(path); // 새로운 경로 추가
//       return newSteps;
//     });
//   };

//   const value = {
//     sizingOptions,
//     setSizingOptions,
//     selectedCloud,
//     setSelectedCloud,
//     generationResults,
//     setGenerationResults,
//     // 👇 [신규] Context를 통해 Set과 함수 제공
//     completedSteps,
//     setCompletedSteps,
//   };

//   return (
//     <ExpeditionContext.Provider value={value}>
//       {children}
//     </ExpeditionContext.Provider>
//   );
// };
