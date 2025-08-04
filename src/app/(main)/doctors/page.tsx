"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import { DoctorResponse } from "@/app/api/doctors/route";
const doctor = "/assets/dashboard/doctor.svg";

const DoctorsPage: React.FC = () => {
  const [doctors, setDoctors] = useState<DoctorResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('/api/doctors');
        if (!response.ok) {
          throw new Error('Failed to fetch doctors');
        }
        const data = await response.json();
        setDoctors(data);
      } catch (err) {
        setError('Failed to load doctors');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.specialist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <div className="flex justify-center items-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
    </div>
  );

  if (error) return (
    <div className="text-center p-5 text-red-500">
      <i className="bi bi-exclamation-triangle text-3xl mb-2"></i>
      <p>{error}</p>
    </div>
  );

  return (
    <main className="flex-grow p-5 overflow-y-auto">
      {/* Search bar */}
      <div className="flex justify-between items-center mb-5">
        <div className="relative w-full max-w-sm">
          <i className="bi bi-search absolute top-1/2 left-3 -translate-y-1/2 text-teal-500 text-sm"></i>
          <input
            type="text"
            className="w-full pl-9 pr-4 py-2 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-teal-500 transition duration-300" 
            placeholder="Search Doctors"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-teal-800 text-white p-5 rounded-2xl flex justify-between items-center mb-5">
        <div>
          <h2 className="text-lg font-semibold mb-1">Find Your Specialist</h2>
          <p className="text-sm mb-4">Book appointments with qualified doctors</p>
        </div>
        <img src={doctor} alt="Doctor" className="w-32 h-32" />
      </div>

      {/* Doctor cards */}
      <h3 className="text-lg font-medium mb-3">Available Doctors</h3>

      {filteredDoctors.length === 0 ? (
        <div className="text-center p-10 bg-gray-50 rounded-lg">
          <p>No doctors found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDoctors.map((doctor) => (
            <div key={doctor.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="flex items-center mb-3">
                <div className="bg-teal-100 w-12 h-12 rounded-full flex items-center justify-center mr-3">
                  <i className="bi bi-person-fill text-teal-500 text-xl"></i>
                </div>
                <div>
                  <h4 className="font-medium">{doctor.name}</h4>
                  <p className="text-sm text-gray-600">{doctor.specialist}</p>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Link href={`/doctors/${doctor.id}/appointment`} className="flex-1">
                  <button className="w-full bg-gradient-to-r from-teal-500 to-teal-700 text-white py-2 rounded-lg text-sm font-medium hover:opacity-90 transition">
                    Book Appointment
                  </button>
                </Link>
                <Link href={`/doctors/${doctor.id}`} className="flex-1">
                  <button className="w-full border border-teal-500 text-teal-500 py-2 rounded-lg text-sm font-medium hover:bg-teal-50 transition">
                    View Profile
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default DoctorsPage;