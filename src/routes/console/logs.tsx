import { useEffect, useState, type CSSProperties, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CalendarClock, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, FileText, Filter, RotateCcw, Search } from "lucide-react";
import { getUsageLogPage } from "@/lib/fyt";
import { authEnabled } from "@/lib/auth/client";
import { formatNumber, formatUsd, maskKey } from "@/lib/format";
import { useLanguage } from "@/lib/language";
import { cn } from "@/lib/utils";
import { LogDetailsDrawer } from "@/components/console/log-details-drawer";

export const Route = createFileRoute("/console/logs")({ component: UsageLogsPage });

type StatusFilter = "all" | "ok" | "failed";
type Filters = { from: string; to: string; model: string; key: string; status: StatusFilter };
type LogRow = Awaited<ReturnType<typeof getUsageLogPage>>["rows"][number];
const rise = (i: number) => ({ "--ops-i": i }) as CSSProperties;
const demoRows: LogRow[] = [
  { id: -1, created_at: "2026-09-23T16:35:22.000Z", model: "GPT-5", api_key_last4: "8x2K", input_tokens: 12000, output_tokens: 4200, cost_cents: 32, status: "ok" },
  { id: -2, created_at: "2026-09-23T11:35:22.000Z", model: "Claude 4", api_key_last4: "8x2K", input_tokens: 13730, output_tokens: 4840, cost_cents: 37, status: "ok" },
  { id: -3, created_at: "2026-09-23T06:35:22.000Z", model: "Gemini 2.5", api_key_last4: "8x2K", input_tokens: 15460, output_tokens: 5480, cost_cents: 42, status: "ok" },
  { id: -4, created_at: "2026-09-23T01:35:22.000Z", model: "DeepSeek V3", api_key_last4: "8x2K", input_tokens: 17190, output_tokens: 6120, cost_cents: 46, status: "ok" },
  { id: -5, created_at: "2026-09-22T20:35:22.000Z", model: "Grok 3", api_key_last4: "8x2K", input_tokens: 18920, output_tokens: 6760, cost_cents: 51, status: "ok" },
  { id: -6, created_at: "2026-09-22T15:35:22.000Z", model: "Qwen 3", api_key_last4: "8x2K", input_tokens: 20650, output_tokens: 7400, cost_cents: 56, status: "ok" },
];

