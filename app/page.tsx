"use client";

import ThemeToggle from '@/components/ui/ThemeToggle';
import Link from 'next/link';
import { SqueezeCarousel, type SqueezeSlide } from '@/components/ui/squeeze-carousel';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { useState } from 'react';
import { TubelightNavbar } from '@/components/ui/tubelight-navbar';

// --- DATA UNTUK FEATURED HIGHLIGHTS ---
const highlightSlides: SqueezeSlide[] = [
  {
    id: "github",
    title: "Github",
    description: "Akun Github saya, tempat menyimpan berbagai source code proyek.",
    image: "/images/github.png",
    imageAlt: "Github Profile",
    action: "Kunjungi Github",
    href: "https://github.com/JardelPoliviera",
    target: "_blank"
  },
  {
    id: "linkedin",
    title: "LinkedIn",
    description: "Profil profesional dan pengalaman kerja saya.",
    image: "/images/linkedin.png",
    imageAlt: "LinkedIn Profile",
    action: "Mari Terhubung",
    href: "https://linkedin.com/in/jardel-poliviera-51288a320/",
    target: "_blank"
  },
  {
    id: "after-effects",
    title: "After Effects",
    description: "My video editing and motion graphics projects.",
    image: "/images/after.png",
    imageAlt: "After Effects Project",
    action: "Lihat Karya",
    href: "/portofolio",
    target: "_self"
  }
];

// --- KONFIGURASI ANIMASI FRAMER MOTION ---
const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: "easeOut" as const } 
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

