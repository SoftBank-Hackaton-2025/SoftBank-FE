// src/api/presigned.ts

import { apiClient } from './client';
import { PresignedResponse } from '../types/api';

/**
 * [1단계] S3 Presigned URL 및 Request ID 발급 요청 (POST /start)
 */
export const fetchPresignedUrl = async (): Promise<PresignedResponse> => {
  // 명세서에 따라 Request Body는 빈 객체로 보냅니다.
  const response = await apiClient.post<PresignedResponse>('/start', {}); 
  
  // 🔴 Axios 응답 객체에서 'data' 속성만 반환하도록 수정 (PresignedResponse 타입과 일치)
  return response.data;
};