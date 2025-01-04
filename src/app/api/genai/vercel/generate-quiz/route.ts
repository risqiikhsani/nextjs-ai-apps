import { questionSchema, questionsSchema } from "@/lib/schemas";
import { streamObject } from "ai";
import { createAmazonBedrock } from "@ai-sdk/amazon-bedrock";
export const maxDuration = 60;

const bedrock = createAmazonBedrock({
  region: process.env.AWS_REGION_BEDROCK,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_ID,
});

export async function POST(req: Request) {
  const { files } = await req.json();
  const firstFile = files[0].data;

  const result = streamObject({
    model: bedrock("anthropic.claude-3-haiku-20240307-v1:0"),
    messages: [
      {
        role: "system",
        content:
          "You are a teacher. Your job is to take a document, and create a multiple choice test (with 4 questions) based on the content of the document. Each option should be roughly equal in length.",
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Create a multiple choice test based on this document.",
          },
          {
            type: "file",
            data: firstFile,
            mimeType: "application/pdf",
          },
        ],
      },
    ],
    schema: questionSchema,
    output: "array",
    onFinish: ({ object }) => {
      const res = questionsSchema.safeParse(object);
      if (res.error) {
        throw new Error(res.error.errors.map((e) => e.message).join("\n"));
      }
    },
  });

  return result.toTextStreamResponse();
}
