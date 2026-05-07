import { NextResponse, NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
  } catch (e) {
    console.error(`VAPI search error`, e);
    return NextResponse.json({
      results: [{ result: "Error processsing request." }],
    });
  }
};
