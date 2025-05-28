"use client";
import type React from "react";
import { useState, useRef, useEffect } from "react";
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
  "Tell me the available information regarding BTC from CoinMarketCap",
  "What is the current price of ETH in CoinMarketCap?",
  "Can you list the assets with the highest price from CoinMarketCap?",
  "Can you list the assets with the highest market cap from CoinMarketCap?",
];

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [prompts, setPrompts] = useState<OpenAI.ChatCompletionMessageParam[]>(
    []
  );
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    <div className="flex flex-col w-full max-w-4xl mx-auto h-[calc(85vh-8rem)]">
      {/* Main Chat Container */}
      <div className="flex flex-col h-full border border-gray-700 rounded-lg shadow-lg bg-gray-900">
        {/* Chat Window */}
        <div className="flex-1 overflow-y-auto p-3 bg-gray-800 space-y-3 rounded-t-lg">
          {messages.map((msg) => (
            <Message key={msg.id} sender={msg.sender} text={msg.text} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Ask me about button */}
        <div className="px-2 py-1 bg-gray-900 border-t border-gray-700">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-full px-3 py-1.5 text-sm text-white hover:text-gray-200 border border-blue-500 rounded-md transition-colors flex items-center justify-center space-x-1"
            type="button"
            aria-label="Show example questions"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-labelledby="questionIcon">
              <title id="questionIcon">Question mark icon</title>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Ask me about</span>
          </button>
        </div>

        {/* Input Section */}
        <div className="flex items-center p-2 bg-gray-900 border-t border-gray-700 rounded-b-lg">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="flex-1 p-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white placeholder-gray-400 text-base"
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

      {/* Popup Menu for Example Questions */}
      <div 
        ref={mobileMenuRef}
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className={`absolute bottom-0 left-0 right-0 bg-gray-800 rounded-t-xl transform transition-transform duration-300 ${
          isMobileMenuOpen ? 'translate-y-0' : 'translate-y-full'
        }`}>
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <p className="text-base text-white font-medium">
                {isLoading ? 'Waiting for response...' : 'Example Questions'}
              </p>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-white hover:text-gray-200"
                aria-label="Close menu"
                type="button"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-labelledby="closeIcon">
                  <title id="closeIcon">Close icon</title>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-2 max-h-[50vh] overflow-y-auto">
              {exampleQuestions.map((question) => (
                <button
                  key={`example-${question}`}
                  onClick={() => {
                    handleSend(question);
                    setIsMobileMenuOpen(false);
                  }}
                  disabled={isLoading}
                  type="button"
                  className={`w-full px-3 py-2 border border-gray-700 rounded-lg text-base text-left transition-colors ${
                    isLoading 
                      ? "bg-gray-700 text-gray-400 cursor-not-allowed opacity-60" 
                      : "bg-gray-900 text-white hover:bg-gray-700"
                  }`}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
