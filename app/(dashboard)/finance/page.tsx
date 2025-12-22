"use client";

import React, { useMemo, useState } from "react";

type Holding = {
  symbol: string;
  name: string;
  account?: string;
  shares?: number;
  costBasis?: number;
  marketValue?: number;
};

const HOLDINGS: Holding[] = [
  { symbol: "GOOG", name: "Alphabet" },
  { symbol: "NVDA", name: "NVIDIA" },
  { symbol: "AMD", name: "Advanced Micro" },
  { symbol: "PLTR", name: "Palantir" },
  { symbol: "SCHD", name: "Dividend ETF" },
  { symbol: "HIMS", name: "Hims & Hers" },
  { symbol: "WASYX", name: "Core Growth" },
];

function money(n: number) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

export default function FinancePage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return HOLDINGS;
    return HOLDINGS.filter(
      (h) =>
        h.symbol.toLowerCase().includes(q) ||
        h.name.toLowerCase().includes(q)
    );
  }, [query]);

  // Phase 1 values (static placeholders to keep the UI working)
  const marketValue = 27987.95;
  const totalGain = 2914.69;

  return (
    <div className="page">
      <div className="card headerCard">
        <div>
          <div className="kicker">FINANCE</div>
          <div className="title">Portfolio Snapshot</div>
        </div>

        <div className="pillRow">
          <span className="pill">Phase 1 · static</span>
          <span className="pill good">Ready for live data</span>
        </div>
      </div>

      <div className="financeTop">
        <div className="card stat">
          <div className="cardTitle">MARKET VALUE</div>
          <div className="statValue">{money(marketValue)}</div>
        </div>

        <div className="card stat">
          <div className="cardTitle">PERFORMANCE</div>
          <div className="statValue goodText">+{money(totalGain)}</div>
        </div>

        <div className="card stat">
          <div className="cardTitle">HOLDINGS</div>
          <div className="muted">Search and scroll</div>
          <input
            className="input"
            value={query}
            placeholder="Search symbol or name…"
            onChange={(e) => setQuery(e.target.value)}
            style={{ marginTop: 10 }}
          />
        </div>
      </div>

      <div className="card tableCard">
        <div className="tableWrap">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: 140 }}>Symbol</th>
                <th>Name</th>
                <th style={{ width: 160 }} className="right">
                  Phase
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((h) => (
                <tr key={h.symbol}>
                  <td className="strong">{h.symbol}</td>
                  <td>{h.name}</td>
                  <td className="right muted">Phase 1</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={3} className="muted" style={{ padding: 16 }}>
                    No matches.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
