// src/pages/ProjectUpload/ProjectUpload.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom'; // 👈 1. useNavigate import
import styles from './ProjectUpload.module.css';

const ProjectUpload: React.FC = () => {
  const navigate = useNavigate(); // 👈 2. useNavigate 훅 사용 준비

  // 3. 버튼 클릭 시 호출될 함수
  const handleExpeditionStart = () => {
    // (나중에 여기에 실제 파일 업로드 로직 추가)
    
    // 4. 코드 분석 페이지(/analysis)로 즉시 이동
    navigate('/analysis');
  };

  return (
    <div className={styles.uploadContainer}>
      <h1 className={styles.title}>Begin Your Journey</h1>
      <p className={styles.subtitle}>Upload your code to start your adventure!</p>

      <div className={styles.dropZone}>
        <div className={styles.cloudIcon}>☁️</div>
        <p>
          <strong>Drag & drop your file here</strong>
        </p>
        <p>or click to browse</p>
      </div>

      {/* 👇 5. onClick 이벤트 핸들러 연결 */}
      <button className={styles.submitButton} onClick={handleExpeditionStart}>
        Begin Expedition
      </button>
    </div>
  );
};

export default ProjectUpload;