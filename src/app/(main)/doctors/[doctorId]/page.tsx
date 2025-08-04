"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { Doctor } from "#/prisma/db";

const doctorPlaceholder = "/assets/dashboard/doctor.svg";

export default function DoctorProfile() {
  const params = useParams();
  const doctorId = params?.doctorId as string | undefined;

  const pathname = usePathname();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await fetch(`/api/doctors/${doctorId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch doctor data");
        }
        const data = await response.json();
        setDoctor(data);
      } catch (err) {
        setError("Failed to load doctor details");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();

  }, [doctorId]);

  if (loading) return (
    <div className="flex justify-center items-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
    </div>
  );

  if (error) return <p>{error}</p>;
  if (!doctor) return <p>Doctor not found</p>;

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/doctors" className="text-teal-600 hover:underline">
          ← Back to Doctors
        </Link>

        <div className="bg-white rounded-xl shadow-lg mt-4 p-6">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <img
              src={doctorPlaceholder}
              alt={doctor.name}
              className="w-48 h-48 rounded-full object-cover"
            />
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{doctor.name}</h1>
              <p className="text-teal-600 text-xl">{doctor.specialist}</p>

              <div className="mt-4 space-y-2">
                <p>📚 Education: {doctor.education}</p>
                <p>🏥 Experience: {doctor.experience}</p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">About</h2>
            <p className="text-gray-600">{doctor.about}</p>
          </div>

          <div className="mt-8 flex gap-4">
            <Link href={`${pathname}/appointment`}>
              <button className="bg-teal-600 text-white px-6 py-2 rounded-full hover:bg-teal-700">
                Book Appointment
              </button>
            </Link>
            <Link href={`/message/${doctorId}`} className="border border-teal-600 text-teal-600 px-6 py-2 rounded-full hover:bg-teal-50">
              Send Message
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
