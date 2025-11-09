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