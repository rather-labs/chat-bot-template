"use client";
import React, { useState } from "react";
import { sendMessage } from "./Server";
import Message from "./Message";
import OpenAI from "openai";

interface MessageType {
  sender: "user" | "bot";
  text: string;
}

const Chatbot: React.FC = () => {
  // TODO: Implement multiple chat tabs
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [prompts, setPrompts] = useState<OpenAI.ChatCompletionMessageParam[]>(
    []
  );
  const [input, setInput] = useState<string>("");

  async function handleSend() {
    if (!input.trim()) return;

    // Add user message
    const newMessage: MessageType = { sender: "user", text: input };
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    // Simulate bot response (replace with actual API call)
    const response = await sendMessage(prompts, input);
    const botMessage: MessageType = {
      sender: "bot",
      text: response[response.length - 1].content as string,
    };
    setPrompts(response);
    setMessages((prevMessages) => [...prevMessages, botMessage]);
    setInput("");
  }

  return (
    <div className="flex flex-col w-full max-w-md mx-auto h-[80vh] border rounded-lg shadow-lg">
      {/* Chat Window */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-100 space-y-3">
        {messages.map((msg, index) => (
          <Message key={index} sender={msg.sender} text={msg.text} />
        ))}
      </div>

      {/* Input Section */}
      <div className="flex items-center p-3 bg-white border-t">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSend}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
          Send
        </button>
        <button
          onClick={() => {
            setPrompts([]);
            setMessages([]);
          }}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
