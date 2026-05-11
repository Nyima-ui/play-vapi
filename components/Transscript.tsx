interface TransscriptProps {
  messages: Messages[];
  currentUserMessage: string;
  currentAssistantMessage: string;
}

const Transscript = ({
  messages,
  currentAssistantMessage,
  currentUserMessage,
}: TransscriptProps) => {
  return (
    <div className="border h-96 overflow-auto px-10 pb-10 flex flex-col">
      {messages.map((msg, idx) => (
        <p
          key={idx}
          className={`${msg.role === "assistant" ? "" : "bg-gray-800 px-5 py-2.5 rounded-md self-end"} mt-5 max-w-lg`}
        >
          <span className="text-red-500">final message</span>
          {msg.text}
        </p>
      ))}

      {currentAssistantMessage && (
        <p className="mt-5 max-w-lg">
          <span className="text-red-500">partial assistant message</span>
          {currentAssistantMessage}
        </p>
      )}
      {currentUserMessage && (
        <p className="bg-gray-800 px-5 py-2.5 rounded-md self-end mt-5 max-w-lg">
          <span className="text-red-500">partial user message</span>
          {currentUserMessage}
        </p>
      )}
    </div>
  );
};

export default Transscript;
