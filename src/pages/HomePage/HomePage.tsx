// src/pages/HomePage/HomePage.tsx

import React from 'react';
import { Link } from 'react-router-dom'; // 👈 버튼을 링크로 만들기 위해 import
import styles from './HomePage.module.css';

const HomePage: React.FC = () => {
  return (
    <div className={styles.homeContainer}>
      <h1 className={styles.title}>
        HikariFlow / <span className={styles.japaneseTitle}>光フロー</span>
      </h1>
      <p className={styles.subtitle}>
        "빛(光)처럼 빠르고 매끄러운 배포 플로우"
      </p>
      
      <div className={styles.description}>
        <p>
          HikariFlow는 여러분의 프로젝트 코드를 분석하여, 
          AI 기반으로 최적화된 클라우드(AWS, Azure, GCP) 인프라를 추천하고,
          배포에 필요한 Terraform 코드와 GitHub Actions 워크플로우를 
          즉시 생성해 주는 자동화 솔루션입니다.
        </p>
        <p>
          지금 바로 여러분의 여정을 시작해 보세요!
        </p>
      </div>
      
      {/* 'Project Upload' 페이지(/upload)로 이동하는 시작 버튼 */}
      <Link to="/upload" className={styles.startButton}>
        Start Expedition
      </Link>
    </div>
  );
};

export default HomePage;