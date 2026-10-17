import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Suspense } from 'react';

// Komponen untuk mengambil data dari Supabase
async function LaprakData() {
  const { data: lapraks } = await supabase
    .from('laprak')
    .select('title, course, slug, created_at')
    .order('created_at', { ascending: false });

  return (
    <div className="grid gap-4">
      {lapraks && lapraks.map((item: any, idx: number) => (
        // Link ini tetap mengarah ke /laprak/[slug] tempat detail laprakmu berada
        <Link key={idx} href={`/laprak/${item.slug}`} className="block p-6 rounded-2xl border backdrop-blur-md shadow-sm hover:scale-[1.02] transition-all"
              style={{ backgroundColor: 'color-mix(in srgb, var(--text-primary) 5%, transparent)', borderColor: 'color-mix(in srgb, var(--text-primary) 10%, transparent)' }}>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
            <div>
              <h2 className="text-xl font-bold mb-1">{item.title}</h2>
              <span className="text-xs font-mono px-2 py-1 rounded bg-[#1ED760]/20 text-[#1ED760]">{item.course}</span>
            </div>
            <span className="text-sm opacity-50">
              {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
        </Link>
      ))}
      
      {(!lapraks || lapraks.length === 0) && (
        <p className="text-center opacity-50 py-10">Belum ada laprak yang dipublikasikan.</p>
      )}
    </div>
  );
}

// Komponen Halaman Utama
export default function DaftarLaprakDinamis() {
  return (
    <div className="min-h-screen p-8 md:p-20 transition-colors duration-500 pb-32" style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }}>
      <div className="max-w-4xl mx-auto mt-5">
        
        {/* Tombol kembali ke ruang folder */}
        <Link href="/laprak" className="text-secondary text-decoration-none mb-4 inline-block hover:text-white transition-colors">
          <i className="fas fa-arrow-left me-2"></i> Kembali ke Folder
        </Link>

        <div className="mb-12 border-b border-gray-300 dark:border-zinc-800 pb-4">
          <h1 className="text-4xl font-bold mb-2">Arsip Web Dinamis</h1>
          <p className="text-zinc-500">Kumpulan laporan praktikum berbasis sistem Supabase.</p>
        </div>

        {/* Suspense akan menampilkan teks memuat sampai Supabase selesai mengirim data */}
        <Suspense fallback={<div className="text-center py-10 text-zinc-500">Memuat data dari database...</div>}>
          <LaprakData />
        </Suspense>

      </div>
    </div>
  );
}