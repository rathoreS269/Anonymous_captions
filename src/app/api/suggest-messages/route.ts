import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    console.log("Request received at API");
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.log("API key is missing");
      return NextResponse.json({ error: "API key is missing" }, { status: 400 });
    }

    const { input } = await req.json();
    if (!input?.trim()) {
      return NextResponse.json({ error: "Input is empty" }, { status: 400 });
    }

    const geminiAPI = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const response = await fetch(geminiAPI, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: input }] }],
      }),
    });
     // console.log("response is" , response)
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";
    //console.log("data is " , data)

    return NextResponse.json({ response: generatedText });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
