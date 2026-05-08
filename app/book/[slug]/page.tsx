"use client";
import { start, stop } from "../../../lib/vapi";
import { useParams } from "next/navigation";

const BookPage = () => {
  const { slug: _id } = useParams();
  const bookId = Array.isArray(_id) ? _id[0] : _id;
  if (!bookId) return <p>Cannot load the book.</p>;
  
  return (
    <div>
      <button
        className="cursor-pointer border rounded-md m-5 px-5 py-2.5"
        onClick={() => start(bookId)}
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

export default BookPage;
