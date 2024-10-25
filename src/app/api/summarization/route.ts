import { HfInference } from "@huggingface/inference";
import { NextResponse } from "next/server";

const HF_TOKEN = process.env.HF_TOKEN;
const inference = new HfInference(HF_TOKEN);

async function getSummarization({ text }: { text: string }) {
  try {
    const out = await inference.summarization({
      model: 'facebook/bart-large-cnn',
      inputs: text,
      parameters: {
        max_length:100
      },
    });

    return out;
  } catch (error) {
    console.error("Chat completion error:", error);
    throw new Error("Failed to get chat completion");
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

    // Get the chat completion
    const completion = await getSummarization({ text });

    console.log("completion", completion);

    // Return the response
    return NextResponse.json({ completion });
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}