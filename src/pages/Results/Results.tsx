// src/pages/Results/Results.tsx

import React from 'react';
// 👇 [변경] 'expedition.context.ts'에서 훅을 가져옵니다.
import { useExpedition } from '../../stores/expedition.context'; 
import styles from './Results.module.css';

const Results: React.FC = () => {
  const { selectedCloud } = useExpedition();
  const provider = selectedCloud || 'Cloud';

  // ... (이하 YAML 코드 및 JSX 코드는 동일합니다) ...
  const yamlCode = `
name: Deploy Terraform to ${provider}
on:
  push:
    branches:
      - main
jobs:
  terraform:
    name: 'Terraform'
    runs-on: ubuntu-latest
    steps:
      - name: 'Checkout'
        uses: actions/checkout@v2
      - name: 'Setup Terraform'
        uses: hashicorp/setup-terraform@v1
        with:
          cli_config_credentials_token: \${{ secrets.TF_API_TOKEN }}
      - name: 'Terraform Format'
        run: terraform fmt -check
      - name: 'Terraform Init'
        run: terraform init
      - name: 'Terraform Plan'
        run: terraform plan
      - name: 'Terraform Apply'
        if: github.ref == 'refs/heads/main'
        run: terraform apply -auto-approve
`;

  const handleDownloadBundle = () => {
    alert('다운로드 기능이 구현될 예정입니다.');
  };

  return (
    <div className={styles.resultsContainer}>
      <h1 className={styles.title}>Deployment & Results</h1>
      <p className={styles.subtitle}>
        Your infrastructure code and deployment workflow are ready.
      </p>
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>
          GitHub Actions Workflow (.yml) for {provider}
        </h2>
        <p className={styles.sectionIntro}>
          선택하신 ${provider} 플랜에 대한 배포 자동화(CI/CD) 워크플로우입니다.
        </p>
        <div className={styles.codeSnippet}>
          <pre>
            <code>{yamlCode}</code>
          </pre>
        </div>
      </div>
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Download Your Bundle</h2>
        <p className={styles.sectionIntro}>
          모든 테라폼 코드(.tf)와 GitHub Actions 워크플로우(.yml)가 포함된
          압축(zip) 파일입니다.
        </p>
        <button
          className={styles.downloadButton}
          onClick={handleDownloadBundle}
        >
          Download Bundle (.zip)
        </button>
      </div>
    </div>
  );
};

export default Results;