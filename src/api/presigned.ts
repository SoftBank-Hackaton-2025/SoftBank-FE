// src/api/presigned.ts

// import { apiClient } from './client';
// import { PresignedResponse } from '../types/api';

// /**
//  * [1단계] S3 Presigned URL 및 Request ID 발급 요청 (POST /start)
//  */
// export const fetchPresignedUrl = async (): Promise<PresignedResponse> => {
//   // 명세서에 따라 Request Body는 빈 객체로 보냅니다.
//   const response = await apiClient.post<PresignedResponse>('/start', {}); 
  
//   // 🔴 Axios 응답 객체에서 'data' 속성만 반환하도록 수정 (PresignedResponse 타입과 일치)
//   return response.data;
// };


// src/api/presigned.ts
import { apiClient } from './client';
import type { PresignedResponse } from '../types/api';

/** 런타임 가드: /start 응답 스키마 확인 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isPresignedResponse = (v: any): v is PresignedResponse =>
  v && typeof v.upload_url === 'string' && typeof v.request_id === 'string';

/**
 * [1단계] Presigned URL + Request ID 발급 (POST /start)
 */
export const fetchPresignedUrl = async (): Promise<PresignedResponse> => {
  const { data } = await apiClient.post<PresignedResponse>(
    '/start',
    {},
    {
      headers: { 'Content-Type': 'application/json' },
      timeout: 15000,
    }
  );

  if (!isPresignedResponse(data)) {
    throw new Error(`Invalid /start response: ${JSON.stringify(data)}`);
  }
  return data;
};

/**
 * Presigned URL에서 S3 객체 키 추출 (쿼리스트링 제거)
 * - Encoded 버전: 공백이 %20 등으로 남음 → 대부분의 백엔드가 이 형태를 기대
 * - Decoded 버전: 사람이 읽기 쉬운 원본 문자열(공백 그대로)
 */
export const getS3KeyEncoded = (uploadUrl: string): string => {
  const u = new URL(uploadUrl);
  return u.pathname.replace(/^\/+/, ''); // "/uploads/a/b.zip" -> "uploads/a/b.zip"
};

export const getS3KeyDecoded = (uploadUrl: string): string => {
  const u = new URL(uploadUrl);
  return decodeURIComponent(u.pathname.replace(/^\/+/, ''));
};

/** 기본 권장: Encoded 우선 사용 */
export const getS3KeyFromPresigned = getS3KeyEncoded;
