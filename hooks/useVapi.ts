"use client";
import Vapi from "@vapi-ai/web";
import { useEffect, useState, useRef } from "react";

const VAPI_API_KEY = process.env.NEXT_PUBLIC_VAPI_API_KEY!;
const ASSISTANT_ID = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_KEY!;

let vapi: InstanceType<typeof Vapi>;

type CallStatus =
  | "idle"
  | "connecting"
  | "starting"
  | "listening"
  | "thinking"
  | "speaking";

const getVapi = () => {
  if (!vapi) {
    if (!VAPI_API_KEY) {
      throw new Error("VAPI_API_KEY is not set.");
    }
    vapi = new Vapi(VAPI_API_KEY);
  }
  return vapi;
};


export const useVapi = async () => {
    
};
