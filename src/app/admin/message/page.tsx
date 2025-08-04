"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

type UserMessage = {
  userId: number;
  userName: string;
  userUsername: string;
  lastMessage: string;
  lastMessageTime: string;
  avatar?: string;
};

type Doctor = {
  id: number;
  name: string;
  specialist: string;
  avatar?: string;
};

export default function MessagePage() {
  return (
    <Suspense fallback={<div>Loading messages...</div>}>
      <UserMessageListPage />
    </Suspense>
  );
}

function UserMessageListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [allMessages, setAllMessages] = useState<UserMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [doctor, setDoctor] = useState<Doctor | null>(null);

  const [showUserList, setShowUserList] = useState(false);
  const [users, setUsers] = useState<{ id: number; name: string; username: string }[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState("");

  const [showDoctorList, setShowDoctorList] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [doctorSearchTerm, setDoctorSearchTerm] = useState("");

  const doctorId = searchParams?.get("doctorId");

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  const filteredDoctors = doctors.filter((doctor) =>
    doctor.name.toLowerCase().includes(doctorSearchTerm.toLowerCase()) ||
    doctor.specialist.toLowerCase().includes(doctorSearchTerm.toLowerCase())
  );

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await fetch(`/api/doctors/${doctorId}`);
        const data = await res.json();
        setDoctor(data);
      } catch (error) {
        console.error("Failed to fetch doctor:", error);
      }
    };

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/message/user?doctorId=${doctorId}`);
        const data = await res.json();
        setAllMessages(data);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
    fetchMessages();
  }, [doctorId]);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoadingUsers(false);
    }
  };

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

  const filteredMessages = allMessages.filter((message) =>
    message.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.userUsername.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name?: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleDoctorSelect = (newDoctorId: number) => {
    setShowDoctorList(false);
    router.push(`/admin/message?doctorId=${newDoctorId}`);
  };

  return (
    <main className="flex-grow p-5 overflow-y-auto h-full relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-semibold">User Messages</h2>
      </div>

      {/* Doctor Profile */}
      <div
        className="mb-5 cursor-pointer"
        onClick={() => {
          setShowDoctorList(true);
          fetchDoctors();
        }}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            {doctor?.avatar ? (
              <img src={doctor.avatar} alt={doctor.name} className="w-12 h-12 rounded-full" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
                {doctor ? getInitials(doctor.name) : "?"}
              </div>
            )}
          </div>
          <div>
            <h3 className="font-medium text-gray-800">{doctor?.name ?? "Select a doctor"}</h3>
            <p className="text-sm text-indigo-600">
              {doctor?.specialist ?? "Click to choose a doctor"}
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative w-full max-w-md mb-5">
        <i className="bi bi-search absolute top-1/2 left-3 -translate-y-1/2 text-indigo-500 text-sm"></i>
        <input
          type="text"
          className="w-full pl-9 pr-4 py-3 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 transition duration-300"
          placeholder="Search users or usernames..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Messages list */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : filteredMessages.length > 0 ? (
          filteredMessages.map((message) => (
            <Link
              href={`/admin/message/${message.userId}?doctorId=${doctorId}`}
              key={message.userId}
              className="block"
            >
              <div className="p-4 border-b border-gray-200 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition">
                <div className="relative">
                  {message.avatar ? (
                    <img src={message.avatar} alt={message.userName} className="w-14 h-14 rounded-full" />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
                      {getInitials(message.userName)}
                    </div>
                  )}
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium truncate">{message.userName}</h3>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                      {new Date(message.lastMessageTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-indigo-600">@{message.userUsername}</p>
                  <p className="text-sm text-gray-600 truncate">{message.lastMessage}</p>
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
          onClick={() => {
            setShowUserList(true);
            fetchUsers();
          }}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-700 text-white shadow-lg flex items-center justify-center hover:opacity-90 transition"
        >
          <i className="bi bi-plus-lg text-2xl"></i>
        </button>
      </div>

      {/* Modal for new conversation (Users) */}
      {showUserList && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">Start New Conversation</h3>
              <button
                onClick={() => setShowUserList(false)}
                className="text-gray-500 hover:text-gray-700 transition"
              >
                <i className="bi bi-x-lg text-lg"></i>
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto">
              <div className="sticky top-0 z-10 bg-white p-4 border-b">
                <div className="relative">
                  <i className="bi bi-search absolute top-1/2 left-3 -translate-y-1/2 text-indigo-500 text-sm"></i>
                  <input
                    type="text"
                    placeholder="Search users or usernames..."
                    value={userSearchTerm}
                    onChange={(e) => setUserSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
              </div>
              {loadingUsers ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : users.length > 0 ? (
                filteredUsers.map((user) => (
                  <Link
                    href={`/admin/message/${user.id}?doctorId=${doctorId}`}
                    key={user.id}
                    onClick={() => setShowUserList(false)}
                    className="block"
                  >
                    <div className="p-4 border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer">
                      <h4 className="font-medium text-gray-800">{user.name}</h4>
                      <p className="text-sm text-indigo-600">@{user.username}</p>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="p-6 text-center text-gray-500">
                  <p>No users available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal for selecting doctor */}
      {showDoctorList && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">Select Doctor</h3>
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
                  <i className="bi bi-search absolute top-1/2 left-3 -translate-y-1/2 text-indigo-500 text-sm"></i>
                  <input
                    type="text"
                    placeholder="Search doctors or specialties..."
                    value={doctorSearchTerm}
                    onChange={(e) => setDoctorSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
              </div>
              {loadingDoctors ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : doctors.length > 0 ? (
                filteredDoctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    onClick={() => handleDoctorSelect(doctor.id)}
                    className="p-4 border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer"
                  >
                    <h4 className="font-medium text-gray-800">{doctor.name}</h4>
                    <p className="text-sm text-indigo-600">{doctor.specialist}</p>
                  </div>
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