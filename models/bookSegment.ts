import { Schema, model, models } from "mongoose";

const BookSegmentSchema = new Schema({
  bookId: { type: Schema.Types.ObjectId, ref: "BookUpload", required: true },
  text: { type: String, required: true },
  segmentIndex: { type: Number, required: true },
  wordCount: { type: Number, required: true },
  embedding: { type: [Number], required: true },
});

const BookSegment = models.BookSegment || model("BookSegment", BookSegmentSchema);
export default BookSegment