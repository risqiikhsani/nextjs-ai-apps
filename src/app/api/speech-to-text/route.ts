export const maxDuration = 60;

import { HfInference } from "@huggingface/inference";
import { NextResponse } from "next/server";

const HF_TOKEN = process.env.HF_TOKEN;
const inference = new HfInference(HF_TOKEN);

async function getTextFromSpeech({ model, audio }: { model: string; audio: string }) {
  try {
    // Convert base64 back to Buffer
    const audioBuffer = Buffer.from(audio, 'base64');
    
    const out = await inference.automaticSpeechRecognition({
      model: model || 'facebook/wav2vec2-large-960h-lv60-self',
      data: audioBuffer,
    });
    
    return out;
  } catch (error) {
    console.error("Speech recognition error:", error);
    throw new Error("Failed to transcribe speech to text");
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { model, audio } = body;
    
    if (!audio) {
      return NextResponse.json(
        { error: "Audio data is required" }, 
        { status: 400 }
      );
    }

    const response = await getTextFromSpeech({ model, audio });
    
    return NextResponse.json({ text: response.text }, { status: 200 });
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: "Failed to process audio" },
      { status: 500 }
    );
  }
}
