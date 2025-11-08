// src/pages/AISizing/AISizing.tsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useExpedition } from "../../stores/expedition.context";
import styles from "./AISizing.module.css";

const API_ENDPOINT = `${import.meta.env.VITE_API_BASE_URL}/tf-start`;

// 옵션 매핑 (key -> label)
const OPTIONS_MAP = {
  purpose: [
    { key: "portfolio", label: "개인 프로젝트 / 포트폴리오" },
    { key: "poc", label: "내부 테스트 / PoC" },
    { key: "pilot", label: "파일럿(소규모 트래픽)" },
    { key: "production", label: "실제 상용 서비스" },
  ],
  region: [
    { key: "global", label: "전세계 (글로벌)" },
    { key: "apac", label: "아시아·태평양 위주" },
    { key: "kr", label: "한국 전용" },
    { key: "intranet", label: "사내망/VPN 전용" },
  ],
  availability: [
    { key: "single", label: "초저예산 단일 인스턴스(간헐 다운타임 허용)" },
    { key: "selfhealing", label: "자동복구/헬스체크(셀프 힐링)" },
    { key: "ha-multi-az", label: "다중 AZ 고가용성(무중단 지향)" },
    { key: "dr-multicloud", label: "DR/멀티클라우드(재해 복구 중시)" },
  ],
  security: [
    { key: "public-open", label: "퍼블릭 오픈 OK(테스트/데모)" },
    { key: "public-waf", label: "퍼블릭 + WAF/레이트 리밋" },
    { key: "private-subnet", label: "프라이빗 서브넷 + ALB/NAT(민감 자원 비공개)" },
    { key: "zero-trust", label: "제로트러스트/VPN 전용(강력 접근제어)" },
  ],
};

const getLabelFromKey = (
  category: keyof typeof OPTIONS_MAP,
  key?: string | null
) => {
  if (!key) return null;
  const found = OPTIONS_MAP[category].find((o) => o.key === key);
  return found ? found.label : null;
};

const AISizing: React.FC = () => {
  const navigate = useNavigate();
  const { sizingOptions, setSizingOptions, setCompletedSteps } = useExpedition();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onSelectSingle =
    (category: "purpose" | "region" | "availability" | "security", value: string) =>
    () => {
      setErrorMessage(null);
      setSizingOptions((prev) => ({
        ...prev,
        [category]: [value],
      }));
    };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);

    const categories: (keyof typeof OPTIONS_MAP)[] = [
      "purpose",
      "region",
      "availability",
      "security",
    ];
    const missing = categories.find(
      (c) => !sizingOptions[c] || sizingOptions[c].length !== 1
    );
    if (missing) {
      setErrorMessage("모든 항목에서 하나씩 선택해 주세요.");
      return;
    }

    const requestId = localStorage.getItem("userFlowRequestId");
    if (!requestId) {
      setErrorMessage(
        "오류: 이전 단계의 request_id를 찾을 수 없습니다. 이전 단계로 돌아가 주세요."
      );
      console.error("request_id missing in localStorage");
      return;
    }

    const payload = {
      request_id: requestId,
      survey: {
        purpose: getLabelFromKey("purpose", sizingOptions.purpose[0]),
        "region-location": getLabelFromKey("region", sizingOptions.region[0]),
        availability: getLabelFromKey("availability", sizingOptions.availability[0]),
        security: getLabelFromKey("security", sizingOptions.security[0]),
      },
    };

    setIsLoading(true);

    try {
      const res = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`API 호출 실패: ${res.status} ${text}`);
      }

      const data = await res.json().catch(() => null);
      console.log("✅ Lambda/API Gateway 응답:", data);

      // 여기서 data.results 또는 data.message 등 실제 Lambda 반환값 활용 가능
      // 예: results 존재 시 setCompletedSteps, navigate
      setCompletedSteps?.("/terraform/sizing");
      navigate("/terraform-loading");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("API 호출 오류:", err);
      setErrorMessage(`데이터 전송 중 오류가 발생했습니다. (${msg})`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.sizingContainer}>
      <h1 className={styles.title}>AI Sizing</h1>
      <p className={styles.subtitle}>
        AI가 최적의 인프라 규모를 추천할 수 있도록 항목을 선택해 주세요.
      </p>

      <form className={styles.form} onSubmit={handleSubmit}>
        {/* 각 카테고리 반복 */}
        {(["purpose", "region", "availability", "security"] as const).map(
          (category) => (
            <fieldset key={category} className={styles.fieldset}>
              <legend className={styles.legend}>
                {category === "purpose"
                  ? "배포 목적"
                  : category === "region"
                  ? "배포 위치"
                  : category === "availability"
                  ? "안정성 (가용성/예산)"
                  : "보안성"}
              </legend>
              <div className={styles.checkboxGroup}>
                {OPTIONS_MAP[category].map((opt) => (
                  <label key={opt.key} className={styles.label}>
                    <input
                      type="radio"
                      name={category}
                      checked={sizingOptions[category].includes(opt.key)}
                      onChange={onSelectSingle(category, opt.key)}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </fieldset>
          )
        )}

        {errorMessage && (
          <p className={styles.errorMessage} role="alert">
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? "요청중..." : "추천 받기"}
        </button>
      </form>
    </div>
  );
};

export default AISizing;
