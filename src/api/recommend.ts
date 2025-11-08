// api/recommend.ts
import { apiClient } from './client';
import { getRequestId } from '../utils/requestIdStorage';
import type { RecommendRequest, RecommendResponse } from '../types/api';

/**
 * [3단계] 설문조사 후 추천 요청 (POST /tf-start)
 * @param surveyData - 설문조사 결과 데이터
 */
export const postRecommendation = async (
  surveyData: RecommendRequest['survey_data']
): Promise<RecommendResponse> => {
  const requestId = getRequestId();

  if (!requestId) {
    throw new Error('추천 요청을 위해 유효한 Request ID가 필요합니다.');
  }

  const payload: RecommendRequest = {
    request_id: requestId,
    survey_data: surveyData,
  };

  const response = await apiClient.post<RecommendResponse>('/tf-start', payload);
  return response.data;
};