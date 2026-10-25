import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import ThemeToggle from '@/components/ui/ThemeToggle';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
 
export default async function LaprakDetail({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const currentSlug = resolvedParams.slug;

  const { data: laprak } = await supabase
    .from('laprak')
    .select('*')
    .eq('slug', currentSlug)
    .single();

  if (!laprak) return notFound();

  return (
    <>
      {/* CSS MURNI ANTI-GAGAL */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .laprak-wrapper {
            --l-bg: #f3f4f6; 
            --l-text: #111827; 
            --l-glass: rgba(255, 255, 255, 0.7); 
            --l-border: rgba(0, 0, 0, 0.1); 
          }
          
          html.dark .laprak-wrapper,
          [data-bs-theme="dark"] .laprak-wrapper,
          [data-theme="dark"] .laprak-wrapper {
            --l-bg: #09090b; 
            --l-text: #f8fafc; 
            --l-glass: rgba(39, 39, 42, 0.6); 
            --l-border: rgba(255, 255, 255, 0.1); 
          }
        `
      }} />

      <div className="laprak-wrapper min-h-screen pb-48 transition-colors duration-500" style={{ backgroundColor: 'var(--l-bg)', color: 'var(--l-text)' }}>
        
        <div className="p-8 md:p-12 max-w-4xl mx-auto relative z-10">
          
          {/* Header Laprak */}
          <div className="mb-12 pb-8 relative flex flex-col items-center">
            
            {/* Tombol kembali ke portofolio (Kiri Atas) */}
            <div className="absolute top-0 left-0 z-20">
              <Link href="/portofolio" 
                    className="flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md shadow-sm hover:scale-105 hover:-translate-x-1 transition-all text-sm font-semibold"
                    style={{ backgroundColor: 'var(--l-glass)', border: '1px solid var(--l-border)', color: 'var(--l-text)' }}>
                <span aria-hidden="true">&larr;</span> Kembali ke Portofolio
              </Link>
            </div>

            {/* Tombol Theme Toggle (Kanan Atas) */}
            <div className="absolute top-0 right-0 z-20 flex items-center justify-center p-2 rounded-full backdrop-blur-md shadow-sm hover:scale-110 transition-transform"
                 style={{ backgroundColor: 'var(--l-glass)', border: '1px solid var(--l-border)' }}>
               <ThemeToggle />
            </div>

            {/* Kotak Judul Kaca */}
            <div className="mt-14 p-8 w-full text-center rounded-3xl backdrop-blur-xl shadow-lg transition-colors duration-500"
                 style={{ backgroundColor: 'var(--l-glass)', border: '1px solid var(--l-border)' }}>
              <h1 className="text-3xl md:text-4xl font-extrabold mb-3 drop-shadow-sm">
                {laprak.title}
              </h1>
              <p className="inline-block px-4 py-1.5 rounded-full font-mono text-sm font-bold border border-[#1ED760]/30 bg-[#1ED760]/10 text-[#1ED760]">
                {laprak.course}
              </p>
            </div>
          </div>

          {/* Susunan Cells */}
          <div className="flex flex-col gap-8">
            {laprak.content && Array.isArray(laprak.content) && laprak.content.map((cell: any, idx: number) => {
              
              if (cell.type === 'text') {
                return (
                  <div key={idx} className="p-6 md:p-8 rounded-3xl backdrop-blur-lg shadow-md transition-colors duration-500 relative"
                       style={{ backgroundColor: 'var(--l-glass)', border: '1px solid var(--l-border)' }}>
                    <p className="leading-relaxed text-justify whitespace-pre-wrap font-medium">
                      {cell.content}
                    </p>
                  </div>
                );
              }
              
              if (cell.type === 'code') {
                return (
                  <div key={idx} className="rounded-3xl overflow-hidden backdrop-blur-lg shadow-md transition-colors duration-500 relative"
                       style={{ backgroundColor: 'var(--l-glass)', border: '1px solid var(--l-border)' }}>
                    
                    <div className="flex px-5 py-4 items-center gap-2 border-b" style={{ borderColor: 'var(--l-border)' }}>
                      <div className="w-3.5 h-3.5 rounded-full bg-[#FF5F56] shadow-sm"></div>
                      <div className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E] shadow-sm"></div>
                      <div className="w-3.5 h-3.5 rounded-full bg-[#27C93F] shadow-sm"></div>
                      <span className="ml-auto text-xs font-mono uppercase tracking-widest opacity-70">
                        {cell.language || 'Code'}
                      </span>
                    </div>

                    <pre className="p-6 overflow-x-auto text-sm text-[#1ED760] font-mono bg-[#0d1117]">
                      <code>{cell.content}</code>
                    </pre>
                  </div>
                );
              }

              if (cell.type === 'image') {
                return (
                  <div key={idx} className="p-4 rounded-3xl backdrop-blur-lg shadow-md transition-colors duration-500 flex justify-center relative"
                       style={{ backgroundColor: 'var(--l-glass)', border: '1px solid var(--l-border)' }}>
                    <img 
                      src={cell.content} 
                      alt="Output Praktikum" 
                      className="max-w-full rounded-2xl shadow-sm"
                      style={{ border: '1px solid var(--l-border)' }} 
                    />
                  </div>
                );
              }

              return null;
            })}
          </div>

        </div>
      </div>
    </>
  );
}
