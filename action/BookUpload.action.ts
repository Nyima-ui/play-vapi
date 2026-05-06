"use server";
import { getBatchEmbeddings, getEmbedding } from "@/lib/getEmbeddings";
import connectToMongoDB from "@/lib/mongoose";
import BookUpload from "@/models/bookPdf";
import BookSegment from "@/models/bookSegment";

export const UploadBookPdf = async (payload: BookUploadPayload) => {
  try {
    await connectToMongoDB();

    const book = await BookUpload.create({
      title: payload.title,
      author: payload.author,
      pdfUrl: payload.pdfUrl,
      coverUrl: payload.coverUrl,
    });

    return {
      success: true,
      data: { ...book.toObject(), _id: book._id.toString() },
    };
  } catch (e) {
    console.error("Error uploading pdf of the book", e);
    return {
      success: false,
      error: e,
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

const BATCH_SIZE = 20;
const BATCH_DELAY_MS = 1000;

export const UploadBookSegments = async (
  bookId: string,
  segments: Segment[],
) => {
  try {
    await connectToMongoDB();

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

      const embeddings = await getBatchEmbeddings(chunk.map((s) => s.text));

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
    console.error("Error uploading pdf segments", e);
    return {
      success: false,
      error: e,
    };
  }
};
