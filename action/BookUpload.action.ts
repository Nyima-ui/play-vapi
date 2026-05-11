"use server";
import {
  getBatchEmbeddingsWithNomicAPI,
  getEmbedding,
} from "@/lib/getEmbeddings";
import connectToMongoDB from "@/lib/mongoose";
import BookUpload from "@/models/bookPdf";
import BookSegment from "@/models/bookSegment";
import { unstable_noStore as noStore } from "next/cache";

export const UploadBookPdf = async (payload: BookUploadPayload) => {
  try {
    await connectToMongoDB();

    const book = await BookUpload.create({
      title: payload.title,
      author: payload.author,
      pdfUrl: payload.pdfUrl,
      coverUrl: payload.coverUrl,
      persona: payload.persona
    });

    // VALIDATE THAT BOOK WAS CREATED WITH AN ID
    if (!book || !book._id) {
      throw new Error("Book created but missing _id");
    }

    const bookData = book.toObject();
    return {
      success: true,
      data: { ...bookData, _id: book._id.toString() },
    };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    console.error("Error uploading pdf of the book:", errorMessage, e);
    return {
      success: false,
      error: errorMessage,
    };
  }
};

const delay = async (ms: number) => new Promise((res) => setTimeout(res, ms));

export const getEmbeddingWithRetry = async (
  text: string,
  retries: number = 3,
): Promise<number[]> => {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await getEmbedding(text);
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      const isRateLimit = message.includes("429");
      const isLastAttempt = attempt === retries - 1;

      if (!isRateLimit || isLastAttempt) throw e;

      const backOff = 2 ** attempt * 1000;
      console.warn(`Rate limited. Retrying in: ${backOff}ms...`);
      await new Promise((res) => setTimeout(res, backOff));
    }
  }
  throw new Error("Uncreachable");
};

export const getEmbeddingWithNomic = async (text: string) => {
  try {
    const response = await fetch("http://localhost:11434/api/embeddings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "nomic-embed-text",
        prompt: text,
      }),
    });

    const data = await response.json();
    const embedding = data.embedding;

    return embedding;
  } catch (e) {
    console.error(`Error embedding using nomic ollama model`, e);
  }
};

const BATCH_SIZE = 20;
const BATCH_DELAY_MS = 1000;

export const UploadBookSegments = async (
  bookId: string,
  segments: Segment[],
) => {
  try {
    await connectToMongoDB();

    if (!bookId) {
      throw new Error("bookId is required");
    }

    const chunks: Segment[][] = [];
    for (let i = 0; i < segments.length; i += BATCH_SIZE) {
      chunks.push(segments.slice(i, i + BATCH_SIZE));
    }

    console.log(
      `Processing ${segments.length} segments in ${chunks.length} batches...`,
    );

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      console.log(
        `Batch ${i + 1}/${chunks.length} - embedding ${chunk.length} segments.`,
      );

      const embeddings = await getBatchEmbeddingsWithNomicAPI(
        chunk.map((s) => s.text),
      );

      // embeddings function now throws on error, so no need to check for undefined
      await BookSegment.insertMany(
        chunk.map((segment, j) => ({
          bookId,
          text: segment.text,
          segmentIndex: segment.segmentIndex,
          wordCount: segment.wordCount,
          embedding: embeddings[j],
        })),
      );

      if (i < chunks.length - 1) {
        await delay(BATCH_DELAY_MS);
      }
    }

    return {
      success: true,
      totalSegments: segments.length,
    };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    console.error("Error uploading pdf segments:", errorMessage, e);
    return {
      success: false,
      error: errorMessage,
    };
  }
};

export const updateTotalSegments = async (
  bookId: string,
  totalSegments: number,
) => {
  try {
    await connectToMongoDB();

    await BookUpload.findByIdAndUpdate(bookId, { $set: { totalSegments } });
  } catch (e) {
    console.error(`Error updating total segments of book document`, e);
    return {
      success: false,
      error: e,
    };
  }
};

export const fetchBooks = async () => {
  noStore();
  try {
    await connectToMongoDB();

    const data = await BookUpload.find().lean();

    const books = data.map((book) => ({
      ...book,
      _id: book._id.toString(),
    }));

    return {
      success: true,
      data: books,
    };
  } catch (e) {
    console.error(`Error fetching uploaded book`, e);
    return {
      success: false,
      error: e,
    };
  }
};

export const fetchBookById = async (bookId: string) => {
  try {
    await connectToMongoDB();

    const book = await BookUpload.findOne({ _id: bookId }).lean();

    return {
      success: true,
      data: { ...book, _id: book._id.toString() },
    };
    
  } catch (e) {
    console.error(`Error fetching book using id`, e);
    return {
      success: false,
      error: e,
    };
  }
};
