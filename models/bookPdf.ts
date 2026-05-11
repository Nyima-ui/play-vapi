import { Schema, model, models } from "mongoose";

const BookUploadSchema = new Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    pdfUrl: { type: String, required: true },
    coverUrl: { type: String },
    persona: { type: String },
    totalSegments: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const BookUpload = models.BookUpload || model("BookUpload", BookUploadSchema);

export default BookUpload;
