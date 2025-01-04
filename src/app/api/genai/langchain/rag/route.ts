import { BedrockChat } from "@langchain/community/chat_models/bedrock";
import {
  AIMessage,
  BaseMessageFields,
  HumanMessage,
} from "@langchain/core/messages";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { LangChainAdapter } from "ai";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { BedrockEmbeddings } from "@langchain/aws";
import { JSONLoader } from "langchain/document_loaders/fs/json";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

const embeddings = new BedrockEmbeddings({
  region: process.env.AWS_REGION_BEDROCK!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  model: "amazon.titan-embed-text-v2:0",
});

const vectorStore = new FaissStore(embeddings, {});

const loader = new JSONLoader("src/data/states.json", [
  "/state",
  "/code",
  "/nickname",
  "/website",
  "/admission_date",
  "/admission_number",
  "/capital_city",
  "/capital_url",
  "/population",
  "/population_rank",
  "/constitution_url",
  "/twitter_url",
]);

const model = new BedrockChat({
  model: "anthropic.claude-3-haiku-20240307-v1:0",
  region: process.env.AWS_REGION_BEDROCK,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// Retrieve relevant context
async function retrieveContext(vectorStore: FaissStore, query: string) {
  // you can
  // query database vector
//   const similaritySearchResults = await vectorStore.similaritySearch(query, 2);

//   for (const doc of similaritySearchResults) {
//     console.log(`* ${doc.pageContent} [${JSON.stringify(doc.metadata, null)}]`);
//   }

  // OR
  // transform the vector store into a retriever for easier usage in your chains.
  // Retrieve top 3 most relevant documents
  const retriever = vectorStore.asRetriever(3);
  const retrievedDocs = await retriever.invoke(query);

  // Format context
  return retrievedDocs
    .map((doc, index) => `[Document ${index + 1}]: ${doc.pageContent}`)
    .join("\n\n");
}


export async function GET() {
  try {
    const docs = await loader.load();
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const splits = await textSplitter.splitDocuments(docs);
    await vectorStore.addDocuments(splits)
    return Response.json("Document added to db vector");
  } catch (error) {
    console.error(error);
  }
}

export async function POST(req: Request) {
  const { messages } = await req.json();
  const latestMessage = messages[messages?.length - 1]?.content;
  const parser = new StringOutputParser();

  const processedMessages = [
    // Add a system message to ensure multilingual support
    [
      "system",
      `You are a helpful AI assistant named {name} capable of communicating in any language. 
      Detect and use the language of the user's input. 
      Your default language is english.
      Use the below context to augment what you know about the topic.
      The context will provide you with the most recent page data.
      If context doesn't include the information you need, answer based on existing knowledge.
      format response using markdown where applicable and don't return images.
      -------------
      <context>
      {context}
      </context>
      -------------
      question: {latestMessage}
      -------------
      answer:
      `,
    ],
    ...messages.map(
      (message: { role: string; content: string | BaseMessageFields }) =>
        message.role === "user"
          ? new HumanMessage(message.content)
          : new AIMessage(message.content)
    ),
  ];

  // Retrieve context
  const retrievedDocs = await retrieveContext(vectorStore, latestMessage);

  const prompt = ChatPromptTemplate.fromMessages(processedMessages);
  const chain = prompt.pipe(model).pipe(parser);

  // Stream the response
  const stream = await chain.stream({
    name: "Hypernova",
    context: retrievedDocs,
    latestMessage: latestMessage,
  });

  return LangChainAdapter.toDataStreamResponse(stream);
}

// Allow streaming responses up to 30 seconds
export const maxDuration = 60;
