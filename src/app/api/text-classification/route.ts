export const maxDuration = 60;

import { HfInference } from "@huggingface/inference";
import { NextResponse } from "next/server";

const HF_TOKEN = process.env.HF_TOKEN;
const inference = new HfInference(HF_TOKEN);

async function getClassification({ text }: { text: string }) {
  try {
    const out = await inference.textClassification({
      model: 'distilbert-base-uncased-finetuned-sst-2-english',
      inputs: text,
    });

    return out;
  } catch (error) {
    console.error("Chat result error:", error);
    throw new Error("Failed to get chat result");
  }
}

export async function POST(req: Request) {
  try {
    // Parse the request body
    const body = await req.json();
    const { text } = body;

    if (!text) {
      return NextResponse.json(
        { error: "text is required" },
        { status: 400 }
      );
    }

    // Get the chat result
    const result = await getClassification({ text });

    console.log("result", result);

    // Return the response
    return NextResponse.json({ result });
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}