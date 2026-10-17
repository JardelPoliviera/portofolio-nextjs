"use client";

import React from "react";

// Data deskripsi tools editing
const editingTools = [
  {
    name: "After Effects",
    role: "Motion Graphics & VFX",
    text: "Software andalan untuk menciptakan efek visual kompleks, animasi tipografi, dan motion graphics berkualitas profesional.",
    img: "https://ui-avatars.com/api/?name=Ae&background=00005a&color=33ccff&bold=true&font-size=0.4",
  },
  {
    name: "CapCut",
    role: "Video Editor",
    text: "Aplikasi editing video yang sangat cepat dan praktis. Sangat andal untuk memproduksi konten media sosial yang dinamis.",
    img: "https://ui-avatars.com/api/?name=Cc&background=000000&color=ffffff&bold=true&font-size=0.4",
  },
  {
    name: "Figma",
    role: "UI/UX Design",
    text: "Platform desain antarmuka berbasis cloud yang esensial untuk membuat prototipe dan wireframe website dengan kolaborasi mulus.",
    img: "https://ui-avatars.com/api/?name=Fg&background=f24e1e&color=ffffff&bold=true&font-size=0.4",
  },
  {
    name: "Alight Motion",
    role: "Mobile Animation",
    text: "Platform terbaik untuk membuat animasi keyframe dan motion graphics tingkat lanjut langsung dari perangkat seluler.",
    img: "https://ui-avatars.com/api/?name=Am&background=000000&color=00ff00&bold=true&font-size=0.4",
  },
  {
    name: "Premiere Pro",
    role: "Video Editor",
    text: "Standar industri untuk pengeditan video berbasis timeline. Menawarkan kontrol penuh untuk post-produksi profesional.",
    img: "https://ui-avatars.com/api/?name=Pr&background=00005a&color=e88aff&bold=true&font-size=0.4",
  },
  {
    name: "Lightroom",
    role: "Photo Grading",
    text: "Alat manajemen dan pengeditan foto yang sangat luar biasa untuk melakukan color grading dan menyesuaikan pencahayaan gambar.",
    img: "https://ui-avatars.com/api/?name=Lr&background=00005a&color=5bc0de&bold=true&font-size=0.4",
  }
];

// Komponen Card
const ReviewCard = ({
  img,
  name,
  role,
  text,
}: {
  img: string;
  name: string;
  role: string;
  text: string;
}) => {
  return (
    // Menggunakan variabel CSS agar teks dan background beradaptasi pada Mode Terang/Gelap
    <div className="relative flex flex-col justify-center gap-4 p-6 rounded-3xl shrink-0 w-[280px] h-[280px] border border-[var(--border-glass)] bg-[var(--bg-glass)] backdrop-blur-md shadow-xl overflow-hidden">
      <div className="flex flex-row items-center gap-4">
        {/* Menggunakan rounded-xl (kotak bersudut tumpul) agar lebih cocok untuk logo software */}
        <img className="rounded-xl w-12 h-12 border border-[var(--border-glass)] object-cover shadow-sm" alt={name} src={img} />
        <div className="flex flex-col">
          <span className="text-sm font-bold text-[var(--text-primary)]">{name}</span>
          <span className="text-xs text-[#1ED760] font-medium">{role}</span>
        </div>
      </div>
      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
        {text}
      </p>
    </div>
  );
};

export function VerticalMarquee() {
  const singleColumn = [...editingTools, ...editingTools]; 

  return (
    <div className="relative flex h-[600px] w-full flex-row items-center justify-center overflow-hidden [perspective:1000px]">
      
      <div 
        className="flex h-full w-full justify-center"
        style={{
          maskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
          transform: "rotateZ(-5deg) scale(1.1)"
        }}
      >
        <div className="flex flex-col gap-6 py-4 animate-marquee-vertical items-center">
          {singleColumn.map((tool, i) => (
            <ReviewCard key={i} {...tool} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee-vertical {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        .animate-marquee-vertical {
          animation: marquee-vertical 30s linear infinite;
        }
        
        /* Tambahan agar animasi berhenti jika mouse diarahkan (hover) untuk mempermudah membaca */
        .animate-marquee-vertical:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}