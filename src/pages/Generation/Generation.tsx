// src/pages/Generation/Generation.tsx
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate, Link } from "react-router-dom";
import styles from "./Generation.module.css";
import { useExpedition } from "../../stores/expedition.context";

type PreviewState = { provider: string; code: string } | null;

const Generation: React.FC = () => {
  const navigate = useNavigate();
  const { generationResults, setSelectedCloud } = useExpedition();
  const [preview, setPreview] = useState<PreviewState>(null);

  const handleCloudSelect = (provider: string) => {
    setSelectedCloud(provider);
    navigate("/results");
  };

  // ESC로 닫기 + 모달 열릴 때 body 스크롤 잠금
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPreview(null);
    };
    if (preview) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", onKey);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [preview]);

  if (!generationResults || generationResults.length === 0) {
    return (
      <div className={styles.genContainer}>
        <h1 className={styles.title}>No Cloud Recommendations</h1>
        <p className={styles.subtitle}>
          먼저 <Link to="/terraform">AI Sizing</Link>을 실행해 추천을
          받아주세요.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.genContainer}>
      <h1 className={styles.title}>Cloud Recommendations</h1>
      <p className={styles.subtitle}>
        각 클라우드의 예상 비용과 Terraform 파일을 확인하세요.
      </p>

      <div className={styles.grid}>
        {generationResults.map((opt, idx) => {
          const code = opt.terraformCode ?? "";
          return (
            <div key={`${opt.provider}-${idx}`} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.providerMeta}>
                  {opt.logo && (
                    <img
                      src={opt.logo}
                      alt={`${opt.provider} logo`}
                      className={styles.providerLogo}
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  )}
                  <h2 className={styles.providerName}>
                    {opt.provider ?? "Unknown"}
                  </h2>
                </div>
                <div className={styles.costSection}>
                  <span className={styles.costLabel}>Estimated</span>
                  <span className={styles.costValue}>
                    {opt.estimatedCost ?? "N/A"}
                  </span>
                </div>
              </div>

              <div className={styles.linkRow}>
                {code && (
                  <button
                    type="button"
                    className={styles.previewBtn}
                    onClick={() =>
                      setPreview({
                        provider: opt.provider ?? "Unknown",
                        code,
                      })
                    }
                  >
                    Quick preview
                  </button>
                )}
              </div>

              <button
                className={styles.selectButton}
                onClick={() => handleCloudSelect(opt.provider ?? "")}
              >
                Select {opt.provider ?? "Unknown"}
              </button>
            </div>
          );
        })}
      </div>

      {/* ===== Modal (Portal) ===== */}
      {preview &&
        createPortal(
          <div
            className={styles.modalBackdrop}
            onClick={() => setPreview(null)}
            aria-hidden="true"
          >
            <div
              className={styles.modal}
              role="dialog"
              aria-modal="true"
              aria-label={`${preview.provider} Terraform code`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <h3 className={styles.modalTitle}>
                  {preview.provider} — Terraform preview
                </h3>
                <button
                  className={styles.modalClose}
                  onClick={() => setPreview(null)}
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              <div className={styles.modalActions}>
                <button
                  className={styles.copyButton}
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(preview.code);
                      alert("Copied!");
                    } catch {
                      alert("Copy failed");
                    }
                  }}
                >
                  Copy code
                </button>
              </div>

              <div className={styles.modalBody}>
                <pre>
                  <code>{preview.code}</code>
                </pre>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default Generation;
