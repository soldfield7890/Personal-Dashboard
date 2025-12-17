import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    items: [
      { symbol: "MSFT", changePct: 1.4 },
      { symbol: "GOOG", changePct: 0.9 },
      { symbol: "RTX", changePct: -0.6 },
      { symbol: "DUK", changePct: 0.3 }
    ]
  });
}
