// api/client.ts
import axios from 'axios';
// (uuid 라이브러리 import 삭제)

// API 게이트웨이 기본 URL (리전 코드만 실제 값으로 변경)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ❗️❗️ /start API는 헤더 없이 호출되어야 하므로 인터셉터에 request_id 주입 로직을 넣지 않습니다.
// 대신, 각 API 함수에서 request_id를 직접 가져와서 Body에 넣어주어야 합니다.
apiClient.interceptors.request.use(
  (config) => {
    // 여기에 모든 요청에 필요한 공통 헤더를 추가할 수 있지만, 
    // request_id는 Body에 들어가므로 헤더 로직은 비워둡니다.
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);