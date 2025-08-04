"use client"

import { AppointmentResponse } from "@/app/api/appointments/route";
import { formatDate } from "@/utils/customUtils";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function AppointmentPage() {
  const [appointmentFilter, setAppointmentFilter] = useState("upcoming");
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAppointments() {
      try {
        const response = await fetch('/api/appointments');
        if (!response.ok) {
          throw new Error('Failed to fetch appointments');
        }
        const data = await response.json();
        setAppointments(data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    }
    fetchAppointments();
  }, []);

  const today = new Date();

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
      case "completed": return "bg-blue-100 text-blue-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
    </div>
  );

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-lg text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="bg-gradient-to-r from-teal-500 to-teal-700 text-white p-6 rounded-2xl mb-6">
        <h1 className="text-2xl font-bold mb-2">My Appointments</h1>
        <p className="text-lg">Manage your scheduled doctor appointments</p>
      </div>

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
        <Link
          href="/doctors"
          className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition flex items-center"
        >
          <i className="bi bi-plus-circle mr-2"></i>
          Schedule New Appointment
        </Link>
      </div>

      {filteredAppointments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAppointments.map((appointment: AppointmentResponse) => (
            <div key={appointment.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow relative">
              {/* Date and Queue Number */}
              <div className="bg-teal-600 text-white p-2 flex justify-between items-center">
                <div className="flex items-center">
                  <i className="bi bi-calendar-date mr-2"></i>
                  <span>{formatDate(appointment.date)}</span>
                </div>
                <div className="flex items-center font-bold">
                  <i className="bi bi-person-lines-fill mr-1"></i>
                  <span>Queue #{appointment.queue}</span>
                </div>
              </div>

              <div className="border-b border-gray-100 p-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600">
                    <i className="bi bi-person-badge"></i>
                  </div>
                  <div className="ml-3">
                    <div className="text-lg font-medium text-gray-900">{appointment.doctorName}</div>
                    <div className="text-sm text-gray-500">{appointment.doctorSpecialty}</div>
                  </div>
                  <div className="ml-auto">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusClass(appointment.status)}`}>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-start mb-3">
                  <div className="flex-shrink-0 w-5 text-teal-500">
                    <i className="bi bi-clipboard-plus"></i>
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">Purpose</div>
                    <div className="text-sm text-gray-700">{appointment.purpose}</div>
                  </div>
                </div>

                <div className="flex items-start mb-3">
                  <div className="flex-shrink-0 w-5 text-teal-500">
                    <i className="bi bi-geo-alt"></i>
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">Location</div>
                    <div className="text-sm text-gray-700">{appointment.location}</div>
                  </div>
                </div>

                {appointment.notes && (
                  <div className="flex items-start mt-3">
                    <div className="flex-shrink-0 w-5 text-teal-500">
                      <i className="bi bi-journal-text"></i>
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">Notes</div>
                      <div className="text-sm text-gray-700">{appointment.notes}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md text-center py-12">
          <div className="mx-auto w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mb-4">
            <i className="bi bi-calendar-x text-teal-600 text-2xl"></i>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
          <p className="text-gray-500 mb-6">There are no {appointmentFilter} appointments to display</p>
          <Link href="/doctors" className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition">
            Schedule an Appointment
          </Link>
        </div>
      )}
    </div>
  );
}