import { BedrockChat } from "@langchain/community/chat_models/bedrock";
import {
  AIMessage,
  BaseMessageFields,
  HumanMessage
} from "@langchain/core/messages";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { LangChainAdapter } from "ai";

const model = new BedrockChat({
  model: "anthropic.claude-3-haiku-20240307-v1:0",
  region: process.env.AWS_REGION_BEDROCK,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// Allow streaming responses up to 30 seconds
export const maxDuration = 60;




export async function POST(req: Request) {
  const { messages } = await req.json();
  const parser = new StringOutputParser();
  // const systemTemplate =
  // "You are a helpful AI assistant named {name} capable of communicating in any language. Detect and use the language of the user's input.";

  // Prepare messages, converting to LangChain message types

  const processedMessages = [
    // Add a system message to ensure multilingual support
    [
      "system",
      `You are a helpful AI assistant named {name}.`    
    ],
    ...messages.map(
      (message: { role: string; content: string | BaseMessageFields }) =>
        message.role === "user"
          ? new HumanMessage(message.content)
          : new AIMessage(message.content)
    ),
  ];
  const prompt = ChatPromptTemplate.fromMessages(processedMessages);
  const chain = prompt.pipe(model).pipe(parser);

  // Stream the response
  const stream = await chain.stream({
    name:"Hypernova"
  });

  return LangChainAdapter.toDataStreamResponse(stream);
}
