import { useState, useId } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Check, Copy, Route, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LogRowData {
  id: number;
  created_at: string;
  model: string;
  api_key_last4: string;
  input_tokens: number;
  output_tokens: number;
  cost_cents: number;
  status: string;
}

export interface LogDetailsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  log: LogRowData | null;
  zh?: boolean;
}

function DetailRow({
  label,
  value,
  mono = false,
  customValue,
}: {
  label: React.ReactNode;
  value?: React.ReactNode;
  mono?: boolean;
  customValue?: React.ReactNode;
}) {
  return (
    <div className="grid min-w-0 grid-cols-[5.5rem_minmax(0,1fr)] sm:grid-cols-[7rem_minmax(0,1fr)] items-center gap-2 py-1 text-xs">
      <span className="text-[#6F737B] min-w-0 text-xs font-normal">
        {label}
      </span>
      <div
        className={cn(
          "max-w-full min-w-0 text-xs break-all text-[#16181D]",
          mono && "font-mono text-[11.5px]"
        )}
      >
        {customValue || value}
      </div>
    </div>
  );
}

function DetailSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0 space-y-1.5">
      <div className="text-xs font-semibold text-[#16181D]">
        {label}
      </div>
      <div className="min-w-0 space-y-2 overflow-hidden rounded-2xl border border-[rgba(17,24,39,0.065)] bg-[rgba(247,248,250,0.65)] p-3.5 transition-colors">
        {children}
      </div>
    </div>
  );
}

