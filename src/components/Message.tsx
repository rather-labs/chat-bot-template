import React from "react";

interface MessageProps {
  sender: "user" | "bot";
  text: string;
}

const Message: React.FC<MessageProps> = ({ sender, text }) => {
  const isUser = sender === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xs p-3 rounded-lg ${
          isUser ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
        }`}
      >
        {text}
      </div>
    </div>
  );
};

export default Message;
