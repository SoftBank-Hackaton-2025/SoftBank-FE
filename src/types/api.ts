// src/types/api.ts

// ---------------------------
// 1. POST /start 응답 타입
// ---------------------------
export interface PresignedResponse {
  upload_url: string; 
  request_id: string; // 백엔드가 발급한 Flow ID
}

// ---------------------------
// 2. POST /code-analyze 요청/응답 타입 (상세 명세 가정)
// ---------------------------
// 요청: request_id와 S3에 업로드된 파일의 정보 (예: S3 Path 또는 Key)가 필요할 것입니다.
// export interface AnalysisRequest {
//   request_id: string;
//   s3_key: string; // S3에 업로드된 파일 경로
// }
export interface AnalysisRequest {
  request_id: string;
  s3_key: string;        // S3에 업로드된 파일 경로(키)
  file_name?: string;    // (선택) 원본 파일명 - 백엔드 로깅 용도면 사용
}

// 응답: 분석이 시작되었다는 단순 응답
export interface AnalysisResponse {
  message: string;
  status: 'ANALYSIS_STARTED' | 'PENDING';
}

// ---------------------------
// 3. POST /tf-start 요청/응답 타입 (상세 명세 가정)
// ---------------------------
// 요청: request_id와 설문조사 결과 데이터
// export interface RecommendRequest {
//   request_id: string;
//   survey_data: {
//     cloud_provider: string;
//     budget: string;
//     // ... 기타 설문조사 필드
//   };
// }

// // 응답: 추천 결과
// export interface RecommendResponse {
//   recommendation_id: string;
//   terraform_code_snippet: string;
// }


// --- /tf-start ---
// export interface TfStartRequest {
//   request_id: string;
//   survey: {
//     purpose: string;
//     "region-location": string;
//     availability: string;
//     security: string;
//   };
// }

// export type TerraformBlock = { files: Record<string, string> } | string;

// export interface CloudCost {
//   totalUSD?: number;
//   breakdown?: Record<string, number>;
//   currency?: "USD";
// }

// export interface TfStartResponse {
//   data: {
//     terraform: {
//       "terraform-aws"?: TerraformBlock;
//       "terraform-azure"?: TerraformBlock;
//       "terraform-gcp"?: TerraformBlock;
//     };
//     cost: {
//       "cost-aws"?: CloudCost | number | string;
//       "cost-azure"?: CloudCost | number | string;
//       "cost-gcp"?: CloudCost | number | string;
//     };
//   };
//   status?: "STARTED" | "PENDING" | "FAILED";
//   message?: string;
// }

// --- /tf-start ---
export interface TfStartRequest {
  request_id: string;
  survey: {
    purpose: string;
    "region-location": string;
    availability: string;
    security: string;
  };
}

// 공통 Terraform 블록
export interface TerraformFile {
  path: string;
  contentSnippet: string;
}
export interface TerraformArtifacts {
  s3Key?: string;      // AWS
  blobUrl?: string;    // Azure
  gcsUri?: string;     // GCP
  checksumSha256?: string;
}
export interface TerraformBlockCommon {
  provider: string;    // "aws" | "azurerm" | "google"
  region: string;
  version: string;
  summary: string;
  variables: Record<string, string>;
  outputs: Record<string, string>;
  files: TerraformFile[];
  artifacts: TerraformArtifacts;
}

// terraform 배열 원소 (세 개 중 하나)
export type TerraformEntry =
  | { "terraform-aws": TerraformBlockCommon }
  | { "terraform-azure": TerraformBlockCommon }
  | { "terraform-gcp": TerraformBlockCommon };

// cost는 { aws, azure, gcp } 숫자
export interface TfStartResponse {
  costs: {
    aws?: string;   // "150.00"
    gcp?: string;   // "200.21"
    azure?: string; // "180.14"
  };
  terraform_urls: {
    aws?: string;   // presigned .tf URL
    gcp?: string;
    azure?: string;
  };
}


// ---------------------------
// 4. POST /git-start 요청/응답 타입 (상세 명세 가정)
// ---------------------------
export interface GuideRequest {
  request_id: string;
  selected_recommendation_id: string;
}

export interface GuideResponse {
  git_action_yaml: string;
  cloud_cli_script: string;
}