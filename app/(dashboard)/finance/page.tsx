"use client";

import { useMemo, useState } from "react";
import { Card } from "@/app/components/ui/Card";

type Holding = {
  acct: string; // e.g., "F", "CS"
  symbol: string;
  name: string;
  qty: number;
  last: number | null;
  mktValue: number | null;
  gainLoss: number | null;
  gainLossPct: number | null; // 0.1234 = 12.34%
  costBasis: number | null;
  avgCost: number | null;
};

// Hardcoded from Portfolio_Positions_Dec-17-2025.csv (Phase 1)
const HOLDINGS: Holding[] = [
  {
    acct: "CS",
    symbol: "NVDA",
    name: "NVIDIA CORPORATION COM",
    qty: 3,
    last: 133.35,
    mktValue: 400.05,
    gainLoss: 123.67,
    gainLossPct: 0.4476,
    costBasis: 276.38,
    avgCost: 92.1267
  },
  {
    acct: "CS",
    symbol: "GOOG",
    name: "ALPHABET INC CAP STK CL C",
    qty: 14,
    last: 213.14,
    mktValue: 2983.96,
    gainLoss: 189.9,
    gainLossPct: 0.0679,
    costBasis: 2794.06,
    avgCost: 199.5757
  },
  {
    acct: "CS",
    symbol: "LULU",
    name: "LULULEMON ATHLETICA INC COM",
    qty: 4,
    last: 365.76,
    mktValue: 1463.04,
    gainLoss: -126.96,
    gainLossPct: -0.0799,
    costBasis: 1590,
    avgCost: 397.5
  },
  {
    acct: "CS",
    symbol: "SCHD",
    name: "SCHWAB STRATEGIC TR US DIVIDEND EQUITY ETF",
    qty: 16,
    last: 64.48,
    mktValue: 1031.68,
    gainLoss: 2.4,
    gainLossPct: 0.0023,
    costBasis: 1029.28,
    avgCost: 64.33
  },
  {
    acct: "CS",
    symbol: "SFM",
    name: "SPROUTS FARMERS MARKET INC COM",
    qty: 6,
    last: 162.07,
    mktValue: 972.42,
    gainLoss: -264.58,
    gainLossPct: -0.2138,
    costBasis: 1237,
    avgCost: 206.1667
  },
  {
    acct: "CS",
    symbol: "AMD",
    name: "ADVANCED MICRO DEVICES INC COM",
    qty: 4,
    last: 131.31,
    mktValue: 525.24,
    gainLoss: 190.14,
    gainLossPct: 0.5681,
    costBasis: 335.1,
    avgCost: 83.775
  },
  {
    acct: "CS",
    symbol: "PLTR",
    name: "PALANTIR TECHNOLOGIES INC CL A",
    qty: 4,
    last: 75.31,
    mktValue: 301.24,
    gainLoss: 165.06,
    gainLossPct: 1.2129,
    costBasis: 136.18,
    avgCost: 34.045
  },
  {
    acct: "CS",
    symbol: "SOFI",
    name: "SOFI TECHNOLOGIES INC COM",
    qty: 10,
    last: 16.49,
    mktValue: 164.9,
    gainLoss: 96.7,
    gainLossPct: 1.4195,
    costBasis: 68.2,
    avgCost: 6.82
  },
  {
    acct: "CS",
    symbol: "RGTI",
    name: "RIGETTI COMPUTING INC COM",
    qty: 20,
    last: 5.79,
    mktValue: 115.8,
    gainLoss: 35.8,
    gainLossPct: 0.4481,
    costBasis: 80,
    avgCost: 4
  },
  {
    acct: "F",
    symbol: "WASYX",
    name: "WASATCH CORE GROWTH FUND",
    qty: 305.491,
    last: 63.65,
    mktValue: 19444.18,
    gainLoss: 2917.62,
    gainLossPct: 0.1764,
    costBasis: 16526.56,
    avgCost: 54.1023
  },
  {
    acct: "CS",
    symbol: "HIMS",
    name: "HIMS & HERS HEALTH INC CL A",
    qty: 20,
    last: 15.26,
    mktValue: 305.2,
    gainLoss: -239.8,
    gainLossPct: -0.4401,
    costBasis: 545,
    avgCost: 27.25
  },
  {
    acct: "CS",
    symbol: "CRWV",
    name: "COREWEAVE INC COM CL A",
    qty: 2,
    last: 58.37,
    mktValue: 116.74,
    gainLoss: -89.26,
    gainLossPct: -0.4349,
    costBasis: 206,
    avgCost: 103
  },
  {
    acct: "CS",
    symbol: "FETH",
    name: "FIDELITY ETHEREUM FUND",
    qty: 5,
    last: 25.58,
    mktValue: 127.9,
    gainLoss: -69.5,
    gainLossPct: -0.3519,
    costBasis: 197.4,
    avgCost: 39.48
  },
  {
    acct: "CS",
    symbol: "SMCI",
    name: "SUPER MICRO COMPUTER INC COM",
    qty: 1,
    last: 35.6,
    mktValue: 35.6,
    gainLoss: -16.5,
    gainLossPct: -0.3171,
    costBasis: 52.1,
    avgCost: 52.1
  }
];

