import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const apiKey = process.env.OPENAI_API_KEY!;
    const projectId = process.env.OPENAI_PROJECT_ID!;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "OpenAI-Project": projectId
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        input: prompt,
      })
    });

    const data = await response.json();
    return NextResponse.json({ output: data.output_text ?? "" });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Assistant error" }, { status: 500 });
  }
}
