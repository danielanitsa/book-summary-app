import { Hono } from "hono";
import { handle } from "hono/vercel";
import { logger } from "hono/logger";
import { generatePrompt } from "@/app/utils/generatePrompt";

export const runtime = "edge";

export interface SummaryResult {
  status: string;
  result: string;
  cost: number;
}

export interface SummaryResponse {
  [key: string]: SummaryResult;
}

const app = new Hono().basePath("/api");
app.use(logger());

app.post("/generate-summary", async (c) => {
  const { bookname, author, isbn } = await c.req.json();
  const prompt_ai: string = generatePrompt(bookname, author, isbn);

  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      authorization: `Bearer ${process.env.EDENAI_API_KEY}`,
    },
    body: JSON.stringify({
      response_as_dict: true,
      attributes_as_list: false,
      show_original_response: false,
      output_sentences: 1,
      providers: ["anthropic/claude-3-sonnet-20240229-v1:0"],
      text: prompt_ai,
    }),
  };

  try {
    const response = await fetch(
      "https://api.edenai.run/v2/text/summarize",
      options,
    );
    const data: SummaryResponse = await response.json();

    const modelKey = "anthropic/claude-3-sonnet-20240229-v1:0";
    const summaryResult = data[modelKey].result; // Accessing using bracket notation
    console.log(summaryResult);

    return c.json({ summary: summaryResult });
  } catch (error) {
    throw new Error(`${error}`);
  }
});

export const GET = handle(app);
export const POST = handle(app);
export const DELETE = handle(app);
export const PUT = handle(app);
