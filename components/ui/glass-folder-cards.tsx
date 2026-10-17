"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FileCode, FileText, Image as ImageIcon, Folder } from "lucide-react";

interface FileItem {
  name: string;
  meta?: string;
  link?: string;
}

interface GlassFolderProps {
  label: string;
  meta?: string;
  files?: FileItem[];
  appearDelay?: number;
}

export default function GlassFolder({ label, meta, files = [], appearDelay = 0 }: GlassFolderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getIcon = (name: string) => {
    if (name.includes("Web") || name.includes("Mobile")) return <Folder className="w-5 h-5 text-[var(--spotify-accent,#1ED760)]" />;
    if (name.includes("Figma") || name.includes("Design") || name.includes("Pixel") || name.includes("Chroma") || name.includes("Kasir")) return <ImageIcon className="w-5 h-5 text-[var(--spotify-accent,#1ED760)]" />;
    return <FileCode className="w-5 h-5 text-[var(--spotify-accent,#1ED760)]" />;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: appearDelay / 1000 }}
      className="relative w-64 h-48 cursor-pointer group [perspective:2000px] mt-24 mb-8"
    >
      <motion.div
        className="w-full h-full relative [transform-style:preserve-3d]"
        whileHover={{ rotateX: 10, rotateY: -10, z: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* BAGIAN BELAKANG FOLDER (Kaca Bening) */}
        <div className="absolute inset-0 bg-white/5 dark:bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl rounded-tl-none shadow-2xl flex flex-col justify-end p-5">
           
           {/* Tab atas folder */}
           <div className="absolute top-[-20px] left-0 w-[45%] h-[20px] bg-white/5 dark:bg-white/10 border-t border-l border-r border-white/20 rounded-t-lg backdrop-blur-xl" />

           {/* ISI DOKUMEN (Tidak bening, menggunakan warna tema aslimu) */}
           <div className="absolute inset-x-4 top-0 bottom-4 flex flex-col justify-end z-0">
             {files.map((file, idx) => (
               <motion.a
                 key={idx} href={file.link || "#"} target={file.link?.startsWith("/") ? "_self" : "_blank"}
                 initial={{ y: 0, opacity: 0, scale: 0.8 }}
                 animate={{ y: isOpen ? -120 - (idx * 55) : 0, opacity: isOpen ? 1 : 0, scale: isOpen ? 1 : 0.8 }}
                 transition={{ duration: 0.4, delay: isOpen ? idx * 0.05 : 0, type: "spring" }}
                 // Menggunakan bg-[var(--bg-glass-hover)] agar isi file tetap solid dan sesuai tema terang/gelap
                 className={`absolute bottom-0 w-full bg-[var(--bg-glass-hover)] border border-[var(--border-glass)] rounded-lg p-3 flex items-center gap-3 shadow-xl text-decoration-none hover:scale-105 transition-all duration-300 ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}
                 style={{ zIndex: files.length - idx }} onClick={(e) => e.stopPropagation()} 
               >
                 {getIcon(file.name)}
                 <div className="text-left">
                   <p className="text-sm font-bold text-[var(--text-primary)] truncate max-w-[140px] m-0">{file.name}</p>
                   {file.meta && <p className="text-[11px] text-[var(--text-secondary)] m-0">{file.meta}</p>}
                 </div>
               </motion.a>
             ))}
           </div>
        </div>

        {/* BAGIAN DEPAN FOLDER (Kaca Penutup Bening) */}
        <motion.div
          className="absolute inset-0 pointer-events-none bg-white/10 dark:bg-white/10 backdrop-blur-md border border-white/30 rounded-xl rounded-tl-none origin-bottom shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] flex flex-col justify-end p-5 z-20"
          animate={{ rotateX: isOpen ? -45 : 0 }} transition={{ type: "spring", stiffness: 200, damping: 25 }}
        >
           <div className="text-left">
             <h3 className="text-2xl font-extrabold tracking-wide drop-shadow-md m-0 text-[var(--text-primary)]">
               {label}
             </h3>
             {meta && <p className="text-sm font-medium mt-1 drop-shadow-sm m-0 text-[var(--text-secondary)]">{meta}</p>}
           </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}