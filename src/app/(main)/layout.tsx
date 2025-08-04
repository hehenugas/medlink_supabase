"use client"

import { ReactNode, useEffect, useState } from 'react';
import { RightbarContext } from '@/context/RightbarContext';
import Rightbar from './rightbar';
import Sidebar from './sidebar';

export default function RootLayout({ children }: { children: ReactNode }) {
  const [rightbarOpen, setRightbarOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1060) {
        setRightbarOpen(true);
        setSidebarOpen(true);
      } else {
        setRightbarOpen(false);
        setSidebarOpen(false);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSidebarClick = () => {
    if (isMobile()) {
      setRightbarOpen(false);
      setSidebarOpen(!sidebarOpen);
    }
  };

  const handleRightbarClick = () => {
    if (isMobile()) {
      setSidebarOpen(false);
      setRightbarOpen(!rightbarOpen);
    }
  };

  const isMobile = () => {
    return window.innerWidth < 1060
  }

  return (
    <RightbarContext.Provider value={{ setRightbarOpen }}>
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
          <Sidebar setRightbarOpen={setRightbarOpen} setSidebarOpen={setSidebarOpen} />
        </aside>

        {/* Main Content */}
        <main className="mt-8 md:mt-0 flex-1 p-6 overflow-y-auto text-black">{children}</main>

        {/* Mobile Rightbar Toggle */}
        <button
          className="md:hidden h-10 w-10 fixed top-4 right-4 z-50 bg-white p-2 rounded-full shadow border"
          onClick={handleRightbarClick}
        >
          <i className={`bi ${rightbarOpen ? 'bi-x-lg' : 'bi-layout-sidebar-inset-reverse'}`}></i>
        </button>

        {/* Rightbar */}
        <aside
          className={`
            fixed right-0 md:static z-10 h-full w-[300px] bg-white p-5 flex flex-col justify-between border-r border-gray-300
            transform transition-transform duration-300 ease-in-out
            ${rightbarOpen ? 'translate-x-0' : 'translate-x-full'}
            md:translate-x-0
          `}
        >
          <Rightbar />
        </aside>
      </div>
    </RightbarContext.Provider>
  );
}
