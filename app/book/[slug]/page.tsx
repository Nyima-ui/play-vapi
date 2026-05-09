import { fetchBookById } from "@/action/BookUpload.action";
import VapiControl from "@/components/VapiControl";
import Image from "next/image";

const BookPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug: bookId } = await params;

  const result = await fetchBookById(bookId);
  const book = result.data ? result.data : {};

  return (
    <div>
      <div className="border">


        <VapiControl book={book} />
      </div>
    </div>
  );
};

export default BookPage;
