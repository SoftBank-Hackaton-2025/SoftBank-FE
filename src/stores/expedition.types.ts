import type { Dispatch, SetStateAction } from "react";

export type SizingOptions = {
  purpose: string[];
  region: string[];
  availability: string[];
  security: string[];
};

export interface CloudOption {
  provider: string;
  logo: string;
  estimatedCost: string;
  terraformCode: string;
}

export interface ExpeditionState {
  sizingOptions: SizingOptions;
  // React 표준 시그니처 쓰면 가장 안전/간단
  setSizingOptions: Dispatch<SetStateAction<SizingOptions>>;

  selectedCloud?: string;
  setSelectedCloud: (cloud: string) => void;

  generationResults: CloudOption[];
  setGenerationResults: (results: CloudOption[]) => void;

  completedSteps: Set<string>;
  setCompletedSteps: (path: string) => void;

  resetSizingOptions: () => void;
}


// // src/stores/expedition.types.ts

// // 3사 비교 데이터 타입
// export interface CloudOption {
//   // ... (기존 코드 동일)
//   provider: string;
//   logo: string;
//   estimatedCost: string;
//   terraformCode: string;
// }

// // 1. 전역 저장소 데이터 타입
// export interface ExpeditionState {
//   // ... (기존 코드 동일)
//   sizingOptions: {
//     scale?: string;
//     users?: string;
//   };
//   setSizingOptions: (options: ExpeditionState['sizingOptions']) => void;
  
//   selectedCloud?: string;
//   setSelectedCloud: (cloud: string) => void;

//   generationResults: CloudOption[];
//   setGenerationResults: (results: CloudOption[]) => void;

//   // 👇 [신규] 완료된 단계를 저장할 Set
//   completedSteps: Set<string>; // (path를 저장, 예: '/upload', '/terraform/sizing')
//   setCompletedSteps: (path: string) => void;
// }