"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content: "Halo! Saya Artificial Intelligence (AI) Asisten Sehat MedLink Smart Anda, siap membantu dengan informasi awal seputar kesehatan. Senang Anda menghubungi saya.",
        }
      ]);
    }
  }, []);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    
    setLoading(true);
    setInput("");

    try {
      const historyForApi = messages
        .slice(messages[0]?.role === 'assistant' ? 1 : 0)
        .map(msg => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }],
        }));

      const res = await fetch("/api/message/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.content, history: historyForApi }),
      });

      if (!res.ok) {
        throw new Error("Gagal mendapatkan respons dari server.");
      }

      const data = await res.json();
      const aiReply: Message = { 
        role: "assistant", 
        content: data.text 
      };

      setMessages(prev => [...prev, aiReply]);

    } catch (err) {
      console.error("Error:", err);
      const errorReply: Message = {
        role: "assistant",
        content: "Maaf, terjadi kesalahan. Silakan coba lagi nanti.",
      };
      setMessages(prev => [...prev, errorReply]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col h-full bg-gray-50">
      <div className="p-4 bg-white border-b border-gray-200 flex items-center gap-3">
        <Link href="/message" className="text-gray-500 hover:text-teal-500 transition">
          <i className="bi bi-arrow-left text-xl"></i>
        </Link>
        <div className="flex items-center gap-3 flex-grow">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl">
            AI
          </div>
          <div>
            <h3 className="font-medium">Health AI Assistant</h3>
            <p className="text-xs text-teal-600">Online</p>
          </div>
        </div>
      </div>

      <div className="flex-grow p-4 overflow-y-auto space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[75%] px-4 py-2 rounded-2xl whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-teal-600 text-white rounded-br-lg"
                  : "bg-white border border-gray-200 text-gray-800 rounded-bl-lg"
              }`}
            >
              <p>{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
             <div className="max-w-[70%] px-4 py-2 rounded-2xl bg-white border border-gray-200 text-gray-800">
                <div className="flex items-center gap-1">
                    <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></span>
                </div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 bg-white border-t border-gray-200">
        <form onSubmit={sendMessage} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tanyakan sesuatu tentang kesehatan..."
            className="flex-grow border-2 border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:border-teal-500"
            disabled={loading}
          />
          <button
            type="submit"
            className="w-12 h-12 bg-teal-600 text-white rounded-full flex items-center justify-center hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            disabled={!input.trim() || loading}
          >
            <i className="bi bi-send text-xl"></i>
          </button>
        </form>
      </div>
    </main>
  );
}