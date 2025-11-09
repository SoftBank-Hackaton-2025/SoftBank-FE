// src/pages/CodeAnalysis/CodeAnalysis.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CodeAnalysis.module.css";
import { useExpedition } from "../../stores/expedition.context"; // 👈 1. 훅 import

const CodeAnalysis: React.FC = () => {
  const navigate = useNavigate();
  const [statusText, setStatusText] = useState(
    "Analyzing project structure..."
  );

  // 👇 2. 전역 스토어에서 완료 함수 가져오기
  const { setCompletedSteps } = useExpedition();

  useEffect(() => {
    const startAnalysis = async () => {
      setStatusText("Detecting frameworks and dependencies...");
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setStatusText("Checking for infrastructure files (e.g., Dockerfile)...");
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // 👇 3. 다음 페이지로 넘어가기 직전, "1단계(/upload)가 완료됨"을 저장
      setCompletedSteps("/upload");

      setStatusText("Analysis complete. Moving to Sizing...");
      await new Promise((resolve) => setTimeout(resolve, 500));

      navigate("/terraform/sizing"); // 2단계로 이동
    };

    startAnalysis();
  }, [navigate, setCompletedSteps]); // 👈 4. 의존성 배열에 추가

  // ... (이하 JSX 코드는 동일)
  return (
    <div className={styles.analysisContainer}>
      <h1 className={styles.title}>Analyzing Code...</h1>
      <p className={styles.subtitle}>
        Please wait while AI analyzes your project.
      </p>
      <div className={styles.spinner}></div>
      <p className={styles.statusText}>{statusText}</p>
    </div>
  );
};

export default CodeAnalysis;
