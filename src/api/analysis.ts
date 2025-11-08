// // api/analysis.ts
// import { apiClient } from './client';
// import { getRequestId } from '../utils/requestIdStorage';
// import type { AnalysisRequest, AnalysisResponse } from '../types/api';

// /**
//  * [2단계] 업로드한 파일 분석 요청 (POST /code-analyze)
//  * @param fileName - S3에 업로드된 파일의 이름 (ex: source.zip)
//  */
// export const postCodeAnalysis = async (s3Key: string): Promise<AnalysisResponse> => {
//   const requestId = getRequestId();

//   if (!requestId) {
//     throw new Error('분석 요청을 위해 유효한 Request ID가 필요합니다. /start를 먼저 호출해주세요.');
//   }

//   const payload: AnalysisRequest = {
//     request_id: requestId,
//     file_name: "source.zip",
//   };

//   const response = await apiClient.post<AnalysisResponse>('/code-analyze', payload);
//   return response.data;
// };

import { apiClient } from './client';
import { getRequestId } from '../utils/requestIdStorage';

export type AnalysisCompatPayload = {
  request_id: string;
  s3_key: string;
  file_name?: string;   // 레거시 호환
  upload_url?: string;  // presigned 원문 제공(백엔드 재검증용)
};

export type AnalysisResponse = {
  message: string;
  status: 'ANALYSIS_STARTED' | 'PENDING';
};

/**
 * POST /code-analyze
 * @param s3Key     예: "uploads/<request_id>/source.zip" 또는 실제 파일명 키
 * @param uploadUrl /start에서 받은 presigned URL 원문 (검증용)
 */
export const postCodeAnalysis = async (
  s3Key: string,
  uploadUrl?: string
): Promise<AnalysisResponse> => {
  const requestId = getRequestId();
  if (!requestId) throw new Error('유효한 Request ID가 필요합니다. 먼저 /start를 호출하세요.');

  const fileName = s3Key.split('/').pop() ?? 'source.zip';

  const payload: AnalysisCompatPayload = {
    request_id: requestId,
    s3_key: s3Key,
    file_name: fileName,   // 레거시 서버가 file_name을 요구하는 경우 대비
    upload_url: uploadUrl, // 백엔드가 presigned와의 일치 검증을 하고 있다면 도움이 됨
  };

  // 디버깅 도움
  // eslint-disable-next-line no-console
  console.log('[code-analyze payload]', payload);

  const { data } = await apiClient.post<AnalysisResponse>('/code-analyze', payload, {
    headers: { 'Content-Type': 'application/json' },
    timeout: 15000,
  });
  return data;
};
