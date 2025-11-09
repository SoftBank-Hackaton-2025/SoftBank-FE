/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useExpedition } from "../../stores/expedition.context";
import styles from "./Results.module.css";
import { fetchActionsYaml, gitStartAndZip, type Cloud } from "../../api/guide";
import { downloadBlob } from "../../utils/download";

const Results: React.FC = () => {
  const navigate = useNavigate();
  const { selectedCloud, setCompletedSteps } = useExpedition();
  const cloud = (selectedCloud?.toLowerCase?.() ?? "aws") as Cloud;
  const provider = selectedCloud || "Cloud";

  const [yamlCode, setYamlCode] = useState<string>("Loading workflow...");
  const [downloading, setDownloading] = useState(false);

  // 단계 완료 체크
  useEffect(() => {
    setCompletedSteps("/generation");
  }, [setCompletedSteps]);

  // 페이지 진입 즉시 /actions 불러와 화면에 표시
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const yaml = await fetchActionsYaml(cloud);
        if (alive) setYamlCode(yaml);
      } catch (e: any) {
        const msg = await extractErrText(e);
        console.error("fetchActionsYaml error:", msg || e);
        if (alive) {
          setYamlCode(`# Actions YAML 로딩 실패
# 원인: ${
            msg ?? "알 수 없음"
          }\n# (산출물 생성(/tf-start) 완료 및 request_id 일치 여부 확인)`);
        }
      }
    })();
    return () => {
      alive = false;
    };
  }, [cloud]);

  // /git-start → ZIP 생성 후 다운로드
  const handleDownloadBundle = async () => {
    try {
      setDownloading(true);
      const { blob, filename } = await gitStartAndZip(cloud);
      downloadBlob(blob, filename || `deployment-bundle-${cloud}.zip`);
    } catch (e: any) {
      const msg = await extractErrText(e);
      console.error("handleDownloadBundle error:", msg || e);
      alert(`다운로드 중 오류가 발생했습니다.\n${msg ?? ""}`);
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

      {/* --- 1. CI/CD 섹션 (/actions 결과 표시) --- */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>
          GitHub Actions Workflow (.yml) for {provider}
        </h2>
        <p className={styles.sectionIntro}>
          선택하신 {provider} 플랜에 대한 배포 자동화(CI/CD) 워크플로우입니다.
        </p>
        <div className={styles.codeSnippet}>
          <pre>
            <code>{yamlCode}</code>
          </pre>
        </div>
      </div>

      {/* --- 2. 다운로드 섹션 (/git-start 결과 ZIP) --- */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Download Your Bundle</h2>
        <p className={styles.sectionIntro}>
          Terraform 코드, GitHub Actions 워크플로우, CLI 가이드를 ZIP으로
          내려받습니다.
        </p>
        <button
          className={styles.downloadButton}
          onClick={handleDownloadBundle}
          disabled={downloading}
        >
          {downloading ? "Preparing..." : "Download Bundle (.zip)"}
        </button>
      </div>

      <div className={styles.nextStepContainer}>
        <button className={styles.nextStepButton} onClick={handleNextStep}>
          Finish & Get Deployment Tips
        </button>
      </div>
    </div>
  );
};

export default Results;

// 도우미: Axios 에러 본문 안전 추출
async function extractErrText(e: any) {
  const blob = e?.response?.data;
  if (blob && typeof blob === "object" && typeof blob.text === "function") {
    try {
      return await blob.text();
    } catch {
      /* noop */
    }
  }
  return e?.response?.data ?? e?.message ?? null;
}
