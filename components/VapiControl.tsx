"use client";
import { useVapi } from "@/lib/vapi";
import Transscript from "./Transscript";
import Image from "next/image";

const VapiControl = ({ book }: { book: UploadedBook }) => {
  const {
    start,
    stop,
    sendTextToVoiceCall,
    setUserTextMessage,
    setMessages,
    userTextMessage,
    messages,
    currentUserMessage,
    currentAssistantMessage,
    pendingTextRef,
    status,
  } = useVapi(book);

  const handleSend = async () => {
    if (!userTextMessage.trim()) return;
    if (status === "idle") {
      pendingTextRef.current = userTextMessage;
      setMessages((prev) => [...prev, { role: "user", text: userTextMessage }]);
      await start();
    } else {
      sendTextToVoiceCall();
    }
    setUserTextMessage("");
  };

  const getStatusDisplay = () => {
    switch (status) {
      case "connecting":
        return { label: "Connecting..." };
      case "starting":
        return { label: "Starting..." };
      case "listening":
        return { label: "Listening..." };
      case "thinking":
        return { label: "Thinking..." };
      case "speaking":
        return { label: "Speaking..." };
      default:
        return { label: "Ready" };
    }
  };

  const statusDisplay = getStatusDisplay();

  return (
    <div>
      <div className="flex gap-5">
        <Image height={136.5} width={91} src={book.coverUrl} alt={book.title} />
        <div>
          <div>
            <h1 className="text-3xl">{book.title}</h1>
            <p>By {book.author}</p>
          </div>

          <div>
            <p className="bg-zinc-700 px-5 py-1 rounded-md mt-3">
              {statusDisplay.label}
            </p>
          </div>
        </div>
      </div>
      <Transscript
        messages={messages}
        currentUserMessage={currentUserMessage}
        currentAssistantMessage={currentAssistantMessage}
      />

      <div className="px-5">
        <label htmlFor="user-prompt" className="sr-only">
          Type a message
        </label>
        <textarea
          name="user-prompt"
          id="user-prompt"
          value={userTextMessage}
          onChange={(e) => setUserTextMessage(e.target.value)}
          className="w-full border border-white focus:ring-2 focus:ring-blue-400 focus:outline-none focus:border-transparent rounded-md h-30 resize-none py-1 px-1.5"
          placeholder="Ask something about the book..."
        ></textarea>
        <div>
          <button
            type="button"
            onClick={handleSend}
            className="px-5 py-1.5 border rounded-md ml-auto block cursor-pointer active:scale-95"
          >
            Send
          </button>
        </div>
      </div>
      {/* BUTTONS  */}
      <div>
        <button
          className="cursor-pointer border rounded-md m-5 px-5 py-2.5"
          onClick={start}
        >
          Speak
        </button>
        <button
          className="cursor-pointer border rounded-md m-5 px-5 py-2.5"
          onClick={stop}
        >
          Stop
        </button>
      </div>
    </div>
  );
};

export default VapiControl;
// yeah, I would like to know about David's relationshop with his brother.

/*
User text "send" flow when starting the conversation: 
1. user send text
2. render user text on the web
2. connect the call
2. toggle the states accordingly
3. don't say that "hey, i am your reading buddy, blah blah"
4. send the user text message to vapi api
5. toggle the status accordingly
6. let ai speak out the response
7. toggle the status accordingly
*/
