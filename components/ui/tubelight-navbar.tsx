"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User, Briefcase, Mail } from "lucide-react";

export function TubelightNavbar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", url: "/", icon: Home },
    { name: "About", url: "/about", icon: User },
    { name: "Portfolio", url: "/portofolio", icon: Briefcase },
    { name: "Contact", url: "/kontak", icon: Mail },
  ];

  return (
    // Class d-md-none dan md:hidden memastikan navbar ini HANYA muncul di HP
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[9999] d-md-none md:hidden">
      <nav className="flex items-center gap-1 rounded-full bg-[var(--bg-glass)] backdrop-blur-xl border border-[var(--border-glass)] px-2 py-1 shadow-[0_8px_30px_rgba(0,0,0,0.25)]">
        {navItems.map((item) => {
          const isActive =
            item.url === "/"
              ? pathname === "/"
              : pathname === item.url ||
                (item.url === "/portofolio" && pathname.startsWith("/laprak"));
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.url}
              aria-label={item.name}
              className={`relative flex items-center justify-center rounded-full p-2 transition-all duration-200 ${
                isActive
                  ? "text-[#1ED760] bg-[#1ED760]/10"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-glass-hover)]"
              }`}
            >
              <span className="hidden md:inline-block mr-2 text-xs font-medium">
                {item.name}
              </span>
              <Icon size={18} strokeWidth={2.2} />

              {isActive && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className="absolute -top-1 left-1/2 h-[2.5px] w-5 -translate-x-1/2 rounded-full bg-[#1ED760] shadow-[0_0_8px_2px_rgba(30,215,96,0.6)]"
                />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}