import OpenAI from "openai";
import { FEEDBACK_PROMPT } from "@/services/Constants";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    console.log("API HIT");

    const body = await req.json();

    console.log("BODY:", body);

    const { conversation } = body;

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation missing" },
        { status: 400 },
      );
    }

    console.log("Conversation type:", typeof conversation);

    // safer conversion
    const conversationString =
      typeof conversation === "string"
        ? conversation
        : JSON.stringify(conversation);

    const FINAL_PROMPT = FEEDBACK_PROMPT.replace(
      "{{conversation}}",
      conversationString,
    );

    console.log("PROMPT READY");

    // CHECK API KEY
    console.log("API KEY EXISTS:", !!process.env.OPENROUTER_API_KEY);

    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    console.log("OPENAI CLIENT CREATED");

    const completion = await openai.chat.completions.create({
      model: "openai/gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Return ONLY valid JSON. No markdown. No explanations.",
        },
        {
          role: "user",
          content: FINAL_PROMPT,
        },
      ],
    });

    console.log("FULL COMPLETION:", JSON.stringify(completion, null, 2));

    const result = completion?.choices?.[0]?.message?.content;

    if (!result) {
      return NextResponse.json(
        { error: "No AI response generated" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (e) {
    console.error("SERVER ERROR:");
    console.error(e);

    return NextResponse.json(
      {
        error: e.message,
        stack: e.stack,
      },
      { status: 500 },
    );
  }
}
