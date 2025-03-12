import { BedrockChat } from "@langchain/community/chat_models/bedrock";
import {
  AIMessage,
  BaseMessageFields,
  HumanMessage,
} from "@langchain/core/messages";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { LangChainAdapter } from "ai";
import { ConversationTokenBufferMemory } from "langchain/memory";  // Import memory

const model = new BedrockChat({
  model: "anthropic.claude-3-haiku-20240307-v1:0",
  //model:"anthropic.claude-3-5-sonnet-20241022-v2:0",
  // model:"amazon.nova-lite-v1:0",
  region: process.env.AWS_REGION_BEDROCK,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// Allow streaming responses up to 30 seconds
export const maxDuration = 60;

export async function POST(req: Request) {
  const data = await req.json();
  console.log(data);
  const messages = data.messages;
  const persona_name = data.persona_name;
  const persona_gender = data.persona_gender;
  const persona_personality = data.persona_personality;
  const persona_hobbies = data.persona_hobbies;
  const persona_preferences = data.persona_preferences;
  const user_name = data.user_name;
  const parser = new StringOutputParser();

  const memory = new ConversationTokenBufferMemory({
    returnMessages: true,  // Keeps messages in memory
    memoryKey: "history",  // Stores conversation history
    llm: model,
    maxTokenLimit: 2000,  // Adjust based on model's context window
  });

  // Add existing messages to memory
  for (const message of messages) {
    memory.chatHistory.addMessage(
      message.role === "user" ? new HumanMessage(message.content) : new AIMessage(message.content)
    );
  }

  // Retrieve memory messages (so it doesn't forget previous context)
  const history = await memory.loadMemoryVariables({});

  const processedMessages = [
    new AIMessage(`${persona_name} is a persona with gender of ${persona_gender} with ${persona_personality} personality. Respond in character to ${user_name}.`),
    ...history.history, // Retain chat history
  ];


  // Function to delay for a specified time
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));
  await delay(8000);

  // const processedMessages = [
  //   new AIMessage(
  //     `{persona_name} is a {persona_gender} with {persona_personality}. Respond in character to {user_name}.`
  //   ),
  //   ...messages.map((message: any) =>
  //     message.role === "user"
  //       ? new HumanMessage(message.content)
  //       : new AIMessage(message.content)
  //   ),
  // ];
  const prompt = ChatPromptTemplate.fromMessages(processedMessages);
  const chain = prompt.pipe(model).pipe(parser);
  console.log("Processed Messages:", JSON.stringify(processedMessages, null, 2));


  // Stream the response
  const stream = await chain.stream({
    persona_name,
    persona_gender,
    persona_personality,
    persona_hobbies,
    persona_preferences,
    user_name,
  });

  return LangChainAdapter.toDataStreamResponse(stream);
}
