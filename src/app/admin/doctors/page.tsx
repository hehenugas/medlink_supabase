"use client";

import { useEffect, useState } from "react";
import Table from "@/components/Table";
import { User, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

interface DoctorResponse {
  id: number;
  name: string;
  specialist: string;
  education: string;
  experience: string;
  location: string;
  about: string;
}

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<DoctorResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchDoctors() {
      try {
        setLoading(true);
        const response = await fetch("/api/doctors");
        if (!response.ok) {
          throw new Error("Failed to fetch doctors");
        }
        const data = await response.json();
        setDoctors(data);
      } catch (err: any) {
        console.error("Error fetching doctors:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDoctors();
  }, []);

  const columns = [
    {
      header: "Name",
      accessor: (doctor: DoctorResponse) => (
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600">
            <User size={18} />
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-gray-900">{doctor.name}</div>
            <div className="text-sm text-gray-500">{doctor.specialist}</div>
          </div>
        </div>
      ),
      accessorKey: "name",
      sortable: true,
    },
    {
      header: "Education",
      accessor: "education",
      sortable: true,
    },
    {
      header: "Experience",
      accessor: "experience",
      sortable: true,
    },
    {
      header: "Location",
      accessor: (doctor: DoctorResponse) => (
        <div className="flex items-start">
          <MapPin size={16} className="mt-1 mr-2 text-teal-600 flex-shrink-0" />
          <div className="text-sm text-gray-900">{doctor.location}</div>
        </div>
      ),
      sortable: true,
      accessorKey: "location",
    },
    {
      header: "About",
      accessor: "about",
      sortable: true,
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Doctors</h1>

      <Table
        columns={columns as any}
        data={doctors}
        keyExtractor={(item) => item.id}
        isLoading={loading}
        onRowClick={(doctor) => router.push(`/admin/doctors/${doctor.id}`)}
        emptyStateProps={{
          title: "No doctors found",
          description: "There are no doctors to display",
          actionLabel: "Contact Support",
          onAction: () => window.location.href = "/support",
        }}
        searchPlaceholder="Search doctors..."
        initialItemsPerPage={5}
        itemsPerPageOptions={[5, 10, 20, 30]}
        headerClassName="bg-teal-50"
        rowClassName={() => "hover:bg-teal-50"}
        actions={(doctor: DoctorResponse) => (
          <div className="flex gap-2">
            <button
              onClick={() => router.push(`/admin/doctors/${doctor.id}`)}
              className="px-3 py-1 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
            >
              Details
            </button>
          </div>
        )}
      />
    </div>
  );
}