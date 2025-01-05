
import { StringOutputParser } from '@langchain/core/output_parsers';
import { LangChainAdapter } from 'ai';

import { BedrockChat } from "@langchain/community/chat_models/bedrock";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer";

const resumePolisher = ChatPromptTemplate.fromTemplate(
    `
  Analyze and enhance the following resume content: '{prompt}' for a {position_name} position.
  Focus on:
  1. Highlighting relevant skills and experiences
  2. Using impactful action verbs
  3. Quantifying achievements where possible
  4. Maintaining professional tone and formatting
  
  Return only the enhanced resume content without explanations.
      `,
)

const resumePolisherWithJobUrl = ChatPromptTemplate.fromTemplate(
  `
  Job Description Context: '{extracted_job_descriptions}'
  
  Analyze and enhance the following resume content: '{prompt}' for a {position_name} position.
  Focus on:
  1. Aligning skills and experiences with the job requirements
  2. Using relevant keywords from the job description
  3. Highlighting matching qualifications
  4. Quantifying achievements that relate to the role
  
  Return only the enhanced resume content without explanations.
  `,
)


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

    // Destructure incoming request data
    const { prompt, position_name,job_url } = data;

    if (!position_name) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields: position_name.",
        }),
        { status: 400 }
      );
    }



    let extracted_job_descriptions = "";
    if (job_url) {
      const webLoader = new PuppeteerWebBaseLoader(job_url,  {
        launchOptions: {
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        },
        gotoOptions: {
          waitUntil: "domcontentloaded",
        },
        async evaluate(page) {
          const selectors = [
            '.job-description',
            '#job-details',
            '[data-test="job-description"]',
          ];
          
          for (const selector of selectors) {
            const element = await page.$(selector);
            if (element) {
              const text = await page.evaluate(el => el.textContent || '', element);
              return Promise.resolve(text);
            }
          }
          // Fallback to body content if no specific selectors match
          const bodyText = await page.evaluate(() => document.body.textContent || '');
          return Promise.resolve(bodyText);
        }
      });
      const documents = await webLoader.load();
      extracted_job_descriptions = documents.map((doc) => doc.pageContent).join("\n");
      console.log("Extracted Job Description:", extracted_job_descriptions);
    }
    // Choose the appropriate prompt template
    const prompt_template = job_url ? resumePolisherWithJobUrl : resumePolisher
    // const input = job_url ? {extracted_job_descriptions,prompt,position_name}:{prompt,position_name}

    // Create output parser
    const parser = new StringOutputParser();

    // Create the translation chain and stream the response
    const chain = prompt_template.pipe(model).pipe(parser);
    const stream = await chain.stream({extracted_job_descriptions,prompt,position_name});

    // Convert the stream to a data stream response
    return LangChainAdapter.toDataStreamResponse(stream);
}