"use client";
import { start, stop } from "../lib/vapi";

interface VapiControlProps {
  bookId: string;
  title: string;
  author: string;
}

const VapiControl = ({ bookId, title, author }: VapiControlProps) => {
  return (
    <div>
      <button
        className="cursor-pointer border rounded-md m-5 px-5 py-2.5"
        onClick={() => start(bookId, title, author)}
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
  );
};

export default VapiControl;
