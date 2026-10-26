"use client";

import ThemeToggle from '@/components/ui/ThemeToggle';
import Link from 'next/link';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { VerticalMarquee } from '@/components/ui/vertical-marquee'; 
import { useState } from 'react';
import { TubelightNavbar } from '@/components/ui/tubelight-navbar';

// Konfigurasi animasi Framer Motion
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
    transition: { staggerChildren: 0.15 }
  }
};

export default function About() {
  const [openAccordion, setOpenAccordion] = useState<string | null>("collapseOne");

  const toggleAccordion = (id: string) => {
    setOpenAccordion(prev => (prev === id ? null : id));
  };

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
          <li className="nav-item"><Link href="/" className="nav-link"><i className="fas fa-home"></i> Home</Link></li>
          <li className="nav-item"><Link href="/about" className="nav-link active"><i className="fas fa-user"></i> About Me</Link></li>
          <li className="nav-item"><Link href="/portofolio" className="nav-link"><i className="fas fa-book-open"></i> Portfolio</Link></li>
          <li className="nav-item"><Link href="/kontak" className="nav-link"><i className="fas fa-envelope"></i> Contact</Link></li>
          <li className="nav-item mt-4"><ThemeToggle /></li>
        </ul>
      </nav>

      <main className="main-content">
        
        {/* ============================================== */}
        {/* HEADER DENGAN 2 KOLOM (PROFIL KIRI, MARQUEE KANAN) */}
        {/* ============================================== */}
        <div className="container-fluid mt-5 pt-5 px-3 md:px-5">
          <div className="row align-items-center g-5 min-vh-50 pb-5">
            
            {/* Kolom Kiri: Profil Anda */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="col-lg-6"
            >
              <div className="d-flex flex-column flex-md-row align-items-center align-items-md-start gap-4 text-center text-md-start">
                <motion.img 
                  variants={fadeUpVariant}
                  src="/images/profile.jpg" 
                  alt="Profile" 
                  className="rounded-circle shadow-lg flex-shrink-0 border-4 border-[var(--border-glass)]" 
                  style={{ width: "200px", height: "200px", objectFit: "cover" }} 
                />
                
                <motion.div variants={fadeUpVariant} className="w-100">
                  <small className="text-[#1ED760] text-uppercase fw-bold d-block mb-2">Desain Web & Video Editing</small>
                  <h1 className="fw-bold display-4 text-[var(--text-primary)]">Jardel Poliviera</h1>
                  <p className="text-[var(--text-secondary)] mb-4">Mahasiswa Informatika • Universitas Andalas</p>
                  
                  {/* Email & Telepon disusun ke bawah */}
                  <div className="d-flex flex-column gap-2 justify-content-center justify-content-md-start text-sm mb-4">
                    <span className="text-[var(--text-secondary)]">
                      <i className="fas fa-envelope text-[#1ED760] me-3 w-4 text-center"></i>
                      jardelpoliviera@gmail.com
                    </span>
                    <span className="text-[var(--text-secondary)]">
                      <i className="fas fa-phone text-[#1ED760] me-3 w-4 text-center"></i>
                      +62 822 6972 7118
                    </span>
                  </div>

                  <div className="d-flex gap-3 justify-content-center justify-content-md-start">
                    <a href="https://www.instagram.com/areljrdl/" target="_blank" rel="noopener noreferrer" className="btn text-[var(--text-primary)] rounded-pill px-4 hover:bg-[var(--bg-glass-hover)]" style={{ backgroundColor: "var(--bg-glass)", border: "1px solid var(--border-glass)" }}>
                      <i className="fab fa-instagram me-2 text-[#1ED760]"></i> Instagram
                    </a>
                    <a href="https://www.linkedin.com/in/jardel-poliviera-51288a320/" target="_blank" rel="noopener noreferrer" className="btn text-[var(--text-primary)] rounded-pill px-4 hover:bg-[var(--bg-glass-hover)]" style={{ backgroundColor: "var(--bg-glass)", border: "1px solid var(--border-glass)" }}>
                      <i className="fab fa-linkedin me-2 text-[#1ED760]"></i> LinkedIn
                    </a>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Kolom Kanan: Vertical Marquee Tools */}
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="col-lg-6"
            >
              <VerticalMarquee />
            </motion.div>

          </div>
        </div>

        {/* ============================================== */}
        {/* PERJALANAN SAYA (ACCORDION BERANIMASI) */}
        {/* ============================================== */}
        <motion.div 
          className="container-fluid mt-5 pt-3 px-3 md:px-5"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
        >
          <motion.h3 variants={fadeUpVariant} className="fw-bold mb-4 text-[var(--text-primary)]">Perjalanan Saya</motion.h3>
          
          <div className="accordion custom-accordion" id="accordionAbout">
              
            {/* Bagian Pendidikan */}
            <motion.div variants={fadeUpVariant} className="accordion-item mb-3 rounded-2xl overflow-hidden border border-[var(--border-glass)]" style={{ backgroundColor: "var(--bg-glass)" }}>
              <h2 className="accordion-header m-0">
                <button 
                  className={`w-full flex items-center justify-between p-4 text-start font-semibold transition-colors duration-200 ${
                    openAccordion === 'collapseOne' ? 'bg-[var(--bg-glass-hover)] text-[#1ED760]' : 'text-[var(--text-primary)] hover:bg-[var(--bg-glass-hover)]'
                  }`}
                  type="button" 
                  onClick={() => toggleAccordion('collapseOne')}
                >
                  <span className="flex items-center gap-3">
                    <i className="fas fa-graduation-cap text-[#1ED760] text-lg"></i>
                    <span className="text-base font-semibold">Pendidikan (Education)</span>
                  </span>
                  <i className={`fas fa-chevron-down text-sm transition-transform duration-300 ${openAccordion === 'collapseOne' ? 'rotate-180 text-[#1ED760]' : 'opacity-60'}`}></i>
                </button>
              </h2>
              <AnimatePresence initial={false}>
                {openAccordion === 'collapseOne' && (
                  <motion.div
                    key="content-edu"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="p-5 border-t border-[var(--border-glass)]" style={{ color: "var(--text-secondary)" }}>
                      <ul className="list-unstyled mb-0">
                        <li className="mb-3">
                          <strong className="text-[var(--text-primary)]">Universitas Andalas</strong> 
                          <span className="badge bg-[#1ED760] text-black float-end font-bold px-2.5 py-1 rounded-full text-xs">2024 - Sekarang</span><br />
                          <small className="opacity-80">S1 Informatika</small>
                        </li>
                        <li className="mb-3">
                          <strong className="text-[var(--text-primary)]">SMA Uswatun Hasanah</strong> 
                          <span className="badge border border-[var(--text-primary)]/40 text-[var(--text-primary)] float-end px-2.5 py-1 rounded-full text-xs">2021 - 2024</span><br />
                          <small className="opacity-80">Pesantren Terpadu Serambi Mekkah</small>
                        </li>
                        <li className="mb-3">
                          <strong className="text-[var(--text-primary)]">SMP Uswatun Hasanah</strong> 
                          <span className="badge border border-[var(--text-primary)]/40 text-[var(--text-primary)] float-end px-2.5 py-1 rounded-full text-xs">2018 - 2021</span><br />
                          <small className="opacity-80">Pesantren Terpadu Serambi Mekkah</small>
                        </li>
                        <li>
                          <strong className="text-[var(--text-primary)]">SDN 078 Bengkulu Utara</strong> 
                          <span className="badge border border-[var(--text-primary)]/40 text-[var(--text-primary)] float-end px-2.5 py-1 rounded-full text-xs">2012 - 2018</span><br />
                        </li>
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Bagian Pengalaman */}
            <motion.div variants={fadeUpVariant} className="accordion-item mb-3 rounded-2xl overflow-hidden border border-[var(--border-glass)]" style={{ backgroundColor: "var(--bg-glass)" }}>
              <h2 className="accordion-header m-0">
                <button 
                  className={`w-full flex items-center justify-between p-4 text-start font-semibold transition-colors duration-200 ${
                    openAccordion === 'collapseTwo' ? 'bg-[var(--bg-glass-hover)] text-[#1ED760]' : 'text-[var(--text-primary)] hover:bg-[var(--bg-glass-hover)]'
                  }`}
                  type="button" 
                  onClick={() => toggleAccordion('collapseTwo')}
                >
                  <span className="flex items-center gap-3">
                    <i className="fas fa-briefcase text-[#1ED760] text-lg"></i>
                    <span className="text-base font-semibold">Pengalaman (Experience)</span>
                  </span>
                  <i className={`fas fa-chevron-down text-sm transition-transform duration-300 ${openAccordion === 'collapseTwo' ? 'rotate-180 text-[#1ED760]' : 'opacity-60'}`}></i>
                </button>
              </h2>
              <AnimatePresence initial={false}>
                {openAccordion === 'collapseTwo' && (
                  <motion.div
                    key="content-exp"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="p-5 border-t border-[var(--border-glass)] flex flex-col gap-3" style={{ color: "var(--text-secondary)" }}>
                      <div>
                        <p className="mb-1 text-[var(--text-primary)] font-semibold">Create Pixel Art <span className="text-xs opacity-60 font-normal">(2025)</span></p>
                        <p className="text-sm opacity-80 mb-0">Membuat web yang mengubah gambar menjadi pixel art.</p>
                      </div>
                      <hr className="m-0 border-[var(--border-glass)]" />
                      <div>
                        <p className="mb-1 text-[var(--text-primary)] font-semibold">Progressive web <span className="text-xs opacity-60 font-normal">(2025)</span></p>
                        <p className="text-sm opacity-80 mb-0">Membuat web app yang responsif.</p>
                      </div>
                      <hr className="m-0 border-[var(--border-glass)]" />
                      <div>
                        <p className="mb-1 text-[var(--text-primary)] font-semibold">RangersPRINT <span className="text-xs opacity-60 font-normal">(2025)</span></p>
                        <p className="text-sm opacity-80 mb-0">Project Kewirausahaan.</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Bagian Keahlian */}
            <motion.div variants={fadeUpVariant} className="accordion-item mb-3 rounded-2xl overflow-hidden border border-[var(--border-glass)]" style={{ backgroundColor: "var(--bg-glass)" }}>
              <h2 className="accordion-header m-0">
                <button 
                  className={`w-full flex items-center justify-between p-4 text-start font-semibold transition-colors duration-200 ${
                    openAccordion === 'collapseThree' ? 'bg-[var(--bg-glass-hover)] text-[#1ED760]' : 'text-[var(--text-primary)] hover:bg-[var(--bg-glass-hover)]'
                  }`}
                  type="button" 
                  onClick={() => toggleAccordion('collapseThree')}
                >
                  <span className="flex items-center gap-3">
                    <i className="fas fa-code text-[#1ED760] text-lg"></i>
                    <span className="text-base font-semibold">Keahlian (Skills)</span>
                  </span>
                  <i className={`fas fa-chevron-down text-sm transition-transform duration-300 ${openAccordion === 'collapseThree' ? 'rotate-180 text-[#1ED760]' : 'opacity-60'}`}></i>
                </button>
              </h2>
              <AnimatePresence initial={false}>
                {openAccordion === 'collapseThree' && (
                  <motion.div
                    key="content-skills"
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

          </div>
        </motion.div>

        <div className="pb-28"></div>
        
      </main>
    </>
  );
}
