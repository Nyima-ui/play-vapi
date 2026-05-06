import { NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const segments: Segment[] = [
  {
    text: "The sun slowly rose above the quiet hills casting a warm golden light",
    segmentIndex: 0,
    wordCount: 14,
  },
  {
    text: "A gentle breeze moved through the trees making the leaves whisper softly",
    segmentIndex: 1,
    wordCount: 13,
  },
  {
    text: "He opened his laptop determined to finish the project he had started yesterday",
    segmentIndex: 2,
    wordCount: 14,
  },
  {
    text: "The coffee beside him had gone cold but he barely noticed as he kept typing",
    segmentIndex: 3,
    wordCount: 16,
  },
  {
    text: "Hours passed quickly as lines of code turned into something functional and meaningful",
    segmentIndex: 4,
    wordCount: 14,
  },
  {
    text: "He paused for a moment stretching his arms and looking out the window",
    segmentIndex: 5,
    wordCount: 14,
  },
  {
    text: "There was a quiet satisfaction in building something from nothing with patience",
    segmentIndex: 6,
    wordCount: 13,
  },
  {
    text: "Even though challenges appeared he found himself enjoying the process more each day",
    segmentIndex: 7,
    wordCount: 14,
  },
  {
    text: "By the end of the day he had made real progress and felt proud",
    segmentIndex: 8,
    wordCount: 15,
  },
];

export const GET = async () => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:batchEmbedContents?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requests: segments.map((segment) => ({
            model: "models/gemini-embedding-001",
            content: { parts: [{ text: segment.text }] },
          })),
        }),
      },
    );

    const data = await response.json();

    const formatted = data.embeddings.map(
      (e: { values: number[] }) => e.values,
    );
    
    return NextResponse.json({ success: true, formatted });

  } catch (e) {
    console.error("Error vectorizing seed text", e);
    return NextResponse.json({
      success: false,
      error: e instanceof Error ? e.message : e,
    });
  }
};
