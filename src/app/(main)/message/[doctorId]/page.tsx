"use client";

import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Doctor {
  name: string;
  specialist: string;
  avatar?: string | null;
}

interface Message {
  id: number;
  sender: "DOCTOR" | "USER";
  content: string;
  time: string;
  doctor: Doctor;
}

export default function DoctorChatPage() {
  const params = useParams();
  const doctorId = params?.doctorId as string | undefined;
  const [message, setMessage] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/message/doctor/${doctorId}`);
        const data: Message[] = await res.json();
        setChatMessages(data);
        if (data.length > 0) {
          setDoctor(data[0].doctor);
        }
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchDoctor = async () => {
      try {
        const res = await fetch(`/api/doctors/${doctorId}`);
        const data = await res.json();
        setDoctor(data);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
    fetchMessages();
  }, [doctorId]);

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
      const res = await fetch(`/api/message/doctor/${doctorId}`, {
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
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
    </div>
  );

  if (!doctor) {
    return (
      <div className="flex-grow p-5 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <i className="bi bi-exclamation-circle text-red-500 text-4xl"></i>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Doctor not found</h3>
          <p className="text-gray-500 mb-4">The doctor you're looking for doesn't exist.</p>
          <Link href="/message">
            <button className="bg-gradient-to-r from-teal-500 to-teal-700 text-white px-6 py-2 rounded-lg hover:opacity-90 transition">
              Back to Messages
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
        <Link href="/message" className="text-gray-500 hover:text-teal-500 transition">
          <i className="bi bi-arrow-left text-xl"></i>
        </Link>

        <div className="flex items-center gap-3 flex-grow">
          {doctor.avatar ? (
            <img src={doctor.avatar} alt={doctor.name} className="w-12 h-12 rounded-full" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold">
              {getInitials(doctor.name)}
            </div>
          )}
          <div>
            <h3 className="font-medium">{doctor.name}</h3>
            <p className="text-xs text-teal-600">{doctor.specialist}</p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div ref={chatContainerRef} className="flex-grow p-4 overflow-y-auto bg-gray-50">
        <div className="flex flex-col space-y-3">
          {chatMessages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === "USER" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                  msg.sender === "USER"
                    ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white"
                    : "bg-white border border-gray-200 text-gray-800"
                }`}
              >
                <p>{msg.content}</p>
                <div
                  className={`flex justify-end items-center gap-1 text-xs mt-1 ${
                    msg.sender === "USER" ? "text-teal-100" : "text-gray-500"
                  }`}
                >
                  <span>{new Date(msg.time).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })}</span>
                  {msg.sender === "USER" && <i className="bi bi-check2-all"></i>}
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
            className="flex-grow pl-4 pr-10 py-3 border-2 border-gray-300 rounded-full text-sm focus:outline-none focus:border-teal-500 transition duration-300"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            type="submit"
            className="w-12 h-12 flex items-center justify-center bg-teal-500 text-white rounded-full hover:bg-teal-600 transition"
            disabled={!message.trim()}
          >
            <i className="bi bi-send text-xl"></i>
          </button>
        </form>
      </div>
    </main>
  );
}
