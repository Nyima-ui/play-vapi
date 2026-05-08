import Vapi from "@vapi-ai/web";

const VAPI_API_KEY = process.env.NEXT_PUBLIC_VAPI_API_KEY!;
const ASSISTANT_ID = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_KEY!;

const vapi = new Vapi(VAPI_API_KEY);

export const start = async (
  bookId: string,
  bookTitle: string,
  bookAuthor: string,
) => {
  vapi.start(ASSISTANT_ID, {
    variableValues: {
      bookId: bookId,
    },
    firstMessage: `Hi! I'am your reading buddy. What would you like to discuss about ${bookTitle} by ${bookAuthor}`,
  });
};

export const stop = async () => {
  vapi.stop();
};

vapi.on("message", (msg) => {
  if (msg.type === "transcript") {
    console.log(msg.role, msg.transcript);
  }
});
