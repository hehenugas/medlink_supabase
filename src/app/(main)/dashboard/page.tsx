"use client";

import Link from "next/link";
import { useContext, useEffect } from "react";
import { RightbarContext } from '@/context/RightbarContext';
import GoogleMaps from "@/components/GoogleMaps";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const doctor = "/assets/dashboard/doctor.svg";
const pharmacy = "/assets/dashboard/pharmacy.svg";
const laboratory = "/assets/dashboard/laboratory.svg";
const healthcare = "/assets/dashboard/White Colorful Concept Map Chart_page-0001.png";
const monitoring = "/assets/dashboard/monitoring.svg";
const groupDoctor = "/assets/dashboard/group-doctor.svg";

export default function DashboardPage() {
  const { user } = useAuth();
  const { setRightbarOpen } = useContext(RightbarContext);

  return (
    <main className="flex-grow p-5 overflow-y-auto">
      <div className="flex justify-between items-center mb-5">
        <div className="relative w-full max-w-sm">
          <i className="bi bi-search absolute top-1/2 left-3 -translate-y-1/2 text-teal-500 text-sm"></i>
          <input
            type="text"
            className="w-full pl-9 pr-4 py-2 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-teal-500 transition duration-300"
            placeholder="Search Here"
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div
              className="flex items-center justify-center w-[50px] h-[50px] rounded-[20%] cursor-pointer hover:bg-gradient-to-b hover:from-teal-400 hover:to-teal-700 hover:text-white transition"
              onClick={() => setRightbarOpen((prev) => !prev)}
            >
              <i className="bi bi-sliders text-xl"></i>
            </div>
            <div className="flex items-center justify-center w-[50px] h-[50px] rounded-[20%] cursor-pointer hover:bg-gradient-to-b hover:from-teal-400 hover:to-teal-700 hover:text-white transition">
              <i className="bi bi-bell-fill text-xl"></i>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <img src="/assets/Team/marko.jpg" alt="User" width={40} height={40} className="rounded-full" />
            <div>
              <strong>{user?.name}</strong>
              <br />
              <small>@{user?.username}</small>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-teal-500 to-teal-800 text-white p-5 rounded-2xl flex justify-between items-center mb-5">
        <div className="max-w-[40%]">
          <h2 className="text-lg font-semibold mb-4">Comprehensive Health Service Offered Here</h2>
          {/* <button className="border border-white px-5 py-2 rounded-full mr-2 font-bold hover:bg-white hover:text-teal-500 transition">Get Started</button>
          <button className="border border-white px-5 py-2 rounded-full font-bold hover:bg-white hover:text-teal-500 transition">Learn More</button> */}
        </div>
        <img src={groupDoctor} alt="Doctors" className="w-52 h-52" />
      </div>

      <div className="mb-5">
        <h3 className="text-lg font-medium mb-3">Feature</h3>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {[
            { href: "/healthcare-monitoring", src: monitoring, label: "Healthcare Monitoring" },
            { href: "/doctors", src: doctor, label: "Doctor" },
            { href: "/laboratory", src: laboratory, label: "Laboratory" },
            { href: "/pharmacy", src: pharmacy, label: "Pharmacy" },
            { href: "/healthcare", src: healthcare, label: "Healthcare" },
          ].map(({ href, src, label }) => (
            <Link href={href} key={label} className="flex flex-col items-center justify-between p-2 rounded-xl text-center cursor-pointer hover:bg-gradient-to-b hover:from-teal-300 hover:to-teal-700 hover:text-white transition">
              <img src={src} alt={label} className="w-30 h-30 mb-1" />
              <p>{label}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium">Nearby Location</h3>
          <button className="border border-teal-500 text-teal-500 px-5 py-2 rounded-full font-bold hover:bg-gradient-to-b hover:from-teal-500 hover:to-teal-700 hover:text-white transition">See All</button>
        </div>
        <div>
          <GoogleMaps
            show={true}
            latitude={-7.5578}
            longitude={110.7713}
            zoom={15}
            markerColor="blue"
            markerLabel="H"
          />
        </div>
      </div>
    </main>
  );
}
