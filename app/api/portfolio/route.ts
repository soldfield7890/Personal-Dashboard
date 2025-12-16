import crypto from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type DriveFile = { id: string; name: string; modifiedTime?: string };

export type NormalizedHolding = {
    source: "schwab" | "fidelity";
    asOfDate: string;
    account?: string;
    symbol: string;
    name?: string;
    quantity: number;
    price: number;
    marketValue: number;
    costBasis?: number;
    gainLoss?: number;
    gainLossPct?: number;
    raw: Record<string, string>;
};

function getEnvOrThrow(name: string) {
    const v = process.env[name];
    if (!v) throw new Error(`Missing ${name} in .env.local`);
    return v;
}
function normalizePrivateKey(raw: string) {
    return raw.replace(/\\n/g, "\n");
}
function base64Url(input: Buffer | string) {
    const b = Buffer.isBuffer(input) ? input : Buffer.from(input);
    return b.toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

/** ===== OAuth: Service Account → Access Token ===== */
async function getServiceAccountAccessToken() {
    const clientEmail = getEnvOrThrow("GOOGLE_SERVICE_ACCOUNT_EMAIL");
    const privateKey = normalizePrivateKey(getEnvOrThrow("GOOGLE_PRIVATE_KEY"));

    const now = Math.floor(Date.now() / 1000);
    const header = { alg: "RS256", typ: "JWT" };
    const payload = {
        iss: clientEmail,
        scope: "https://www.googleapis.com/auth/drive.readonly",
        aud: "https://oauth2.googleapis.com/token",
        iat: now,
        exp: now + 60 * 60,
    };

    const unsigned = `${base64Url(JSON.stringify(header))}.${base64Url(JSON.stringify(payload))}`;

    const signer = crypto.createSign("RSA-SHA256");
    signer.update(unsigned);
    signer.end();
    const signature = signer.sign(privateKey);
    const assertion = `${unsigned}.${base64Url(signature)}`;

    const body = new URLSearchParams();
    body.set("grant_type", "urn:ietf:params:oauth:grant-type:jwt-bearer");
    body.set("assertion", assertion);

    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
        cache: "no-store",
    });

    const text = await tokenRes.text();
    let json: any;
    try {
        json = JSON.parse(text);
    } catch {
        throw new Error(`Token endpoint returned non-JSON: ${text.slice(0, 200)}`);
    }
    if (!tokenRes.ok) {
        throw new Error(`Token error ${tokenRes.status}: ${json?.error ?? "unknown"} ${json?.error_description ?? ""}`);
    }
    if (!json.access_token) throw new Error("No access_token returned from Google.");
    return json.access_token as string;
}

/** ===== Drive helpers ===== */
async function driveListFiles(folderId: string, accessToken: string) {
    const q = encodeURIComponent(`'${folderId}' in parents and trashed=false`);
    const fields = encodeURIComponent("files(id,name,modifiedTime)");
    const url = `https://www.googleapis.com/drive/v3/files?q=${q}&fields=${fields}&pageSize=1000`;

    const res = await fetch(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
    });

    const text = await res.text();
    let json: any;
    try {
        json = JSON.parse(text);
    } catch {
        throw new Error(`Drive list returned non-JSON: ${text.slice(0, 200)}`);
    }
    if (!res.ok) {
        const msg = json?.error?.message ?? "Drive list failed";
        throw new Error(`Drive list error ${res.status}: ${msg}`);
    }

    const files: DriveFile[] = (json.files ?? []).filter((f: any) =>
        String(f?.name ?? "").toLowerCase().endsWith(".csv")
    );
    return files;
}

async function driveDownloadFileText(fileId: string, accessToken: string) {
    const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
    const res = await fetch(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
    });
    const text = await res.text();
    if (!res.ok) throw new Error(`Drive download error ${res.status}: ${text.slice(0, 200)}`);
    return text;
}

function pickLatestByFilename(files: DriveFile[], regex: RegExp) {
    const matches = files
        .map((f) => {
            const m = f.name.match(regex);
            return m ? { file: f, date: m[1] } : null;
        })
        .filter(Boolean) as { file: DriveFile; date: string }[];

    matches.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
    return matches[0]?.file ?? null;
}

function dateFromFilename(name: string) {
    const m = name.match(/(\d{4}-\d{2}-\d{2})/);
    return m?.[1] ?? new Date().toISOString().slice(0, 10);
}

/** ===== CSV parse (no deps; stable enough for broker exports) ===== */
function parseCsv(text: string) {
    const s = text.replace(/^\uFEFF/, "");
    const lines = s.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length === 0) return { rows: [] as Record<string, string>[], rowCount: 0 };

    const parseLine = (line: string) => {
        const out: string[] = [];
        let cur = "";
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const ch = line[i];
            if (ch === '"') {
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
        return out.map((x) => x.trim());
    };

    const headers = parseLine(lines[0]).map((h, idx) => (h ? h : `col_${idx + 1}`));
    const rows: Record<string, string>[] = [];

    for (let i = 1; i < lines.length; i++) {
        const cols = parseLine(lines[i]);
        const rec: Record<string, string> = {};
        headers.forEach((h, idx) => (rec[h] = cols[idx] ?? ""));
        rows.push(rec);
    }

    return { rows, rowCount: rows.length };
}

