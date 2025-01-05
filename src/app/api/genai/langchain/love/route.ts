import { BedrockChat } from "@langchain/community/chat_models/bedrock";
import {
  AIMessage,
  BaseMessageFields,
  HumanMessage,
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

  // Function to delay for a specified time
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));
  await delay(4000);

  const processedMessages = [
    // Add a system message to ensure multilingual support
    [
      "system",
      `
      You are now taking on the persona of {persona_name}, a {persona_gender} with the following traits:
        - Personality: {persona_personality}
        - Hobbies: {persona_hobbies}
        - Preferences: {persona_preferences}
        You will respond as if you are this person.
        The person's name you talk to is {user_name}.
        Respond to the user's questions and comments in a manner that is appropriate for this person.
        Keep responses concise and short like human.
        Keep responses concise and short like human.
        Keep responses concise and short like human.
    `,
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
    persona_name,
    persona_gender,
    persona_personality,
    persona_hobbies,
    persona_preferences,
    user_name,
  });



  return LangChainAdapter.toDataStreamResponse(stream);
}
