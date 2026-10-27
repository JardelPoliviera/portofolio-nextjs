"use client";

import { useState, useEffect } from "react";

export default function ThemeToggle({ className }: { className?: string }) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const updateThemeState = () => {
      const savedTheme = localStorage.getItem("theme");
      const currentTheme =
        document.documentElement.getAttribute("data-theme") || savedTheme || "dark";
      setIsDark(currentTheme === "dark");
    };

    updateThemeState();
    window.addEventListener("themechange", updateThemeState);
    window.addEventListener("storage", updateThemeState);

    return () => {
      window.removeEventListener("themechange", updateThemeState);
      window.removeEventListener("storage", updateThemeState);
    };
  }, []);

  const toggleTheme = () => {
    const nextTheme = isDark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("theme", nextTheme);
    setIsDark(!isDark);
    window.dispatchEvent(new Event("themechange"));
  };

  return (
    <button 
      type="button"
      onClick={toggleTheme}
      className={`nav-link bg-transparent border-0 d-flex align-items-center gap-3 transition-colors ${className || 'w-100 text-start'}`}
      style={{ cursor: "pointer" }}
      aria-label="Ubah Tema"
      title={isDark ? "Beralih ke Mode Terang" : "Beralih ke Mode Gelap"}
    >
      <i className="fas fa-circle-half-stroke fa-lg"></i>
      <span className="d-md-none">Ubah Tema</span>
      <span className="d-none d-md-inline">Tema</span>
    </button>
  );
}
