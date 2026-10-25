"use client";

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface LaprakItem {
  id?: number | string;
  title: string;
  course: string;
  slug: string;
  created_at: string;
}

export default function DaftarLaprakDinamis() {
  const [lapraks, setLapraks] = useState<LaprakItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(false);

  const fetchLapraks = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('laprak')
        .select('id, title, course, slug, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase fetch error:', error);
        setErrorMsg(error.message);
      } else {
        setLapraks(data || []);
        setErrorMsg(null);
      }
    } catch (err: any) {
      console.error('Unexpected error:', err);
      setErrorMsg(err.message || 'Gagal memuat data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLapraks();

    // Setup Supabase Realtime Subscription
    const channel = supabase
      .channel('laprak-realtime-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'laprak' },
        (payload) => {
          console.log('Perubahan realtime Supabase terdeteksi:', payload);
          fetchLapraks();
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setIsRealtimeConnected(true);
        } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          setIsRealtimeConnected(false);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchLapraks]);

  return (
    <div
      className="min-h-screen p-8 md:p-20 transition-colors duration-500 pb-32"
      style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }}
    >
      <div className="max-w-4xl mx-auto mt-5">
        
        {/* Tombol kembali & Status Realtime */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <Link
            href="/laprak"
            className="text-secondary text-decoration-none hover:text-white transition-colors inline-flex items-center gap-2"
          >
            <i className="fas fa-arrow-left"></i> Kembali ke Folder
          </Link>

          <div className="flex items-center gap-2">
            {/* Pintasan Editor */}
            <Link
              href="/arel-secret-creator"
              className="text-xs px-3 py-1.5 rounded-full border border-[#1ED760]/30 bg-[#1ED760]/10 text-[#1ED760] hover:bg-[#1ED760]/20 transition flex items-center gap-1.5 font-semibold"
            >
              <i className="fas fa-pen-nib"></i> Editor Laprak
            </Link>

            {/* Indikator Status Realtime */}
            <div className="flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-full border border-white/10 bg-white/5">
              <span
                className={`w-2 h-2 rounded-full ${
                  isRealtimeConnected ? 'bg-[#1ED760] animate-pulse' : 'bg-yellow-500'
                }`}
              ></span>
              <span className="opacity-75">
                {isRealtimeConnected ? 'Realtime Aktif' : 'Menghubungkan...'}
              </span>
              <button
                onClick={() => {
                  setLoading(true);
                  fetchLapraks();
                }}
                title="Segarkan data manual"
                className="ml-1 opacity-60 hover:opacity-100 transition-opacity"
              >
                <i className="fas fa-sync-alt text-xs"></i>
              </button>
            </div>
          </div>
        </div>

        <div className="mb-8 border-b border-gray-300 dark:border-zinc-800 pb-4">
          <h1 className="text-4xl font-bold mb-2">Arsip Web Dinamis</h1>
          <p className="text-zinc-500">
            Kumpulan laporan praktikum yang terhubung langsung & realtime ke database Supabase.
          </p>
        </div>

        {/* Notifikasi Error jika RLS belum dibuka */}
        {errorMsg && (
          <div className="p-4 mb-6 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-sm">
            <p className="font-bold mb-1">
              <i className="fas fa-exclamation-triangle me-2"></i> Perhatian Supabase:
            </p>
            <p className="mb-2">{errorMsg}</p>
            <p className="text-xs opacity-80">
              Tip: Jika pesan menyebutkan <em>&apos;row-level security policy&apos;</em>, pastikan telah menambahkan Policy SELECT untuk tabel <code>laprak</code> di dashboard Supabase.
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16 text-zinc-500">
            <i className="fas fa-spinner fa-spin text-2xl mb-3 block text-[#1ED760]"></i>
            Memuat data realtime dari Supabase...
          </div>
        )}

        {/* Konten Laprak */}
        {!loading && (
          <div className="grid gap-4">
            {lapraks.map((item, idx) => (
              <div
                key={item.id || item.slug || idx}
                className="group relative p-6 rounded-2xl border backdrop-blur-md shadow-sm transition-all hover:scale-[1.01]"
                style={{
                  backgroundColor: 'color-mix(in srgb, var(--text-primary) 5%, transparent)',
                  borderColor: 'color-mix(in srgb, var(--text-primary) 10%, transparent)',
                }}
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
                  <Link href={`/laprak/${item.slug}`} className="flex-grow">
                    <h2 className="text-xl font-bold mb-1 group-hover:text-[#1ED760] transition-colors">
                      {item.title}
                    </h2>
                    <span className="text-xs font-mono px-2 py-1 rounded bg-[#1ED760]/20 text-[#1ED760]">
                      {item.course}
                    </span>
                  </Link>

                  <div className="flex items-center gap-3 self-end md:self-auto">
                    <span className="text-sm opacity-50">
                      {item.created_at
                        ? new Date(item.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })
                        : 'Baru saja'}
                    </span>

                    {/* Tombol Edit Laprak */}
                    <Link
                      href={`/arel-secret-creator?slug=${item.slug}`}
                      title="Edit ulang laprak ini"
                      className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-[#1ED760] hover:text-black hover:border-[#1ED760] text-xs font-semibold transition flex items-center gap-1.5"
                    >
                      <i className="fas fa-pen"></i> Edit
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {lapraks.length === 0 && !errorMsg && (
              <div className="text-center py-16 opacity-60 border border-dashed border-white/10 rounded-2xl">
                <i className="fas fa-inbox text-3xl mb-3 block opacity-40"></i>
                <p className="font-semibold mb-1">Belum ada laprak yang dipublikasikan.</p>
                <p className="text-xs text-zinc-500">
                  Data yang ditambahkan ke tabel <code>laprak</code> di Supabase akan langsung muncul di sini secara otomatis.
                </p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
