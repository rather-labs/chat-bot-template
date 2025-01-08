"use client";
import Image from "next/image";

export default function Header() {
  return (
    <header className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo or Title */}
        <div className="flex items-center">
          <Image
            src="/Rather192x192.png"
            alt="RatherLogo"
            width={50}
            height={50}
          />
          <h1 className="text-white text-xl font-bold gap-x-5">
            Ratherlab's Coinmarket chatbot
          </h1>
        </div>
      </div>
    </header>
  );
}
