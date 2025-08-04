"use client"

import { ReactNode, useEffect, useState } from 'react';
import Sidebar from './sidebar'

export default function RootLayout({ children }: { children: ReactNode }) {

  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1060) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSidebarClick = () => {
    if (isMobile()) {
      setSidebarOpen(!sidebarOpen);
    }
  };

  const isMobile = () => {
    return window.innerWidth < 1060
  }

  return (
      <div className="flex h-screen text-black relative">

        {/* Mobile Sidebar Toggle */}
        <button
          className="md:hidden h-10 w-10 fixed top-4 left-4 z-50 bg-white p-2 rounded-full shadow border"
          onClick={handleSidebarClick}
        >
          <i className={`bi ${sidebarOpen ? 'bi-x-lg' : 'bi-list'}`}></i>
        </button>

        {/* Sidebar */}
        <aside
          className={`
            fixed md:static z-10 h-full w-[250px] bg-white p-5 flex flex-col justify-between border-r border-gray-300
            transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            md:translate-x-0
          `}
        >
          <Sidebar setSidebarOpen={setSidebarOpen}/>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto text-black">{children}</main>
      </div>
  );
}