function fmtMoney(n: number | null | undefined) {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function fmtPct(p: number | null | undefined) {
  if (p === null || p === undefined || Number.isNaN(p)) return "—";
  return `${(p * 100).toFixed(2)}%`;
}

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export default function FinancePage() {
  const [q, setQ] = useState("");
  const [acct, setAcct] = useState<"ALL" | "F" | "CS">("ALL");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return HOLDINGS.filter((h) => {
      const acctOk = acct === "ALL" ? true : h.acct === acct;
      const qOk =
        !query ||
        h.symbol.toLowerCase().includes(query) ||
        h.name.toLowerCase().includes(query);
      return acctOk && qOk;
    }).sort((a, b) => (b.mktValue ?? 0) - (a.mktValue ?? 0));
  }, [q, acct]);

  const totals = useMemo(() => {
    const mkt = filtered.reduce((s, h) => s + (h.mktValue ?? 0), 0);
    const gl = filtered.reduce((s, h) => s + (h.gainLoss ?? 0), 0);
    const cost = filtered.reduce((s, h) => s + (h.costBasis ?? 0), 0);
    const glPct = cost > 0 ? gl / cost : 0;
    return { mkt, gl, cost, glPct };
  }, [filtered]);

  const movers = useMemo(() => {
    const withPct = filtered.filter((h) => typeof h.gainLossPct === "number");
    const sorted = [...withPct].sort((a, b) => (b.gainLossPct ?? 0) - (a.gainLossPct ?? 0));
    return {
      gainers: sorted.slice(0, 5),
      losers: sorted.slice(-5).reverse()
    };
  }, [filtered]);

  return (
    <div className="grid" style={{ gap: 18 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <div>
          <div className="muted" style={{ letterSpacing: 1, fontWeight: 800 }}>FINANCE</div>
          <div style={{ fontSize: 34, fontWeight: 900, marginTop: 6 }}>Portfolio Snapshot</div>
          <div className="muted" style={{ marginTop: 6 }}>
            Phase 1 = hardcoded holdings from standardized spreadsheet. Phase 2 = live quotes + scoring + signals.
          </div>
        </div>

        <div className="badge" style={{ padding: "10px 14px" }}>
          Holdings: <span style={{ fontWeight: 900, marginLeft: 6 }}>{filtered.length}</span>
        </div>
      </div>

      <Card
        className="tile-command"
        title="PORTFOLIO SUMMARY"
        subtitle="Totals across selected holdings"
        right={
          <div style={{ display: "flex", gap: 10 }}>
            <span className="badge">Acct:&nbsp;
              <select
                value={acct}
                onChange={(e) => setAcct(e.target.value as any)}
                style={{ background: "transparent", border: "none", color: "inherit", fontWeight: 900 }}
              >
                <option value="ALL">ALL</option>
                <option value="F">F</option>
                <option value="CS">CS</option>
              </select>
            </span>

            <input
              className="input"
              placeholder="Search symbol or name…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              style={{ width: 320 }}
            />
          </div>
        }
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div className="badge" style={{ padding: 14 }}>
            <div className="muted" style={{ fontWeight: 800 }}>Market Value</div>
            <div style={{ fontSize: 28, fontWeight: 950, marginTop: 6 }}>{fmtMoney(totals.mkt)}</div>
            <div className="muted" style={{ marginTop: 6 }}>Total value of selected positions</div>
          </div>

          <div className="badge" style={{ padding: 14 }}>
            <div className="muted" style={{ fontWeight: 800 }}>Total Gain/Loss</div>
            <div
              style={{ fontSize: 28, fontWeight: 950, marginTop: 6 }}
              className={cx(totals.gl >= 0 ? "pos" : "neg")}
            >
              {fmtMoney(totals.gl)}
            </div>
            <div className="muted" style={{ marginTop: 6 }}>
              Since cost basis • {fmtPct(totals.glPct)}
            </div>
          </div>
        </div>
      </Card>

      <div className="grid" style={{ gridTemplateColumns: "2fr 1fr", gap: 18 }}>
        <Card className="tile-command" title="HOLDINGS" subtitle="Hardcoded from standardized spreadsheet (Phase 1)">
          <div style={{ overflowX: "auto" }}>
            <table className="table" style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr className="muted" style={{ textAlign: "left" }}>
                  <th style={{ padding: "10px 10px" }}>Acct</th>
                  <th style={{ padding: "10px 10px" }}>Symbol</th>
                  <th style={{ padding: "10px 10px" }}>Description</th>
                  <th style={{ padding: "10px 10px", textAlign: "right" }}>Qty</th>
                  <th style={{ padding: "10px 10px", textAlign: "right" }}>Last</th>
                  <th style={{ padding: "10px 10px", textAlign: "right" }}>Mkt Value</th>
                  <th style={{ padding: "10px 10px", textAlign: "right" }}>P/L $</th>
                  <th style={{ padding: "10px 10px", textAlign: "right" }}>P/L %</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((h) => {
                  const gl = h.gainLoss ?? 0;
                  return (
                    <tr key={`${h.acct}-${h.symbol}`} className="row">
                      <td style={{ padding: "10px 10px" }}>
                        <span className="badge" style={{ padding: "4px 8px" }}>{h.acct}</span>
                      </td>
                      <td style={{ padding: "10px 10px", fontWeight: 950 }}>{h.symbol}</td>
                      <td style={{ padding: "10px 10px" }}>{h.name}</td>
                      <td style={{ padding: "10px 10px", textAlign: "right" }}>{h.qty.toLocaleString()}</td>
                      <td style={{ padding: "10px 10px", textAlign: "right" }}>{fmtMoney(h.last)}</td>
                      <td style={{ padding: "10px 10px", textAlign: "right" }}>{fmtMoney(h.mktValue)}</td>
                      <td
                        style={{ padding: "10px 10px", textAlign: "right", fontWeight: 900 }}
                        className={cx(gl >= 0 ? "pos" : "neg")}
                      >
                        {fmtMoney(h.gainLoss)}
                      </td>
                      <td
                        style={{ padding: "10px 10px", textAlign: "right", fontWeight: 900 }}
                        className={cx((h.gainLossPct ?? 0) >= 0 ? "pos" : "neg")}
                      >
                        {fmtPct(h.gainLossPct)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        <div style={{ display: "grid", gap: 18 }}>
          <Card className="tile-markets" title="TOP GAINERS" subtitle="By total gain/loss % (Phase 1)">
            <div className="vlist">
              {movers.gainers.map((h) => (
                <div key={h.symbol} className="vrow">
                  <div style={{ fontWeight: 950 }}>{h.symbol}</div>
                  <div className="pos" style={{ fontWeight: 950 }}>{fmtPct(h.gainLossPct)}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="tile-markets" title="TOP LOSERS" subtitle="By total gain/loss % (Phase 1)">
            <div className="vlist">
              {movers.losers.map((h) => (
                <div key={h.symbol} className="vrow">
                  <div style={{ fontWeight: 950 }}>{h.symbol}</div>
                  <div className="neg" style={{ fontWeight: 950 }}>{fmtPct(h.gainLossPct)}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="tile-month" title="NEXT ENHANCEMENTS" subtitle="Your Phase 2 path">
            <div className="vlist">
              <div className="muted">Live quotes via your <code>/api/markets</code> route</div>
              <div className="muted">Scoring model column + “Action” column</div>
              <div className="muted">Pullback detection + DCA suggestions</div>
              <div className="muted">Account rollups (F vs CS)</div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
