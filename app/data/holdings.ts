// app/data/holdings.ts

export type Broker = "Fidelity" | "Schwab";

export type Holding = {
  broker: Broker;
  symbol: string;
  name: string;
  quantity: number;
  price?: number; // optional (depends on CSV)
  marketValue?: number; // optional
  costBasis?: number; // optional
  gainLoss?: number; // optional
  gainLossPct?: number; // optional
};

function toNumber(v: string | undefined | null) {
  if (!v) return undefined;
  const cleaned = v
    .replace(/\$/g, "")
    .replace(/,/g, "")
    .replace(/\(/g, "-")
    .replace(/\)/g, "")
    .trim();
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : undefined;
}

function safe(v: any) {
  return String(v ?? "").trim();
}

function parseCsv(text: string): { headers: string[]; rows: Record<string, string>[] } {
  // Minimal robust CSV parsing (handles quoted commas)
  const lines: string[] = [];
  let cur = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];

    if (ch === '"' && next === '"') {
      cur += '"';
      i++;
      continue;
    }
    if (ch === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (ch === "\n" && !inQuotes) {
      lines.push(cur);
      cur = "";
      continue;
    }
    cur += ch;
  }
  if (cur.trim().length) lines.push(cur);

  const splitLine = (line: string) => {
    const out: string[] = [];
    let cell = "";
    let q = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      const next = line[i + 1];
      if (ch === '"' && next === '"') {
        cell += '"';
        i++;
        continue;
      }
      if (ch === '"') {
        q = !q;
        continue;
      }
      if (ch === "," && !q) {
        out.push(cell);
        cell = "";
        continue;
      }
      cell += ch;
    }
    out.push(cell);
    return out.map((s) => s.trim());
  };

  const headerLine = lines.find((l) => l.trim().length > 0);
  if (!headerLine) return { headers: [], rows: [] };

  const headers = splitLine(headerLine).map((h) => h.toLowerCase());
  const startIndex = lines.indexOf(headerLine) + 1;

  const rows: Record<string, string>[] = [];
  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    const cells = splitLine(line);
    const r: Record<string, string> = {};
    headers.forEach((h, idx) => {
      r[h] = cells[idx] ?? "";
    });
    rows.push(r);
  }

  return { headers, rows };
}

// --- Broker-specific mapping heuristics ---
// These are intentionally flexible, because Schwab/Fidelity export headers vary by account/export type.
// We map by "best guess" header names and gracefully omit what isn't present.

function normalizeHoldingRow(broker: Broker, row: Record<string, string>): Holding | null {
  const h = (k: string) => safe(row[k]);

  // Common candidates
  const symbol =
    h("symbol") ||
    h("ticker") ||
    h("security id") ||
    h("security") ||
    h("investment") ||
    h("description"); // fallback

  const name =
    h("description") ||
    h("security description") ||
    h("security") ||
    h("investment name") ||
    symbol;

  // quantity
  const qty =
    toNumber(h("quantity")) ??
    toNumber(h("shares")) ??
    toNumber(h("units")) ??
    toNumber(h("share quantity"));

  if (!symbol || !qty || qty === 0) return null;

  const price =
    toNumber(h("price")) ??
    toNumber(h("last price")) ??
    toNumber(h("market price"));

  const marketValue =
    toNumber(h("market value")) ??
    toNumber(h("current value")) ??
    toNumber(h("value"));

  const costBasis =
    toNumber(h("cost basis")) ??
    toNumber(h("total cost")) ??
    toNumber(h("cost"));

  const gainLoss =
    toNumber(h("gain/loss")) ??
    toNumber(h("gain loss")) ??
    toNumber(h("unrealized gain/loss"));

  const gainLossPct =
    toNumber(h("gain/loss %")) ??
    toNumber(h("gain loss %")) ??
    toNumber(h("unrealized gain/loss %"));

  return {
    broker,
    symbol: symbol.toUpperCase().slice(0, 12),
    name,
    quantity: qty,
    price,
    marketValue,
    costBasis,
    gainLoss,
    gainLossPct,
  };
}

export function parseBrokerCsv(broker: Broker, csvText: string): Holding[] {
  const { rows } = parseCsv(csvText);
  const holdings: Holding[] = [];

  for (const row of rows) {
    const normalized = normalizeHoldingRow(broker, row);
    if (normalized) holdings.push(normalized);
  }

  // consolidate by symbol within broker
  const map = new Map<string, Holding>();
  for (const h of holdings) {
    const key = `${h.broker}:${h.symbol}`;
    const existing = map.get(key);
    if (!existing) {
      map.set(key, { ...h });
    } else {
      existing.quantity += h.quantity;
      // prefer latest non-undefined numeric fields
      existing.price = existing.price ?? h.price;
      existing.marketValue = (existing.marketValue ?? 0) + (h.marketValue ?? 0);
      existing.costBasis = (existing.costBasis ?? 0) + (h.costBasis ?? 0);
      existing.gainLoss = (existing.gainLoss ?? 0) + (h.gainLoss ?? 0);
    }
  }

  return Array.from(map.values()).sort((a, b) => (b.marketValue ?? 0) - (a.marketValue ?? 0));
}

export function summarizeHoldings(all: Holding[]) {
  const totalValue = all.reduce((s, h) => s + (h.marketValue ?? 0), 0);
  const totalCost = all.reduce((s, h) => s + (h.costBasis ?? 0), 0);
  const gain = totalValue && totalCost ? totalValue - totalCost : undefined;
  const gainPct =
    gain !== undefined && totalCost && totalCost !== 0 ? (gain / totalCost) * 100 : undefined;

  return { totalValue, totalCost, gain, gainPct };
}
