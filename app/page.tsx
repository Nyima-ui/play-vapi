import UploadForm from "@/components/UploadForm";

import BookList from "@/components/BookList";

export default function Home() {
  return (
    <div>
      <BookList />
      <UploadForm />
    </div>
  );
}
