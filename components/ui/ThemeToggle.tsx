"use client";

import { useState, useEffect } from "react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
      setIsDark(false);
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  return (
    <button 
      onClick={toggleTheme}
      className="nav-link bg-transparent border-0 d-flex align-items-center gap-3 w-100 text-start transition-colors"
      style={{ cursor: "pointer" }}
    >
      {/* Ikon diubah menjadi setengah lingkaran (standar ikon tema) */}
      <i className="fas fa-circle-half-stroke fa-lg"></i>
      {/* Teks hanya muncul di HP atau Sidebar, menyesuaikan ruang */}
      <span className="d-md-none">Ubah Tema</span>
      <span className="d-none d-md-inline">Tema</span>
    </button>
  );
}