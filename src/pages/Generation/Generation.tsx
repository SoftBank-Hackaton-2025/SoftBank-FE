// src/pages/Generation/Generation.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Generation.module.css';
import { useExpedition } from '../../stores/expedition.context'; 

const Generation: React.FC = () => {
  const navigate = useNavigate();
  const { generationResults, setSelectedCloud } = useExpedition();

  const handleCloudSelect = (provider: string) => {
    setSelectedCloud(provider); 
    navigate('/results');
  };

  if (generationResults.length === 0) {
    return (
      <div className={styles.genContainer}>
        <h1 className={styles.title}>No Data</h1>
        <p className={styles.subtitle}>
          데이터를 생성하기 위해 
          <a href="/terraform"> Terraform Valley </a> 
          페이지로 돌아가 AI Sizing을 먼저 실행해 주세요.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.genContainer}>
      <h1 className={styles.title}>Cloud Recommendations</h1>
      <p className={styles.subtitle}>
        Here are the generated Terraform configurations and estimated costs.
      </p>
      <div className={styles.grid}>
        {generationResults.map((option) => (
          <div key={option.provider} className={styles.card}>
            <h2 className={styles.providerName}>{option.provider}</h2>
            <div className={styles.costSection}>
              <span className={styles.costLabel}>Estimated Cost</span>
              {/* 👇 [수정] 'costValue' -> 'estimatedCost'로 변경 */}
              <span className={styles.costValue}>{option.estimatedCost}</span>
            </div>
            <div className={styles.codeSnippet}>
              <pre><code>{option.terraformCode}</code></pre>
            </div>
            <button 
              className={styles.selectButton} 
              onClick={() => handleCloudSelect(option.provider)}
            >
              Select {option.provider}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Generation;