import type { TfStartResponse } from "../types/api";
import type { CloudOption } from "../stores/expedition.types";

const label = { aws: "AWS", gcp: "GCP", azure: "Azure" } as const;
const logo  = { aws: "/assets/aws.svg", gcp: "/assets/gcp.svg", azure: "/assets/azure.svg" } as const;

async function fetchText(url?: string): Promise<string> {
  if (!url) return "";
  const res = await fetch(url);
  if (!res.ok) throw new Error(`fetch ${url} -> ${res.status}`);
  const text = await res.text();
  // 너무 길면 일부만 표시(필요 없으면 잘라내기 제거 가능)
  return text.slice(0, 50_000);
}

/**
 * /tf-start의 최종 응답({ costs, terraform_urls })을
 * 화면 표시용 CloudOption[]으로 변환.
 * presigned .tf를 즉시 GET해서 terraformCode에 담아줌.
 */
export async function toCloudOptionsForDisplay(resp: TfStartResponse): Promise<CloudOption[]> {
  const urls = resp.terraform_urls ?? {};
  const costs = resp.costs ?? {};

  // 병렬로 .tf 텍스트 수집
  const [awsTf, gcpTf, azTf] = await Promise.all([
    fetchText(urls.aws).catch(() => ""),
    fetchText(urls.gcp).catch(() => ""),
    fetchText(urls.azure).catch(() => ""),
  ]);

  return [
    {
      provider: label.aws,
      logo: logo.aws,
      estimatedCost: costs.aws ? `$${Number(costs.aws).toFixed(2)}` : "N/A",
      terraformCode: awsTf || "// No terraform content",
    },
    {
      provider: label.azure,
      logo: logo.azure,
      estimatedCost: costs.azure ? `$${Number(costs.azure).toFixed(2)}` : "N/A",
      terraformCode: azTf || "// No terraform content",
    },
    {
      provider: label.gcp,
      logo: logo.gcp,
      estimatedCost: costs.gcp ? `$${Number(costs.gcp).toFixed(2)}` : "N/A",
      terraformCode: gcpTf || "// No terraform content",
    },
  ];
}
