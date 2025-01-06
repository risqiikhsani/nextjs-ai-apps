
import { streamText } from 'ai';
import { createAmazonBedrock } from '@ai-sdk/amazon-bedrock';

const bedrock = createAmazonBedrock({
    region: process.env.AWS_REGION_BEDROCK,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_ID,
});



// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();
  console.log(messages);

  const result = streamText({
    model: bedrock("anthropic.claude-3-haiku-20240307-v1:0"),
    messages,
  });

  return result.toDataStreamResponse();
}