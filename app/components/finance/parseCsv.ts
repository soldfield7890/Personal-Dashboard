"use client";

export type Holding = {
  symbol: string;
  name?: string;
  shares?: number;
  costBasis?: number;
  lastPrice?: number;
  value?: number;
  score?: number; // stub score
};

function toNum(v: string): number | undefined {
  const s = (v ?? "").toString().replace(/[$,]/g, "").trim();
  if (!s) return undefined;
  const n = Number(s);
  return Number.isFinite(n) ? n : undefined;
}

/**
 * Minimal CSV parser with quote handling.
 * Good enough for most brokerage exports (headers + rows).
 */
export function parseCsv(text: string): { headers: string[]; rows: Record<string, string>[] } {
  const lines: string[][] = [];
  let cur = "";
  let row: string[] = [];
  let inQuotes = false;

  const pushCell = () => {
    row.push(cur);
    cur = "";
  };

  const pushRow = () => {
    // ignore fully empty trailing lines
    if (row.length === 1 && row[0].trim() === "") {
      row = [];
      return;
    }
    lines.push(row);
    row = [];
  };

  for (let i = 0; i < text.length; i++) {
    const c = text[i];

    if (c === '"') {
      const next = text[i + 1];
      if (inQuotes && next === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (!inQuotes && c === ",") {
      pushCell();
      continue;
    }

    if (!inQuotes && c === "\n") {
      pushCell();
      pushRow();
      continue;
    }

    if (!inQuotes && c === "\r") {
      // ignore CR (Windows line endings)
      continue;
    }

    cur += c;
  }

  // flush last cell/row
  pushCell();
  if (row.length) pushRow();

  const [headerRow, ...dataRows] = lines;
  const headers = (headerRow ?? []).map((h) => (h ?? "").trim()).filter(Boolean);

  const rows = dataRows
    .filter((r) => r.some((x) => (x ?? "").trim() !== ""))
    .map((r) => {
      const obj: Record<string, string> = {};
      headers.forEach((h, idx) => {
        obj[h] = (r[idx] ?? "").trim();
      });
      return obj;
    });

  return { headers, rows };
}

export function rowsToHoldings(rows: Record<string, string>[]): Holding[] {
  // Try common header names (you can extend later)
  const pick = (r: Record<string, string>, keys: string[]) => {
    for (const k of keys) if (r[k] != null && r[k] !== "") return r[k];
    return "";
  };

  return rows
    .map((r) => {
      const symbol = pick(r, ["Symbol", "Ticker", "symbol", "ticker"]).toUpperCase();
      if (!symbol) return null;

      const name = pick(r, ["Description", "Name", "Security", "Security Name", "name"]);
      const shares = toNum(pick(r, ["Quantity", "Shares", "shares", "Qty"]));
      const lastPrice = toNum(pick(r, ["Last Price", "Price", "Last", "Market Price", "price"]));
      const value = toNum(pick(r, ["Current Value", "Market Value", "Value", "marketValue", "value"]));
      const costBasis = toNum(pick(r, ["Cost Basis", "Cost", "Total Cost", "costBasis", "cost"]));

      // Stub score for now: prefer value-weighted placeholder
      const score = value ? Math.round(Math.min(100, Math.max(0, (Math.log10(value + 1) * 20)))) : undefined;

      return { symbol, name, shares, lastPrice, value, costBasis, score } as Holding;
    })
    .filter(Boolean) as Holding[];
}
