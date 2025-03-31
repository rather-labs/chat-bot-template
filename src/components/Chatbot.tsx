"use client";
import type React from "react";
import { useState, useRef } from "react";
import { sendMessage } from "./Server";
import Message from "./Message";
import type OpenAI from "openai";

interface MessageType {
  sender: "user" | "bot";
  text: string;
  id: string;
}


const exampleQuestions = [
  "What can you help me with?",
  "What is the current price of BTC in CoinMarketCap?",
  "What is the current price of ETH in CoinMarketCap?",
  "Can you list the assets with the highest price from CoinMarketCap?",
  "Can you list the assets with the highest market cap from CoinMarketCap?",
  "Tell me the available information regarding BTC from CoinMarketCap",
];

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [prompts, setPrompts] = useState<OpenAI.ChatCompletionMessageParam[]>(
    []
  );
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  async function handleSend(messageText: string = input) {
    if ((!messageText.trim() && !input.trim()) || isLoading) return;
    
    const textToSend = messageText.trim() || input.trim();
    setIsLoading(true);
    
    // Add user message
    const newMessage: MessageType = { 
      sender: "user", 
      text: textToSend, 
      id: `user-${Date.now()}` 
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    
    // Scroll immediately after user message is added
    setTimeout(scrollToBottom, 100);

    try {
      // Simulate bot response (replace with actual API call)
      const response = await sendMessage(prompts, textToSend);
      const botMessage: MessageType = {
        sender: "bot",
        text: response[response.length - 1].content as string,
        id: `bot-${Date.now()}`
      };
      setPrompts(response);
      setMessages((prevMessages) => [...prevMessages, botMessage]);
      
      // Scroll again after bot message is added
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      console.error("Error sending message:", error);
      // Optionally add error handling UI here
    } finally {
      setIsLoading(false);
      setInput("");
    }
  }

  return (
    <div className="flex w-full max-w-4xl mx-auto h-[70vh]">
      {/* Main Chat Container */}
      <div className="flex flex-col flex-grow border border-gray-700 rounded-lg shadow-lg bg-gray-900 mr-4">
        {/* Chat Window */}
        <div className="flex-1 overflow-y-auto p-3 bg-gray-800 space-y-3 rounded-t-lg">
          {messages.map((msg) => (
            <Message key={msg.id} sender={msg.sender} text={msg.text} />
          ))}
          
          {/* Empty div for auto-scrolling */}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Section */}
        <div className="flex items-center p-2 bg-gray-900 border-t border-gray-700 rounded-b-lg">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="flex-1 p-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-gray-200 placeholder-gray-500 text-base"
            disabled={isLoading}
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            type="button"
            className={`ml-2 px-4 py-2 text-white rounded-md transition text-base ${
              isLoading || !input.trim() ? "bg-blue-900 text-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-1 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-labelledby="loadingIcon">
                  <title id="loadingIcon">Loading spinner</title>
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Waiting...
              </span>
            ) : (
              "Send"
            )}
          </button>
          <button
            onClick={() => {
              setPrompts([]);
              setMessages([]);
            }}
            disabled={isLoading}
            type="button"
            className={`ml-2 px-4 py-2 text-white rounded-md transition text-base ${
              isLoading ? "bg-gray-700 text-gray-500 cursor-not-allowed" : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            Clear
          </button>
        </div>
      </div>
      
      {/* Sidebar with Examples */}
      <div className={`w-64 bg-gray-900 border border-gray-700 rounded-lg shadow-lg p-3 transition-opacity ${isLoading ? 'opacity-60' : 'opacity-100'}`}>
        <div className="flex flex-col space-y-2">
          <p className="text-base text-gray-400 font-medium border-b border-gray-700 pb-1 mb-1">
            {isLoading ? 'Waiting for response...' : 'Example Questions'}
          </p>
          {exampleQuestions.map((question) => (
            <button
              key={`example-${question}`}
              onClick={() => handleSend(question)}
              disabled={isLoading}
              type="button"
              className={`px-3 py-2 border border-gray-700 rounded-lg text-base text-left transition-colors ${
                isLoading 
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed opacity-60" 
                  : "bg-gray-800 text-blue-300 hover:bg-gray-700"
              }`}
            >
              {question}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