export default function Home() {
  const [isSkillsOpen, setIsSkillsOpen] = useState(false);

  return (
    <>
      {/* --- NAVBAR MOBILE --- */}
      <TubelightNavbar />

      {/* --- SIDEBAR DESKTOP --- */}
      <nav className="sidebar d-none d-md-flex flex-column z-50">
        <div className="brand-section mb-4">
          <h4><i className="text-success"></i>Arel'S Portofolio</h4>
        </div>
        <ul className="nav flex-column">
          <li className="nav-item"><Link href="/" className="nav-link active"><i className="fas fa-home"></i> Home</Link></li>
          <li className="nav-item"><Link href="/about" className="nav-link"><i className="fas fa-user"></i> About Me</Link></li>
          <li className="nav-item"><Link href="/portofolio" className="nav-link"><i className="fas fa-book-open"></i> Portfolio</Link></li>
          <li className="nav-item"><Link href="/kontak" className="nav-link"><i className="fas fa-envelope"></i> Contact</Link></li>
          <li className="nav-item mt-4"><ThemeToggle /></li>
          <div className="mt-auto p-3">
           <Link href="/arel-secret-creator" className="text-[var(--text-secondary)] opacity-50 hover:opacity-100 transition" title="Creator Access">
             <i className="fas fa-lock fa-sm"></i>
           </Link>
          </div>
        </ul>
      </nav>

      <main className="main-content">
        
        {/* ========================================= */}
        {/* BANNER UTAMA */}
        {/* ========================================= */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="p-5 mb-4 rounded-3 text-[var(--text-primary)] border border-[var(--border-glass)] backdrop-blur-md" 
          style={{ background: "var(--bg-glass)" }}
        >
          <div className="container-fluid py-5">
            <div className="row align-items-center g-4">
              
              {/* Animasi teks meluncur dari kiri */}
              <motion.div 
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="col-lg-8 col-md-7"
              >
                <h1 className="display-5 fw-bold text-[var(--text-primary)]">Jardel Poliviera Portofolio</h1>
                <p className="fs-4 text-[var(--text-secondary)]">Mahasiswa Informatika yang memiliki ketertarikan pada Video Editing.</p>
                <Link href="/portofolio" className="btn btn-success btn-lg rounded-pill px-4 mt-3 bg-[#1ED760] text-black border-0 hover:bg-[#1db954]">Lihat Portfolio</Link>
                <Link href="/kontak" className="btn btn-outline-light btn-lg rounded-pill px-4 mt-3 ms-2 text-[var(--text-primary)] border-[var(--text-primary)] hover:bg-[var(--text-primary)] hover:text-[var(--grad-bg)]">Hubungi Saya</Link>
              </motion.div>

              {/* Animasi Instagram Card meluncur dari kanan */}
              <motion.div 
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                className="col-lg-4 col-md-5 d-flex justify-content-md-end justify-content-center"
              >
                <a href="https://www.instagram.com/areljrdl/" target="_blank" rel="noopener noreferrer" className="instagram-glass-card">
                  <div className="glass-glow"></div>
                  <div className="instagram-header">
                    <div className="avatar-container">
                      <div className="avatar-gradient-border">
                        <img src="/images/arel.jpg" alt="Jardel Poliviera" className="instagram-avatar-img" />
                      </div>
                      <div className="instagram-badge">
                        <i className="fa-brands fa-instagram"></i>
                      </div>
                    </div>
                    <div className="instagram-user-info">
                      <span className="ig-display-name text-[var(--text-primary)]">Jardel Poliviera</span>
                      <span className="ig-username text-[var(--text-secondary)]">@areljrdl</span>
                    </div>
                  </div>
                  <div className="instagram-body">
                    <p className="ig-bio text-[var(--text-secondary)]">Informatics Engineering Student<br />Video Editor & Designer</p>
                    <div className="tool-deck-container mt-4">
                      <div className="tool-deck-row">
                        <div className="tool-item">
                          <div className="tool-badge" title="CapCut"><svg viewBox="0 0 24 24" className="icon-capcut"><rect x="1.5" y="1.5" width="21" height="21" rx="5" fill="none" stroke="currentColor" strokeWidth="2" /><text x="12" y="15.5" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="10" textAnchor="middle">Cc</text></svg></div>
                          <span className="tool-label">CapCut</span>
                        </div>
                        <div className="tool-item">
                          <div className="tool-badge" title="Figma"><svg viewBox="0 0 24 24" className="icon-figma"><path d="M8 24c2.21 0 4-1.79 4-4v-4H8c-2.21 0-4 1.79-4 4s1.79 4 4 4zM4 12c0 2.21 1.79 4 4 4h4v-8H8c-2.21 0-4 1.79-4 4zm0-8c0 2.21 1.79 4 4 4h4V0H8c-2.21 0-4 1.79-4 4zm12 4c0-2.21-1.79-4-4-4h-4v8h4c2.21 0 4-1.79 4-4zm-4 8c2.21 0 4-1.79 4-4s-1.79-4-4-4v8z" /></svg></div>
                          <span className="tool-label">Figma</span>
                        </div>
                        <div className="tool-item">
                          <div className="tool-badge" title="After Effects"><svg viewBox="0 0 24 24" className="icon-ae"><rect x="1.5" y="1.5" width="21" height="21" rx="5" fill="none" stroke="currentColor" strokeWidth="2" /><text x="12" y="15.5" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="10" textAnchor="middle">Ae</text></svg></div>
                          <span className="tool-label">After Effects</span>
                        </div>
                        <div className="tool-item">
                          <div className="tool-badge" title="Alight Motion"><svg viewBox="0 0 24 24" className="icon-am"><rect x="1.5" y="1.5" width="21" height="21" rx="5" fill="none" stroke="currentColor" strokeWidth="2" /><text x="12" y="15.5" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="10" textAnchor="middle">Am</text></svg></div>
                          <span className="tool-label">Alight Motion</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="instagram-footer">
                    <div className="mock-follow-btn bg-[#1ED760] text-black">Kunjungi Profil</div>
                  </div>
                </a>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* ========================================= */}
        {/* CAROUSEL HIGHLIGHTS */}
        {/* ========================================= */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeUpVariant}
        >
          <h4 className="fw-bold mb-3 mt-5 text-[var(--text-primary)]">Featured Highlights</h4>
          <div className="mb-5 w-full rounded-2xl overflow-hidden border border-[var(--border-glass)] bg-[var(--bg-glass)] shadow-xl p-2 pb-0">
            <SqueezeCarousel 
              slides={highlightSlides} 
              accent="#1ED760" 
              accentForeground="#000000"
              autoplay={true}
              interval={5000}
            />
          </div>
        </motion.div>

        {/* ========================================= */}
        {/* SKILLS SECTION */}
        {/* ========================================= */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
        >
          <motion.h4 variants={fadeUpVariant} className="fw-bold mb-3 mt-5 text-[var(--text-primary)]">Skill</motion.h4>
          <div className="row g-4 mb-5">
            {[
              { title: 'Web Design', icon: 'fa-paint-brush' },
              { title: 'Video Editing', icon: 'fa-photo-film' },
              { title: 'Fotografi', icon: 'fa-camera-alt' },
              { title: 'Post Design', icon: 'fa-clone' }
            ].map((skill, index) => (
              <motion.div variants={fadeUpVariant} className="col-6 col-md-3" key={index}>
                <div className="spotify-card text-center p-4">
                  <i className={`fas ${skill.icon} fa-3x mb-3 text-[#1ED760]`}></i>
                  <h5 className="text-[var(--text-primary)]">{skill.title}</h5>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bagian Keahlian (Accordion Interaktif) */}
        <motion.div variants={fadeUpVariant} className="accordion-item mb-5 rounded-2xl overflow-hidden border border-[var(--border-glass)]" style={{ backgroundColor: "var(--bg-glass)" }}>
          <h2 className="accordion-header m-0">
            <button 
              className={`w-full flex items-center justify-between p-4 text-start font-semibold transition-colors duration-200 ${
                isSkillsOpen ? 'bg-[var(--bg-glass-hover)] text-[#1ED760]' : 'text-[var(--text-primary)] hover:bg-[var(--bg-glass-hover)]'
              }`}
              type="button" 
              onClick={() => setIsSkillsOpen(!isSkillsOpen)}
            >
              <span className="flex items-center gap-3">
                <i className="fas fa-code text-[#1ED760] text-lg"></i>
                <span className="text-base font-semibold">Keahlian Tambahan (Skills Detail)</span>
              </span>
              <i className={`fas fa-chevron-down text-sm transition-transform duration-300 ${isSkillsOpen ? 'rotate-180 text-[#1ED760]' : 'opacity-60'}`}></i>
            </button>
          </h2>
          <AnimatePresence initial={false}>
            {isSkillsOpen && (
              <motion.div
                key="home-skills-detail"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="p-5 border-t border-[var(--border-glass)] flex flex-col gap-3" style={{ color: "var(--text-secondary)" }}>
                  <div>
                    <p className="mb-1 text-[var(--text-primary)] font-semibold">Fotografi & Design</p>
                    <small className="opacity-80">Lightroom & Figma</small>
                  </div>
                  <hr className="m-0 border-[var(--border-glass)]" />
                  <div>
                    <p className="mb-1 text-[var(--text-primary)] font-semibold">Videografi</p>
                    <small className="opacity-80">After Effects & Alight Motion</small>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="pb-28"></div>
        
      </main>
    </>
  );
}
