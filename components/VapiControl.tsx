"use client";
import { useVapi } from "@/lib/vapi";
import Transscript from "./Transscript";

interface VapiControlProps {
  bookId: string;
  title: string;
  author: string;
}

const VapiControl = ({ book }: { book: UploadedBook }) => {
  const { start, stop, messages, currentUserMessage, currentAssistantMessage } =
    useVapi(book);
  return (
    <div>
      <Transscript
        messages={messages}
        currentUserMessage={currentUserMessage}
        currentAssistantMessage={currentAssistantMessage}
      />
      {/* BUTTONS  */}
      <div>
        <button
          className="cursor-pointer border rounded-md m-5 px-5 py-2.5"
          onClick={() => start(book._id, book.title, book.author)}
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
