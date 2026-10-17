import Link from 'next/link';
import Script from 'next/script';
import GlassFolder from '@/components/ui/glass-folder-cards';
import ThemeToggle from '@/components/ui/ThemeToggle'; 

export default function LaprakPage() {
  return (
    <>
      <nav className="navbar navbar-dark bg-black fixed-top d-md-none z-50">
        <div className="container-fluid">
          <Link className="navbar-brand fw-bold" href="/">
            <i className="text-success"></i> My Portfolio
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mobileMenu">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="mobileMenu">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item"><Link className="nav-link" href="/">Home</Link></li>
              <li className="nav-item"><Link className="nav-link" href="/about">About</Link></li>
              <li className="nav-item"><Link className="nav-link active" href="/portofolio">Portfolio</Link></li>
              <li className="nav-item"><Link className="nav-link" href="/kontak">Contact</Link></li>
              <li className="nav-item"><ThemeToggle /></li>
            </ul>
          </div>
        </div>
      </nav>

      <nav className="sidebar d-none d-md-flex flex-column z-50">
        <div className="brand-section mb-4">
          <h4><i className="text-success"></i>Arel'S Portofolio</h4>
        </div>
        <ul className="nav flex-column">
          <li className="nav-item"><Link href="/" className="nav-link"><i className="fas fa-home"></i> Home</Link></li>
          <li className="nav-item"><Link href="/about" className="nav-link"><i className="fas fa-user"></i> About Me</Link></li>
          <li className="nav-item"><Link href="/portofolio" className="nav-link active"><i className="fas fa-book-open"></i> Portfolio</Link></li>
          <li className="nav-item"><Link href="/kontak" className="nav-link"><i className="fas fa-envelope"></i> Contact</Link></li>
          <li className="nav-item mt-4"><ThemeToggle /></li>
        </ul>
      </nav>

      <main className="main-content d-flex flex-column min-vh-100 p-0" style={{ background: "var(--gradient-start)" }}>
        
        <div className="flex-grow-1 d-flex flex-column align-items-center p-4 z-10 pt-5 mt-5">
          <div className="text-center mb-0 mt-4 mt-md-0 relative w-full">
            
            {/* TOMBOL KEMBALI DITAMBAHKAN DI SINI */}
            <div className="w-full max-w-5xl flex justify-start mb-2">
            <Link 
              href="/portofolio" 
              className="text-secondary text-decoration-none hover:text-white transition-colors flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10"
            >
              <i className="fas fa-arrow-left"></i> Kembali ke Portfolio
            </Link>
          </div>
            <h1 className="display-4 fw-bold drop-shadow-md" style={{ color: "#1ED760" }}>
              Arsip Praktikum
            </h1>
          </div>

          {/* Grid 3 Folder */}
          <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-end justify-items-center gap-x-14 gap-y-12 mt-4">
            
            {/* Folder 1: Pemrograman Web (HTML Lama) */}
            <GlassFolder 
              label="Web (Statis)" 
              meta="HTML Lama"
              appearDelay={0}
              files={[
                { name: "Laprak 9", meta: "Pemrograman Web", link: "/laprak9.html" },
                { name: "Laprak 8", meta: "Pemrograman Web", link: "/laprak8.html" },
                { name: "Laprak 7", meta: "Pemrograman Web", link: "/laprak7.html" },
                { name: "Laprak 6", meta: "Pemrograman Web", link: "/laprak6.html" }
              ]}
            />

            {/* Folder 2: Aplikasi Mobile (HTML Lama) */}
            <GlassFolder 
              label="Aplikasi Mobile" 
              meta="HTML Lama"
              appearDelay={200}
              files={[
                { name: "Modul 4", meta: "Aplikasi Mobile", link: "/LaprakAplikasiMobile-4.html" },
                { name: "Modul 3", meta: "Aplikasi Mobile", link: "/LaprakAplikasiMobile-3.html" },
                { name: "Modul 2", meta: "Aplikasi Mobile", link: "/LaprakAplikasiMobile-2.html" },
                { name: "Modul 1", meta: "Aplikasi Mobile", link: "/LaprakAplikasiMobile-1.html" }
              ]}
            />

            {/* Folder 3: Laprak Berbasis Web Baru */}
            <GlassFolder 
              label="Web Baru" 
              meta="Proyek Dinamis"
              appearDelay={400}
              files={[
                { name: "Buka Arsip Dinamis", meta: "Data Supabase", link: "/laprak-dinamis" }
              ]}
            />

          </div>
        </div>

      </main>
      <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" strategy="lazyOnload" />
    </>
  );
}