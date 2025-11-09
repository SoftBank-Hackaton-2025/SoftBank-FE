import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ProjectUpload.module.css";

// 필요한 API 및 유틸리티 함수들을 임포트합니다.
import { fetchPresignedUrl } from "../../api/presigned";
import { uploadFileToS3 } from "../../api/s3";
import { postCodeAnalysis } from "../../api/analysis";
import { saveRequestId } from "../../utils/requestIdStorage";

const ProjectUpload: React.FC = () => {
  const navigate = useNavigate();

  // 파일 상태와 업로드 상태를 관리합니다.
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [statusText, setStatusText] = useState(
    "Upload your code to start your adventure!"
  );
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      // .zip 파일만 허용하는 로직 추가 가능
      setSelectedFile(event.target.files[0]);
      setStatusText(
        `File selected: ${event.target.files[0].name}. Click 'Begin Expedition' to start upload.`
      );
    }
  };

  const handleExpeditionStart = async () => {
    if (!selectedFile) {
      alert("Please select a ZIP file first.");
      return;
    }

    setIsUploading(true);
    setStatusText("1. Requesting Presigned URL...");

    try {
      // ------------------------------------
      // Step 1: Presigned URL 및 Request ID 발급 (POST /start)
      // ------------------------------------
      // presigned.ts 수정으로 인해, 이제 presignedResponse는 Response.data를 바로 가리킵니다.
      const presignedResponse = await fetchPresignedUrl();

      // 응답 객체에서 upload_url과 request_id를 추출합니다.
      const uploadUrl = presignedResponse.upload_url;
      const requestId = presignedResponse.request_id;

      // 🔴 필수: uploadUrl 또는 requestId가 유효한지 확인
      if (!uploadUrl || !requestId) {
        throw new Error(
          `Invalid response from /start. URL: ${uploadUrl}, ID: ${requestId}`
        );
      }

      saveRequestId(requestId); // 🔴 백엔드에서 받은 ID 저장
      setStatusText(`2. Uploading to S3... (Request ID: ${requestId})`);

      // ------------------------------------
      // Step 2: S3로 파일 업로드 (PUT 요청)
      // ------------------------------------
      await uploadFileToS3(uploadUrl, selectedFile, (percent) => {
        setStatusText(`2. Uploading... ${percent}% complete.`);
      });

      // ------------------------------------
      // Step 3: 분석 요청 (POST /code-analyze)
      // ------------------------------------
      setStatusText("3. Upload successful. Requesting code analysis...");

      // 파일 이름 전체를 인수로 전달 (S3 Key 구성용)
      const fileName = selectedFile.name;

      await postCodeAnalysis(fileName);

      setStatusText("Analysis started. Moving to Analysis Status page...");

      // 성공 시 다음 페이지로 이동
      navigate("/analysis");
    } catch (error) {
      console.error("Upload and Analysis Flow Failed:", error);
      // 실패 시 statusText에 에러 메시지 표시
      setStatusText(
        `❌ Upload Failed! ${
          error instanceof Error ? error.message : "Unknown error."
        }`
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={styles.uploadContainer}>
      <h1 className={styles.title}>Begin Your Journey</h1>
      <p className={styles.subtitle}>{statusText}</p>

      {/* 🔴 파일 선택 Input */}
      <input
        type="file"
        accept=".zip" // .zip 파일만 허용
        onChange={handleFileChange}
        style={{ display: "none" }}
        id="file-upload"
      />

      <label htmlFor="file-upload" className={styles.dropZone}>
        <div className={styles.cloudIcon}>☁️</div>
        <p>
          <strong>
            {selectedFile ? selectedFile.name : "Drag & drop your file here"}
          </strong>
        </p>
        <p>or click to browse (.zip only)</p>
      </label>

      {/* 🔴 버튼 클릭 시 업로드 로직 실행 */}
      <button
        className={styles.submitButton}
        onClick={handleExpeditionStart}
        disabled={!selectedFile || isUploading}
      >
        {isUploading ? "Uploading..." : "Begin Expedition"}
      </button>
    </div>
  );
};

export default ProjectUpload;
