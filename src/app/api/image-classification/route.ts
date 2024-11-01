export const maxDuration = 60;

import { HfInference } from "@huggingface/inference";
import { NextResponse } from "next/server";

const HF_TOKEN = process.env.HF_TOKEN;
const inference = new HfInference(HF_TOKEN);

async function getImageClassification({ model, image }: { model?: string; image: Buffer }) {
  try {
    const out = await inference.imageClassification({
      model: model || "google/vit-base-patch16-224",
      data: image,  // Passing the image as a buffer
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
    const { model, image } = body;

    if (!image) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    // Assuming the image is sent as a base64 string, decode it
    const imageBuffer = Buffer.from(image, "base64");

    // Get the image classification result
    const imageResponse = await getImageClassification({ model, image: imageBuffer });

    // Return the classification result
    return NextResponse.json({ imageResponse });
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
