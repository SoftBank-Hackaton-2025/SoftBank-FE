// src/pages/TerraformLoading/TerraformLoading.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './TerraformLoading.module.css';
import { useExpedition } from '../../stores/expedition.context'; 
import { type CloudOption } from '../../stores/expedition.types'; 

// ... (mockCloudOptions는 동일)
const mockCloudOptions: CloudOption[] = [
  { provider: 'AWS', logo: 'aws.png', estimatedCost: '$120.50 / month', terraformCode: 'provider "aws" {\n  region = "us-east-1"\n}\n...'},
  { provider: 'Azure', logo: 'azure.png', estimatedCost: '$115.70 / month', terraformCode: 'provider "azurerm" {\n  features {}\n}\n...'},
  { provider: 'GCP', logo: 'gcp.png', estimatedCost: '$109.90 / month', terraformCode: 'provider "google" {\n  project = "my-gcp-project"\n}\n...'},
];

const TerraformLoading: React.FC = () => {
  const navigate = useNavigate();
  // 👇 1. setCompletedSteps 추가
  const { sizingOptions, setGenerationResults, setCompletedSteps } = useExpedition();
  const [statusText, setStatusText] = useState('Generating recommendations...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const startGeneration = async () => {
      try {
        setStatusText(`Calling AI Sizing Lambda with ${sizingOptions.scale || 'default'} scale...`);
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        const results = mockCloudOptions; 

        setGenerationResults(results);

        // 👇 2. 3단계로 넘어가기 직전, "2단계(/terraform/sizing)가 완료됨"을 저장
        setCompletedSteps('/terraform/sizing');

        setStatusText('Generation complete. Moving to comparison...');
        navigate('/generation');

      } catch (err) {
        // ... (에러 처리는 동일)
        console.error(err);
        setError('Failed to generate recommendations. Please try again.');
        setStatusText('Error!');
      }
    };
    startGeneration();
  }, [navigate, sizingOptions, setGenerationResults, setCompletedSteps]); // 👈 3. 의존성 배열에 추가

  // ... (이하 JSX 코드는 동일)
  return (
    <div className={styles.analysisContainer}>
      <h1 className={styles.title}>Generating Terraform Code...</h1>
      <p className={styles.subtitle}>
        Please wait while AI configures your infrastructure and costs.
      </p>
      {!error && <div className={styles.spinner}></div>}
      <p className={styles.statusText} style={{ color: error ? 'red' : '' }}>
        {error ? error : statusText}
      </p>
    </div>
  );
};

export default TerraformLoading;