"use client";

import { useAuth } from "@/context/AuthContext";
import { HistoricalData } from "#/prisma/db";
import { useEffect, useState } from "react";
import MedicalCheckupChart from "@/components/MedicalCheckUpChart";

export default function HealthcareMonitoringPage() {
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        const res = await fetch("/api/medical-checkup");
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();
        setHistoricalData(data);
      } catch (error) {
        console.error("Gagal mengambil data medical checkup:", error);
      }
    };

    fetchHistoricalData();
  }, []);

  const formatDate = (date: string | Date) => {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      throw new Error("Invalid date format");
    }
    return parsedDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="p-6">
      <div className="bg-gradient-to-r from-teal-500 to-teal-700 text-white p-6 rounded-2xl mb-6">
        <h1 className="text-2xl font-bold mb-2">Healthcare Services</h1>
        <p className="text-lg">Your complete health solution partner</p>
      </div>

      {/* Diagnoses Section */}
      <div className="mb-6">
        <div className="flex flex-col gap-6 pb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Patient Information */}
            <div className="flex flex-col w-full border rounded-xl shadow-sm">
              <div className="h-[50px] flex items-center bg-teal-50 rounded-t-xl">
                <p className="pl-5 text-xl font-semibold text-teal-800">
                  Patient Information
                </p>
              </div>
              <div className="flex flex-col gap-4 p-5">
                <p>
                  <span className="font-medium">Name:</span> {user?.name}
                </p>
                <p>
                  <span className="font-medium">Student ID:</span> {user?.studentId}
                </p>
                <p>
                  <span className="font-medium">Major:</span> {user?.major}
                </p>
                <p>
                  <span className="font-medium">Gender:</span> {user?.gender}
                </p>
                <p>
                  <span className="font-medium">Birth Place:</span> {user?.birthPlace}
                </p>
                <p>
                  <span className="font-medium">Birth Date:</span>{" "}
                  {user?.birthDate ? formatDate(user.birthDate) : "N/A"}
                </p>
                <p>
                  <span className="font-medium">Phone Number:</span> {user?.phoneNumber}
                </p>
              </div>
            </div>
          </div>

          {/* Historical Data */}
          <div className="flex flex-col w-full border rounded-xl shadow-sm">
            <div className="h-[50px] flex items-center bg-teal-50 rounded-t-xl">
              <p className="pl-5 text-xl font-semibold text-teal-800">
                Historical Data
              </p>
            </div>
            <div className="w-full overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-teal-50">
                    <th className="text-left p-4 border-b">Measurement</th>
                    <th className="text-left p-4 border-b">Value</th>
                    <th className="text-left p-4 border-b">Status</th>
                    <th className="text-left p-4 border-b">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {historicalData?.map((data: HistoricalData, index: any) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="p-4 border-b">{data.parameter}</td>
                      <td className="p-4 border-b">
                        {data.value} {data.unit}
                      </td>
                      <td className="p-4 border-b">{data.information}</td>
                      <td className="p-4 border-b">{formatDate(data.date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Chart Section */}
          {historicalData.length > 0 && (
            <MedicalCheckupChart data={historicalData as any} />
          )}
        </div>
      </div>
    </div>
  );
}