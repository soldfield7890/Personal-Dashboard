import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    today: [
      { time: "2:00 PM", title: "HST Call Review", weight: "Hard" },
      { time: "3:00 PM", title: "Exec Touchpoint", weight: "Med" },
      { time: "5:30 PM", title: "Family Dinner", weight: "Good" }
    ],
    nextUp: [
      { title: "Deep work block" },
      { title: "Contract review" },
      { title: "Family event" }
    ]
  });
}
