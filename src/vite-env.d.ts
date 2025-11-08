interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  // 필요한 환경변수는 여기에 추가 (반드시 VITE_ 프리픽스)
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}