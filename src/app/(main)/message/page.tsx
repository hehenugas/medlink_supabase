"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AllMessageDoctorResponse } from "@/app/api/message/doctor/route";

export default function MessageListPage() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [allMessage, setAllMessage] = useState<AllMessageDoctorResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [showDoctorList, setShowDoctorList] = useState(false);
  const [doctors, setDoctors] = useState<{ id: number; name: string; specialist: string }[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [doctorSearchTerm, setDoctorSearchTerm] = useState("");
  const [showChatOption, setShowChatOption] = useState(false);

  const filteredDoctors = doctors.filter((doctor) =>
    doctor.name.toLowerCase().includes(doctorSearchTerm.toLowerCase()) ||
    doctor.specialist.toLowerCase().includes(doctorSearchTerm.toLowerCase())
  );

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch("/api/message/doctor");
        const data = await res.json();
        setAllMessage(data);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const fetchDoctors = async () => {
    setLoadingDoctors(true);
    try {
      const res = await fetch("/api/doctors");
      const data = await res.json();
      setDoctors(data);
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
    } finally {
      setLoadingDoctors(false);
    }
  };

  const filteredMessage = allMessage.filter((message) =>
    message.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.doctorSpecialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <main className="flex-grow p-5 overflow-y-auto h-full relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-semibold">Messages</h2>
      </div>

      {/* Banner */}
      <div className="bg-gradient-to-r from-teal-500 to-teal-800 text-white p-5 rounded-2xl flex justify-between items-center mb-5">
        <div>
          <h2 className="text-lg font-semibold mb-2">Connect With Your Doctors</h2>
          <p className="text-sm mb-4">Chat with your healthcare providers securely</p>
        </div>
        <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
          <i className="bi bi-chat-dots-fill text-white text-4xl"></i>
        </div>
      </div>

      {/* Search */}
      <div className="relative w-full max-w-md mb-5">
        <i className="bi bi-search absolute top-1/2 left-3 -translate-y-1/2 text-teal-500 text-sm"></i>
        <input
          type="text"
          className="w-full pl-9 pr-4 py-3 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-teal-500 transition duration-300"
          placeholder="Search doctors or specialties..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Messages list */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
          </div>
        ) : filteredMessage.length > 0 ? (
          filteredMessage.map((message) => (
            <Link
              href={`/message/${message.doctorId}`}
              key={message.doctorId}
              className="block"
            >
              <div className="p-4 border-b border-gray-200 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition">
                <div className="relative">
                  {message.avatar ? (
                    <img src={message.avatar} alt={message.doctorName} className="w-14 h-14 rounded-full" />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold text-lg">
                      {getInitials(message.doctorName)}
                    </div>
                  )}
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium truncate">{message.doctorName}</h3>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                      {new Date(message.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{message.lastMessage}</p>
                  <p className="text-xs text-teal-600">{message.doctorSpecialty}</p>
                </div>
                <i className="bi bi-chevron-right text-gray-400"></i>
              </div>
            </Link>
          ))
        ) : (
          <div className="p-8 text-center text-gray-500">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <i className="bi bi-search text-gray-400 text-2xl"></i>
            </div>
            <p className="font-medium">No conversations found</p>
            <p className="text-sm mt-1">Try a different search term</p>
          </div>
        )}
      </div>

      {/* Floating action button */}
      <div className="absolute bottom-6 right-6 z-40">
        <button
          onClick={() => setShowChatOption(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-teal-500 to-teal-700 text-white shadow-lg flex items-center justify-center hover:opacity-90 transition"
        >
          <i className="bi bi-plus-lg text-2xl"></i>
        </button>

      </div>

      {showChatOption && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="relative bg-white rounded-xl shadow-xl max-w-sm w-full mx-4 overflow-hidden">
            <div className="p-5">
              <h3 className="text-lg font-semibold mb-4">Start New Chat</h3>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowChatOption(false);
                    setShowDoctorList(true);
                    fetchDoctors();
                  }}
                  className="w-full py-3 px-4 rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition"
                >
                  Chat with Doctor
                </button>
                <button
                  onClick={() => {
                    setShowChatOption(false);
                    window.location.href = "/message/ai";
                  }}
                  className="w-full py-3 px-4 rounded-lg border border-teal-600 text-teal-600 hover:bg-teal-50 transition"
                >
                  Ask AI Assistant
                </button>
              </div>
              <button
                  onClick={() => setShowChatOption(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                  <i className="bi bi-x-lg text-lg"></i>
                </button>
            </div>
          </div>
        </div>
      )}


      {/* Modal for new conversation */}
      {showDoctorList && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">Start New Conversation</h3>
              <button
                onClick={() => setShowDoctorList(false)}
                className="text-gray-500 hover:text-gray-700 transition"
              >
                <i className="bi bi-x-lg text-lg"></i>
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto">
              <div className="sticky top-0 z-10 bg-white p-4 border-b">
                <div className="relative">
                  <i className="bi bi-search absolute top-1/2 left-3 -translate-y-1/2 text-teal-500 text-sm"></i>
                  <input
                    type="text"
                    placeholder="Search doctors or specialties..."
                    value={doctorSearchTerm}
                    onChange={(e) => setDoctorSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-teal-500 transition"
                  />
                </div>
              </div>
              {loadingDoctors ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-500"></div>
                </div>
              ) : doctors.length > 0 ? (
                filteredDoctors.map((doctor) => (
                  <Link
                    href={`/message/${doctor.id}`}
                    key={doctor.id}
                    onClick={() => setShowDoctorList(false)}
                    className="block"
                  >
                    <div className="p-4 border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer">
                      <h4 className="font-medium text-gray-800">{doctor.name}</h4>
                      <p className="text-sm text-teal-600">{doctor.specialist}</p>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="p-6 text-center text-gray-500">
                  <p>No doctors available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
