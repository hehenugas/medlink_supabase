"use client";

import { Suspense, useEffect, useState, useMemo } from "react";
import Table from "@/components/Table";
import { Trash2, Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formatDate } from "@/utils/customUtils";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import MedicalCheckupChart from "@/components/MedicalCheckUpChart";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export interface MedicalCheckupData {
  id: number;
  parameter: string;
  value: string;
  unit: string;
  information: string;
  date: string;
  userId: number;
  userName: string;
  userUsername: string;
}

interface User {
  id: number;
  name: string;
  username: string;
  avatar?: string;
}

export default function MedicalCheckupPage() {
  return (
    <Suspense fallback={<div>Loading messages...</div>}>
      <MedicalCheckup />
    </Suspense>
  );
}

function MedicalCheckup() {
  const [checkupData, setCheckupData] = useState<MedicalCheckupData[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  const [showUserList, setShowUserList] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState("");

  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Handle user ID from query parameters
  useEffect(() => {
    const userId = searchParams?.get("userId");
    if (userId && !isNaN(parseInt(userId))) {
      setSelectedUserId(parseInt(userId));
    } else {
      setSelectedUserId(null);
      setSelectedUser(null);
    }
  }, [searchParams]);

  // Fetch users when showing user list
  useEffect(() => {
    if (showUserList) {
      fetchUsers();
    }
  }, [showUserList]);

  useEffect(() => {
    async function fetchMedicalCheckup() {
      if (!selectedUserId) {
        setCheckupData([]);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`/api/medical-checkup/${selectedUserId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch medical checkup data");
        }
        const data = await response.json();
        setCheckupData(data);
      } catch (err: any) {
        console.error("Error fetching medical checkup data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchMedicalCheckup();
  }, [selectedUserId]);

  useEffect(() => {
    async function fetchSelectedUser() {
      if (!selectedUserId) {
        setSelectedUser(null);
        return;
      }

      try {
        const response = await fetch("/api/user-list");
        if (!response.ok) {
          throw new Error("Failed to fetch user list");
        }

        const data: User[] = await response.json();
        const foundUser = data.find((user) => user.id === selectedUserId);
        setSelectedUser(foundUser ?? null);
      } catch (err: any) {
        console.error("Error fetching user:", err);
        setSelectedUser(null);
      }
    }

    fetchSelectedUser();
  }, [selectedUserId]);

  const fetchUsers = async () => {
    setUserLoading(true);
    try {
      const response = await fetch("/api/user-list");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data);
    } catch (err: any) {
      console.error("Error fetching users:", err);
    } finally {
      setUserLoading(false);
    }
  };

  const handleDelete = async (dataId: number) => {
    if (!selectedUserId) return;

    if (confirm("Are you sure you want to delete this record?")) {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/medical-checkup/${selectedUserId}?dataId=${dataId}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete record");
        }

        setCheckupData(checkupData.filter((item) => item.id !== dataId));
      } catch (err: any) {
        console.error("Error deleting record:", err);
        alert("Failed to delete record");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleUserSelect = (user: User) => {
    router.push(`${pathname}?userId=${user.id}`);
    setSelectedUserId(user.id);
    setShowUserList(false);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const columns = [
    {
      header: "Parameter",
      accessor: "parameter",
    },
    {
      header: "Value",
      accessor: (data: MedicalCheckupData) => `${data.value} ${data.unit}`,
    },
    {
      header: "Information",
      accessor: (data: MedicalCheckupData) => (
        <div
          className={`px-2 py-1 rounded text-sm inline-block ${
            data.information === "Normal"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {data.information}
        </div>
      ),
    },
    {
      header: "Date",
      accessor: (data: MedicalCheckupData) => formatDate(new Date(data.date)),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Medical Checkup</h1>
      </div>

      {/* User Profile */}
      <div
        className="mb-5 cursor-pointer"
        onClick={() => {
          setShowUserList(true);
        }}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            {selectedUser?.avatar ? (
              <img
                src={selectedUser.avatar}
                alt={selectedUser.name}
                className="w-12 h-12 rounded-full"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold text-lg">
                {selectedUser ? getInitials(selectedUser.name) : "?"}
              </div>
            )}
          </div>
          <div>
            <h3 className="font-medium text-gray-800">
              {selectedUser ? selectedUser.name : "Select a user"}
            </h3>
            <p className="text-sm text-teal-600">
              {selectedUser ? `@${selectedUser.username}` : "Click to choose user"}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table
          columns={columns as any}
          data={checkupData}
          keyExtractor={(item) => item.id}
          isLoading={loading}
          emptyStateProps={{
            title: "No medical checkup data",
            description: selectedUserId
              ? "There is no medical checkup data for this user"
              : "Please select a user to view their medical checkup data",
          }}
          searchPlaceholder="Search parameters..."
          initialItemsPerPage={10}
          itemsPerPageOptions={[5, 10, 20, 50]}
          headerClassName="bg-teal-50"
          rowClassName={() => "hover:bg-teal-50"}
          actions={(data: MedicalCheckupData) => (
            <div className="flex gap-2">
              <button
                onClick={() => handleDelete(data.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-full transition"
                title="Delete record"
              >
                <Trash2 size={18} />
              </button>
            </div>
          )}
        />
      </div>

      {/* Chart Section */}
      {checkupData.length > 0 && <MedicalCheckupChart data={checkupData} />}

      {/* Modal for selecting user */}
      {showUserList && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">Select User</h3>
              <button
                onClick={() => setShowUserList(false)}
                className="text-gray-500 hover:text-gray-700 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto">
              <div className="sticky top-0 z-10 bg-white p-4 border-b">
                <div className="relative">
                  <Search className="absolute top-1/2 left-3 -translate-y-1/2 text-teal-500 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search users or usernames..."
                    value={userSearchTerm}
                    onChange={(e) => setUserSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-teal-500 transition"
                  />
                </div>
              </div>
              {userLoading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-500"></div>
                </div>
              ) : users.length > 0 ? (
                filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => handleUserSelect(user)}
                    className="p-4 border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-10 h-10 rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold">
                            {getInitials(user.name)}
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">
                          {user.name}
                        </h4>
                        <p className="text-sm text-teal-600">@{user.username}</p>
                      </div>
                    </div>
                  </div>
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
    </div>
  );
}