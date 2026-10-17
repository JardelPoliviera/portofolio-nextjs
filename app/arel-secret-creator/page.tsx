"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase'; // Sesuaikan path jika berbeda
import Link from 'next/link';

export default function SecretCellCreator() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  
  // Data Meta
  const [title, setTitle] = useState('');
  const [course, setCourse] = useState('');
  const [slug, setSlug] = useState('');
  
  // Data Cells (Array dari blok-blok konten)
  const [cells, setCells] = useState<{ id: number, type: string, content: string, language?: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "arel2026") setIsAuthenticated(true);
    else alert("Sandi salah!");
  };

  const addTextCell = () => setCells([...cells, { id: Date.now(), type: 'text', content: '' }]);
  const addCodeCell = () => setCells([...cells, { id: Date.now(), type: 'code', content: '', language: 'dart' }]);
  const addImageCell = () => setCells([...cells, { id: Date.now(), type: 'image', content: '' }]);

  const updateCellContent = (id: number, content: string) => {
    setCells(cells.map(c => c.id === id ? { ...c, content } : c));
  };

  const handlePublish = async () => {
    if (!slug || !title) return alert("Slug dan Judul wajib diisi!");
    setLoading(true);
    
    // Simpan ke Supabase
    const { error } = await supabase.from('laprak').insert([
      { slug, title, course, content: cells }
    ]);

    setLoading(false);
    if (error) {
      alert("Gagal menyimpan: " + error.message);
    } else {
      setPublishedUrl(`/laprak/${slug}`);
      alert("Berhasil! Laprak sudah online.");
    }
  };

  if (!isAuthenticated) {
    return (
       /* BAGIAN LOGIN: Sama seperti kode sebelumnya... */
       <div className="flex h-screen items-center justify-center bg-black"><form onSubmit={handleLogin}><input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} className="p-2 bg-zinc-900 text-white rounded mr-2" /><button className="bg-[#1ED760] p-2 rounded font-bold text-black">Masuk</button></form></div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-10 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-[#1ED760] mb-6">Cell-Based Laprak Creator</h1>
      
      {/* Meta Input */}
      <div className="flex gap-4 mb-6">
        <input type="text" placeholder="Judul (ex: Modul 3)" className="p-3 w-1/3 bg-zinc-900 border border-zinc-700 rounded-lg text-white" onChange={(e) => setTitle(e.target.value)} />
        <input type="text" placeholder="Mata Kuliah" className="p-3 w-1/3 bg-zinc-900 border border-zinc-700 rounded-lg text-white" onChange={(e) => setCourse(e.target.value)} />
        <input type="text" placeholder="Link Akhiran/Slug (ex: modul-3-prak)" className="p-3 w-1/3 bg-zinc-900 border border-zinc-700 rounded-lg text-white" onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/ /g, '-'))} />
      </div>

      {/* Area Cells */}
      <div className="space-y-4 mb-8">
        {cells.map((cell, idx) => (
          <div key={cell.id} className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl relative">
            <span className="text-xs text-[#1ED760] uppercase font-bold absolute top-2 right-4">{cell.type} BLOCK</span>
            {cell.type === 'text' ? (
              <textarea placeholder="Ketik teori atau pembahasan di sini..." className="w-full bg-transparent outline-none mt-4 min-h-[100px]" value={cell.content} onChange={(e) => updateCellContent(cell.id, e.target.value)} />
            ) : (
              <textarea placeholder="Paste kode Anda di sini..." className="w-full bg-black border border-zinc-800 text-[#1ED760] font-mono p-4 rounded mt-4 min-h-[150px] outline-none" value={cell.content} onChange={(e) => updateCellContent(cell.id, e.target.value)} />
            )}
            {cell.type === 'image' && (
              <input type="text" placeholder="Paste URL Gambar di sini (contoh: https://i.imgur.com/gambar.png)" className="w-full bg-black border border-zinc-800 text-white p-3 rounded mt-4 outline-none focus:border-[#1ED760]" value={cell.content} onChange={(e) => updateCellContent(cell.id, e.target.value)} />
            )}
          </div>
        ))}
      </div>

      {/* Tombol Aksi */}
      <div className="flex gap-4">
        <button onClick={addTextCell} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm">+ Teks</button>
        <button onClick={addCodeCell} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm">+ Kode</button>
        <button onClick={addImageCell} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm">+ Gambar Output</button>
        
        <button onClick={handlePublish} disabled={loading} className="px-6 py-2 bg-[#1ED760] text-black font-bold rounded-lg ml-auto hover:scale-105 transition">
          {loading ? "Menyimpan..." : "Publish Laprak!"}
        </button>
      </div>

      {publishedUrl && (
        <div className="mt-8 p-4 bg-zinc-900 border border-[#1ED760] rounded-lg">
          <p className="text-sm">Laprak berhasil dibuat! Link untuk asisten lab:</p>
          <Link href={publishedUrl} target="_blank" className="text-[#1ED760] font-bold underline">
            www.domainanda.com{publishedUrl}
          </Link>
        </div>
      )}
    </div>
  );
}