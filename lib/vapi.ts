"use client";
import Vapi from "@vapi-ai/web";
import { useEffect, useState } from "react";

const VAPI_API_KEY = process.env.NEXT_PUBLIC_VAPI_API_KEY!;
const ASSISTANT_ID = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_KEY!;

let vapi: InstanceType<typeof Vapi>;

const getVapi = () => {
  if (!vapi) {
    if (!VAPI_API_KEY) {
      throw new Error("VAPI_API_KEY is not set.");
    }
    vapi = new Vapi(VAPI_API_KEY);
  }
  return vapi;
};

export const useVapi = (book: UploadedBook) => {
  const [messages, setMessages] = useState<Messages[]>([]);
  const [currentAssistantMessage, setCurrentAssistantMessage] = useState("");
  const [currentUserMessage, setCurrentUserMessage] = useState("");

  useEffect(() => {
    const handleMessage = (msg: VapiMessage) => {
      if (msg.type !== "transcript") return;

      if (msg.transcriptType === "final") {
        if (msg.role === "user") setCurrentUserMessage("");
        if (msg.role === "assistant") setCurrentAssistantMessage("");

        setMessages((prev) => {
          const isDupe = prev.some(
            (m) => m.role === msg.role && m.text === msg.transcript,
          );

          return isDupe
            ? prev
            : [...prev, { role: msg.role, text: msg.transcript }];
        });
      }

      if (msg.role === "assistant" && msg.transcriptType === "partial") {
        setCurrentAssistantMessage(msg.transcript);
      }
      if (msg.role === "user" && msg.transcriptType === "partial") {
        setCurrentUserMessage(msg.transcript);
      }
    };

    getVapi().on("message", handleMessage);

    return () => {
      getVapi().off("message", handleMessage);
    };
  }, []);

  const start = async (
    bookId: string,
    bookTitle: string,
    bookAuthor: string,
  ) => {
    try {
      getVapi().start(ASSISTANT_ID, {
        variableValues: {
          bookId: bookId,
        },
        firstMessage: `Hi! I'am your reading buddy. What would you like to discuss about ${bookTitle} by ${bookAuthor}`,
      });
    } catch (e) {
      console.error(`Failed to start call: ${e}`);
    }
  };

  const stop = async () => {
    getVapi().stop();
  };

  return {
    start,
    stop,
    messages,
    currentUserMessage,
    currentAssistantMessage,
  };
};
