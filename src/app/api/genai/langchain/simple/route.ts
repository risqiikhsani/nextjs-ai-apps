import { BedrockChat } from "@langchain/community/chat_models/bedrock";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const model = new BedrockChat({
  model: "anthropic.claude-3-haiku-20240307-v1:0",
  region: process.env.AWS_REGION_BEDROCK,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_ID!,
  },
  // endpointUrl: "custom.amazonaws.com",
  // modelKwargs: {
  //   anthropic_version: "bedrock-2023-05-31",
  // },
});

const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You are a helpful assistant that translates {input_language} to {output_language}.",
  ],
  ["human", "{input}"],
]);

const chain = prompt.pipe(model);

export async function GET() {
  const response = await chain.invoke({
    input_language: "English",
    output_language: "German",
    input: "I love programming.",
  });

  return Response.json(response);
}
