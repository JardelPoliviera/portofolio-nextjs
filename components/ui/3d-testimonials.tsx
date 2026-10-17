"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Arkan",
    role: "Project Manager",
    text: "Desain UI/UX yang dibuat oleh Jardel sangat modern. Pengalaman pengguna benar-benar diperhatikan dengan detail.",
    image: "https://i.pravatar.cc/150?u=arkan" 
  },
  {
    id: 2,
    name: "Imam",
    role: "System Analyst",
    text: "Sangat mudah bekerja sama dengan Jardel. Portofolionya mencerminkan dedikasinya pada visualisasi data dan web programming.",
    image: "https://i.pravatar.cc/150?u=imam"
  },
  {
    id: 3,
    name: "Abdullah",
    role: "Web Developer",
    text: "Kombinasi antara kemampuan video editing dan web programming membuatnya memiliki nilai tambah yang luar biasa dalam tim.",
    image: "https://i.pravatar.cc/150?u=abdullah"
  }
];

export function Testimonials3D() {
  const [active, setActive] = useState(0);

  // Auto-play berputar setiap 4 detik
  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full max-w-sm mx-auto h-[240px] perspective-1000 mt-4 md:mt-0">
      <AnimatePresence>
        {testimonials.map((testimonial, index) => {
          const isActive = active === index;
          const isNext = (active + 1) % testimonials.length === index;
          const isPrev = (active - 1 + testimonials.length) % testimonials.length === index;
          
          let zIndex = 0;
          let y = 0;
          let scale = 1;
          let opacity = 0;
          let rotateX = 0;
          
          // Logika tumpukan 3D
          if (isActive) {
            zIndex = 30; y = 0; scale = 1; opacity = 1; rotateX = 0;
          } else if (isNext) {
            zIndex = 20; y = 35; scale = 0.9; opacity = 0.6; rotateX = -5;
          } else if (isPrev) {
            zIndex = 10; y = 70; scale = 0.8; opacity = 0.3; rotateX = -10;
          }
          
          return (
            <motion.div
              key={testimonial.id}
              initial={false}
              animate={{ zIndex, y, scale, opacity, rotateX }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 w-full h-full bg-[var(--bg-glass)] border border-[var(--border-glass)] backdrop-blur-xl rounded-3xl p-6 shadow-2xl flex flex-col justify-between cursor-pointer"
              style={{ transformOrigin: "top center" }}
              onClick={() => setActive(index)} // Klik untuk mengubah aktif
            >
              <div className="text-[var(--text-secondary)] text-sm mb-4 line-clamp-3 leading-relaxed">
                 <Quote size={20} className="text-[#1ED760] mb-2 opacity-50" />
                 "{testimonial.text}"
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center border border-[#1ED760] overflow-hidden shrink-0">
                   <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h5 className="text-[var(--text-primary)] font-bold text-sm m-0">{testimonial.name}</h5>
                  <span className="text-[var(--text-secondary)] text-xs">{testimonial.role}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}