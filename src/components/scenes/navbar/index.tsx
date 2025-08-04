"use client";

import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import CustomLink from "./Link";
import { SelectedPage } from "@/utils/types";
import useMediaQuery from "@/hooks/useMediaQuery";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

type Props = {
  isTopOfPage: boolean;
  selectedPage: SelectedPage;
  setSelectedPage: (value: SelectedPage) => void;
};

const Navbar = ({ isTopOfPage, selectedPage, setSelectedPage }: Props) => {
  const { user, logout } = useAuth();
  const [isMenuToggled, setIsMenuToggled] = useState<boolean>(false);
  const flexBetween = "flex items-center justify-between";
  const isAboveMediumScreens = useMediaQuery("(min-width: 1060px)");
  const navbarBackground = isTopOfPage ? "" : "bg-teal-400 drop-shadow";

  return (
    <nav>
      <div
        className={`${navbarBackground} ${flexBetween} fixed top-0 z-30 w-full py-6 transition duration-300`}
      >
        <div className={`${flexBetween} mx-auto w-5/6`}>
          <div className={`${flexBetween} w-full gap-16`}>
            {/* Logo */}
            <div className="flex flex-row w-[300px] sm:w-[400px] justify-start items-center">
              <Image
                src="/assets/Logo/medlink.png"
                alt="logo"
                width={40}
                height={40}
                className="h-10 w-13"
              />
              <p className="pl-3 font-montserrat text-lg sm:text-xl font-bold">
                MedLink Smart UMS
              </p>
            </div>

            {/* Desktop Navigation */}
            {isAboveMediumScreens ? (
              <div className={`${flexBetween} w-full`}>
                <div className={`${flexBetween} gap-8 text-sm`}>
                  {["Home", "About", "Services", "Team"].map((page) => (
                    <CustomLink
                      key={page}
                      page={page as SelectedPage}
                      selectedPage={selectedPage}
                      setSelectedPage={setSelectedPage}
                      isTopOfPage={isTopOfPage}
                    />
                  ))}
                </div>
                <div className={`${flexBetween} gap-8`}>
                  {/* <Link href="/diagnose" passHref>
                    <p className="hover:text-teal-600 hover:underline cursor-pointer">
                      Diagnose Now
                    </p>
                  </Link> */}
                  <a href="/dashboard">
                    <p className="hover:text-teal-600 hover:underline cursor-pointer">
                      Dashboard
                    </p>
                  </a>
                  {user ? (
                    <button onClick={logout} className="rounded-md bg-secondary-500 px-10 py-2 hover:bg-yellow-300 hover:text-white transition duration-300">
                      Logout
                    </button>
                  ) : (
                    <a href={"/login"} className="rounded-md bg-secondary-500 px-10 py-2 hover:bg-yellow-300 hover:text-white transition duration-300">
                      Login
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <button
                className="rounded-full bg-secondary-500 p-2"
                onClick={() => setIsMenuToggled(true)}
              >
                <Bars3Icon className="h-6 w-6 text-white" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu with Animation */}
      <AnimatePresence>
        {!isAboveMediumScreens && isMenuToggled && (
          <motion.div
            key="mobile-menu"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3 }}
            className="fixed right-0 top-0 z-40 h-full w-[300px] bg-teal-400 drop-shadow-xl"
          >
            <div className="flex justify-end p-6">
              <button onClick={() => setIsMenuToggled(false)}>
                <XMarkIcon className="h-6 w-6 text-gray-600" />
              </button>
            </div>
            <div className="mx-10 mt-10 flex flex-col gap-8 text-lg font-semibold">
              {["Home", "About", "Services", "Team"].map((page) => (
                <CustomLink
                  key={page}
                  page={page as SelectedPage}
                  selectedPage={selectedPage}
                  setSelectedPage={(value) => {
                    setSelectedPage(value);
                    setIsMenuToggled(false);
                  }}
                  isTopOfPage={isTopOfPage}
                />
              ))}
              <a href="/dashboard">
                <p
                  onClick={() => setIsMenuToggled(false)}
                  className="hover:text-teal-600 underline cursor-pointer"
                >
                  Dashboard
                </p>
              </a>
              {user ? (
                <button onClick={logout} className="rounded-md bg-secondary-500 px-10 py-2 hover:bg-yellow-300 hover:text-white transition duration-300">
                  Logout
                </button>
              ) : (
                <a href={"/login"} className="rounded-md bg-secondary-500 px-10 py-2 hover:bg-yellow-300 hover:text-white transition duration-300">
                  Login
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
