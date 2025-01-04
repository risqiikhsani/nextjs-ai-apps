"use server";

import { createAmazonBedrock } from "@ai-sdk/amazon-bedrock";
import { generateObject } from "ai";
import { z } from "zod";

const bedrock = createAmazonBedrock({
  region: process.env.AWS_REGION_BEDROCK,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_ID,
});

export const generateQuizTitle = async (file: string) => {
  const result = await generateObject({
    model: bedrock("anthropic.claude-3-haiku-20240307-v1:0"),
    schema: z.object({
      title: z
        .string()
        .describe(
          "A max three word title for the quiz based on the file provided as context"
        ),
    }),
    prompt:
      "Generate a title for a quiz based on the following (PDF) file name. Try and extract as much info from the file name as possible. If the file name is just numbers or incoherent, just return quiz.\n\n " +
      file,
  });
  return result.object.title;
};
