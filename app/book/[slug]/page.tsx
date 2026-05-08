import { fetchBookById } from "@/action/BookUpload.action";
import VapiControl from "@/components/VapiControl";
import Image from "next/image";
import Transscript from "@/components/Transscript";

const BookPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug: bookId } = await params;

  const result = await fetchBookById(bookId);
  const book = result.data ? result.data : {};

  return (
    <div>
      <div className="border">
        <div className="flex gap-5">
          <Image
            height={136.5}
            width={91}
            src={book.coverUrl}
            alt={book.title}
          />
          <div>
            <h1 className="text-3xl">{book.title}</h1>
            <p>By {book.author}</p>
          </div>
        </div>

        <VapiControl book={book} />
      </div>
    </div>
  );
};

export default BookPage;
