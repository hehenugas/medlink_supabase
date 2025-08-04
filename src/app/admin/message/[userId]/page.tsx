"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";

interface User {
  id: string;
  name: string;
  username: string;
  avatar?: string | null;
}

interface Message {
  id: number;
  sender: "DOCTOR" | "USER";
  content: string;
  time: string;
  user: User;
}

export default function UserChatPage() {
  const params = useParams();
  const id = params?.userId as string | undefined;

    const searchParams = useSearchParams();
  const doctorId = searchParams?.get("doctorId") || "1";

  const userId = parseInt(id as string);
  const [message, setMessage] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/message/user/${userId}?doctorId=${doctorId}`);
        const data: Message[] = await res.json();
        setChatMessages(data);
        if (data.length > 0) {
          setUser(data[0].user);
        }
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/user-list/${userId}`);
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    fetchMessages();
  }, [userId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessageContent = message.trim();
    setMessage("");

    try {
      const res = await fetch(`/api/message/user/${userId}?doctorId=${doctorId}`, {
        method: "POST",
        body: JSON.stringify({ content: newMessageContent }),
      });

      const savedMessage: Message = await res.json();
      setChatMessages([...chatMessages, savedMessage]);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  if (loading) return (
    <div className="flex justify-center items-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );

  if (!user) {
    return (
      <div className="flex-grow p-5 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <i className="bi bi-exclamation-circle text-red-500 text-4xl"></i>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">User not found</h3>
          <p className="text-gray-500 mb-4">The user you're looking for doesn't exist.</p>
          <Link href="/admin/message/">
            <button className="bg-gradient-to-r from-indigo-500 to-indigo-700 text-white px-6 py-2 rounded-lg hover:opacity-90 transition">
              Back to User Messages
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-grow flex flex-col h-[90vh]">
      {/* Header */}
      <div className="p-4 bg-white border-b border-gray-200 flex items-center gap-3">
        <Link href={`/admin/message?doctorId=${doctorId}`}className="text-gray-500 hover:text-indigo-500 transition">
          <i className="bi bi-arrow-left text-xl"></i>
        </Link>

        <div className="flex items-center gap-3 flex-grow">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
              {getInitials(user.name)}
            </div>
          )}
          <div>
            <h3 className="font-medium">{user.name}</h3>
            <p className="text-xs text-indigo-600">@{user.username}</p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div ref={chatContainerRef} className="flex-grow p-4 overflow-y-auto bg-gray-50">
        <div className="flex flex-col space-y-3">
          {chatMessages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === "DOCTOR" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                  msg.sender === "DOCTOR"
                    ? "bg-gradient-to-r from-indigo-500 to-indigo-600 text-white"
                    : "bg-white border border-gray-200 text-gray-800"
                }`}
              >
                <p>{msg.content}</p>
                <div
                  className={`flex justify-end items-center gap-1 text-xs mt-1 ${
                    msg.sender === "DOCTOR" ? "text-indigo-100" : "text-gray-500"
                  }`}
                >
                  <span>{new Date(msg.time).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })}</span>
                  {msg.sender === "DOCTOR" && <i className="bi bi-check2-all"></i>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Message Input */}
      <div className="p-4 bg-white border-t border-gray-200">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <input
            type="text"
            className="flex-grow pl-4 pr-10 py-3 border-2 border-gray-300 rounded-full text-sm focus:outline-none focus:border-indigo-500 transition duration-300"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            type="submit"
            className="w-12 h-12 flex items-center justify-center bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition"
            disabled={!message.trim()}
          >
            <i className="bi bi-send text-xl"></i>
          </button>
        </form>
      </div>
    </main>
  );
}
