// src/stores/expedition.types.ts

// 3사 비교 데이터 타입
export interface CloudOption {
  provider: string;
  logo: string;
  estimatedCost: string;
  terraformCode: string;
}

// 1. 전역 저장소 데이터 타입
export interface ExpeditionState {
  sizingOptions: {
    scale?: string;
    users?: string;
  };
  setSizingOptions: (options: ExpeditionState['sizingOptions']) => void;
  
  selectedCloud?: string;
  setSelectedCloud: (cloud: string) => void;

  generationResults: CloudOption[];
  setGenerationResults: (results: CloudOption[]) => void;
}