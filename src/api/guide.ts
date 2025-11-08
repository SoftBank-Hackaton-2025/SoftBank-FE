// api/guide.ts
import { apiClient } from './client';
import { getRequestId } from '../utils/requestIdStorage';
import type { GuideRequest, GuideResponse } from '../types/api';

/**
 * [4단계] 선택된 클라우드에 대한 가이드 파일 요청 (POST /git-start)
 * @param selectedRecommendationId - 추천 결과 중 사용자가 선택한 ID
 */
export const postGuideRequest = async (
  selectedRecommendationId: string
): Promise<GuideResponse> => {
  const requestId = getRequestId();

  if (!requestId) {
    throw new Error('가이드 요청을 위해 유효한 Request ID가 필요합니다.');
  }

  const payload: GuideRequest = {
    request_id: requestId,
    selected_recommendation_id: selectedRecommendationId,
  };

  const response = await apiClient.post<GuideResponse>('/git-start', payload);
  return response.data;
};