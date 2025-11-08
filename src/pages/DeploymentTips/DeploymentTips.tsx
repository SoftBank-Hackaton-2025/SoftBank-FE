// src/pages/DeploymentTips/DeploymentTips.tsx

import React, { useEffect } from 'react'; // 👈 1. useEffect import
import { Link } from 'react-router-dom';
import { useExpedition } from '../../stores/expedition.context';
import styles from './DeploymentTips.module.css';

// 1. 클라우드별 콘솔 링크
const consoleLinks: { [key: string]: string } = {
  AWS: 'https://aws.amazon.com/console/',
  Azure: 'https://portal.azure.com/',
  GCP: 'https://console.cloud.google.com/',
  Cloud: '#', // 기본값
};

// 2. 클라우드별 배포 팁
const deploymentTips: { [key: string]: string[] } = {
  AWS: [
    '다운로드한 .zip 파일의 압축을 풉니다.',
    '터미널에서 `terraform init`, `terraform plan`, `terraform apply`를 순서대로 실행하세요.',
    'GitHub Actions .yml 파일을 .github/workflows/ 폴더에 추가하고, 리포지토리 Settings > Secrets에 `AWS_ACCESS_KEY_ID`와 `AWS_SECRET_ACCESS_KEY`를 등록하세요.',
  ],
  Azure: [
    '다운로드한 .zip 파일의 압축을 풉니다.',
    '터미널에서 `terraform init`, `terraform plan`, `terraform apply`를 순서대로 실행하세요.',
    'GitHub Actions .yml 파일을 .github/workflows/ 폴더에 추가하고, 리포지토리 Secrets에 `AZURE_CREDENTIALS`를 등록하세요.',
  ],
  GCP: [
    '다운로드한 .zip 파일의 압축을 풉니다.',
    '터미널에서 `terraform init`, `terraform plan`, `terraform apply`를 순서대로 실행하세요.',
    'GitHub Actions .yml 파일을 .github/workflows/ 폴더에 추가하고, 리포지토리 Secrets에 `GCP_SA_KEY`를 등록하세요.',
  ],
  Cloud: ['배포를 시작하기 전에 3단계에서 클라우드를 먼저 선택해 주세요.'],
};

const DeploymentTips: React.FC = () => {
  // 👇 2. setCompletedSteps 훅 가져오기
  const { selectedCloud, setCompletedSteps } = useExpedition();
  const provider = selectedCloud || 'Cloud';
  const consoleLink = consoleLinks[provider];
  const tips = deploymentTips[provider];

  // 👇 3. [신규] 페이지가 로드될 때 "4단계(/results)가 완료됨"을 저장
  useEffect(() => {
    setCompletedSteps('/results');
  }, [setCompletedSteps]); // 👈 4. 의존성 배열 추가

  return (
    <div className={styles.tipsContainer}>
      <h1 className={styles.title}>Congratulations!</h1>
      <p className={styles.subtitle}>
        Your HikariFlow expedition is complete.
      </p>

      {/* --- 1. 콘솔 링크 섹션 --- */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>
          Next Step: Visit Your Cloud Console
        </h2>
        <p className={styles.sectionIntro}>
          선택하신 **{provider}**의 콘솔로 이동하여 생성된 리소스를 확인하세요.
        </p>
        <a
          href={consoleLink}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.consoleButton}
        >
          Go to {provider} Console
        </a>
      </div>

      {/* --- 2. 배포 팁 섹션 --- */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Deployment Tips</h2>
        <ul className={styles.tipList}>
          {tips.map((tip, index) => (
            <li key={index} className={styles.tipItem}>
              {tip}
            </li>
          ))}
        </ul>
      </div>

      {/* --- 3. 홈으로 돌아가기 --- */}
      <div className={styles.section}>
        <Link to="/" className={styles.homeButton}>
          Start a New Expedition
        </Link>
      </div>
    </div>
  );
};

export default DeploymentTips;