import { Hono } from "hono";
import fs from "fs";
import { handle } from "hono/vercel";
import { logger } from "hono/logger";
import { generatePrompt } from "@/app/utils/generatePrompt";
import { generateAudioSummary } from "@/app/lib/deepgram";
import { nanoid } from "nanoid";
import { uploadToByteScale } from "@/app/lib/upload";
import { db } from "@/db/db";
import { getBookCoverUrl } from "@/lib/book";

export interface SummaryResult {
  status: string;
  result: string;
  cost: number;
}

interface GenerateAudioSummaryRequest {
  summary: string;
}

export interface SummaryResponse {
  [key: string]: SummaryResult;
}

const app = new Hono().basePath("/api");
app.use(logger());

app.post("/generate-summary", async (c) => {
  const { bookname, author, isbn, coverId } = await c.req.json();
  const prompt_ai = generatePrompt(bookname, author, isbn);

  // Check if the summary already exists in the database
  const existingBook = await db.book.findUnique({
    where: { isbn: isbn },
    include: { summary: true },
  });

  if (existingBook && existingBook.summary) {
    return c.json({ summary: existingBook.summary.content });
  }

  const text_options = {
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
    const textResponse = await fetch(
      "https://api.edenai.run/v2/text/summarize",
      text_options,
    );
    if (!textResponse.ok) {
      throw new Error(
        `Failed to fetch the text book summary: ${textResponse.statusText}`,
      );
    }

    const textData = await textResponse.json();
    const modelKey = "anthropic/claude-3-sonnet-20240229-v1:0";
    const summaryResult = textData[modelKey]?.result;

    if (!summaryResult) {
      throw new Error("Failed to generate summary");
    }

    const cover = await getBookCoverUrl(coverId, null, "M");

    // Save the summary to the database
    const newBook = await db.book.upsert({
      where: { isbn: isbn },
      update: { title: bookname, author: author },
      create: {
        isbn: isbn,
        title: bookname,
        author: author,
        coverUrl: cover.url,
      },
    });

    await db.summary.create({
      data: {
        content: summaryResult,
        bookId: newBook.id,
      },
    });

    return c.json({ summary: summaryResult });
  } catch (error: unknown) {
    console.error("Error:", error);
    return c.json({ error: error }, 500);
  }
});

app.post("/generate-audio-summary", async (c) => {
  const { summary }: GenerateAudioSummaryRequest = await c.req.json();

  if (!summary) {
    return c.json({ error: "Summary is required" }, 400);
  }

  // Check if the audio summary already exists in the database
  const existingSummary = await db.summary.findFirst({
    where: { content: summary },
  });

  if (existingSummary && existingSummary.audioUrl) {
    return c.json({ audioUrl: existingSummary.audioUrl });
  }

  try {
    const fileNameId = nanoid();
    const fileName = `${fileNameId}.wav`;
    const filePath = await generateAudioSummary(summary, fileName);
    const bytescaleUrl = await uploadToByteScale(filePath, fileName);

    // Update the summary record with the audio URL
    await db.summary.update({
      where: { id: existingSummary?.id },
      data: { audioUrl: bytescaleUrl },
    });

    // Remove the local file after uploading
    await fs.promises.unlink(filePath);

    return c.json({ audioUrl: bytescaleUrl });
  } catch (error) {
    console.error("Error in /api/generate-audio-summary:", error);
    return c.json({ error: error }, 500);
  }
});

app.post("/add-favorite", async (c) => {
  const { userId, bookId, bookDetails, coverId } = await c.req.json();

  if (!userId || !bookId) {
    return c.json({ error: "User ID and Book ID are required" }, 400);
  }

  try {
    // Check if the book exists in the Book table
    let book = await db.book.findUnique({
      where: { id: bookId },
    });
    const coverUrl = await getBookCoverUrl(coverId, null, "M");
    // If the book does not exist, insert it
    if (!book) {
      book = await db.book.create({
        data: {
          id: bookId,
          isbn: bookDetails.isbn,
          title: bookDetails.title,
          author: bookDetails.author,
          coverUrl: coverUrl.url, // Optional
        },
      });
    }

    // Check if the book is already in the user's favorites
    const existingFavorite = await db.favorite.findUnique({
      where: { userId_bookId: { userId, bookId } },
    });

    if (existingFavorite) {
      return c.json({ message: "Book is already in favorites" }, 200);
    }

    // Add the book to the user's favorites
    const newFavorite = await db.favorite.create({
      data: {
        userId,
        bookId,
      },
    });

    return c.json({ favorite: newFavorite });
  } catch (error) {
    console.error("Error adding favorite:", error);
    return c.json({ error: error }, 500);
  }
});

export const GET = handle(app);
export const POST = handle(app);
export const DELETE = handle(app);
export const PUT = handle(app);
