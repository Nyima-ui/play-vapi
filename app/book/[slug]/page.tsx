import { fetchBookById } from "@/action/BookUpload.action";
import VapiControl from "@/components/VapiControl";

const BookPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug: bookId } = await params;

  const result = await fetchBookById(bookId);
  const book = result.data ? result.data : {};

  return (
    <div>
      <VapiControl bookId={bookId} title={book.title} author={book.author} />
    </div>
  );
};

export default BookPage;
