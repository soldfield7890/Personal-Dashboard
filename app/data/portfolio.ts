// app/data/portfolio.ts
import fs from "fs";
import path from "path";

export type Broker = "fidelity" | "schwab";

export type NormalizedHolding = {
    broker: Broker;
    asOf: string; // YYYY-MM-DD
    account?: string;
    symbol: string;
    name: string;
    quantity: number;
    price?: number;
    marketValue: number;
    costBasis?: number;
    unrealizedPL?: number;
    currency?: string;
};

export type PortfolioSnapshot = {
    asOf: string;
    files: Record<Broker, string>;
    holdings: NormalizedHolding[];
    totals: {
        marketValue: number;
        costBasis?: number;
        unrealizedPL?: number;
        byBroker: Record<Broker, number>;
    };
};

const DEFAULT_DIR = path.join(process.cwd(), "app", "data", "portfolios");

/** Tiny CSV parser that supports quotes. Good enough for brokerage exports (Phase 1). */
function parseCSV(text: string): Array<Record<string, string>> {
    const lines = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n").filter(Boolean);
    if (lines.length < 2) return [];

    const headers = splitCSVLine(lines[0]).map((h) => h.trim());
    const rows: Array<Record<string, string>> = [];

    for (let i = 1; i < lines.length; i++) {
        const cols = splitCSVLine(lines[i]);
        if (cols.every((c) => c.trim() === "")) continue;

        const row: Record<string, string> = {};
        for (let j = 0; j < headers.length; j++) {
            row[headers[j]] = (cols[j] ?? "").trim();
        }
        rows.push(row);
    }
    return rows;
}

function splitCSVLine(line: string): string[] {
    const out: string[] = [];
    let cur = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const ch = line[i];

        if (ch === '"') {
            // double quote escape
            if (inQuotes && line[i + 1] === '"') {
                cur += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
            continue;
        }

        if (ch === "," && !inQuotes) {
            out.push(cur);
            cur = "";
            continue;
        }

        cur += ch;
    }
    out.push(cur);
    return out;
}

function toNumber(v: string | undefined): number | undefined {
    if (!v) return undefined;
    const cleaned = v
        .replace(/\$/g, "")
        .replace(/,/g, "")
        .replace(/\s+/g, "")
        .replace(/\((.*?)\)/g, "-$1");
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : undefined;
}

function pickColumn(row: Record<string, string>, candidates: string[]): string | undefined {
    const keys = Object.keys(row);
    for (const c of candidates) {
        const hit = keys.find((k) => k.toLowerCase().includes(c));
        if (hit) return row[hit];
    }
    return undefined;
}

function normalizeRow(broker: Broker, asOf: string, row: Record<string, string>): NormalizedHolding | null {
    const symbol =
        (pickColumn(row, ["symbol", "ticker"]) || "").toUpperCase().trim();

    const name =
        (pickColumn(row, ["name", "description", "security"]) || "").trim();

    const quantity =
        toNumber(pickColumn(row, ["quantity", "shares", "units"])) ?? 0;

    const price =
        toNumber(pickColumn(row, ["price", "last", "market price"])) ?? undefined;

    const marketValue =
        toNumber(pickColumn(row, ["market value", "value", "current value"])) ??
        (price !== undefined ? quantity * price : 0);

    const costBasis =
        toNumber(pickColumn(row, ["cost basis", "cost"])) ?? undefined;

    const unrealizedPL =
        toNumber(pickColumn(row, ["unrealized", "gain/loss", "gain", "p/l"])) ?? undefined;

    const account =
        (pickColumn(row, ["account", "account name", "account number"]) || "").trim() || undefined;

    // Skip empty/no-symbol rows (common in broker CSV footers)
    if (!symbol && !name) return null;

    return {
        broker,
        asOf,
        account,
        symbol: symbol || "—",
        name: name || symbol || "Unknown",
        quantity,
        price,
        marketValue,
        costBasis,
        unrealizedPL,
        currency: "USD",
    };
}

function listPortfolioFiles(dir: string) {
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir).filter((f) => f.endsWith(".csv"));
}

function latestAsOf(files: string[]): string | null {
    // expects *_holdings_YYYY-MM-DD.csv
    const dates = new Set<string>();
    for (const f of files) {
        const m = f.match(/_holdings_(\d{4}-\d{2}-\d{2})\.csv$/);
        if (m?.[1]) dates.add(m[1]);
    }
    const sorted = Array.from(dates).sort(); // lexical works for ISO dates
    return sorted.length ? sorted[sorted.length - 1] : null;
}

export function loadLatestPortfolioSnapshot(portfoliosDir = DEFAULT_DIR): PortfolioSnapshot {
    const files = listPortfolioFiles(portfoliosDir);

    const asOf = latestAsOf(files);
    if (!asOf) {
        return {
            asOf: "—",
            files: { fidelity: "", schwab: "" },
            holdings: [],
            totals: { marketValue: 0, byBroker: { fidelity: 0, schwab: 0 } },
        };
    }

    const fidelityFile = files.find((f) => f === `fidelity_holdings_${asOf}.csv`);
    const schwabFile = files.find((f) => f === `schwab_holdings_${asOf}.csv`);

    if (!fidelityFile || !schwabFile) {
        // If one is missing, we still return something useful
        return {
            asOf,
            files: { fidelity: fidelityFile ?? "", schwab: schwabFile ?? "" },
            holdings: [],
            totals: { marketValue: 0, byBroker: { fidelity: 0, schwab: 0 } },
        };
    }

    const fidelityText = fs.readFileSync(path.join(portfoliosDir, fidelityFile), "utf8");
    const schwabText = fs.readFileSync(path.join(portfoliosDir, schwabFile), "utf8");

    const fidelityRows = parseCSV(fidelityText);
    const schwabRows = parseCSV(schwabText);

    const fidelityHoldings = fidelityRows
        .map((r) => normalizeRow("fidelity", asOf, r))
        .filter(Boolean) as NormalizedHolding[];

    const schwabHoldings = schwabRows
        .map((r) => normalizeRow("schwab", asOf, r))
        .filter(Boolean) as NormalizedHolding[];

    const holdings = [...fidelityHoldings, ...schwabHoldings];

    const byBroker = {
        fidelity: fidelityHoldings.reduce((s, h) => s + (h.marketValue || 0), 0),
        schwab: schwabHoldings.reduce((s, h) => s + (h.marketValue || 0), 0),
    };

    const marketValue = holdings.reduce((s, h) => s + (h.marketValue || 0), 0);
    const costBasis = holdings.reduce((s, h) => s + (h.costBasis || 0), 0);
    const unrealizedPL = holdings.reduce((s, h) => s + (h.unrealizedPL || 0), 0);

    return {
        asOf,
        files: { fidelity: fidelityFile, schwab: schwabFile },
        holdings,
        totals: {
            marketValue,
            costBasis: costBasis || undefined,
            unrealizedPL: unrealizedPL || undefined,
            byBroker,
        },
    };
}
