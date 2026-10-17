"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User, Briefcase, Mail } from "lucide-react";

export function TubelightNavbar() {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState(pathname);

  useEffect(() => {
    setActiveTab(pathname);
  }, [pathname]);

  const navItems = [
    { name: "Home", url: "/", icon: Home },
    { name: "About", url: "/about", icon: User },
    { name: "Portfolio", url: "/portofolio", icon: Briefcase },
    { name: "Contact", url: "/kontak", icon: Mail },
  ];

  return (
    // Class d-md-none dan md:hidden memastikan navbar ini HANYA muncul di HP
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] d-md-none md:hidden">
      <div className="flex items-center gap-2 rounded-full bg-black/80 backdrop-blur-md border border-white/10 p-2 shadow-2xl">
        {navItems.map((item) => {
          const isActive = activeTab === item.url;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.url}
              onClick={() => setActiveTab(item.url)}
              className={`relative flex items-center justify-center rounded-full p-3 transition-colors ${
                isActive ? "text-[#1ED760]" : "text-white/60 hover:text-white"
              }`}
            >
              <span className="hidden md:inline-block mr-2 text-sm font-medium">
                {item.name}
              </span>
              <Icon size={24} />

              {isActive && (
                <motion.div
                  layoutId="tubelight"
                  className="absolute -top-2 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full bg-[#1ED760] shadow-[0_0_10px_2px_rgba(30,215,96,0.6)]"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}