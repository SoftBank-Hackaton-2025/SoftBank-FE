// src/pages/CodeAnalysis/CodeAnalysis.tsx

import React, { useEffect, useState } from 'react'; // 👈 1. useEffect, useState import
import { useNavigate } from 'react-router-dom'; // 👈 2. useNavigate import
import styles from './CodeAnalysis.module.css';

const CodeAnalysis: React.FC = () => {
  const navigate = useNavigate();
  // 3. 로딩 상태 및 에러 메시지 관리를 위한 state
  const [statusText, setStatusText] = useState('Checking dependencies...');
  const [error, setError] = useState<string | null>(null);

  // 4. 컴포넌트가 처음 렌더링될 때(마운트될 때) 1번만 실행
  useEffect(() => {
    
    // 5. Lambda를 호출하는 비동기 함수 정의
    const startAnalysis = async () => {
      try {
        setStatusText('Analyzing project structure...');
        
        // --- (여기에 실제 Lambda 호출 로직 구현) ---
        // 예: const response = await fetch('YOUR_LAMBDA_ENDPOINT_URL', {
        //   method: 'POST',
        //   body: JSON.stringify({ /* ...zip 파일 정보 등... */ })
        // });
        //
        // if (!response.ok) {
        //   throw new Error('Analysis failed');
        // }
        //
        // const result = await response.json();
        // ---------------------------------------------

        // (임시) 지금은 Lambda 호출 성공을 가정하고 2초 뒤에 넘어갑니다.
        // (실제로는) 위 `await` 호출이 성공적으로 끝나면 바로 아래 코드가 실행됩니다.
        await new Promise(resolve => setTimeout(resolve, 2000)); // 👈 이 줄은 나중에 Lambda 호출 코드로 대체하세요.

        // 6. Lambda 실행이 성공적으로 완료되면
        setStatusText('Analysis complete. Moving to next step...');
        
        // 7. 다음 페이지([2단계] 체크박스)로 이동
        navigate('/terraform/sizing');

      } catch (err) {
        // 8. Lambda 실행 중 에러가 발생하면
        console.error(err);
        setError('Failed to analyze the project. Please try again.');
        setStatusText('Error!');
      }
    };

    startAnalysis(); // 👈 9. 정의한 함수 실행
    
  }, [navigate]); // navigate 함수가 변경될 때만(사실상 1번만) 실행

  return (
    <div className={styles.analysisContainer}>
      <h1 className={styles.title}>Analyzing Your Code...</h1>
      <p className={styles.subtitle}>
        Please wait a moment while we review your project.
      </p>

      {/* 10. 에러가 아닐 때만 스피너 표시 */}
      {!error && <div className={styles.spinner}></div>}

      {/* 11. 상태 텍스트 또는 에러 메시지 표시 */}
      <p className={styles.statusText} style={{ color: error ? 'red' : '' }}>
        {error ? error : statusText}
      </p>
    </div>
  );
};

export default CodeAnalysis;