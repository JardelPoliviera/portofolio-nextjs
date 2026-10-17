"use client";

import GlassFolder from '@/components/ui/glass-folder-cards';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { useState } from 'react';
import Link from 'next/link';

export default function Portfolio() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <>
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
          <li className="nav-item"><Link href="/about" className="nav-link"><i className="fas fa-user"></i> About Me</Link></li>
          <li className="nav-item"><Link href="/portofolio" className="nav-link active"><i className="fas fa-book-open"></i> Portfolio</Link></li>
          <li className="nav-item"><Link href="/kontak" className="nav-link"><i className="fas fa-envelope"></i> Contact</Link></li>
          {/* 3. Pasang tombol di Sidebar Desktop */}
          <li className="nav-item mt-4"><ThemeToggle /></li>
        </ul>
      </nav>

     <main className="main-content d-flex flex-column min-vh-100 p-0">
        
        <div className="flex-grow-1 p-4 p-md-5 z-10 pt-5 mt-5">
          
          {/* ========================================= */}
          {/* BAGIAN JUDUL BESAR YANG SUDAH DIPERBARUI */}
          {/* ========================================= */}
          <div className="text-center mb-0 mt-4 mt-md-0">
            <h1 className="display-4 fw-bold drop-shadow-md" style={{ color: "#1ED760" }}>
              My Projects
            </h1>
          </div>

          <div className="relative grid grid-cols-1 items-end justify-items-center gap-x-14 gap-y-12 md:grid-cols-2 lg:grid-cols-3 mt-5">
            
            {/* Folder 1: UI/UX & Design */}
            <GlassFolder 
              label="UI/UX Design" 
              meta="4 Proyek Figma"
              appearDelay={0}
              files={[
                { name: "Chroma", meta: "Web App UI", link: "https://steel-thank-36339945.figma.site" },
                { name: "Kasir", meta: "Point of Sales", link: "https://chief-pulp-90892905.figma.site" },
                { name: "RangerPRINT", meta: "Platform Bisnis", link: "https://barn-kneel-77891323.figma.site" },
                { name: "Create Pixel Art", meta: "Design Web", link: "https://eject-blend-03291930.figma.site/" }
              ]}
            />

            {/* Folder 2: Web Development */}
            <GlassFolder 
              label="Web Dev" 
              meta="Proyek Koding"
              appearDelay={150}
              files={[
                { name: "Progressive Web", meta: "HTML/CSS App", link: "https://jardelpoliviera.github.io/Project-DesainWeb-Jardel/about.html" },
                { name: "Portofolio", meta: "Source Code", link: "/" }
              ]}
            />

            {/* Folder 3: Arsip Praktikum (Pintu menuju halaman 2 folder laprak) */}
            <GlassFolder 
              label="Arsip Praktikum" 
              meta="Tugas Kuliah"
              appearDelay={300}
              files={[
                { name: "Pemrograman Web", meta: "Buka Halaman", link: "/laprak" },
                { name: "Aplikasi Mobile", meta: "Buka Halaman", link: "/laprak" }
              ]}
            />

          </div>
        </div>

        <div className="pb-28"></div>
        
      </main>

      {/* Panggil komponen SpotifyFooter di sini */}

    </>
  );
}