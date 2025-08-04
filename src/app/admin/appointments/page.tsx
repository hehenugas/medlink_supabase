"use client"

import Link from "next/link";
import { useEffect, useState } from "react";
import Table from "@/components/Table";
import { Search, Calendar, MapPin, User } from "lucide-react";
import { AppointmentResponse } from "@/app/api/appointments/route";
import { formatDate } from "@/utils/customUtils";
import { useRouter } from "next/navigation";

export default function AppointmentPage() {
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [appointmentFilter, setAppointmentFilter] = useState("upcoming");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const today = new Date();

  useEffect(() => {
    async function fetchAppointments() {
      try {
        setLoading(true);
        const response = await fetch('/api/appointments');
        if (!response.ok) {
          throw new Error('Failed to fetch appointments');
        }
        const data = await response.json();

        const parsedAppointments = data.map((appt: any) => ({
          ...appt,
          date: new Date(appt.date),
        }));

        setAppointments(parsedAppointments);
      } catch (err: any) {
        console.error('Error fetching appointments:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchAppointments();
  }, []);

  const handleAcceptAppointment = async (appointmentId: number) => {
    try {
      const response = await fetch(`/api/appointments/accept/${appointmentId}`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to accept appointment');
      }
      setAppointments(prev => prev.map(appointment =>
        appointment.id === appointmentId
          ? { ...appointment, status: 'confirmed' }
          : appointment
      ));
      router.refresh();
    } catch (err) {
      console.error('Error accepting appointment:', err);
    }
  };

  const handleRejectAppointment = async (appointmentId: number) => {
    try {
      const response = await fetch(`/api/appointments/reject/${appointmentId}`, {
        method: 'PATCH',
      });
      if (!response.ok) {
        throw new Error('Failed to reject appointment');
      }
      setAppointments(prev => prev.map(appointment =>
        appointment.id === appointmentId
          ? { ...appointment, status: 'rejected' }
          : appointment
      ));
    } catch (err) {
      console.error('Error rejecting appointment:', err);
    }
  };

  const handleDeleteAppointment = async (appointmentId: number) => {
    if (!confirm('Are you sure you want to delete this appointment?')) return;

    try {
      const response = await fetch(`/api/appointments/delete/${appointmentId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete appointment');
      }
      setAppointments(prev => prev.filter(appointment => appointment.id !== appointmentId));
    } catch (err) {
      console.error('Error deleting appointment:', err);
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.date);
    if (appointmentFilter === "upcoming") {
      return appointmentDate >= today;
    } else if (appointmentFilter === "past") {
      return appointmentDate < today;
    } else if (appointmentFilter === "all") {
      return true;
    }
    return true;
  });

  const getStatusClass = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const columns = [
    {
      header: "User",
      accessor: "userName",
      sortable: true
    },
    {
      header: "Doctor",
      accessor: (appointment: AppointmentResponse) => (
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600">
            <User size={18} />
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-gray-900">{appointment.doctorName}</div>
            <div className="text-sm text-gray-500">{appointment.doctorSpecialty}</div>
          </div>
        </div>
      ),
      accessorKey: "doctorName",
      sortable: true
    },
    {
      header: "Date & Time",
      accessor: (appointment: AppointmentResponse) => (
        <div className="flex items-start">
          <Calendar size={16} className="mt-1 mr-2 text-teal-600" />
          <div>{formatDate(appointment.date)}</div>
        </div>
      ),
      accessorKey: "date",
      sortable: true,
      sortingFn: (a: any, b: any) => {
        const dateA = a.original.date instanceof Date ? a.original.date : new Date(a.original.date);
        const dateB = b.original.date instanceof Date ? b.original.date : new Date(b.original.date);

        return dateA.getTime() - dateB.getTime();
      }
    },
    {
      header: "Purpose",
      accessor: "purpose",
      sortable: true
    },
    {
      header: "Location",
      accessor: (appointment: AppointmentResponse) => (
        <div className="flex items-start">
          <MapPin size={16} className="mt-1 mr-2 text-teal-600 flex-shrink-0" />
          <div className="text-sm text-gray-900">{appointment.location}</div>
        </div>
      ),
      sortable: false
    },
    {
      header: "Status",
      accessor: (appointment: AppointmentResponse) => (
        <span className={`px-2 py-1 text-xs rounded-full ${getStatusClass(appointment.status)}`}>
          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
        </span>
      ),
      sortable: true,
      accessorKey: "status"
    },
    {
      header: "Notes",
      accessor: "notes",
      sortable: true
    }
  ];

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-4 py-2 rounded-lg ${appointmentFilter === "upcoming" ? "bg-teal-600 text-white" : "bg-gray-100 hover:bg-teal-100"}`}
            onClick={() => setAppointmentFilter("upcoming")}
          >
            Upcoming
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${appointmentFilter === "past" ? "bg-teal-600 text-white" : "bg-gray-100 hover:bg-teal-100"}`}
            onClick={() => setAppointmentFilter("past")}
          >
            Past
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${appointmentFilter === "all" ? "bg-teal-600 text-white" : "bg-gray-100 hover:bg-teal-100"}`}
            onClick={() => setAppointmentFilter("all")}
          >
            All
          </button>
        </div>
      </div>

      <Table
        columns={columns as any}
        data={filteredAppointments}
        keyExtractor={(item) => item.id}
        isLoading={loading}
        onRowClick={(appointment) => console.log("Clicked appointment:", appointment)}
        emptyStateProps={{
          title: "No appointments found",
          description: `There are no ${appointmentFilter} appointments to display`,
          actionLabel: "",
          onAction: () => window.location.href = "/doctors"
        }}
        searchPlaceholder="Search appointments..."
        initialItemsPerPage={5}
        itemsPerPageOptions={[5, 10, 20, 30]}
        headerClassName="bg-teal-50"
        rowClassName={(appointment) => {
          if (appointment.status === "confirmed") return "hover:bg-green-50";
          if (appointment.status === "pending") return "hover:bg-yellow-50";
          if (appointment.status === "completed") return "hover:bg-blue-50";
          if (appointment.status === "cancelled") return "hover:bg-red-50";
          return "hover:bg-gray-50";
        }}
        actions={(appointment) => (
          <div className="flex gap-2">
            {appointment.status === "pending" && (
              <>
                <button
                  onClick={() => handleAcceptAppointment(appointment.id)}
                  className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleRejectAppointment(appointment.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Reject
                </button>
              </>
            )}
            <button
              onClick={() => handleDeleteAppointment(appointment.id)}
              className="px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              Delete
            </button>
          </div>
        )}
      />
    </div>
  );
}