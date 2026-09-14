import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { getDashboard } from "@/lib/fyt";
import { formatNumber, formatTokens, formatYuan } from "@/lib/format";

export const Route = createFileRoute("/console/")({ component: Overview });

function Overview() {
  const user = useCurrentUser();
  const [data, setData] = useState<Awaited<ReturnType<typeof getDashboard>> | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    void getDashboard()
      .then(setData)
      .catch(() => setFailed(true));
  }, []);

  const name = user?.displayName?.split(" ")[0] ?? "there";

  return (
    <section className="console-page">
      <p className="console-kicker">Console</p>
      <h1 className="console-hello">Welcome back, {name}.</h1>
      {failed ? (
        <p className="console-muted">Unable to load workspace.</p>
      ) : data ? (
        <>
          <p className="console-balance">{formatYuan(data.balanceCents)}</p>
          <p className="console-balance-label">Balance</p>
          <dl className="console-stats">
            <div>
              <dt>Today spend</dt>
              <dd>{formatYuan(data.todaySpendCents)}</dd>
            </div>
            <div>
              <dt>Requests</dt>
              <dd>{formatNumber(data.requests)}</dd>
            </div>
            <div>
              <dt>Tokens</dt>
              <dd>{formatTokens(data.tokens)}</dd>
            </div>
            <div>
              <dt>Success</dt>
              <dd>{(data.successBps / 100).toFixed(2)}%</dd>
            </div>
          </dl>
        </>
      ) : (
        <p className="console-muted">Loading workspace…</p>
      )}
    </section>
  );
}
