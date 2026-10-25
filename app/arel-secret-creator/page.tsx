"use client";

import { useState, useEffect, useCallback, Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface Cell {
  id: number;
  type: 'text' | 'code' | 'image';
  content: string;
  language?: string;
}

interface ExistingLaprak {
  id?: number | string;
  title: string;
  course: string;
  slug: string;
  content: any;
  created_at?: string;
}

function SecretCreatorContent() {
  const searchParams = useSearchParams();
  const initialSlug = searchParams.get('slug');

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  // Mode: 'new' atau 'edit'
  const [mode, setMode] = useState<'new' | 'edit'>('new');
  const [existingLapraks, setExistingLapraks] = useState<ExistingLaprak[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string>('');

  // Form data
  const [title, setTitle] = useState('');
  const [course, setCourse] = useState('');
  const [slug, setSlug] = useState('');
  const [cells, setCells] = useState<Cell[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [fetchingExisting, setFetchingExisting] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Ambil daftar laprak yang sudah ada di Supabase
  const loadExistingLapraks = useCallback(async () => {
    setFetchingExisting(true);
    try {
      const { data, error } = await supabase
        .from('laprak')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setExistingLapraks(data);
      }
    } catch (err) {
      console.error('Error loading existing lapraks:', err);
    } finally {
      setFetchingExisting(false);
    }
  }, []);

  // Pilih laprak untuk diedit
  const handleSelectLaprakToEdit = useCallback((targetSlug: string, laprakList?: ExistingLaprak[]) => {
    const list = laprakList || existingLapraks;
    const target = list.find((item) => item.slug === targetSlug);
    if (!target) return;

    setMode('edit');
    setSelectedSlug(target.slug);
    setTitle(target.title || '');
    setCourse(target.course || '');
    setSlug(target.slug || '');

    // Format cells
    if (Array.isArray(target.content)) {
      const formattedCells: Cell[] = target.content.map((c: any, index: number) => ({
        id: c.id || Date.now() + index,
        type: c.type || 'text',
        content: c.content || '',
        language: c.language || 'dart',
      }));
      setCells(formattedCells);
    } else {
      setCells([]);
    }

    setPublishedUrl('');
    setStatusMessage(null);
  }, [existingLapraks]);

  // Load lapraks saat login sukses
  useEffect(() => {
    if (isAuthenticated) {
      loadExistingLapraks();
    }
  }, [isAuthenticated, loadExistingLapraks]);

  // Handle URL query parameter ?slug=...
  useEffect(() => {
    if (isAuthenticated && initialSlug && existingLapraks.length > 0) {
      handleSelectLaprakToEdit(initialSlug, existingLapraks);
    }
  }, [isAuthenticated, initialSlug, existingLapraks, handleSelectLaprakToEdit]);

  // Reset form ke mode baru
  const resetToNew = () => {
    setMode('new');
    setSelectedSlug('');
    setTitle('');
    setCourse('');
    setSlug('');
    setCells([]);
    setPublishedUrl('');
    setStatusMessage(null);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'arel2026') {
      setIsAuthenticated(true);
    } else {
      alert('Sandi salah!');
    }
  };

  // Tambah cell
  const addTextCell = () => setCells(prev => [...prev, { id: Date.now(), type: 'text', content: '' }]);
  const addCodeCell = () => setCells(prev => [...prev, { id: Date.now(), type: 'code', content: '', language: 'dart' }]);
  const addImageCell = () => setCells(prev => [...prev, { id: Date.now(), type: 'image', content: '' }]);

  // Update isi cell
  const updateCellContent = (id: number, content: string) => {
    setCells(prev => prev.map(c => (c.id === id ? { ...c, content } : c)));
  };

  const updateCellLanguage = (id: number, language: string) => {
    setCells(prev => prev.map(c => (c.id === id ? { ...c, language } : c)));
  };

  // Pindahkan cell ke atas
  const moveCellUp = (index: number) => {
    if (index === 0) return;
    setCells(prev => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  // Pindahkan cell ke bawah
  const moveCellDown = (index: number) => {
    if (index === cells.length - 1) return;
    setCells(prev => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  // Hapus cell
  const deleteCell = (id: number) => {
    setCells(prev => prev.filter(c => c.id !== id));
  };

  // Simpan / Update ke Supabase
  const handleSave = async () => {
    if (!slug.trim() || !title.trim()) {
      return alert('Slug dan Judul wajib diisi!');
    }
    setLoading(true);
    setStatusMessage(null);

    const payload = {
      slug: slug.trim(),
      title: title.trim(),
      course: course.trim(),
      content: cells,
    };

    try {
      if (mode === 'edit' && selectedSlug) {
        // Mode Edit: Update data yang sudah ada
        const { error } = await supabase
          .from('laprak')
          .update(payload)
          .eq('slug', selectedSlug);

        if (error) throw error;

        setSelectedSlug(slug.trim());
        setPublishedUrl(`/laprak/${slug.trim()}`);
        setStatusMessage({ type: 'success', text: 'Perubahan laprak berhasil diperbarui!' });
      } else {
        // Mode Baru: Insert
        const { error } = await supabase.from('laprak').insert([payload]);

        if (error) throw error;

        setPublishedUrl(`/laprak/${slug.trim()}`);
        setStatusMessage({ type: 'success', text: 'Laprak baru berhasil dipublikasikan!' });
      }

      await loadExistingLapraks();
    } catch (err: any) {
      console.error('Save error:', err);
      setStatusMessage({ type: 'error', text: 'Gagal menyimpan: ' + (err.message || 'Terjadi kesalahan') });
    } finally {
      setLoading(false);
    }
  };

  // Hapus laprak dari Supabase
  const handleDeleteLaprak = async () => {
    if (!selectedSlug) return;
    const confirmDelete = window.confirm(`Apakah kamu yakin ingin menghapus laprak "${title}" secara permanen?`);
    if (!confirmDelete) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('laprak')
        .delete()
        .eq('slug', selectedSlug);

      if (error) throw error;

      alert('Laprak berhasil dihapus dari Supabase!');
      resetToNew();
      await loadExistingLapraks();
    } catch (err: any) {
      alert('Gagal menghapus: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-black p-4">
        <form onSubmit={handleLogin} className="p-8 bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-sm">
          <div className="text-center mb-6">
            <i className="fas fa-lock text-3xl text-[#1ED760] mb-2"></i>
            <h2 className="text-xl font-bold text-white">Arel Secret Creator</h2>
            <p className="text-xs text-zinc-400">Masukkan sandi khusus untuk mengelola laprak</p>
          </div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-zinc-800 border border-zinc-700 text-white rounded-lg mb-4 outline-none focus:border-[#1ED760]"
          />
          <button className="w-full bg-[#1ED760] hover:bg-[#1db954] p-3 rounded-lg font-bold text-black transition-all">
            Masuk Editor
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 max-w-5xl mx-auto pb-32">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 pb-6 border-b border-zinc-800">
        <div>
          <h1 className="text-3xl font-bold text-[#1ED760] flex items-center gap-2">
            <i className="fas fa-edit"></i> Laprak Editor & Creator
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Buat laprak baru, edit ulang laprak dinamis, susun, pindahkan, dan hapus cell secara realtime.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/laprak-dinamis"
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-lg text-sm transition"
          >
            <i className="fas fa-eye me-2"></i> Lihat Halaman Dinamis
          </Link>
          <button
            onClick={resetToNew}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              mode === 'new'
                ? 'bg-[#1ED760] text-black'
                : 'bg-zinc-800 text-white hover:bg-zinc-700'
            }`}
          >
            <i className="fas fa-plus me-1"></i> Buat Baru
          </button>
        </div>
      </div>

      {/* Selector: Edit Laprak yang Sudah Ada */}
      <div className="p-4 mb-8 bg-zinc-900/90 border border-zinc-800 rounded-2xl flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-zinc-300 whitespace-nowrap">
          <i className="fas fa-folder-open text-[#1ED760]"></i>
          <span>Pilih Laprak Tersedia:</span>
        </div>
        <select
          value={mode === 'edit' ? selectedSlug : ''}
          onChange={(e) => {
            if (e.target.value === '') {
              resetToNew();
            } else {
              handleSelectLaprakToEdit(e.target.value);
            }
          }}
          className="flex-grow p-2.5 bg-zinc-800 border border-zinc-700 text-white rounded-lg outline-none focus:border-[#1ED760] text-sm"
        >
          <option value="">-- Pilih untuk mengedit ulang laprak yang sudah ada --</option>
          {existingLapraks.map((item) => (
            <option key={item.slug} value={item.slug}>
              {item.title} ({item.course}) — /laprak/{item.slug}
            </option>
          ))}
        </select>
        <button
          onClick={loadExistingLapraks}
          disabled={fetchingExisting}
          title="Segarkan daftar laprak dari Supabase"
          className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs transition"
        >
          <i className={`fas fa-sync-alt ${fetchingExisting ? 'fa-spin' : ''}`}></i>
        </button>
      </div>

      {/* Mode Badge & Tombol Hapus Laprak */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wider font-bold px-3 py-1 rounded-full bg-[#1ED760]/20 text-[#1ED760] border border-[#1ED760]/30">
            {mode === 'edit' ? `Mode Edit: "${selectedSlug}"` : 'Mode: Buat Baru'}
          </span>
          {mode === 'edit' && (
            <span className="text-xs text-zinc-500">
              Perubahan akan langsung memperbarui data di Supabase.
            </span>
          )}
        </div>

        {mode === 'edit' && (
          <button
            onClick={handleDeleteLaprak}
            disabled={loading}
            className="text-xs text-red-400 hover:text-red-300 hover:underline flex items-center gap-1.5"
          >
            <i className="fas fa-trash-alt"></i> Hapus Seluruh Laprak Ini
          </button>
        )}
      </div>

      {/* Meta Input */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div>
          <label className="text-xs text-zinc-400 mb-1 block">Judul Laprak</label>
          <input
            type="text"
            placeholder="Judul (ex: Modul 3 Praktikum)"
            className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white outline-none focus:border-[#1ED760]"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs text-zinc-400 mb-1 block">Mata Kuliah</label>
          <input
            type="text"
            placeholder="Mata Kuliah (ex: Pemrograman Web)"
            className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white outline-none focus:border-[#1ED760]"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs text-zinc-400 mb-1 block">Link Akhiran / Slug</label>
          <input
            type="text"
            placeholder="Link Akhiran / Slug (ex: modul-3-prak)"
            className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white outline-none focus:border-[#1ED760]"
            value={slug}
            onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
          />
        </div>
      </div>

      {/* Area Cells */}
      <div className="space-y-5 mb-8">
        {cells.map((cell, idx) => (
          <div
            key={cell.id}
            className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl relative shadow-md transition-all hover:border-zinc-700"
          >
            {/* Cell Toolbar Atas */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-white/10 text-zinc-300">
                  #{idx + 1}
                </span>
                <span className="text-xs text-[#1ED760] uppercase font-bold tracking-wider">
                  {cell.type} BLOCK
                </span>

                {/* Dropdown Bahasa jika tipe CODE */}
                {cell.type === 'code' && (
                  <select
                    value={cell.language || 'dart'}
                    onChange={(e) => updateCellLanguage(cell.id, e.target.value)}
                    className="text-xs bg-black border border-zinc-700 text-zinc-300 rounded px-2 py-1 outline-none"
                  >
                    <option value="dart">Dart</option>
                    <option value="javascript">JavaScript</option>
                    <option value="typescript">TypeScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="html">HTML</option>
                    <option value="css">CSS</option>
                    <option value="cpp">C++</option>
                    <option value="sql">SQL</option>
                    <option value="php">PHP</option>
                  </select>
                )}
              </div>

              {/* Tombol Aksi: Pindah Atas, Pindah Bawah, Hapus Cell */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => moveCellUp(idx)}
                  disabled={idx === 0}
                  title="Pindahkan cell ke atas"
                  className={`px-2.5 py-1 text-xs rounded border transition ${
                    idx === 0
                      ? 'border-zinc-800 text-zinc-600 cursor-not-allowed'
                      : 'border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-white'
                  }`}
                >
                  <i className="fas fa-arrow-up"></i> Naik
                </button>

                <button
                  type="button"
                  onClick={() => moveCellDown(idx)}
                  disabled={idx === cells.length - 1}
                  title="Pindahkan cell ke bawah"
                  className={`px-2.5 py-1 text-xs rounded border transition ${
                    idx === cells.length - 1
                      ? 'border-zinc-800 text-zinc-600 cursor-not-allowed'
                      : 'border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-white'
                  }`}
                >
                  <i className="fas fa-arrow-down"></i> Turun
                </button>

                <button
                  type="button"
                  onClick={() => deleteCell(cell.id)}
                  title="Hapus cell ini"
                  className="px-2.5 py-1 text-xs rounded border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition"
                >
                  <i className="fas fa-trash-alt me-1"></i> Hapus
                </button>
              </div>
            </div>

            {/* Isi Cell */}
            {cell.type === 'text' && (
              <textarea
                placeholder="Ketik teori, penjelasan modul, atau pembahasan di sini..."
                className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl p-4 outline-none focus:border-[#1ED760] min-h-[120px] text-zinc-200"
                value={cell.content}
                onChange={(e) => updateCellContent(cell.id, e.target.value)}
              />
            )}

            {cell.type === 'code' && (
              <textarea
                placeholder="Paste kode program Anda di sini..."
                className="w-full bg-[#0d1117] border border-zinc-800 text-[#1ED760] font-mono p-4 rounded-xl min-h-[160px] outline-none focus:border-[#1ED760]"
                value={cell.content}
                onChange={(e) => updateCellContent(cell.id, e.target.value)}
              />
            )}

            {cell.type === 'image' && (
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Paste URL Gambar di sini (contoh: https://i.imgur.com/contoh.png atau /images/laprak.png)"
                  className="w-full bg-zinc-950 border border-zinc-800 text-white p-3 rounded-xl outline-none focus:border-[#1ED760]"
                  value={cell.content}
                  onChange={(e) => updateCellContent(cell.id, e.target.value)}
                />
                {cell.content && (
                  <div className="p-3 bg-black/50 border border-zinc-800 rounded-xl flex justify-center">
                    <img
                      src={cell.content}
                      alt="Preview Gambar"
                      className="max-h-64 rounded-lg object-contain"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {cells.length === 0 && (
          <div className="text-center py-12 border border-dashed border-zinc-800 rounded-2xl text-zinc-500">
            <i className="fas fa-layer-group text-3xl mb-2 block opacity-40"></i>
            <p>Belum ada cell konten. Tambahkan teks, kode, atau gambar di bawah ini.</p>
          </div>
        )}
      </div>

      {/* Tombol Aksi Bawah */}
      <div className="flex flex-wrap items-center gap-3 p-4 bg-zinc-900 border border-zinc-800 rounded-2xl sticky bottom-6 shadow-2xl backdrop-blur-md bg-opacity-95 z-20">
        <button
          type="button"
          onClick={addTextCell}
          className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-sm font-medium transition flex items-center gap-2"
        >
          <i className="fas fa-paragraph text-[#1ED760]"></i> + Teks
        </button>

        <button
          type="button"
          onClick={addCodeCell}
          className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-sm font-medium transition flex items-center gap-2"
        >
          <i className="fas fa-code text-[#1ED760]"></i> + Kode
        </button>

        <button
          type="button"
          onClick={addImageCell}
          className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-sm font-medium transition flex items-center gap-2"
        >
          <i className="fas fa-image text-[#1ED760]"></i> + Gambar
        </button>

        <button
          type="button"
          onClick={handleSave}
          disabled={loading}
          className="ml-auto px-6 py-2.5 bg-[#1ED760] hover:bg-[#1db954] text-black font-bold rounded-xl transition hover:scale-105 flex items-center gap-2 shadow-lg disabled:opacity-50"
        >
          {loading ? (
            <>
              <i className="fas fa-spinner fa-spin"></i> Menyimpan...
            </>
          ) : mode === 'edit' ? (
            <>
              <i className="fas fa-save"></i> Simpan Perubahan (Update)
            </>
          ) : (
            <>
              <i className="fas fa-paper-plane"></i> Publikasikan Laprak
            </>
          )}
        </button>
      </div>

      {/* Notifikasi Status */}
      {statusMessage && (
        <div
          className={`mt-6 p-4 rounded-xl border text-sm ${
            statusMessage.type === 'success'
              ? 'bg-[#1ED760]/10 border-[#1ED760]/30 text-[#1ED760]'
              : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}
        >
          {statusMessage.text}
        </div>
      )}

      {/* Tautan URL Sukses */}
      {publishedUrl && (
        <div className="mt-4 p-5 bg-zinc-900 border border-[#1ED760]/50 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-white">Laprak online & siap dilihat:</p>
            <p className="text-xs text-zinc-400">Tautan slug: {publishedUrl}</p>
          </div>
          <Link
            href={publishedUrl}
            target="_blank"
            className="px-4 py-2 bg-[#1ED760] text-black font-bold rounded-lg text-sm hover:scale-105 transition text-center"
          >
            <i className="fas fa-external-link-alt me-1.5"></i> Buka Laprak
          </Link>
        </div>
      )}

    </div>
  );
}

export default function SecretCellCreator() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white p-10 text-center">Memuat editor...</div>}>
      <SecretCreatorContent />
    </Suspense>
  );
}
