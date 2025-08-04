"use client"

import { useState, useEffect } from "react";
import { SelectedPage } from "@/utils/types";
import Link from "next/link";

const Diagnoses = () => {
  const [selectedPage, setSelectedPage] = useState<SelectedPage>(
    SelectedPage.Home,
  );
  const [isTopOfPage, setIsTopOfPage] = useState<boolean>(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY === 0) {
        setIsTopOfPage(true);
        setSelectedPage(SelectedPage.Home);
      } else {
        setIsTopOfPage(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex flex-col w-full min-h-screen">
      <div className="flex items-center justify-between px-5 py-3 bg-white border-b">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-red-800"></div>
          <span className="ml-2 font-bold text-red-800">MedLink Smart UMS</span>
        </div>
        <div className="flex space-x-4">
          <span className="text-green-600">Home</span>
          <span>About</span>
          <span>Services</span>
          <span>Team</span>
        </div>
        <div className="flex space-x-2">
          <button className="text-red-800">Diagnose Now</button>
          <button className="bg-yellow-500 px-3 py-1 rounded">Logout</button>
        </div>
      </div>

      <div className="pt-5 px-5 md:px-10 flex flex-col gap-6 pb-20">
        <div className="flex gap-2">
        {/* Patient Information */}
          <div className="flex flex-col w-full border rounded-md shadow-sm">
            <div className="h-[50px] flex items-center bg-red-50">
              <p className="pl-5 text-xl font-semibold text-red-800">Patient Information</p>
            </div>
            <div className="flex flex-col gap-4 p-5">
              <p>Muhammad Alexander</p>
              <p>03 03 2003</p>
              <p>Surakarta</p>
              <p>Engineer</p>
              <p>Islam</p>
            </div>
          </div>

          {/* Current Vital Signs */}
          <div className="flex flex-col w-full border rounded-md shadow-sm">
            <div className="h-[50px] flex items-center bg-red-50">
              <p className="pl-5 text-xl font-semibold text-red-800">Current Vital Signs</p>
            </div>
            <div className="flex flex-wrap w-full p-5">
              <div className="flex-1 flex flex-col items-center justify-center gap-2 py-6 min-w-[150px]">
                <p className="text-lg font-medium text-red-800">Temperature</p>
                <p className="text-4xl font-bold text-red-800">37.5</p>
                <p className="text-sm">°C</p>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center gap-2 py-6 min-w-[150px]">
                <p className="text-lg font-medium text-red-800">Blood Pressure</p>
                <p className="text-4xl font-bold text-red-800">120/80</p>
                <p className="text-sm">mmHg</p>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center gap-2 py-6 min-w-[150px]">
                <p className="text-lg font-medium text-red-800">Heart Rate</p>
                <p className="text-4xl font-bold text-red-800">78</p>
                <p className="text-sm">BPM</p>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center gap-2 py-6 min-w-[150px]">
                <p className="text-lg font-medium text-red-800">SPO2</p>
                <p className="text-4xl font-bold text-red-800">98</p>
                <p className="text-sm">%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Historical Data */}
        <div className="flex flex-col w-full border rounded-md shadow-sm">
          <div className="h-[50px] flex items-center bg-red-50">
            <p className="pl-5 text-xl font-semibold text-red-800">Historical Data</p>
          </div>
          <div className="w-full overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-red-50">
                  <th className="text-left p-4 border-b">Measurement</th>
                  <th className="text-left p-4 border-b">Value</th>
                  <th className="text-left p-4 border-b">Status</th>
                  <th className="text-left p-4 border-b">Time</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-gray-50">
                  <td className="p-4 border-b">Temperature</td>
                  <td className="p-4 border-b">37.5 °C</td>
                  <td className="p-4 border-b">Normal</td>
                  <td className="p-4 border-b">2025-04-26 09:30</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-4 border-b">Blood Pressure</td>
                  <td className="p-4 border-b">120/80 mmHg</td>
                  <td className="p-4 border-b">Normal</td>
                  <td className="p-4 border-b">2025-04-26 09:30</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-4 border-b">Heart Rate</td>
                  <td className="p-4 border-b">78 BPM</td>
                  <td className="p-4 border-b">Normal</td>
                  <td className="p-4 border-b">2025-04-26 09:30</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-4 border-b">SPO2</td>
                  <td className="p-4 border-b">98 %</td>
                  <td className="p-4 border-b">Normal</td>
                  <td className="p-4 border-b">2025-04-26 09:30</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-4 border-b">Temperature</td>
                  <td className="p-4 border-b">38.2 °C</td>
                  <td className="p-4 border-b">Elevated</td>
                  <td className="p-4 border-b">2025-04-25 14:15</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center mt-4">
          <Link href="/healthcare-monitoring" className="bg-red-800 text-white px-6 py-2 rounded">kirim</Link>
        </div>
      </div>
    </div>
  );
};

export default Diagnoses;