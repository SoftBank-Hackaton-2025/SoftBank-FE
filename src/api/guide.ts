import { apiClient } from "./client";
import JSZip from "jszip";
// 디버그 강제값은 필요 시 유지
const DEBUG = true;
const DEBUG_REQUEST_ID = "1234" as const;
const DEBUG_CLOUD = "aws" as const;

function buildGitStartPayload(cloud: "aws" | "gcp" | "azure") {
  const request_id = DEBUG ? DEBUG_REQUEST_ID : localStorage.getItem("request_id") || "";
  const finalCloud = DEBUG ? DEBUG_CLOUD : cloud;
  if (!request_id) throw new Error("유효한 Request ID가 필요합니다.");
  return { request_id, cloud: finalCloud };
}

function looksLikeZipContentType(ct?: string) {
  if (!ct) return false;
  const v = ct.toLowerCase();
  return v.includes("application/zip") || v.includes("application/octet-stream");
}

/**
 * 서버가 ZIP 직반환이면 그대로 저장,
 * 그 외(JSON/HTML 등)면 내용을 읽어 JSON->ZIP으로 재구성하여 저장.
 */
export async function postGitStartAutoZip(
  cloud: "aws" | "gcp" | "azure"
): Promise<{ blob: Blob; filename: string }> {
  const payload = buildGitStartPayload(cloud);

  // 1) 우선 blob으로 받되, 'zip' 컨텐츠가 아니면 본문을 검사해서 폴백
  const res = await apiClient.post("/git-start", payload, {
    responseType: "blob",
    headers: { "Content-Type": "application/json" },
    // timeout 등 필요시 추가
  });

  const contentType = (res.headers?.["content-type"] as string) || "";
  const cd = (res.headers?.["content-disposition"] as string) || "";
  const candidateBlob = res.data as Blob;

  // ZIP로 간주할 수 있으면 그대로 반환
  if (looksLikeZipContentType(contentType)) {
    let filename = "deployment-guide.zip";
    const m = /filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i.exec(cd);
    if (m) filename = decodeURIComponent(m[1] || m[2] || filename);
    return { blob: candidateBlob, filename };
  }

  // ZIP이 아니면 본문을 텍스트로 읽어서 JSON인지 확인
  let text = "";
  try {
    text = await candidateBlob.text();
  } catch {
    // blob을 읽을 수 없으면 그냥 전달
    return { blob: candidateBlob, filename: "deployment-bundle.zip" };
  }

  // JSON 형태면 files에서 코드 추출 → 프론트에서 ZIP 생성
  try {
    const data = JSON.parse(text);
    const files = (data?.files ?? {}) as Record<string, string>;
    const zip = new JSZip();

    if (files["terraform_code"]) zip.file("terraform/main.tf", files["terraform_code"]);
    if (files["github_actions_yaml"])
      zip.file(".github/workflows/deploy.yml", files["github_actions_yaml"]);

    // 응답에 다른 키가 있으면 참고용으로 extras에 덤프(선택)
    Object.entries(files).forEach(([k, v]) => {
      if (k !== "terraform_code" && k !== "github_actions_yaml") {
        zip.file(`extras/${k}.txt`, String(v ?? ""));
      }
    });

    // 최소 한 파일도 없다면, 서버 에러 메시지든 뭐든 그대로 저장
    const hasAny = Object.keys(files).length > 0;
    if (!hasAny) {
      zip.file("README.txt", "Server responded with JSON but no files were provided.");
    }

    const blob = await zip.generateAsync({ type: "blob" });
    return { blob, filename: "deployment-bundle.zip" };
  } catch {
    // JSON도 아니면(에러 HTML 등) 사용자에게 그대로 저장
    return { blob: candidateBlob, filename: "deployment-bundle.zip" };
  }
}


// /* eslint-disable @typescript-eslint/no-explicit-any */
// // src/api/guide.ts
// import { apiClient } from "./client";
// import { getRequestId } from "../utils/requestIdStorage";
// import JSZip from "jszip";

// // git-start용 payload (백엔드 계약: request_id + cloud)
// function buildGitStartPayload(cloud: "aws" | "gcp" | "azure") {
//   const request_id = getRequestId();
//   if (!request_id) throw new Error("유효한 Request ID가 필요합니다.");
//   return { request_id, cloud };
// }

// /**
//  * /git-start
//  * 1) ZIP 직접 반환(application/zip|octet-stream)
//  * 2) JSON 반환({ files: { terraform_code, github_actions_yaml, ... } })
//  * 둘 다 자동 처리
//  */
// export async function postGitStartAutoZip(
//   cloud: "aws" | "gcp" | "azure"
// ): Promise<{ blob: Blob; filename: string }> {
//   const payload = buildGitStartPayload(cloud);

//   // 시나리오 A: ZIP 직접 반환
//   try {
//     const res = await apiClient.post("/git-start", payload, {
//       responseType: "blob",
//       headers: { "Content-Type": "application/json" },
//     });
//     // 파일명 추출(있으면)
//     let filename = "deployment-guide.zip";
//     const cd = (res.headers?.["content-disposition"] as string) || "";
//     const m = /filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i.exec(cd);
//     if (m) filename = decodeURIComponent(m[1] || m[2] || filename);
//     return { blob: res.data as Blob, filename };
//   } catch (e: any) {
//     // 계속 진행해서 JSON 처리 시도
//     if (e?.response?.status && e.response.status !== 415) {
//       // 4xx/5xx라면 메시지를 보이도록 콘솔에 남김
//       try {
//         const text = await e.response.data?.text?.();
//         console.error("git-start zip error:", e.response.status, text);
//       } catch { /* empty */ }
//     }
//   }

//   // 시나리오 B: JSON 반환 → 프론트에서 ZIP 생성
//   const { data } = await apiClient.post("/git-start", payload, {
//     headers: { "Content-Type": "application/json" },
//   });

//   const files = (data?.files ?? {}) as Record<string, string>;
//   const zip = new JSZip();

//   // 백엔드 응답 키에 맞춰 파일로 구성
//   if (files["terraform_code"]) zip.file("terraform/main.tf", files["terraform_code"]);
//   if (files["github_actions_yaml"])
//     zip.file(".github/workflows/deploy.yml", files["github_actions_yaml"]);

//   // 기타 필드가 있으면 안전하게 덤프
//   Object.entries(files).forEach(([k, v]) => {
//     if (k !== "terraform_code" && k !== "github_actions_yaml") {
//       zip.file(`extras/${k}.txt`, String(v));
//     }
//   });

//   const blob = await zip.generateAsync({ type: "blob" });
//   return { blob, filename: "deployment-bundle.zip" };
// }


// // // api/guide.ts
// // import { apiClient } from './client';
// // import { getRequestId } from '../utils/requestIdStorage';
// // import type { GuideRequest, GuideResponse } from '../types/api';

// // /**
// //  * [4단계] 선택된 클라우드에 대한 가이드 파일 요청 (POST /git-start)
// //  * @param selectedRecommendationId - 추천 결과 중 사용자가 선택한 ID
// //  */
// // export const postGuideRequest = async (
// //   selectedRecommendationId: string
// // ): Promise<GuideResponse> => {
// //   const requestId = getRequestId();

// //   if (!requestId) {
// //     throw new Error('가이드 요청을 위해 유효한 Request ID가 필요합니다.');
// //   }

// //   const payload: GuideRequest = {
// //     request_id: requestId,
// //     selected_recommendation_id: selectedRecommendationId,
// //   };

// //   const response = await apiClient.post<GuideResponse>('/git-start', payload);
// //   return response.data;
// // };