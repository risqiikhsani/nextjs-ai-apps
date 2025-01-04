import { StringOutputParser } from '@langchain/core/output_parsers';
import { LangChainAdapter } from 'ai';

import { BedrockChat } from "@langchain/community/chat_models/bedrock";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const translationPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are a grammar correction assistant. Your task is to fix any grammatical errors in the {lang} language text provided. Respond only with the corrected sentence, without additional commentary or explanation.`,
  ],
  ["human", "there are a cat named bob"],
  ["ai", "There is a cat named Bob."],
  ["human", "what is the names of the cats ?"],
  ["ai", "What are the names of the cats ?"],
  ["human", "{prompt}"],
  ]);

const model = new BedrockChat({
  model: "anthropic.claude-3-haiku-20240307-v1:0",
  region: process.env.AWS_REGION_BEDROCK,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});
// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const data = await req.json();
    console.log(data)

    // Create output parser
    const parser = new StringOutputParser();
    const language = data.language
    const prompt = data.prompt;

    // Create the translation chain and stream the response
    const chain = translationPrompt.pipe(model).pipe(parser);
    const stream = await chain.stream({ lang:language,prompt });

    // Convert the stream to a data stream response
    return LangChainAdapter.toDataStreamResponse(stream);
}