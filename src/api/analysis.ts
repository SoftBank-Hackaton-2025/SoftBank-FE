// api/analysis.ts
import { apiClient } from './client';
import { getRequestId } from '../utils/requestIdStorage';
import type { AnalysisRequest, AnalysisResponse } from '../types/api';

/**
 * [2단계] 업로드한 파일 분석 요청 (POST /code-analyze)
 * @param s3Key - S3에 업로드된 파일의 경로/키
 */
export const postCodeAnalysis = async (s3Key: string): Promise<AnalysisResponse> => {
  const requestId = getRequestId();

  if (!requestId) {
    throw new Error('분석 요청을 위해 유효한 Request ID가 필요합니다. /start를 먼저 호출해주세요.');
  }

  const payload: AnalysisRequest = {
    request_id: requestId,
    s3_key: s3Key,
  };

  const response = await apiClient.post<AnalysisResponse>('/code-analyze', payload);
  return response.data;
};