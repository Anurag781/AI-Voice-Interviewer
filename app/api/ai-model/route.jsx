import { QUESTIONS_PROMPT } from "@/services/Constants";
import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req) {
  try {

    // Parse request body
    const body = await req.json();

    console.log("REQUEST BODY:", body);

    const { jobposition, jobdescription, duration, type } = body;

    // Validation
    if (!jobposition || !jobdescription || !duration || !type) {
      return NextResponse.json(
        {
          success: false,
          error: "All fields are required",
        },
        {
          status: 400,
        },
      );
    }

    // Create final prompt
    const FINAL_PROMPT = QUESTIONS_PROMPT.replace("{{jobTitle}}", jobposition)
      .replace("{{jobDescription}}", jobdescription)
      .replace("{{duration}}", duration)
      .replace("{{type}}", type);

    console.log("FINAL PROMPT:", FINAL_PROMPT);

    // Initialize OpenRouter/OpenAI
    const openai = new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: "https://openrouter.ai/api/v1",
    });

    // Generate completion
    const completion = await openai.chat.completions.create({
      model: "openai/gpt-3.5-turbo",

      messages: [
        {
          role: "system",
          content: "You are an expert technical interviewer.",
        },
        {
          role: "user",
          content: FINAL_PROMPT,
        },
      ],

      temperature: 0.7,
    });

    console.log("COMPLETION:", completion);

    const content = completion?.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        {
          success: false,
          error: "No AI response generated",
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json({
      success: true,
      content,
    });
  } catch (error) {
    console.log("FULL ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
}
