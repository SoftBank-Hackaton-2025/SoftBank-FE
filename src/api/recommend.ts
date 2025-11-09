// src/api/recommend.ts
import { apiClient } from './client';
import { getRequestId } from '../utils/requestIdStorage';
import type { TfStartRequest, TfStartResponse } from '../types/api';

export const postRecommendation = async (
  survey: TfStartRequest['survey']
): Promise<TfStartResponse> => {
  const request_id = getRequestId();
  if (!request_id) throw new Error('유효한 Request ID가 필요합니다.');

  const payload: TfStartRequest = { request_id, survey };
  const { data } = await apiClient.post<TfStartResponse>('/tf-start', payload, {
    headers: { 'Content-Type': 'application/json' },
  });
  return data;
};