/** ===== Normalization helpers ===== */
function toNumber(v: string) {
    const s = (v ?? "").trim();
    if (!s) return 0;

    // ($1,234.56) → -1234.56
    const neg = /^\(.*\)$/.test(s);
    const cleaned = s.replace(/[,$%()]/g, "").replace(/\s+/g, "");
    const n = Number(cleaned);
    if (!Number.isFinite(n)) return 0;
    return neg ? -n : n;
}

function pick(row: Record<string, string>, keys: string[]) {
    const lower = Object.fromEntries(Object.entries(row).map(([k, v]) => [k.toLowerCase(), v]));
    for (const k of keys) {
        const v = lower[k.toLowerCase()];
        if (v !== undefined && String(v).trim() !== "") return String(v);
    }
    return "";
}

function normalizeRows(source: "schwab" | "fidelity", asOfDate: string, rows: Record<string, string>[]) {
    const out: NormalizedHolding[] = [];

    for (const r of rows) {
        const symbol = pick(r, ["symbol", "ticker"]);
        const name = pick(r, ["description", "security description", "security", "name"]);

        // quantity
        const qtyRaw = pick(r, ["quantity", "qty", "shares"]);
        const quantity = toNumber(qtyRaw);

        // last price
        const priceRaw = pick(r, ["price", "last price", "last", "market price"]);
        const price = toNumber(priceRaw);

        // market value
        const mvRaw = pick(r, ["market value", "current value", "value", "marketvalue"]);
        const marketValue = toNumber(mvRaw);

        // cost basis
        const cbRaw = pick(r, ["cost basis", "cost basis total", "total cost", "cost"]);
        const costBasis = cbRaw ? toNumber(cbRaw) : undefined;

        // gain/loss
        const glRaw = pick(r, ["gain/loss", "gain loss", "total gain/loss", "gain"]);
        const gainLoss = glRaw ? toNumber(glRaw) : undefined;

        // gain/loss %
        const glpRaw = pick(r, ["gain/loss %", "gain loss %", "gain %", "total gain/loss %"]);
        const gainLossPct = glpRaw ? toNumber(glpRaw) : undefined;

        if (!symbol) continue; // drop blank summary rows

        out.push({
            source,
            asOfDate,
            symbol,
            name: name || undefined,
            quantity,
            price,
            marketValue,
            costBasis,
            gainLoss,
            gainLossPct,
            raw: r,
        });
    }

    return out;
}

export async function GET() {
    try {
        const folderId = getEnvOrThrow("GOOGLE_DRIVE_FOLDER_ID");

        const accessToken = await getServiceAccountAccessToken();
        const files = await driveListFiles(folderId, accessToken);

        const schwabFile = pickLatestByFilename(files, /^schwab_holdings_(\d{4}-\d{2}-\d{2})\.csv$/i);
        const fidelityFile = pickLatestByFilename(files, /^fidelity_holdings_(\d{4}-\d{2}-\d{2})\.csv$/i);

        if (!schwabFile || !fidelityFile) {
            return Response.json(
                {
                    ok: false,
                    error: "Could not find both required files in the Drive folder (latest-by-date).",
                    required: ["schwab_holdings_YYYY-MM-DD.csv", "fidelity_holdings_YYYY-MM-DD.csv"],
                    found: files.map((f) => f.name).sort(),
                },
                { status: 400 }
            );
        }

        const schwabText = await driveDownloadFileText(schwabFile.id, accessToken);
        const fidelityText = await driveDownloadFileText(fidelityFile.id, accessToken);

        const schwabParsed = parseCsv(schwabText);
        const fidelityParsed = parseCsv(fidelityText);

        const schwabDate = dateFromFilename(schwabFile.name);
        const fidelityDate = dateFromFilename(fidelityFile.name);

        const schwabHoldings = normalizeRows("schwab", schwabDate, schwabParsed.rows);
        const fidelityHoldings = normalizeRows("fidelity", fidelityDate, fidelityParsed.rows);

        // Phase 1 deliverable: confirm ingestion + normalized preview
        const previewLimit = 15;

        return Response.json({
            ok: true,
            meta: {
                folderId,
                schwab: { file: schwabFile.name, modifiedTime: schwabFile.modifiedTime, rowCount: schwabParsed.rowCount },
                fidelity: { file: fidelityFile.name, modifiedTime: fidelityFile.modifiedTime, rowCount: fidelityParsed.rowCount },
                normalized: {
                    schwabCount: schwabHoldings.length,
                    fidelityCount: fidelityHoldings.length,
                },
            },
            normalizedPreview: {
                schwab: schwabHoldings.slice(0, previewLimit),
                fidelity: fidelityHoldings.slice(0, previewLimit),
            },
        });
    } catch (e: any) {
        return Response.json(
            { ok: false, error: e?.message ?? "Unknown server error" },
            { status: 500 }
        );
    }
}
