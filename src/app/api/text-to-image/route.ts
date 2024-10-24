import { HfInference } from "@huggingface/inference";
import { NextResponse } from "next/server";

const HF_TOKEN = process.env.HF_TOKEN;
const inference = new HfInference(HF_TOKEN);

async function getImage({ model,text }: { model:string,text: string }) {
  try {
    const out = await inference.textToImage({
      model: model || "stabilityai/stable-diffusion-xl-base-1.0",
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
    const imageResponse = await getImage({ model,text });

    // Send the Blob directly (this will return as binary data)
    return new Response(imageResponse, {
      headers: {
        "Content-Type": "image/jpeg", // Adjust based on the actual image type
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
