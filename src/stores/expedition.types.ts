import type { Dispatch, SetStateAction } from "react";

// SizingOptions 타입이 AISizing.tsx 파일에서 사용하는 4가지 키를 모두 포함해야 합니다.
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
    // setSizingOptions는 React의 표준 Dispatch 타입을 사용해야 합니다.
    setSizingOptions: Dispatch<SetStateAction<SizingOptions>>; 

    selectedCloud?: string;
    setSelectedCloud: (cloud: string) => void;

    generationResults: CloudOption[];
    setGenerationResults: (results: CloudOption[]) => void;

    completedSteps: Set<string>;
    setCompletedSteps: (path: string) => void; 
    
    resetSizingOptions: () => void;
}