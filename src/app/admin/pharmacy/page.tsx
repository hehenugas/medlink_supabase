"use client";

import { User } from "#/prisma/db";
import { MedicationInfo } from "@/app/api/pharmacy/route";
import Table from "@/components/Table";
import { Search, Trash2 } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "react-toastify";

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

export default function MedicalCheckupPage() {
  return (
    <Suspense fallback={<div>Loading messages...</div>}>
      <Pharmacy />
    </Suspense>
  );
}

const columns = [
  {
    header: "Medicine Name",
    accessor: (item: MedicationInfo) => item.namaObat,
    sortable: true,
  },
  {
    header: "Usage Description",
    accessor: (item: MedicationInfo) => item.keteranganPenggunaan,
    sortable: true,
  },
  {
    header: "Dosage",
    accessor: (item: MedicationInfo) => item.dosis,
    sortable: true,
  },
  {
    header: "Usage Per Day",
    accessor: (item: MedicationInfo) => item.usagePerDay,
    sortable: true,
  },
  {
    header: "Usage Day",
    accessor: (item: MedicationInfo) => item.usageDay,
    sortable: true,
  },
  {
    header: "Start Use Time",
    accessor: (item: MedicationInfo) =>
      new Date(item.tanggalMulaiObat).toLocaleString(),
    accessorKey: "tanggalMulaiObat",
    sortable: true,
  },
  {
    header: "End Use Time",
    accessor: (item: MedicationInfo) =>
      new Date(item.tanggalSelesaiObat).toLocaleString(),
    accessorKey: "tanggalSelesaiObat",
    sortable: true,
  },
  {
    header: "Usage Time(s)",
    accessor: (item: MedicationInfo) =>
      Array.isArray(item.jamPenggunaan) ? item.jamPenggunaan.join(", ") : "-",
    sortable: false,
  },
];

