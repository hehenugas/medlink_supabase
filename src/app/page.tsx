"use client"

import Navbar from "@/components/scenes/navbar";
import Home from "@/components/scenes/home";
import Benefits from "@/components/scenes/services";
import About from "@/components/scenes/about";
import Team from "@/components/scenes/team";
import Footer from "@/components/scenes/footer";
import { SelectedPage } from "@/utils/types";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const [selectedPage, setSelectedPage] = useState<SelectedPage>(
    SelectedPage.Home,
  );
  const [isTopOfPage, setIsTopOfPage] = useState<boolean>(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY === 0) {
        setIsTopOfPage(true);
        setSelectedPage(SelectedPage.Home);
      }
      if (window.scrollY !== 0) setIsTopOfPage(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="app bg-gray-20">
      <Navbar
        isTopOfPage={isTopOfPage}
        selectedPage={selectedPage}
        setSelectedPage={setSelectedPage}
      />
      <Home setSelectedPage={setSelectedPage} />
      <About setSelectedPage={setSelectedPage} />
      <Benefits setSelectedPage={setSelectedPage} />
      <Team setSelectedPage={setSelectedPage} />
      <Footer />
    </div>
  );
};

export default Dashboard;
