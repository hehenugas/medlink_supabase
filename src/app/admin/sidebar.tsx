"use client"

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const logo = '/assets/Logo/medlink.png';

export default function sidebar({setSidebarOpen}: {setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>}) {
  const { logout } = useAuth();

  const isMobile = () => {
    return window.innerWidth < 1060
  }

  const handleNavigate = () => {
    if (isMobile()) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      <div>
        <div className="flex justify-center items-center mb-5">
          <Link href="/">
            <img src={logo} alt="Logo" className="w-24 h-28 object-contain" />
          </Link>
        </div>
        <nav className="flex flex-col">
          <SidebarLink href="/admin/dashboard" icon="bi-house-door" text="Dashboard" handleNavigate={handleNavigate}/>
          <SidebarLink href="/admin/users" icon="bi-clipboard-check-fill" text="Users" handleNavigate={handleNavigate}/>
          <SidebarLink href="/admin/medical-checkup" icon="bi-gear-wide" text="Medical Checkup"handleNavigate={handleNavigate}/>
          <SidebarLink href="/admin/doctors" icon="bi-person-standing" text="Doctors" handleNavigate={handleNavigate}/>
          <SidebarLink href="/admin/appointments" icon="bi-clipboard-check-fill" text="Appointments" handleNavigate={handleNavigate}/>
          <SidebarLink href="/admin/message" icon="bi-chat-left-dots" text="Message" handleNavigate={handleNavigate}/>
          <SidebarLink href="/admin/pharmacy" icon="bi-capsule" text="Pharmacy" handleNavigate={handleNavigate}/>
          <SidebarLink href="/admin/iv-monitoring" icon="bi-pc-display-horizontal" text="IV Monitoring" handleNavigate={handleNavigate}/>
        </nav>
      </div>

      <div className="flex flex-col gap-2">
        <SidebarLink href="/account" icon="bi-person-fill" text="My Account" handleNavigate={handleNavigate}/>
        <button
          onClick={logout}
          className="flex items-center gap-2 p-2 mb-2 rounded-lg text-gray-500 hover:bg-teal-500 hover:text-white transition w-full text-left"
        >
          <i className="bi bi-box-arrow-right"></i>
          <span>Sign Out</span>
        </button>
        <SidebarLink href="/help" icon="bi-question-circle-fill" text="Help" handleNavigate={handleNavigate}/>
      </div>
    </>
  )
}


function SidebarLink({ href, icon, text, handleNavigate }: { href: string; icon: string; text: string, handleNavigate: () => void }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={handleNavigate}
      className={`flex items-center gap-2 p-2 mb-2 rounded-lg transition ${
        isActive ? "bg-teal-500 text-white" : "text-gray-500 hover:bg-teal-500 hover:text-white"
      }`}
    >
      <i className={`bi ${icon}`}></i>
      <span>{text}</span>
    </Link>
  );
}
