"use client";
import { useRef, useState } from "react";
import { parsePdf } from "@/lib/utils";
import { upload } from "@vercel/blob/client";
import { UploadBookPdf, UploadBookSegments } from "@/action/BookUpload.action";

const UploadForm = () => {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData(e.target);

      const title = (formData.get("title") as string)
        .replace(/\s+/g, "-")
        .toLowerCase();
      const author = formData.get("author") as string;
      const pdfFile = formData.get("pdf-file") as File;

      // PARSE PDF
      const parsedPdf = await parsePdf(pdfFile);

      //UPLOAD PDF FILE
      const uploadedPdfBlob = await upload(title, pdfFile, {
        access: "public",
        handleUploadUrl: "api/upload",
        contentType: "application/pdf",
      });
      const pdfUrl = uploadedPdfBlob.url;

      //UPLOAD PDF COVER
      const coverBlob = parsedPdf.coverBlob;
      const uploadedCoverBlob = await upload(`${title}_cover.png`, coverBlob, {
        access: "public",
        handleUploadUrl: "api/upload",
        contentType: "image/png",
      });
      const coverUrl = uploadedCoverBlob.url;

      const result = await UploadBookPdf({
        title,
        author,
        pdfUrl,
        coverUrl,
      });

      // CHECK IF PDF UPLOAD WAS SUCCESSFUL
      if (!result.success || !result.data?._id) {
        console.error("Failed to upload book PDF:", result.error);
        throw new Error("Failed to save book to database");
      }

      // SAVE THE SEGMENTS
      const data = await UploadBookSegments(result.data._id, parsedPdf.content);

      if (!data.success) {
        console.error("Failed to upload segments:", data.error);
        throw new Error("Failed to save book segments");
      }

      console.log("Successfully uploaded", data.totalSegments, "segments");
    } catch (e) {
      console.error(`Error uploading book ${e}`);
    } finally {
      setLoading(false);
      formRef.current?.reset();
    }
  };

  return (
    <form onSubmit={handleSubmit} ref={formRef}>
      <div>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          className="border"
          required
        />
      </div>
      <div>
        <label htmlFor="author">Author</label>
        <input
          type="text"
          id="author"
          name="author"
          className="border"
          required
        />
      </div>
      <div>
        <label htmlFor="pdf-file">Pdf File</label>
        <input
          type="file"
          accept="application/pdf, .pdf"
          id="pdf-file"
          name="pdf-file"
          className="border"
          required
        />
      </div>

      <button type="submit" className="border m-5 px-5 py-2 rounded-md">
        {loading && (
          <span className="size-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin inline-block mr-2"></span>
        )}
        Submit
      </button>
      
    </form>
  );
};

export default UploadForm;
