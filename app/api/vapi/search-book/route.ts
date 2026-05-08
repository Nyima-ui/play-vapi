import { getBatchEmbeddingsWithNomicAPI } from "@/lib/getEmbeddings";
import connectToMongoDB from "@/lib/mongoose";
import BookSegment from "@/models/bookSegment";
import mongoose from "mongoose";
import { NextResponse, NextRequest } from "next/server";

const searchWithVectors = async (bookId: string, query: string) => {
  const embeddings = await getBatchEmbeddingsWithNomicAPI([query]);
  if (!embeddings) return null;
  const queryVector = embeddings[0];

  const results = await BookSegment.aggregate([
    {
      $vectorSearch: {
        index: "embedding_index",
        path: "embedding",
        queryVector,
        numCandidates: 50,
        limit: 3,
        filter: { bookId: new mongoose.Types.ObjectId(bookId) },
      },
    },
    {
      $project: { text: 1, score: { $meta: "vectorSearchScore" } },
    },
  ]);

  console.log(results);
  return results.map((r: { text: string }) => r.text).join("\n\n");
};

export const POST = async (request: NextRequest) => {
  try {
    await connectToMongoDB();
    const body = await request.json();

    const toolCallList =
      body?.message?.toolCallList || body?.message?.toolCalls;
    if (!toolCallList?.length) {
      return NextResponse.json({
        results: [{ result: "No tool calls found" }],
      });
    }

    const results = [];
    for (const toolCall of toolCallList) {
      const { id, function: func } = toolCall;
      const args =
        typeof func.arguments === "string"
          ? JSON.parse(func.arguments)
          : func.arguments;

      if (func.name === "searchBook") {
        const text = await searchWithVectors(args.bookId, args.query);
        results.push({
          toolCallId: id,
          result: text ?? "No relevant information found in this book.",
        });
      }
    }

    return NextResponse.json({ results });
  } catch (e) {
    console.error(`VAPI search error`, e);
    return NextResponse.json({
      results: [{ result: "Error processsing request." }],
    });
  }
};
