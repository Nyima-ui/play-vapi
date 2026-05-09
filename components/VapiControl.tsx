"use client";
import { useVapi } from "@/lib/vapi";
import Transscript from "./Transscript";
import Image from "next/image";

const VapiControl = ({ book }: { book: UploadedBook }) => {
  const {
    start,
    stop,
    messages,
    currentUserMessage,
    currentAssistantMessage,
    status,
  } = useVapi(book);

  const getStatusDisplay = () => {
    switch (status) {
      case "connecting":
        return { label: "Connecting..." };
      case "starting":
        return { label: "Starting..." };
      case "listening":
        return { label: "Listening..." };
      case "thinking":
        return { label: "Thinking..." };
      case "speaking":
        return { label: "Speaking..." };
      default:
        return { label: "Ready" };
    }
  };

  const statusDisplay = getStatusDisplay();

  return (
    <div>
      <div className="flex gap-5">
        <Image height={136.5} width={91} src={book.coverUrl} alt={book.title} />
        <div>
          <div>
            <h1 className="text-3xl">{book.title}</h1>
            <p>By {book.author}</p>
          </div>

          <div>
            <p className="bg-zinc-700 px-5 py-1 rounded-md mt-3">
              {statusDisplay.label}
            </p>
          </div>
        </div>
      </div>
      <Transscript
        messages={messages}
        currentUserMessage={currentUserMessage}
        currentAssistantMessage={currentAssistantMessage}
      />
      {/* BUTTONS  */}
      <div>
        <button
          className="cursor-pointer border rounded-md m-5 px-5 py-2.5"
          onClick={start}
        >
          Speak
        </button>
        <button
          className="cursor-pointer border rounded-md m-5 px-5 py-2.5"
          onClick={stop}
        >
          Stop
        </button>
      </div>
    </div>
  );
};

export default VapiControl;
