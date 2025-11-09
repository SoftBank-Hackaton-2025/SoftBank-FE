/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import JSZip from "jszip";
import { apiClient } from "./client";
import { getRequestId } from "../utils/requestIdStorage";

export type Cloud = "aws" | "gcp" | "azure";

/** 공통 payload */
function buildPayload(cloud: Cloud) {
  const request_id = getRequestId();
  if (!request_id) throw new Error("유효한 Request ID가 필요합니다. (/start 먼저 호출)");
  return { request_id, cloud };
}

/** Content-Type이 ZIP처럼 보이는지 */
function looksLikeZipContentType(ct?: string) {
  if (!ct) return false;
  const v = ct.toLowerCase();
  return v.includes("application/zip") || v.includes("application/octet-stream");
}

/** Content-Disposition에서 파일명 추출 */
function pickFilenameFromCD(cd?: string, fallback = "deployment-bundle.zip") {
  if (!cd) return fallback;
  const m = /filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i.exec(cd);
  return decodeURIComponent((m?.[1] || m?.[2] || fallback));
}

/** 서버에서 내려올 수 있는 actions URL 키들 허용 */
function pickActionsUrl(json: any): string | undefined {
  return (
    json?.actions ||
    json?.github_actions ||
    json?.githubActions ||
    json?.actions_url ||
    json?.gitaction ||
    json?.workflow ||
    undefined
  );
}

/** presigned-url GET (텍스트) */
async function fetchTextByUrl(url?: string, label?: string) {
  if (!url) return null;
  try {
    const r = await axios.get(url, { responseType: "text", timeout: 60_000 });
    return r.data as string;
  } catch (e) {
    console.error(`[presigned GET fail] ${label ?? ""}`, url, e);
    return null;
  }
}

/** [1] 페이지 진입 즉시: /actions → {actions: presignedUrl} → 실제 YAML GET */
export async function fetchActionsYaml(cloud: Cloud): Promise<string> {
  const payload = buildPayload(cloud);
  const { data } = await apiClient.post<{ actions: string }>("/actions", payload, {
    headers: { "Content-Type": "application/json" },
    timeout: 60_000,
  });
  if (!data?.actions) throw new Error("actions presigned-url이 없습니다.");
  const resp = await axios.get<string>(data.actions, { responseType: "text", timeout: 60_000 });
  return resp.data;
}

/** [2] 버튼 클릭: /git-start → {terraform, cli, actions} presigned-url 3개 받아 ZIP 생성 */
export async function gitStartAndZip(cloud: Cloud): Promise<{ blob: Blob; filename: string }> {
  const payload = buildPayload(cloud);

  // /git-start는 가벼워야 함(파일 생성 금지). 타임아웃은 여유 있게.
  const res = await apiClient.post("/git-start", payload, {
    responseType: "blob",
    headers: { "Content-Type": "application/json" },
    timeout: 120_000,
  });

  const ct = (res.headers?.["content-type"] as string) || "";
  const cd = (res.headers?.["content-disposition"] as string) || "";

  // 서버가 ZIP을 직반환하면 그대로 저장
  if (looksLikeZipContentType(ct)) {
    const filename = pickFilenameFromCD(cd, `deployment-bundle-${cloud}.zip`);
    return { blob: res.data as Blob, filename };
  }

  // JSON으로 presigned-url 내려오는 케이스
  const raw = await (res.data as Blob).text();
  let json: any = {};
  try {
    json = JSON.parse(raw);
  } catch {
    return { blob: res.data as Blob, filename: "deployment-bundle.zip" };
  }

  const zip = new JSZip();

  // 3개 presigned-url 병렬 GET
  const [tf, cli, actFromGitStart] = await Promise.all([
    fetchTextByUrl(json.terraform, "terraform"),
    fetchTextByUrl(json.cli, "cli"),
    fetchTextByUrl(pickActionsUrl(json), "actions"),
  ]);

  // actions가 json에 없거나 GET 실패했다면 /actions로 보충 시도
  let actionsYaml = actFromGitStart;
  if (!actionsYaml) {
    try {
      actionsYaml = await fetchActionsYaml(cloud);
    } catch (e) {
      console.warn("[fallback /actions 실패] ZIP에 workflow 미포함 가능", e);
    }
  }

  // ZIP 구성
  if (tf) zip.file("terraform/main.tf", tf);
  if (cli) zip.file("cli/commands.txt", cli);
  if (actionsYaml) {
    // 1) GitHub가 자동 인식하는 표준 위치 (숨김 폴더)
    zip.file(".github/workflows/deploy.yml", actionsYaml);
    // 2) Finder 등에서 바로 보이도록 가시용 복사본
    zip.file("github-actions/deploy.yml", actionsYaml);
    // 필요하면 루트 복사본도 활성화
    // zip.file("deploy.yml", actionsYaml);
  } else {
    zip.file(
      "extras/actions-missing.txt",
      `No actions workflow included.\nTried keys: actions/github_actions/actions_url/gitaction/workflow\nraw: ${JSON.stringify(json, null, 2)}`
    );
  }

  if (!tf && !cli && !actionsYaml) {
    zip.file("README.txt", `No files found from /git-start.\nRaw: ${raw}`);
  }

  const blob = await zip.generateAsync({ type: "blob" });
  const filename = `deployment-bundle-${json.cloud ?? cloud}.zip`;
  return { blob, filename };
}
