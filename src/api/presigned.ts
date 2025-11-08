// api/presigned.ts
import { apiClient } from './client';
import type { PresignedResponse } from '../types/api';

/**
 * [1단계] S3 Presigned URL 및 Request ID 발급 요청 (POST /start)
 * - Header/Request Body 없음 (명세서 기준)
 * - 응답으로 upload_url과 request_id를 받습니다.
 */
export const fetchPresignedUrl = async (): Promise<PresignedResponse> => {
  // 명세서에 따라 Request Body는 빈 객체로 보냅니다.
  const response = await apiClient.post<PresignedResponse>('/start', {});
  return response.data;
};