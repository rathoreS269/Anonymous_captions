import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "API key is missing" }, { status: 400 });
    }

    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. " +
      "Each question should be separated by '||'. These questions are for an anonymous social messaging platform, " +
      "like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, " +
      "focusing instead on universal themes that encourage friendly interaction. " +
      "For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. " +
      "Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    const geminiAPI = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const response = await fetch(geminiAPI, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    console.log("data is" , data);
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";

    return NextResponse.json({ suggestions: generatedText });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
