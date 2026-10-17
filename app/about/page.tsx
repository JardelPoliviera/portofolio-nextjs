"use client";

import ThemeToggle from '@/components/ui/ThemeToggle';
import Link from 'next/link';
import Script from 'next/script';
import { motion, type Variants } from 'framer-motion';
import { VerticalMarquee } from '@/components/ui/vertical-marquee'; 
import { useState } from 'react';

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <>
      {/* --- CSS KHUSUS UNTUK MEMAKSA BOOTSTRAP MENGIKUTI TEMA --- */}
      <style>{`
        .custom-accordion .accordion-item {
          background-color: var(--bg-glass) !important;
          border-color: var(--border-glass) !important;
        }
        .custom-accordion .accordion-button {
          color: var(--text-primary) !important;
          background-color: transparent !important;
          box-shadow: none !important;
        }
        .custom-accordion .accordion-button:not(.collapsed) {
          color: var(--text-primary) !important;
          background-color: var(--bg-glass-hover) !important;
          box-shadow: none !important;
        }
        .custom-accordion .accordion-body {
          background-color: transparent !important;
        }
        
        /* PAKSA WARNA TEKS ISI ACCORDION */
        .custom-accordion .accordion-body strong {
          color: var(--text-primary) !important;
        }
        .custom-accordion .accordion-body small,
        .custom-accordion .accordion-body p,
        .custom-accordion .accordion-body li {
          color: var(--text-secondary) !important;
        }
        
        /* PAKSA WARNA TAHUN (BADGE) AGAR TERLIHAT JELAS DI MODE TERANG/GELAP */
        .badge-outline {
          background-color: transparent !important;
          border: 1px solid var(--text-primary) !important;
          color: var(--text-primary) !important;
          opacity: 0.8;
        }
        
        /* WARNA PANAH ACCORDION */
        .custom-accordion .accordion-button::after {
          filter: grayscale(1) contrast(0.5);
        }
      `}</style>

      {/* --- NAVBAR MOBILE --- */}
      <nav className="navbar navbar-dark bg-black fixed-top d-md-none" style={{ zIndex: 1050 }}>
        <div className="container-fluid">
          <Link className="navbar-brand fw-bold" href="/">
            <span className="text-success">My</span> Portfolio
          </Link>
          
          <button 
            className="navbar-toggler" 
            type="button" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          
          {/* PERUBAHAN KUNCI: Buang 'collapse' dan 'show', ganti dengan 'd-block' (tampil) atau 'd-none' (hilang) */}
          <div className={`w-100 mt-3 bg-black ${isMobileMenuOpen ? 'd-block' : 'd-none'}`}>
            <ul className="navbar-nav text-center pb-4 w-100 d-flex flex-column gap-3">
              <li className="nav-item">
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)} style={{ color: 'white', textDecoration: 'none', fontSize: '1.2rem' }}>Home</Link>
              </li>
              <li className="nav-item">
                <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} style={{ color: 'white', textDecoration: 'none', fontSize: '1.2rem' }}>About</Link>
              </li>
              <li className="nav-item">
                <Link href="/portofolio" onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#198754', textDecoration: 'none', fontSize: '1.2rem', fontWeight: 'bold' }}>Portfolio</Link>
              </li>
              <li className="nav-item">
                <Link href="/kontak" onClick={() => setIsMobileMenuOpen(false)} style={{ color: 'white', textDecoration: 'none', fontSize: '1.2rem' }}>Contact</Link>
              </li>
              <li className="nav-item mt-3 d-flex justify-content-center">
                <ThemeToggle />
              </li>
            </ul>
          </div>
        </div>
      </nav>

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
            <motion.div variants={fadeUpVariant} className="accordion-item mb-3 rounded-xl overflow-hidden">
              <h2 className="accordion-header">
                <button className="accordion-button border-0" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne">
                  <i className="fas fa-graduation-cap me-3 text-[#1ED760]"></i> Pendidikan (Education)
                </button>
              </h2>
              <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#accordionAbout">
                <div className="accordion-body">
                  <ul className="list-unstyled mb-0">
                    <li className="mb-3">
                      <strong>Universitas Andalas</strong> 
                      <span className="badge bg-[#1ED760] text-black float-end">2024 - Sekarang</span><br />
                      <small>S1 Informatika</small>
                    </li>
                    <li className="mb-3">
                      <strong>SMA Uswatun Hasanah</strong> 
                      <span className="badge badge-outline float-end">2021 - 2024</span><br />
                      <small>Pesantren Terpadu Serambi Mekkah</small>
                    </li>
                    <li className="mb-3">
                      <strong>SMP Uswatun Hasanah</strong> 
                      <span className="badge badge-outline float-end">2018 - 2021</span><br />
                      <small>Pesantren Terpadu Serambi Mekkah</small>
                    </li>
                    <li>
                      <strong>SDN 078 Bengkulu Utara</strong> 
                      <span className="badge badge-outline float-end">2012 - 2018</span><br />
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Bagian Pengalaman */}
            <motion.div variants={fadeUpVariant} className="accordion-item mb-3 rounded-xl overflow-hidden">
              <h2 className="accordion-header">
                <button className="accordion-button collapsed border-0" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo">
                  <i className="fas fa-briefcase me-3 text-[#1ED760]"></i> Pengalaman (Experience)
                </button>
              </h2>
              <div id="collapseTwo" className="accordion-collapse collapse" data-bs-parent="#accordionAbout">
                <div className="accordion-body d-flex flex-column gap-3">
                  <div>
                    <p className="mb-1"><strong>Create Pixel Art</strong> (2025)</p>
                    <p className="small mb-0">Membuat web yang mengubah gambar menjadi pixel art.</p>
                  </div>
                  <hr className="m-0 border-[var(--border-glass)]" />
                  <div>
                    <p className="mb-1"><strong>Progressive web</strong> (2025)</p>
                    <p className="small mb-0">Membuat web app yang responsif.</p>
                  </div>
                  <hr className="m-0 border-[var(--border-glass)]" />
                  <div>
                    <p className="mb-1"><strong>RangersPRINT</strong> (2025)</p>
                    <p className="small mb-0">Project Kewirausahaan.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Bagian Keahlian */}
            <motion.div variants={fadeUpVariant} className="accordion-item mb-3 rounded-xl overflow-hidden">
              <h2 className="accordion-header">
                <button className="accordion-button collapsed border-0" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree">
                  <i className="fas fa-code me-3 text-[#1ED760]"></i> Keahlian (Skills)
                </button>
              </h2>
              <div id="collapseThree" className="accordion-collapse collapse" data-bs-parent="#accordionAbout">
                <div className="accordion-body d-flex flex-column gap-3">
                  <div>
                    <p className="mb-1"><strong>Fotografi & Design</strong></p>
                    <small>Lightroom & Figma</small>
                  </div>
                  <hr className="m-0 border-[var(--border-glass)]" />
                  <div>
                    <p className="mb-1"><strong>Videografi</strong></p>
                    <small>After Effects & Alight Motion</small>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </motion.div>

        <div className="pb-28"></div>
        
      </main>

      {/* Panggil komponen SpotifyFooter di sini */}
      

      <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" strategy="lazyOnload" />
    </>
  );
}