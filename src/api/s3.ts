// api/s3.ts
import axios from 'axios';

/**
 * [2단계] S3 Presigned URL로 파일 업로드 (PUT)
 * @param url - /start에서 응답받은 Presigned URL
 * @param file - 사용자가 선택한 실제 File 객체
 * @param onUploadProgress - (선택) 업로드 진행률 콜백 함수
 */
export const uploadFileToS3 = async (
  url: string,
  file: File,
  onUploadProgress?: (progress: number) => void
): Promise<void> => {
  await axios.put(url, file, {
    headers: {
      'Content-Type': file.type, // 파일의 MIME 타입 지정
    },
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onUploadProgress?.(percentCompleted);
      }
    },
  });
};