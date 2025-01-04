import { BedrockEmbeddings } from "@langchain/aws";
import { BedrockChat } from "@langchain/community/chat_models/bedrock";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import {
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables";
import { LangChainAdapter } from "ai";
import { JSONLoader } from "langchain/document_loaders/fs/json";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { formatDocumentsAsString } from "langchain/util/document";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const embeddings = new BedrockEmbeddings({
  region: process.env.AWS_REGION_BEDROCK!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  model: "amazon.titan-embed-text-v2:0",
});

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

const ragPrompt = ChatPromptTemplate.fromTemplate(`
      You are an assistant for question-answering tasks. Use the following pieces of retrieved context to answer the question. If you don't know the answer, just say that you don't know. Use three sentences maximum and keep the answer concise.
        You also use the language of the question's language
      Question: {question}
Context: {context}
Answer:
    `);

const model = new BedrockChat({
  model: "anthropic.claude-3-haiku-20240307-v1:0",
  region: process.env.AWS_REGION_BEDROCK,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const docs = await loader.load();

const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});
const splits = await textSplitter.splitDocuments(docs);
const vectorStore = await MemoryVectorStore.fromDocuments(splits, embeddings);
const retriever = vectorStore.asRetriever();

const declarativeRagChain = RunnableSequence.from([
  {
    context: retriever.pipe(formatDocumentsAsString),
    question: new RunnablePassthrough(),
  },
  ragPrompt,
  model,
  new StringOutputParser(),
]);

export async function POST(req: Request) {
  const { prompt } = await req.json();
  try {
    const stream = await declarativeRagChain.stream(prompt);
    // Convert the stream to a data stream response
    return LangChainAdapter.toDataStreamResponse(stream);
  } catch (error) {
    console.error(error);
  }
}
