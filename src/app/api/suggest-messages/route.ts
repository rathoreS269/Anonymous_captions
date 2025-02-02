import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";


export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY; // Use environment variable
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "API key is missing" }),
        { status: 400 }
      );
    }

    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    const geminiAPI = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyDswE_zlPkgUpDnp6N4gsWxkSfz54daYVs`;

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
      return new Response(JSON.stringify(errorData), { status: response.status });
    }

    const data = await response.json();
    console.log("checking data" , data)
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";

    return new Response(generatedText, {
      headers: { "Content-Type": "text/plain" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Something went wrong" }),
      { status: 500 }
    );
  }
}
