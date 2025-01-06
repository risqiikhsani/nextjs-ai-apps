import { BedrockChat } from "@langchain/community/chat_models/bedrock";

import { LangChainAdapter } from "ai";
// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const model = new BedrockChat({
  model: "anthropic.claude-3-haiku-20240307-v1:0",
  region: process.env.AWS_REGION_BEDROCK,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: Request) {
  const { messages } = await req.json();
  console.log(messages);

  const stream = await model.stream(messages);

  return LangChainAdapter.toDataStreamResponse(stream);
}