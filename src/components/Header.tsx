"use client";
import Image from "next/image";

export default function Header() {
  return (
    <header className="bg-gray-950 border-b border-gray-800 py-2 px-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo or Title */}
        <div className="flex items-center space-x-3">
          <Image
            src="/Rather192x192.png"
            alt="RatherLogo"
            width={40}
            height={40}
            className="rounded-md"
          />
          <div className="flex flex-col justify-between items-left">
          <h1 className="text-white text-2xl font-bold">
            Ratherlab&apos;s Coinmarketcap Chatbot 
          </h1>
          <h1 className="text-white text-sm font-bold">
            powered by gaianet&apos;s public node ({process.env.OPENAI_BASE_URL})
          </h1>
          </div>
        </div>
      </div>
    </header>
  );
}