function Pharmacy() {
  const [loading, setLoading] = useState(false);

  // Modal user selection
  const [showUserList, setShowUserList] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [userLoading, setUserLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  // Modal medication creation
  const [showCreateMedication, setShowCreateMedication] = useState(false);
  const [formValue, setFormValue] = useState({
    namaObat: "",
    keteranganPenggunaan: "",
    dosis: "",
    usagePerDay: 1,
    usageDay: 1,
    jamPenggunaan: [] as string[],
    tanggalMulaiObat: "",
    tanggalSelesaiObat: "",
  });

  const [medications, setMedications] = useState([]);

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

      fetchUsers();
    }
  }, [showUserList]);

  // ????
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

  // Fetch medications info
  useEffect(() => {
    fetchMedications();
  }, [selectedUserId]);

  async function fetchMedications() {
    if (!selectedUserId) {
      setMedications([]);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/pharmacy?userId=${selectedUserId}`);
      if (!res.ok) {
        throw new Error("Failed to fetch medications data");
      }
      setMedications(await res.json());
    } catch (e: any) {
      console.error("Error fetching medications data:", e);
    } finally {
      setLoading(false);
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  const handleUserSelect = (user: User) => {
    router.push(`${pathname}?userId=${user.id}`);
    setSelectedUserId(user.id);
    setShowUserList(false);
  };

  const handleChange = (e: any) => {
    const { name, value, type } = e.target;
    setFormValue((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const onAddMedication = async () => {
    const {
      namaObat,
      keteranganPenggunaan,
      dosis,
      usagePerDay,
      usageDay,
      tanggalMulaiObat,
      tanggalSelesaiObat,
    } = formValue;

    if (!namaObat.trim()) return toast.error("Medicine name cannot be empty.");
    if (!keteranganPenggunaan.trim())
      return toast.error("Usage description cannot be empty.");
    if (!dosis.trim()) return toast.error("Dosage cannot be empty.");
    if (!Number.isInteger(usagePerDay) || usagePerDay <= 0)
      return toast.error("Usage per day must be a number greater than 0.");
    if (!Number.isInteger(usageDay) || usageDay <= 0)
      return toast.error("Usage day must be a number greater than 0.");
    if (!tanggalMulaiObat || isNaN(Date.parse(tanggalMulaiObat)))
      return toast.error("Start use time must be a valid date.");
    if (!tanggalSelesaiObat || isNaN(Date.parse(tanggalSelesaiObat)))
      return toast.error("End use time must be a valid date.");

    const startDate = new Date(tanggalMulaiObat);
    const endDate = new Date(tanggalSelesaiObat);
    if (startDate >= endDate)
      return toast.error("Start use time must be before end use time.");

    try {
      const res = await fetch(`/api/pharmacy?userId=${selectedUserId}`, {
        method: "POST",
        body: JSON.stringify({
          ...formValue,
          tanggalMulaiObat: new Date(formValue.tanggalMulaiObat).toISOString(),
          tanggalSelesaiObat: new Date(
            formValue.tanggalSelesaiObat
          ).toISOString(),
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to add medication info!");
      }
    } catch (e) {
      toast.error("Failed to add medication info!");
    } finally {
      toast.success("Medication info added!");
      setShowCreateMedication(false);
      await fetchMedications();
    }
  };

  const onDeleteMedication = async (id: number) => {
    if (!confirm("Are you sure you want to delete this medication info?"))
      return;

    try {
      const res = await fetch(`/api/pharmacy?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete medication info!");
      }
    } catch (e) {
      toast.error("Failed to delete medication info!");
    } finally {
      toast.success("Medication info deleted!");
      await fetchMedications();
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Medical Checkup</h1>
      </div>

      <div className="flex justify-between">
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
                {selectedUser
                  ? `@${selectedUser.username}`
                  : "Click to choose user"}
              </p>
            </div>
          </div>
        </div>

        {/* Add Medication */}
        {selectedUser && (
          <div>
            <button
              onClick={() => setShowCreateMedication(true)}
              className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition flex items-center gap-2"
            >
              <i className="bi bi-plus-lg"></i>
              <span>Add Medication</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-lg shadow">
        <Table
          columns={columns as any}
          data={medications}
          keyExtractor={(item) => item.id}
          isLoading={loading}
          emptyStateProps={{
            title: "No medication data",
            description: selectedUserId
              ? "There is no medication data for this user"
              : "Please select a user to view their medication data",
          }}
          searchPlaceholder="Search parameters..."
          initialItemsPerPage={10}
          itemsPerPageOptions={[5, 10, 20, 50]}
          headerClassName="bg-teal-50"
          rowClassName={() => "hover:bg-teal-50"}
          actions={(data: MedicationInfo) => (
            <div className="flex gap-2">
              <button
                onClick={() => onDeleteMedication(data.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-full transition"
                title="Delete medication"
              >
                <Trash2 size={18} />
              </button>
            </div>
          )}
        />
      </div>

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
                        <p className="text-sm text-teal-600">
                          @{user.username}
                        </p>
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

      {showCreateMedication && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">Add Medication</h3>
              <button
                onClick={() => setShowCreateMedication(false)}
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

            {/* Content */}
            <div className="max-h-96 overflow-y-auto">
              <div className="p-4 border-b grid gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="namaObat"
                    value={formValue.namaObat}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-teal-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Usage Description
                  </label>
                  <input
                    type="text"
                    name="keteranganPenggunaan"
                    value={formValue.keteranganPenggunaan}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-teal-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Dosage
                  </label>
                  <input
                    type="text"
                    name="dosis"
                    value={formValue.dosis}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-teal-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Usage Per Day
                  </label>
                  <input
                    type="number"
                    name="usagePerDay"
                    value={formValue.usagePerDay}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-teal-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Usage Day
                  </label>
                  <input
                    type="number"
                    name="usageDay"
                    value={formValue.usageDay}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-teal-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Start Use Time
                  </label>
                  <input
                    type="datetime-local"
                    name="tanggalMulaiObat"
                    value={formValue.tanggalMulaiObat}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-teal-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    End Use Time
                  </label>
                  <input
                    type="datetime-local"
                    name="tanggalSelesaiObat"
                    value={formValue.tanggalSelesaiObat}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-teal-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Usage Times
                  </label>
                  <div className="space-y-2">
                    {formValue.jamPenggunaan.map(
                      (jam: string, index: number) => (
                        <div key={index} className="flex gap-2 items-center">
                          <input
                            type="time"
                            value={jam}
                            onChange={(e) => {
                              const updated = [...formValue.jamPenggunaan];
                              updated[index] = e.target.value;
                              setFormValue((prev) => ({
                                ...prev,
                                jamPenggunaan: updated,
                              }));
                            }}
                            className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-teal-500 transition"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = formValue.jamPenggunaan.filter(
                                (_, i) => i !== index
                              );
                              setFormValue((prev) => ({
                                ...prev,
                                jamPenggunaan: updated,
                              }));
                            }}
                            className="text-sm text-red-500 hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      )
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        setFormValue((prev) => ({
                          ...prev,
                          jamPenggunaan: [...prev.jamPenggunaan, ""],
                        }))
                      }
                      className="text-sm text-teal-600 hover:underline mt-2"
                    >
                      + Add Time
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end items-center p-4 border-b">
              <button
                onClick={onAddMedication}
                className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition flex items-center gap-2"
              >
                <i className="bi bi-plus-lg"></i>
                <span>Add Medication</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
