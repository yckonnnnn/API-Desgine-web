import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { addFunds, getWallet } from "@/lib/fyt";
import { formatYuan } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/console/wallet")({ component: WalletPage });

const AMOUNTS = [50, 100, 200, 500, 1000];

function WalletPage() {
  const [balance, setBalance] = useState<number | null>(null);
  const [amount, setAmount] = useState(100);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    void getWallet()
      .then((w) => setBalance(w.balanceCents))
      .catch(() => setBalance(0));
  }, []);

  const index = AMOUNTS.indexOf(amount);

  return (
    <section className="console-page wallet-page">
      <p className="console-kicker">Wallet</p>
      <h1 className="console-title">Balance</h1>
      <p className="console-balance">{balance == null ? "—" : formatYuan(balance)}</p>
      <p className="amount-label">Add funds</p>
      <div className="amount-track">
        <span className="amount-liquid" style={{ transform: `translateX(${index * 100}%)` }} />
        {AMOUNTS.map((item) => (
          <button
            key={item}
            type="button"
            className={cn("amount-btn", amount === item && "is-on")}
            onClick={() => setAmount(item)}
          >
            ¥{item}
          </button>
        ))}
      </div>
      <button
        type="button"
        className="btn-ink"
        disabled={busy}
        onClick={() => {
          setBusy(true);
          setNote(null);
          void addFunds({ data: amount })
            .then((w) => {
              setBalance(w.balanceCents);
              setNote(`Added ${formatYuan(amount * 100)}.`);
            })
            .catch(() => setNote("Unable to add funds."))
            .finally(() => setBusy(false));
        }}
      >
        {busy ? "Adding…" : "Add funds"}
      </button>
      {note ? <p className="console-muted wallet-note">{note}</p> : null}
    </section>
  );
}