export function LogDetailsDrawer({
  open,
  onOpenChange,
  log,
  zh = true,
}: LogDetailsDrawerProps) {
  const [copied, setCopied] = useState(false);
  const titleId = useId();
  const descId = useId();

  if (!log) return null;

  const isOk = log.status === "ok";
  const isFirstRowSample = log.id === -1 || log.model === "GPT-5";

  // Faithfully reconstruct prototype data matching Image 2
  const requestId = isFirstRowSample
    ? "20260924035729711687679afedfe40EqYWBdw2"
    : `20260924${new Date(log.created_at).getTime().toString().slice(-8)}afedfe40EqYWB${Math.abs(log.id)}`;
  const channel = "7（官方正版）";
  const retryChain = "7";
  const tokenName = isFirstRowSample ? "管理员账号" : `${zh ? "默认分组密钥" : "Default Key"} (···${log.api_key_last4})`;
  const group = "default";
  const responseTime = isFirstRowSample ? "34.0s (FRT: 8.4s)" : `${(log.input_tokens / 8000 + 0.8).toFixed(1)}s (FRT: ${(log.input_tokens / 30000 + 0.3).toFixed(1)}s)`;
  const path = "/v1/responses";
  const conversionFormat = zh ? "原生格式" : "Native format";
  const reasoningEffort = "high";

  // Token breakdown
  const inputTokens = isFirstRowSample ? 329702 : log.input_tokens;
  const outputTokens = isFirstRowSample ? 7250 : log.output_tokens;
  const cacheTokens = isFirstRowSample ? 329344 : Math.floor(inputTokens * 0.78);

  // Billing breakdown
  const billingMode = zh ? "动态计费" : "Dynamic Pricing";
  const matchedTier = "peak";
  const inputPrice = "$0.3/M";
  const outputPrice = "$1.2/M";
  const cachePrice = "$0.006/M";
  const billingPath = zh ? "上游返回" : "Upstream Response";
  const totalCost = isFirstRowSample ? "$0.00647" : `$${(log.cost_cents / 100).toFixed(5)}`;

  const tiers = [
    {
      label: "peak",
      isMatched: true,
      input: "$0.0003",
      output: "$0.0012",
      cache: "$0.0000",
    },
    {
      label: "off_peak",
      isMatched: false,
      input: "$0.0001",
      output: "$0.0006",
      cache: "$0.0000",
    },
  ];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/25 backdrop-blur-[2px] transition-opacity data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          aria-labelledby={titleId}
          aria-describedby={descId}
          className="fixed inset-y-0 right-0 z-50 flex flex-col h-full w-full max-w-[560px] md:max-w-[620px] bg-white border-l border-[rgba(17,24,39,0.08)] shadow-[-12px_0_36px_rgba(0,0,0,0.1)] rounded-l-3xl overflow-hidden focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right duration-250 ease-out"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-[rgba(17,24,39,0.06)] bg-[rgba(247,248,250,0.65)] shrink-0">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Dialog.Title id={titleId} className="text-[17px] font-semibold text-[#16181D]">
                  {zh ? "日志详情" : "Log Details"}
                </Dialog.Title>
                <span
                  className={cn(
                    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                    isOk
                      ? "bg-[#ecfdf5] text-[#059669] border-[#a7f3d0]/80"
                      : "bg-[#fef2f2] text-[#dc2626] border-[#fecaca]"
                  )}
                >
                  {isOk ? (zh ? "消耗" : "Consume") : (zh ? "失败" : "Failed")}
                </span>
              </div>
              <Dialog.Description id={descId} className="text-xs text-[#6F737B]">
                {zh ? "查看此日志条目的完整详情" : "View the complete details for this log entry"}
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                className="p-1.5 text-[#8a8f98] hover:text-[#16181D] hover:bg-black/5 rounded-full transition-colors cursor-pointer"
                aria-label={zh ? "关闭" : "Close"}
              >
                <X className="size-4" />
              </button>
            </Dialog.Close>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* Overview Meta */}
            <div className="min-w-0 space-y-0.5">
              <DetailRow label={zh ? "请求 ID" : "Request ID"} value={requestId} mono />
              <DetailRow label={zh ? "渠道" : "Channel"} value={channel} mono />
              <DetailRow label={zh ? "重试链路" : "Retry Chain"} value={retryChain} mono />
              <DetailRow label={zh ? "令牌" : "Token"} value={tokenName} mono />
              <DetailRow label={zh ? "分组" : "Group"} value={group} mono />
              <DetailRow
                label={zh ? "响应时间" : "Response Time"}
                customValue={<span className="text-emerald-600 font-medium">{responseTime}</span>}
              />
            </div>

            {/* Request Conversion */}
            <DetailSection label={zh ? "请求转换" : "Request Conversion"}>
              <div className="relative min-w-0">
                <button
                  type="button"
                  className="absolute top-0 right-0 p-1 text-[#8a8f98] hover:text-[#16181D] hover:bg-black/5 rounded transition-colors cursor-pointer"
                  onClick={() => handleCopy(path)}
                  title={zh ? "复制路径" : "Copy path"}
                  aria-label={zh ? "复制路径" : "Copy path"}
                >
                  {copied ? (
                    <Check className="size-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="size-3.5" />
                  )}
                </button>
                <div className="min-w-0 space-y-1.5 pr-6">
                  <DetailRow label={zh ? "路径" : "Path"} value={path} mono />
                  <div className="flex min-w-0 items-center gap-1.5 text-xs text-[#6F737B] pt-0.5">
                    <Route className="size-3.5 text-[#8a8f98] shrink-0" aria-hidden="true" />
                    <span>{conversionFormat}</span>
                  </div>
                </div>
              </div>
            </DetailSection>

            {/* Reasoning Effort */}
            <div className="min-w-0">
              <DetailRow
                label={zh ? "推理强度" : "Reasoning Effort"}
                customValue={<span className="text-amber-600 font-medium">{reasoningEffort}</span>}
              />
            </div>

            {/* Token Breakdown */}
            <DetailSection label={zh ? "Token 明细" : "Token Breakdown"}>
              <DetailRow
                label={zh ? "输入 Token" : "Input Tokens"}
                value={inputTokens.toLocaleString()}
                mono
              />
              <DetailRow
                label={zh ? "输出 Token" : "Output Tokens"}
                value={outputTokens.toLocaleString()}
                mono
              />
              <DetailRow
                label={zh ? "缓存读取" : "Cache Read"}
                value={cacheTokens.toLocaleString()}
                mono
              />
            </DetailSection>

            {/* Billing Details */}
            <DetailSection label={zh ? "计费详情" : "Billing Details"}>
              <DetailRow label={zh ? "计费模式" : "Billing Mode"} value={billingMode} />
              <DetailRow label={zh ? "命中阶梯" : "Matched Tier"} value={matchedTier} mono />
              <DetailRow label={zh ? "输入" : "Input"} value={inputPrice} mono />
              <DetailRow label={zh ? "输出" : "Output"} value={outputPrice} mono />
              <DetailRow label={zh ? "缓存读取" : "Cache Read"} value={cachePrice} mono />
              <DetailRow label={zh ? "计费路径" : "Billing Path"} value={billingPath} />
              <DetailRow label={zh ? "总费用" : "Total Cost"} value={totalCost} mono />
            </DetailSection>

            {/* Dynamic Pricing Table */}
            <DetailSection label={zh ? "动态计费" : "Dynamic Pricing"}>
              <div className="text-xs font-semibold text-[#16181D] mb-1.5">
                {zh ? "分档价格表" : "Tiered price table"}
              </div>
              <div className="overflow-x-auto rounded-xl border border-[rgba(17,24,39,0.05)] bg-white/50">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="text-[#6F737B] border-b border-[rgba(17,24,39,0.06)] bg-black/[0.015]">
                      <th className="py-2.5 px-3 font-normal">{zh ? "档位" : "Tier"}</th>
                      <th className="py-2.5 px-3 font-normal">{zh ? "输入" : "Input"}</th>
                      <th className="py-2.5 px-3 font-normal">{zh ? "输出" : "Output"}</th>
                      <th className="py-2.5 px-3 font-normal">{zh ? "缓存读取" : "Cache Read"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tiers.map((t, index) => (
                      <tr
                        key={index}
                        className={cn(
                          "border-b border-[rgba(17,24,39,0.035)] last:border-0 transition-colors",
                          t.isMatched
                            ? "bg-[#ecfdf5]/80 text-[#064e3b]"
                            : "hover:bg-black/[0.015] text-[#16181D]"
                        )}
                      >
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5">
                            <span className="inline-block px-2 py-0.5 rounded-full text-xs font-mono font-medium bg-[#eff6ff] text-[#2563eb]">
                              {t.label}
                            </span>
                            {t.isMatched && (
                              <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0]">
                                {zh ? "已命中" : "Matched"}
                              </span>
                            )}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-[11.5px]">{t.input}</td>
                        <td className="py-2.5 px-3 font-mono text-[11.5px]">{t.output}</td>
                        <td className="py-2.5 px-3 font-mono text-[11.5px]">{t.cache}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </DetailSection>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
