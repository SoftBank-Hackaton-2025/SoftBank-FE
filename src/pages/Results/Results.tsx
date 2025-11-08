/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/Results/Results.tsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useExpedition } from "../../stores/expedition.context";
import styles from "./Results.module.css";

// 다운로드 연동용 유틸/API
import { postGitStartAutoZip } from "../../api/guide";
import { downloadBlob } from "../../utils/download";

const Results: React.FC = () => {
  const navigate = useNavigate();
  const { selectedCloud, setCompletedSteps } = useExpedition();
  const provider = selectedCloud || "Cloud";

  const [downloading, setDownloading] = useState(false);

  // 3단계 완료 체크
  useEffect(() => {
    setCompletedSteps("/generation");
  }, [setCompletedSteps]);

  // GitHub Actions 더미 YAML (그대로 유지)
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

  // ZIP 다운로드: /git-start POST → (ZIP 직반환 or JSON→프론트 ZIP 생성) 자동 처리
  // const handleDownloadBundle = async () => {
  //   try {
  //     setDownloading(true);
  //     // 선택된 클라우드가 없다면 기본 aws로
  //     const cloud = (selectedCloud?.toLowerCase?.() ?? "aws") as
  //       | "aws"
  //       | "gcp"
  //       | "azure";

  //     const { blob, filename } = await postGitStartAutoZip(cloud);
  //     downloadBlob(blob, filename);
  //   } catch (e: any) {
  //     // Axios 에러 상세 보기
  //     const status = e?.response?.status;
  //     let msg = "다운로드 중 오류가 발생했습니다.";
  //     if (status) msg += ` (HTTP ${status})`;
  //     console.error("handleDownloadBundle error:", e?.response?.data || e);
  //     alert(msg);
  //   } finally {
  //     setDownloading(false);
  //   }
  // };

  const handleDownloadBundle = async () => {
    try {
      setDownloading(true);
      // 테스트용: cloud도 고정
      const { blob, filename } = await postGitStartAutoZip("aws");
      downloadBlob(blob, filename || "deployment-bundle-aws.zip");
    } catch (e) {
      console.error(e);
      alert("다운로드 중 오류가 발생했습니다.");
    } finally {
      setDownloading(false);
    }
  };

  const handleNextStep = () => {
    setCompletedSteps("/results");
    navigate("/tips");
  };

  return (
    <div className={styles.resultsContainer}>
      <h1 className={styles.title}>CI/CD & Download</h1>
      <p className={styles.subtitle}>
        Your infrastructure code and deployment workflow are ready.
      </p>

      {/* --- 1. CI/CD 섹션 --- */}
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

      {/* --- 2. 다운로드 섹션 --- */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Download Your Bundle</h2>
        <p className={styles.sectionIntro}>
          모든 테라폼 코드(.tf)와 GitHub Actions 워크플로우(.yml)가 포함된
          압축(zip) 파일입니다.
        </p>
        <button
          className={styles.downloadButton}
          onClick={handleDownloadBundle}
          disabled={downloading}
        >
          {downloading ? "Preparing..." : "Download Bundle (.zip)"}
        </button>
      </div>

      {/* --- 3. 다음 단계 이동 섹션 --- */}
      <div className={styles.nextStepContainer}>
        <button className={styles.nextStepButton} onClick={handleNextStep}>
          Finish & Get Deployment Tips
        </button>
      </div>
    </div>
  );
};

export default Results;

// // src/pages/Results/Results.tsx

// import React, { useEffect } from "react"; // 👈 1. useEffect import
// import { useNavigate } from "react-router-dom";
// import { useExpedition } from "../../stores/expedition.context";
// import styles from "./Results.module.css";

// const Results: React.FC = () => {
//   const navigate = useNavigate();
//   // 2. setCompletedSteps 훅 가져오기
//   const { selectedCloud, setCompletedSteps } = useExpedition();
//   const provider = selectedCloud || "Cloud";

//   // 👇 3. [신규] 페이지가 로드될 때 "3단계(/generation)가 완료됨"을 저장
//   useEffect(() => {
//     setCompletedSteps("/generation");
//   }, [setCompletedSteps]); // 👈 4. 의존성 배열 추가

//   // 4단계 페이지에서 보여줄 YAML 코드
//   const yamlCode = `
// name: Deploy Terraform to ${provider}

// on:
//   push:
//     branches:
//       - main

// jobs:
//   terraform:
//     name: 'Terraform'
//     runs-on: ubuntu-latest
//     steps:
//       - name: 'Checkout'
//         uses: actions/checkout@v2

//       - name: 'Setup Terraform'
//         uses: hashicorp/setup-terraform@v1
//         with:
//           cli_config_credentials_token: \${{ secrets.TF_API_TOKEN }}

//       - name: 'Terraform Format'
//         run: terraform fmt -check

//       - name: 'Terraform Init'
//         run: terraform init

//       - name: 'Terraform Plan'
//         run: terraform plan

//       - name: 'Terraform Apply'
//         if: github.ref == 'refs/heads/main'
//         run: terraform apply -auto-approve
// `;

//   const handleDownloadBundle = () => {
//     alert("다운로드 기능이 구현될 예정입니다.");
//   };

//   const handleNextStep = () => {
//     // '결과(=4단계)' 완료 표시를 먼저 남김
//     setCompletedSteps("/results");
//     navigate("/tips"); // 그 다음 이동
//   };
//   return (
//     <div className={styles.resultsContainer}>
//       <h1 className={styles.title}>CI/CD & Download</h1>
//       <p className={styles.subtitle}>
//         Your infrastructure code and deployment workflow are ready.
//       </p>

//       {/* --- 1. CI/CD 섹션 --- */}
//       <div className={styles.section}>
//         <h2 className={styles.sectionTitle}>
//           GitHub Actions Workflow (.yml) for {provider}
//         </h2>
//         <p className={styles.sectionIntro}>
//           선택하신 ${provider} 플랜에 대한 배포 자동화(CI/CD) 워크플로우입니다.
//         </p>
//         <div className={styles.codeSnippet}>
//           <pre>
//             <code>{yamlCode}</code>
//           </pre>
//         </div>
//       </div>

//       {/* --- 2. 다운로드 섹션 --- */}
//       <div className={styles.section}>
//         <h2 className={styles.sectionTitle}>Download Your Bundle</h2>
//         <p className={styles.sectionIntro}>
//           모든 테라폼 코드(.tf)와 GitHub Actions 워크플로우(.yml)가 포함된
//           압축(zip) 파일입니다.
//         </p>
//         <button
//           className={styles.downloadButton}
//           onClick={handleDownloadBundle}
//         >
//           Download Bundle (.zip)
//         </button>
//       </div>

//       {/* --- 3. 다음 단계 이동 섹션 --- */}
//       <div className={styles.nextStepContainer}>
//         <button className={styles.nextStepButton} onClick={handleNextStep}>
//           Finish & Get Deployment Tips
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Results;
