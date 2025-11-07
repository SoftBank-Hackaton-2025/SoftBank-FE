// src/pages/TerraformLoading/TerraformLoading.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './TerraformLoading.module.css';
import { useExpedition } from '../../stores/expedition.context'; 
import { type CloudOption } from '../../stores/expedition.types'; 

// (임시) 람다에서 받아올 데이터 예시
const mockCloudOptions: CloudOption[] = [
  { provider: 'AWS', logo: 'aws.png', estimatedCost: '$120.50 / month', terraformCode: 'provider "aws" {\n  region = "us-east-1"\n}\n...'},
  { provider: 'Azure', logo: 'azure.png', estimatedCost: '$115.70 / month', terraformCode: 'provider "azurerm" {\n  features {}\n}\n...'},
  { provider: 'GCP', logo: 'gcp.png', estimatedCost: '$109.90 / month', terraformCode: 'provider "google" {\n  project = "my-gcp-project"\n}\n...'},
];

const TerraformLoading: React.FC = () => {
  const navigate = useNavigate();
  const { sizingOptions, setGenerationResults } = useExpedition();
  const [statusText, setStatusText] = useState('Generating recommendations...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const startGeneration = async () => {
      try {
        setStatusText(`Calling AI Sizing Lambda with ${sizingOptions.scale || 'default'} scale...`);
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        const results = mockCloudOptions; 

        setGenerationResults(results);
        setStatusText('Generation complete. Moving to comparison...');
        navigate('/generation');

      } catch (err) {
        console.error(err);
        setError('Failed to generate recommendations. Please try again.');
        setStatusText('Error!');
      }
    };
    startGeneration();
  }, [navigate, sizingOptions, setGenerationResults]);

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