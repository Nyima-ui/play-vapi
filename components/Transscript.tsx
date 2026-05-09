

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
          {msg.text}
        </p>
      ))}

      {currentAssistantMessage && (
        <p className="mt-5 max-w-lg">{currentAssistantMessage}</p>
      )}
      {currentUserMessage && (
        <p className="bg-gray-800 px-5 py-2.5 rounded-md self-end mt-5 max-w-lg">
          {currentUserMessage}
        </p>
      )}
    </div>
  );
};

export default Transscript;
