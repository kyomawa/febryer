"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import CallToAction from "../CallToAction/CallToAction";

export default function Header() {
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < lastScrollY) {
        setVisible(true);
      } else {
        setVisible(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`fixed top-0 z-50 w-full bg-black bg-opacity-10 backdrop-blur-sm transition-transform duration-300 ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="flex flex-row items-center justify-between p-2 text-white">
        <Image src="/img/logo-light.svg" alt="Logo" width={120} height={120} />
        <nav>
          <ul className="flex flex-row space-x-4 text-base font-semibold">
            <li className="cursor-pointer duration-200 hover:text-primary-500">
              Accueil
            </li>
            <li className="cursor-pointer duration-200 hover:text-primary-500">
              Services
            </li>
            <li className="cursor-pointer duration-200 hover:text-primary-500">
              A Propos
            </li>
            <li className="cursor-pointer duration-200 hover:text-primary-500">
              Contact
            </li>
          </ul>
        </nav>
        <CallToAction size="md" />
      </div>
    </header>
  );
}
