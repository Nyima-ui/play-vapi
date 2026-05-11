interface BookUploadPayload {
  title: string;
  author: string;
  pdfUrl: string;
  coverUrl: string;
  persona: string; 
}

interface Segment {
  text: string;
  segmentIndex: number;
  wordCount: number;
}

interface UploadedBook extends BookUploadPayload {
  _id: string;
  createdAt: string;
  updatedAt: string;
  totalSegments: number;
}

interface VapiMessage {
  type: string;
  role: string;
  transcriptType: string;
  transcript: string;
}

interface Messages {
  role: string;
  text: string;
}

interface VoiceOptions {
  id: string;
  name: string;
  description: string;
}
