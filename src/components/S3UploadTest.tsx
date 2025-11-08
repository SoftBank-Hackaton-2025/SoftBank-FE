// src/components/S3UploadTest.tsx (새 파일)
import React, { useState } from 'react';
import { fetchPresignedUrl } from '../api/presigned'; // POST /start
import { uploadFileToS3 } from '../api/s3';             // PUT to S3
import { postCodeAnalysis } from '../api/analysis';     // POST /code-analyze
import { saveRequestId } from '../utils/requestIdStorage';

const S3UploadTest: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [message, setMessage] = useState<string>('파일을 선택하고 업로드를 시작하세요.');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setMessage(`파일 선택됨: ${event.target.files[0].name}`);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setMessage('1. 업로드 URL 및 Request ID 요청 중...');
    setUploadProgress(0);

    try {
      // ------------------------------------
      // 단계 1: Presigned URL 및 Request ID 발급 (POST /start)
      // ------------------------------------
      const presignedResponse = await fetchPresignedUrl();
      const uploadUrl = presignedResponse.upload_url;
      const requestId = presignedResponse.request_id;
      
      saveRequestId(requestId); // 백엔드에서 받은 ID 저장

      // ------------------------------------
      // 단계 2: S3로 파일 업로드 (PUT 요청)
      // ------------------------------------
      setMessage(`2. S3로 파일 업로드 중... (Request ID: ${requestId})`);
      
      await uploadFileToS3(uploadUrl, selectedFile, (percent) => {
        setUploadProgress(percent);
      });
      
      // ------------------------------------
      // 단계 3: 분석 요청 (POST /code-analyze)
      // ------------------------------------
      setMessage('3. 업로드 성공! 분석 요청 중...');
      
      // 확장자 추출 (예: 'project.zip' -> 'zip')
      const fileExt = selectedFile.name.split('.').pop() || 'zip';
      
      const analysisResponse = await postCodeAnalysis(fileExt);
      
      setMessage(`✅ 최종 성공: S3 업로드 및 분석 요청 완료! (상태: ${analysisResponse.status})`);

    } catch (error) {
      console.error('전체 업로드 및 분석 실패:', error);
      setMessage('❌ 테스트 실패! 콘솔 로그를 확인하세요.');
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h3>S3 연결 및 API Flow 테스트</h3>
      <input type="file" onChange={handleFileChange} accept=".zip" />
      <button 
        onClick={handleUpload} 
        disabled={!selectedFile || uploadProgress > 0 && uploadProgress < 100}
        style={{ marginLeft: '10px' }}
      >
        업로드 및 분석 요청
      </button>
      <p style={{ marginTop: '15px', fontWeight: 'bold' }}>상태: {message}</p>
      {uploadProgress > 0 && (
        <progress value={uploadProgress} max="100" style={{ width: '100%' }} />
      )}
      {uploadProgress > 0 && <p>업로드 진행률: {uploadProgress}%</p>}
    </div>
  );
};

export default S3UploadTest;