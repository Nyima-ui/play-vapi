interface BookUploadPayload {
  title: string;
  author: string;
  pdfUrl: string;
  coverUrl: string;
}

interface Segment {
  text: string;
  segmentIndex: number;
  wordCount: number;
}
