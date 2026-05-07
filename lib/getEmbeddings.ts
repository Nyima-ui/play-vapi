import { model } from "mongoose";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const NOMIC_API_KEY = process.env.NOMIC_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error("Missing Gemini API key.");
}

if (!NOMIC_API_KEY) {
  console.warn("Missing NOMIC_API_KEY in environment variables");
}

export const getEmbedding = async (text: string): Promise<number[]> => {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "models/gemini-embedding-001",
        content: { parts: [{ text }] },
      }),
    },
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini embedding error ${response.status}: ${err}`);
  }

  const data = await response.json();
  return data.embedding.values;
};

export const getBatchEmbeddings = async (texts: string[]) => {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:batchEmbedContents?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        requests: texts.map((text) => ({
          model: "models/gemini-embedding-001",
          content: { parts: [{ text }] },
        })),
      }),
    },
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini batch embedding error ${response.status}: ${err}`);
  }

  const data = await response.json();
  return data.embeddings.map((e: { values: number[] }) => e.values);
};

export const getBatchEmbeddingsWithNomic = async (
  texts: string[],
): Promise<number[][] | undefined> => {
  try {
    //TODO: once deployed we have to change the url
    const embeddings = await Promise.all(
      texts.map((text) =>
        fetch("http://localhost:11434/api/embeddings", {
          method: "POST",
          body: JSON.stringify({
            model: "nomic-embed-text",
            prompt: text,
          }),
        })
          .then((r) => r.json())
          .then((d) => d.embedding),
      ),
    );

    return embeddings;
  } catch (e) {
    console.error(`Error embedding with nomic model`, e);
  }
};


export const getBatchEmbeddingsWithNomicAPI = async (
  texts: string[],
): Promise<number[][]> => {
  if (!NOMIC_API_KEY) {
    throw new Error("NOMIC_API_KEY is not set in environment variables");
  }

  if (!texts || texts.length === 0) {
    throw new Error("No texts provided for embedding");
  }

  try {
    const response = await fetch("https://api-atlas.nomic.ai/v1/embedding/text", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${NOMIC_API_KEY}`,
      },
      body: JSON.stringify({
        model: "nomic-embed-text-v1.5",
        texts: texts,
        task_type: "search_document",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Nomic API error ${response.status}: ${errorText}`
      );
    }

    const data = await response.json();

    if (!data.embeddings || !Array.isArray(data.embeddings)) {
      throw new Error("Invalid response format from Nomic API - missing embeddings array");
    }

    if (data.embeddings.length !== texts.length) {
      throw new Error(
        `Nomic API returned ${data.embeddings.length} embeddings but expected ${texts.length}`
      );
    }

    return data.embeddings;
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    console.error(`Error embedding with Nomic hosted API: ${errorMessage}`, e);
    throw new Error(`Failed to get embeddings: ${errorMessage}`);
  }
};