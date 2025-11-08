import React from "react";
import { useNavigate } from "react-router-dom";
import { useExpedition } from "../../stores/expedition.context";
import styles from "./AISizing.module.css";

const AISizing: React.FC = () => {
  const navigate = useNavigate();
  const { sizingOptions, setSizingOptions, setCompletedSteps } =
    useExpedition();

  // 배열 토글 유틸
  const toggle = (arr: string[], v: string) =>
    arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];

  // 카테고리별 체크박스 핸들러
  const onChangeCheckbox =
    (
      category: "purpose" | "region" | "availability" | "security",
      value: string
    ) =>
    () => {
      setSizingOptions((prev) => ({
        ...prev,
        [category]: toggle(prev[category], value),
      }));
    };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // 아무 것도 안 골랐을 때 방어
    const total =
      sizingOptions.purpose.length +
      sizingOptions.region.length +
      sizingOptions.availability.length +
      sizingOptions.security.length;
    if (total === 0) {
      alert("최소 한 항목 이상 선택해 주세요.");
      return;
    }

    setCompletedSteps?.("/terraform/sizing");
    navigate("/terraform-loading");
  };

  return (
    <div className={styles.sizingContainer}>
      <h1 className={styles.title}>AI Sizing</h1>
      <p className={styles.subtitle}>
        AI가 최적의 인프라 규모를 추천할 수 있도록 항목을 선택해 주세요.
      </p>

      <form className={styles.form} onSubmit={handleSubmit}>
        {/* 배포 목적 */}
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>배포 목적</legend>
          <div className={styles.checkboxGroup}>
            {[
              { key: "portfolio", label: "개인 프로젝트 / 포트폴리오" },
              { key: "poc", label: "내부 테스트 / PoC" },
              { key: "pilot", label: "파일럿(소규모 트래픽)" },
              { key: "production", label: "실제 상용 서비스" },
            ].map((opt) => (
              <label key={opt.key} className={styles.label}>
                <input
                  type="checkbox"
                  checked={sizingOptions.purpose.includes(opt.key)}
                  onChange={onChangeCheckbox("purpose", opt.key)}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </fieldset>

        {/* 배포 위치 */}
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>배포 위치</legend>
          <div className={styles.checkboxGroup}>
            {[
              { key: "global", label: "전세계 (글로벌)" },
              { key: "apac", label: "아시아·태평양 위주" },
              { key: "kr", label: "한국 전용" },
              { key: "intranet", label: "사내망/VPN 전용" },
            ].map((opt) => (
              <label key={opt.key} className={styles.label}>
                <input
                  type="checkbox"
                  checked={sizingOptions.region.includes(opt.key)}
                  onChange={onChangeCheckbox("region", opt.key)}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </fieldset>

        {/* 안정성(가용성/예산) */}
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>안정성 (가용성/예산)</legend>
          <div className={styles.checkboxGroup}>
            {[
              {
                key: "single",
                label: "초저예산 단일 인스턴스(간헐 다운타임 허용)",
              },
              { key: "selfhealing", label: "자동복구/헬스체크(셀프 힐링)" },
              { key: "ha-multi-az", label: "다중 AZ 고가용성(무중단 지향)" },
              {
                key: "dr-multicloud",
                label: "DR/멀티클라우드(재해 복구 중시)",
              },
            ].map((opt) => (
              <label key={opt.key} className={styles.label}>
                <input
                  type="checkbox"
                  checked={sizingOptions.availability.includes(opt.key)}
                  onChange={onChangeCheckbox("availability", opt.key)}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </fieldset>

        {/* 보안성 */}
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>보안성</legend>
          <div className={styles.checkboxGroup}>
            {[
              { key: "public-open", label: "퍼블릭 오픈 OK(테스트/데모)" },
              { key: "public-waf", label: "퍼블릭 + WAF/레이트 리밋" },
              {
                key: "private-subnet",
                label: "프라이빗 서브넷 + ALB/NAT(민감 자원 비공개)",
              },
              {
                key: "zero-trust",
                label: "제로트러스트/VPN 전용(강력 접근제어)",
              },
            ].map((opt) => (
              <label key={opt.key} className={styles.label}>
                <input
                  type="checkbox"
                  checked={sizingOptions.security.includes(opt.key)}
                  onChange={onChangeCheckbox("security", opt.key)}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </fieldset>

        <button type="submit" className={styles.submitButton}>
          추천 받기
        </button>
      </form>
    </div>
  );
};

export default AISizing;
