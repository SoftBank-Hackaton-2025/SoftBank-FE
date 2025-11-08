// src/pages/TerraformLoading/TerraformLoading.tsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./TerraformLoading.module.css";
import { useExpedition } from "../../stores/expedition.context";
import { type CloudOption } from "../../stores/expedition.types";

const TerraformLoading: React.FC = () => {
  const navigate = useNavigate();
  const { sizingOptions, setGenerationResults, setCompletedSteps } = useExpedition();
  const [statusText, setStatusText] = useState("Generating recommendations...");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const startGeneration = async () => {
      try {
        // 1. Lambda API 요청 payload 생성
        const lambdaPayload = {
          request_id: crypto.randomUUID(),
          survey: {
            purpose: sizingOptions.purpose?.[0] || "",
            "region-location": sizingOptions.region?.[0] || "",
            availability: sizingOptions.availability?.[0] || "",
            security: sizingOptions.security?.[0] || "",
          },
        };

        console.log("🚀 Lambda 호출 Payload:", lambdaPayload);
        setStatusText("Calling AI Sizing Lambda with selected survey options...");

        // 2. API Gateway URL (.env 기반)
        const LAMBDA_URL = `${import.meta.env.VITE_API_BASE_URL}/tf-start`;

        const response = await fetch(LAMBDA_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(lambdaPayload),
        });

        if (!response.ok) throw new Error(`API Gateway returned ${response.status}`);

        // 3. Lambda 응답 처리
        const data = await response.json();
        console.log("✅ Lambda Response:", data);

        // 안전하게 results 추출
        let results: CloudOption[] = [];
        if (Array.isArray(data?.results)) {
          results = data.results.map((item: unknown) => {
            const obj = item as Partial<CloudOption>;
            return {
              provider: obj.provider || "Unknown Provider",
              logo: obj.logo || "default.png",
              estimatedCost: obj.estimatedCost || "N/A",
              terraformCode: obj.terraformCode || "",
            };
          });
        }

        if (results.length === 0) {
          throw new Error("Lambda returned empty or invalid results");
        }

        setGenerationResults(results);
        setCompletedSteps("/terraform/sizing");

        setStatusText("Generation complete. Moving to comparison...");
        await new Promise((resolve) => setTimeout(resolve, 1500));
        navigate("/generation");
      } catch (err) {
        console.error("❌ Lambda 호출 실패:", err);
        setError("Failed to generate recommendations. Please try again.");
        setStatusText("Error during generation!");
      }
    };

    startGeneration();
  }, [navigate, sizingOptions, setGenerationResults, setCompletedSteps]);

  return (
    <div className={styles.analysisContainer}>
      <h1 className={styles.title}>Generating Terraform Code...</h1>
      <p className={styles.subtitle}>
        Please wait while AI configures your infrastructure and costs.
      </p>
      {!error && <div className={styles.spinner}></div>}
      <p className={styles.statusText} style={{ color: error ? "red" : "" }}>
        {error ? error : statusText}
      </p>
    </div>
  );
};

export default TerraformLoading;
