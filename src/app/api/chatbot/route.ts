import { HfInference } from "@huggingface/inference";
import { NextResponse } from "next/server";

const HF_TOKEN = process.env.HF_TOKEN;
const inference = new HfInference(HF_TOKEN);

async function getChatCompletion({ message }: { message: string }) {
  try {
    const out = await inference.chatCompletion({
      model: "meta-llama/Meta-Llama-3-8B-Instruct",
      messages: [{role:"user",content:message}],
      max_tokens: 512,
    });

    return out.choices[0].message;
  } catch (error) {
    console.error("Chat completion error:", error);
    throw new Error("Failed to get chat completion");
  }
}

export async function POST(req: Request) {
  try {
    // Parse the request body
    const body = await req.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Get the chat completion
    const completion = await getChatCompletion({ message });

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