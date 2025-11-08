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

  if (!generationResults || generationResults.length === 0) {
    return (
      <div className={styles.genContainer}>
        <h1 className={styles.title}>No Cloud Recommendations</h1>
        <p className={styles.subtitle}>
          데이터를 생성하려면 <a href="/terraform">TerraformLoading</a> 페이지에서
          AI Sizing을 먼저 실행해 주세요.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.genContainer}>
      <h1 className={styles.title}>Cloud Recommendations</h1>
      <p className={styles.subtitle}>
        생성된 Terraform 구성과 예상 비용을 확인하세요.
      </p>
      <div className={styles.grid}>
        {generationResults.map((option, idx) => (
          <div key={`${option.provider}-${idx}`} className={styles.card}>
            <h2 className={styles.providerName}>{option.provider ?? "Unknown"}</h2>
            <div className={styles.costSection}>
              <span className={styles.costLabel}>Estimated Cost</span>
              <span className={styles.costValue}>{option.estimatedCost ?? "N/A"}</span>
            </div>
            <div className={styles.codeSnippet}>
              <pre><code>{option.terraformCode ?? "No Terraform code available"}</code></pre>
            </div>
            <button 
              className={styles.selectButton} 
              onClick={() => handleCloudSelect(option.provider ?? "")}
            >
              Select {option.provider ?? "Unknown"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Generation;
