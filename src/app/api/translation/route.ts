// import { HfInference } from "@huggingface/inference";
// import { NextResponse } from "next/server";

// const HF_TOKEN = process.env.HF_TOKEN;
// const inference = new HfInference(HF_TOKEN);

// async function getTranslation({
//   text,
//   src_lang,
//   target_lang,
// }: {
//   text: string;
//   src_lang?: string;
//   target_lang?: string;
// }) {
//   try {
//     const out = await inference.translation({
//       model: "facebook/mbart-large-50-many-to-many-mmt",
//       inputs: text,
      
//     });

//     return out;
//   } catch (error) {
//     console.error("Chat result error:", error);
//     throw new Error("Failed to get chat result");
//   }
// }

// export async function POST(req: Request) {
//   try {
//     // Parse the request body
//     const body = await req.json();
//     const { text } = body;

//     if (!text) {
//       return NextResponse.json({ error: "text is required" }, { status: 400 });
//     }

//     // Get the chat result
//     const result = await getTranslation({ text });

//     console.log("result", result);

//     // Return the response
//     return NextResponse.json({ result });
//   } catch (error) {
//     console.error("API route error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