function localInput(date: Date) {
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function defaultRange(): Pick<Filters, "from" | "to"> {
  const now = new Date();
  const start = new Date(now);
  start.setDate(start.getDate() - 6);
  start.setHours(0, 0, 0, 0);
  return { from: localInput(start), to: localInput(now) };
}

function toIso(value: string) {
  return value ? new Date(value).toISOString() : undefined;
}

function UsageLogsPage() {
  const { language } = useLanguage();
  const zh = language === "zh";
  const [selectedLog, setSelectedLog] = useState<LogRow | null>(null);
  const [draft, setDraft] = useState<Filters>(() => ({ ...defaultRange(), model: "", key: "", status: "all" }));
  const [filters, setFilters] = useState<Filters>(() => ({ ...defaultRange(), model: "", key: "", status: "all" }));
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [moreOpen, setMoreOpen] = useState(false);
  const [result, setResult] = useState<Awaited<ReturnType<typeof getUsageLogPage>> | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let live = true;
    setFailed(false);
    void getUsageLogPage({
      data: {
        from: toIso(filters.from),
        to: toIso(filters.to),
        model: filters.model || undefined,
        key: filters.key || undefined,
        status: filters.status,
        page,
        pageSize,
      },
    }).then((value) => {
      if (live) setResult(value);
    }).catch(() => {
      if (live) setFailed(true);
    });
    return () => { live = false; };
  }, [filters, page, pageSize]);

  const mockRows = (!authEnabled || (result?.totalRows === 0 && !result.hasRealData))
    ? demoRows.filter((row) => {
        const time = new Date(row.created_at).getTime();
        const from = filters.from ? new Date(filters.from).getTime() : Number.NEGATIVE_INFINITY;
        const to = filters.to ? new Date(filters.to).getTime() : Number.POSITIVE_INFINITY;
        return time >= from && time <= to
          && (!filters.model || row.model.toLowerCase().includes(filters.model.trim().toLowerCase()))
          && (!filters.key || row.api_key_last4.toLowerCase() === filters.key.trim().slice(-4).toLowerCase())
          && (filters.status === "all" || (filters.status === "ok" ? row.status === "ok" : row.status !== "ok"));
      })
    : [];
  const isDemo = mockRows.length > 0 && (!authEnabled || (result?.totalRows === 0 && !result.hasRealData));
  const previewData = !authEnabled || isDemo;
  const rows = isDemo ? mockRows : result?.rows ?? [];
  const totalRows = isDemo ? mockRows.length : result?.totalRows ?? 0;
  const totalInput = isDemo ? mockRows.reduce((sum, row) => sum + row.input_tokens, 0) : result?.totalInput ?? 0;
  const totalOutput = isDemo ? mockRows.reduce((sum, row) => sum + row.output_tokens, 0) : result?.totalOutput ?? 0;
  const totalCost = isDemo ? mockRows.reduce((sum, row) => sum + row.cost_cents, 0) : result?.totalCostCents ?? 0;
  const visibleRows = isDemo ? rows.slice((page - 1) * pageSize, page * pageSize) : rows;
  const pages = Math.max(1, Math.ceil(totalRows / pageSize));
  const firstRow = totalRows ? (page - 1) * pageSize + 1 : 0;
  const lastRow = Math.min(page * pageSize, totalRows);
  const setField = (field: keyof Filters, value: string) => setDraft((current) => ({ ...current, [field]: value }));

  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPage(1);
    setFilters({ ...draft, key: draft.key.trim().slice(-4) });
  }

  function reset() {
    const clean = { ...defaultRange(), model: "", key: "", status: "all" as const };
    setDraft(clean);
    setFilters(clean);
    setPage(1);
  }

  return (
    <section className="ops-page logs-page">
      <header className="ops-head logs-head ops-rise" style={rise(0)}>
        <div>
          <p className="ops-kicker">{zh ? "请求记录" : "Request records"}</p>
          <h1 className="ops-title">{zh ? "使用日志" : "Usage logs"}</h1>
          <p className="ops-head-sub">{zh ? "按时间、模型和密钥查找每一次 API 调用。" : "Find API requests by time, model, or key."}</p>
        </div>
        <span className={cn("logs-live-mark", previewData && "is-demo")}><i aria-hidden="true" />{previewData ? (zh ? "演示数据 · 仅供预览" : "Sample data · preview only") : (zh ? "仅显示你的请求" : "Your requests only")}</span>
      </header>

      <form className="logs-filter ops-rise" style={rise(1)} onSubmit={search}>
        <div className="logs-filter-main">
          <label className="logs-field logs-date-field">
            <span>{zh ? "开始时间" : "From"}</span>
            <span className="logs-input-wrap"><CalendarClock size={16} aria-hidden="true" /><input type="datetime-local" value={draft.from} onChange={(event) => setField("from", event.target.value)} /></span>
          </label>
          <label className="logs-field logs-date-field">
            <span>{zh ? "结束时间" : "To"}</span>
            <span className="logs-input-wrap"><CalendarClock size={16} aria-hidden="true" /><input type="datetime-local" value={draft.to} onChange={(event) => setField("to", event.target.value)} /></span>
          </label>
          <label className="logs-field logs-model-field">
            <span>{zh ? "模型名称" : "Model"}</span>
            <input value={draft.model} onChange={(event) => setField("model", event.target.value)} placeholder={zh ? "搜索模型" : "Search models"} />
          </label>
          <button className={cn("logs-more-button", moreOpen && "is-open")} type="button" aria-expanded={moreOpen} onClick={() => setMoreOpen((open) => !open)}>
            <Filter size={16} aria-hidden="true" />{zh ? "更多筛选" : "More filters"}<ChevronRight size={15} aria-hidden="true" />
          </button>
          <div className="logs-filter-actions">
            <button className="logs-reset-button" type="button" onClick={reset}><RotateCcw size={15} aria-hidden="true" />{zh ? "重置" : "Reset"}</button>
            <button className="logs-search-button" type="submit"><Search size={16} aria-hidden="true" />{zh ? "搜索" : "Search"}</button>
          </div>
        </div>
        {moreOpen ? (
          <div className="logs-filter-extra">
            <label className="logs-field">
              <span>{zh ? "密钥末四位" : "Key suffix"}</span>
              <input value={draft.key} onChange={(event) => setField("key", event.target.value)} placeholder="e.g. 8x2K" maxLength={12} />
            </label>
            <label className="logs-field">
              <span>{zh ? "请求状态" : "Status"}</span>
              <select value={draft.status} onChange={(event) => setField("status", event.target.value)}>
                <option value="all">{zh ? "全部状态" : "All statuses"}</option>
                <option value="ok">{zh ? "成功" : "Successful"}</option>
                <option value="failed">{zh ? "失败" : "Failed"}</option>
              </select>
            </label>
            <p>{zh ? "密钥只显示末四位，不会暴露完整密钥。" : "Only the final four key characters are shown."}</p>
          </div>
        ) : null}
        <div className="logs-query-summary" aria-live="polite">
          <FileText size={16} aria-hidden="true" />
          <span>{zh ? "匹配记录" : "Matching requests"} <strong>{result ? formatNumber(totalRows) : "—"}</strong></span>
          <i />
          <span>{zh ? "累计费用" : "Total cost"} <strong>{result ? formatUsd(totalCost) : "—"}</strong></span>
          <i />
          <span>{zh ? "Token 总量" : "Tokens"} <strong>{result ? formatNumber(totalInput + totalOutput) : "—"}</strong></span>
        </div>
      </form>

      <section className="logs-table-panel ops-panel ops-rise" style={rise(2)} aria-label={zh ? "使用日志列表" : "Usage log list"}>
        {failed ? (
          <div className="logs-empty"><strong>{zh ? "日志暂时无法加载" : "Logs couldn't be loaded"}</strong><span>{zh ? "请检查筛选条件后重试。" : "Check your filters and try again."}</span><button type="button" onClick={reset}>{zh ? "重置筛选" : "Reset filters"}</button></div>
        ) : result === null ? (
          <div className="logs-skeleton" aria-hidden="true">{Array.from({ length: 6 }, (_, index) => <div className="ops-skel" key={index} />)}</div>
        ) : visibleRows.length === 0 ? (
          <div className="logs-empty"><strong>{zh ? "没有找到使用记录" : "No usage found"}</strong><span>{zh ? "试试放宽日期范围或清除部分筛选条件。" : "Try a wider date range or remove a filter."}</span><button type="button" onClick={reset}>{zh ? "清除筛选" : "Clear filters"}</button></div>
        ) : (
          <>
            <div className="logs-table-scroll">
              <table className="ops-table logs-table">
                <thead><tr>
                  <th>{zh ? "时间" : "Time"}</th>
                  <th>{zh ? "模型" : "Model"}</th>
                  <th>{zh ? "API 密钥" : "API key"}</th>
                  <th className="is-num">{zh ? "输入" : "Input"}</th>
                  <th className="is-num">{zh ? "输出" : "Output"}</th>
                  <th className="is-num">{zh ? "费用" : "Cost"}</th>
                  <th>{zh ? "状态" : "Status"}</th>
                </tr></thead>
                <tbody>{visibleRows.map((row) => (
                  <tr key={row.id}>
                    <td><time className="logs-time" dateTime={row.created_at}>{new Date(row.created_at).toLocaleTimeString(zh ? "zh-CN" : "en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })}</time><span className="logs-date">{new Date(row.created_at).toLocaleDateString(zh ? "zh-CN" : "en-US")}</span></td>
                    <td><span className="logs-model-chip"><i aria-hidden="true" />{row.model}</span></td>
                    <td><span className="logs-key-chip">{maskKey(row.api_key_last4)}</span></td>
                    <td className="is-num">{formatNumber(row.input_tokens)}</td>
                    <td className="is-num">{formatNumber(row.output_tokens)}</td>
                    <td className="is-num logs-cost">{formatUsd(row.cost_cents)}</td>
                    <td>
                      <div className="logs-status-cell">
                        <button
                          type="button"
                          className="logs-detail-btn"
                          onClick={() => setSelectedLog(row)}
                          title={zh ? "查看详情" : "View details"}
                        >
                          {zh ? "详情" : "Details"}
                        </button>
                        <span className={cn("ops-pill", row.status === "ok" ? "is-ok" : "is-off")}>
                          <i aria-hidden="true" />
                          {row.status === "ok" ? (zh ? "成功" : "Success") : (zh ? "失败" : "Failed")}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
            <footer className="logs-pagination">
              <span>{zh ? `显示 ${firstRow}–${lastRow} 条，共 ${totalRows} 条` : `Showing ${firstRow}–${lastRow} of ${totalRows}`}</span>
              <label>{zh ? "每页" : "Rows"}<select value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); setPage(1); }}><option value={10}>10</option><option value={25}>25</option><option value={50}>50</option><option value={100}>100</option></select></label>
              <div className="logs-page-buttons">
                <button type="button" aria-label={zh ? "第一页" : "First page"} disabled={page <= 1} onClick={() => setPage(1)}><ChevronsLeft size={16} /></button>
                <button type="button" aria-label={zh ? "上一页" : "Previous page"} disabled={page <= 1} onClick={() => setPage((value) => value - 1)}><ChevronLeft size={16} /></button>
                <span>{page} / {pages}</span>
                <button type="button" aria-label={zh ? "下一页" : "Next page"} disabled={page >= pages} onClick={() => setPage((value) => value + 1)}><ChevronRight size={16} /></button>
                <button type="button" aria-label={zh ? "最后一页" : "Last page"} disabled={page >= pages} onClick={() => setPage(pages)}><ChevronsRight size={16} /></button>
              </div>
            </footer>
          </>
        )}
      </section>

      <LogDetailsDrawer
        open={Boolean(selectedLog)}
        onOpenChange={(open) => {
          if (!open) setSelectedLog(null);
        }}
        log={selectedLog}
        zh={zh}
      />
    </section>
  );
}
