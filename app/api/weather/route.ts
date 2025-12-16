import { NextResponse } from "next/server";

export async function GET() {
  try {
    const lat = 42.5251;   // Leominster
    const lon = -71.7598;

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&timezone=America/New_York`;

    const res = await fetch(url);
    const data = await res.json();

    return NextResponse.json({
      location: "Leominster, MA",
      currentTemp: data.current.temperature_2m,
      currentWindSpeed: data.current.wind_speed_10m,
      currentDescription: "Clear",
      daily: [
        { label: "Tomorrow", max: data.daily.temperature_2m_max[1], min: data.daily.temperature_2m_min[1] },
        { label: "Day 2", max: data.daily.temperature_2m_max[2], min: data.daily.temperature_2m_min[2] },
        { label: "Day 3", max: data.daily.temperature_2m_max[3], min: data.daily.temperature_2m_min[3] }
      ],
    });

  } catch {
    return NextResponse.json({ error: "Failed to fetch weather" }, { status: 500 });
  }
}
