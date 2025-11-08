// src/pages/TerraformValley/TerraformValley.tsx

import React from 'react';
import { Link } from 'react-router-dom'; // 👈 1. Link import
import styles from './TerraformValley.module.css';

const TerraformValley: React.FC = () => {
  return (
    <div className={styles.valleyContainer}>
      <h1 className={styles.title}>Welcome to Terraform Valley</h1>
      <p className={styles.subtitle}>
        Select your next step to configure and generate your infrastructure.
      </p>

      <div className={styles.optionsGrid}>
        {/* 👇 2. <div>를 <Link>로 감싸고, to 경로 설정 */}
        <Link to="/terraform/sizing" className={styles.optionLink}>
          <div className={styles.optionCard}>
            <h2>AI Sizing</h2>
            <p>Optimize your resources with AI recommendations.</p>
          </div>
        </Link>
        
        {/* 👇 (나머지 카드들도 나중에 Link로 감쌀 수 있습니다) */}
        <div className={styles.optionCard}>
          <h2>Generation</h2>
          <p>Generate your Terraform configuration files.</p>
        </div>
        <div className={styles.optionCard}>
          <h2>Results</h2>
          <p>View the final output and deployment summary.</p>
        </div>
      </div>
    </div>
  );
};

export default TerraformValley;