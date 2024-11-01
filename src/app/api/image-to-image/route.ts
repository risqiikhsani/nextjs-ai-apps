export const maxDuration = 60;

import { HfInference } from "@huggingface/inference";
import { NextResponse } from "next/server";

const HF_TOKEN = process.env.HF_TOKEN;
const inference = new HfInference(HF_TOKEN);

function bufferToBlob(buffer: Buffer, type: string = "image/png"): Blob {
  return new Blob([buffer], { type });
}

async function getImageToImage({ model, image, text }: { model?: string; image: Buffer, text?:string }) {
  try {
    const out = await inference.imageToImage({
      model: model || "lllyasviel/sd-controlnet-depth",
      inputs: bufferToBlob(image), 
      parameters:{
        prompt:text || "",
      } 
    });
    console.log(out);
    return out;
  } catch (error) {
    console.error("Image classification error:", error);
    throw new Error("Failed to get image classification");
  }
}

export async function POST(req: Request) {
  try {
    // Parse the request body
    const body = await req.json();
    const { model, image, text } = body;

    if (!image) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    // Assuming the image is sent as a base64 string, decode it
    const imageBuffer = Buffer.from(image, "base64");

    // Get the image classification result
    const imageResponse = await getImageToImage({ model, image: imageBuffer, text });

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
