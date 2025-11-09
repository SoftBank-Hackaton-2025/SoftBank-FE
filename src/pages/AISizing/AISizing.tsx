import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useExpedition } from "../../stores/expedition.context";
import styles from "./AISizing.module.css";

import { postRecommendation } from "../../api/recommend";
import { toCloudOptionsForDisplay } from "../../utils/transformTfStart";

// ---- Categories (fixed keys) ----
const CATEGORIES = ["purpose", "region", "availability", "security"] as const;
type Category = (typeof CATEGORIES)[number];

// ---- UI labels (English) ----
const UI_OPTIONS: Record<Category, { key: string; label: string }[]> = {
  purpose: [
    { key: "portfolio", label: "Personal Project / Portfolio" },
    { key: "poc", label: "Internal Test / PoC" },
    { key: "pilot", label: "Pilot (Small Traffic)" },
    { key: "production", label: "Production Service" },
  ],
  region: [
    { key: "global", label: "Global" },
    { key: "apac", label: "APAC-focused" },
    { key: "kr", label: "Korea Only" },
    { key: "intranet", label: "Intranet/VPN Only" },
  ],
  availability: [
    { key: "single", label: "Ultra-low cost single instance (allow downtime)" },
    { key: "selfhealing", label: "Auto-healing / Health Checks" },
    {
      key: "ha-multi-az",
      label: "High Availability (Multi-AZ, near zero-downtime)",
    },
    {
      key: "dr-multicloud",
      label: "DR / Multi-Cloud (disaster recovery focused)",
    },
  ],
  security: [
    { key: "public-open", label: "Public OK (test/demo)" },
    { key: "public-waf", label: "Public + WAF / Rate Limit" },
    {
      key: "private-subnet",
      label: "Private Subnet + ALB/NAT (hide sensitive resources)",
    },
    {
      key: "zero-trust",
      label: "Zero-Trust / VPN Only (strict access control)",
    },
  ],
};

// ---- Server value map (Korean strings expected by backend) ----
const SERVER_VALUE_MAP: Record<Category, Record<string, string>> = {
  purpose: {
    portfolio: "개인 프로젝트 / 포트폴리오",
    poc: "내부 테스트 / PoC",
    pilot: "파일럿(소규모 트래픽)",
    production: "실제 상용 서비스",
  },
  region: {
    global: "전세계 (글로벌)",
    apac: "아시아·태평양 위주",
    kr: "한국 전용",
    intranet: "사내망/VPN 전용",
  },
  availability: {
    single: "초저예산 단일 인스턴스(간헐 다운타임 허용)",
    selfhealing: "자동복구/헬스체크(셀프 힐링)",
    "ha-multi-az": "다중 AZ 고가용성(무중단 지향)",
    "dr-multicloud": "DR/멀티클라우드(재해 복구 중시)",
  },
  security: {
    "public-open": "퍼블릭 오픈 OK(테스트/데모)",
    "public-waf": "퍼블릭 + WAF/레이트 리밋",
    "private-subnet": "프라이빗 서브넷 + ALB/NAT(민감 자원 비공개)",
    "zero-trust": "제로트러스트/VPN 전용(강력 접근제어)",
  },
};

const toServerValue = (category: Category, key?: string | null) => {
  if (!key) return "";
  return SERVER_VALUE_MAP[category][key] ?? "";
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

    // 1) validation
    const missing = CATEGORIES.find(
      (c) => !sizingOptions[c] || sizingOptions[c].length !== 1
    );
    if (missing) {
      setErrorMessage("Please select exactly one option for each category.");
      return;
    }

    // 2) survey payload (UI -> server values)
    const survey = {
      purpose: toServerValue("purpose", sizingOptions.purpose[0]),
      "region-location": toServerValue("region", sizingOptions.region[0]),
      availability: toServerValue(
        "availability",
        sizingOptions.availability[0]
      ),
      security: toServerValue("security", sizingOptions.security[0]),
    } as const;

    setIsLoading(true);

    try {
      // 3) /tf-start
      const res = await postRecommendation(survey);
      console.log("/tf-start response:", res);

      // 4) fetch presigned .tf -> display
      const results = await toCloudOptionsForDisplay(res);
      setGenerationResults(results);

      // 5) mark done & navigate
      setCompletedSteps?.("/terraform/sizing");
      navigate("/generation");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("API error:", err);
      setErrorMessage(`An error occurred while sending data. (${msg})`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.sizingContainer}>
      <h1 className={styles.title}>AI Sizing</h1>
      <p className={styles.subtitle}>
        Select options so AI can recommend the optimal infrastructure size.
      </p>

      <form className={styles.form} onSubmit={handleSubmit}>
        {CATEGORIES.map((category) => (
          <fieldset key={category} className={styles.fieldset}>
            <legend className={styles.legend}>
              {category === "purpose"
                ? "Purpose"
                : category === "region"
                ? "Region"
                : category === "availability"
                ? "Availability / Budget"
                : "Security"}
            </legend>
            <div className={styles.checkboxGroup}>
              {UI_OPTIONS[category].map((opt) => (
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
          {isLoading ? "Submitting..." : "Get Recommendations"}
        </button>
      </form>
    </div>
  );
};

export default AISizing;
