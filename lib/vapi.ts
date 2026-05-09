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

export const useVapi = (book: UploadedBook) => {
  const [messages, setMessages] = useState<Messages[]>([]);
  const [currentAssistantMessage, setCurrentAssistantMessage] = useState("");
  const [currentUserMessage, setCurrentUserMessage] = useState("");
  const [status, setStatus] = useState<CallStatus>("idle");
  const isStoppingRef = useRef(false);

  useEffect(() => {
    const handleMessage = (msg: VapiMessage) => {
      if (msg.type !== "transcript") return;

      if (msg.transcriptType === "final") {
        if (msg.role === "user") {
          if (!isStoppingRef.current) {
            setStatus("thinking");
          }
          setCurrentUserMessage("");
        }
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

    const handleCallStart = () => setStatus("starting");
    const handleCallEnd = () => setStatus("idle");
    const handleSpeechStart = () => setStatus("speaking");
    const handleSpeechEnd = () => {
      if (!isStoppingRef.current) setStatus("listening");
    };

    getVapi().on("call-start", handleCallStart);
    getVapi().on("call-end", handleCallEnd);
    getVapi().on("speech-start", handleSpeechStart);
    getVapi().on("speech-end", handleSpeechEnd);

    getVapi().on("message", handleMessage);

    return () => {
      getVapi().off("call-start", handleCallStart);
      getVapi().off("call-end", handleCallEnd);
      getVapi().off("speech-start", handleSpeechStart);
      getVapi().off("speech-end", handleSpeechEnd);
      getVapi().off("message", handleMessage);
    };
  }, []);

  useEffect(() => {
    console.log(status);
  }, [status]);

  const start = async () => {
    setStatus("connecting");
    try {
      getVapi().start(ASSISTANT_ID, {
        variableValues: {
          bookId: book._id,
        },
        firstMessage: `Hi! I'am your reading buddy. What would you like to discuss about ${book.title} by ${book.author}`,
      });
    } catch (e) {
      console.error(`Failed to start call: ${e}`);
    }
  };

  const stop = async () => {
    isStoppingRef.current = true;
    getVapi().stop();
  };

  return {
    start,
    stop,
    messages,
    currentUserMessage,
    currentAssistantMessage,
    status,
  };
};
