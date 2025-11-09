import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useExpedition } from "../../stores/expedition.context";
import styles from "./AISizing.module.css";

import { postRecommendation } from "../../api/recommend";
import { toCloudOptionsForDisplay } from "../../utils/transformTfStart";

// 카테고리 상수/타입 (인덱싱 타입 에러 방지)
const CATEGORIES = ["purpose", "region", "availability", "security"] as const;
type Category = (typeof CATEGORIES)[number];

// 옵션 매핑 (key -> label)
const OPTIONS_MAP: Record<Category, { key: string; label: string }[]> = {
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
    {
      key: "private-subnet",
      label: "프라이빗 서브넷 + ALB/NAT(민감 자원 비공개)",
    },
    { key: "zero-trust", label: "제로트러스트/VPN 전용(강력 접근제어)" },
  ],
};

const getLabelFromKey = (category: Category, key?: string | null) => {
  if (!key) return null;
  const found = OPTIONS_MAP[category].find((o) => o.key === key);
  return found ? found.label : null;
};

const AISizing: React.FC = () => {
  const navigate = useNavigate();
  const {
    sizingOptions,
    setSizingOptions,
    setCompletedSteps,
    setGenerationResults,
  } = useExpedition();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onSelectSingle = (category: Category, value: string) => () => {
    setErrorMessage(null);
    setSizingOptions((prev) => ({
      ...prev,
      [category]: [value],
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);

    // 1) 유효성 검사
    const missing = CATEGORIES.find(
      (c) => !sizingOptions[c] || sizingOptions[c].length !== 1
    );
    if (missing) {
      setErrorMessage("모든 항목에서 하나씩 선택해 주세요.");
      return;
    }

    // 2) /tf-start 스펙에 맞춘 survey payload
    const survey = {
      purpose: getLabelFromKey("purpose", sizingOptions.purpose[0]) ?? "",
      "region-location":
        getLabelFromKey("region", sizingOptions.region[0]) ?? "",
      availability:
        getLabelFromKey("availability", sizingOptions.availability[0]) ?? "",
      security: getLabelFromKey("security", sizingOptions.security[0]) ?? "",
    } as const;

    setIsLoading(true);

    try {
      // 3) /tf-start 호출 (request_id는 내부에서 가져옴)
      const res = await postRecommendation(survey); // TfStartResponse
      console.log("/tf-start 응답:", res);

      // 4) presigned .tf를 즉시 GET → 화면표시용 CloudOption[]으로 변환
      const results = await toCloudOptionsForDisplay(res);
      setGenerationResults(results);

      // 5) 완료 마킹 후 결과 화면으로 이동 (중복 호출 방지)
      setCompletedSteps?.("/terraform/sizing");
      navigate("/generation");
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
        {CATEGORIES.map((category) => (
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
        ))}

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
