import { HfInference } from "@huggingface/inference";
import { NextResponse } from "next/server";

const HF_TOKEN = process.env.HF_TOKEN;
const inference = new HfInference(HF_TOKEN);

async function getSpeech({ model,text }: { model:string,text: string }) {
  try {
    const out = await inference.textToSpeech({
      model: model || 'espnet/kan-bayashi_ljspeech_vits',
      inputs: text,
    });
    console.log(out);
    return out;
  } catch (error) {
    console.error("Image generation error:", error);
    throw new Error("Failed to get Image generation");
  }
}

export async function POST(req: Request) {
  try {
    // Parse the request body
    const body = await req.json();
    const { model,text } = body;

    if (!text) {
      return NextResponse.json({ error: "text is required" }, { status: 400 });
    }

    // Get the generated image Blob
    const response = await getSpeech({ model,text });

    console.log(response)

    // Send the Blob directly (this will return as binary data)
    return new Response(response, {
      headers: {
        "Content-Type": "audio/wav", // Adjust based on the actual image type
      },
    });
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
