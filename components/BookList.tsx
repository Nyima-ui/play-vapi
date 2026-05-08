import { fetchBooks } from "@/action/BookUpload.action";
import Link from "next/link";

const BookList = async () => {
  const result = await fetchBooks();
  const books = result.data ? result.data : [];
  return (
    <ul>
      {books.map((b) => (
        <li key={b._id}>
          <Link href={`/book/${b._id}`}>{b.title} </Link>
        </li>
      ))}
    </ul>
  );
};

export default BookList;
