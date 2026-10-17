"use client";

import React, { useState, useRef } from 'react';

export function SpotifyFooter() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      setVolume(newVolume);
    }
  };

  return (
    <div 
      className="fixed bottom-0 left-0 w-full h-[70px] px-3 md:px-4 flex flex-row items-center justify-between z-[100] shadow-[0_-10px_30px_rgba(0,0,0,0.05)] backdrop-blur-xl"
      style={{ 
        backgroundColor: "rgba(128, 128, 128, 0.05)", 
        borderTop: "1px solid rgba(128, 128, 128, 0.1)" 
      }}
    >
      
      <audio 
        ref={audioRef}
        src="/audio/bg-music.mp3" 
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Bagian Kiri: Lebar pasti 25% (md:w-1/4) di laptop, dan 66% (w-2/3) di HP */}
      <div className="flex items-center justify-start gap-2 md:gap-3 w-2/3 md:w-1/4 overflow-hidden">
        <div 
          className="w-10 h-10 md:w-11 md:h-11 rounded flex-shrink-0 flex items-center justify-center shadow-sm"
          style={{ backgroundColor: "rgba(128, 128, 128, 0.1)", border: "1px solid rgba(128, 128, 128, 0.15)" }}
        >
           <i className="fas fa-music text-[var(--text-secondary)] text-xs md:text-sm"></i>
        </div>
        <div className="flex flex-col justify-center overflow-hidden">
          <span className="text-sm font-semibold cursor-default truncate text-[var(--text-primary)]">Portfolio Soundtrack</span>
          <span className="text-[11px] text-[var(--text-secondary)] cursor-default truncate">Background Music</span>
        </div>
      </div>

      {/* Bagian Tengah: Lebar pasti 50% (md:w-2/4) di laptop, dan 33% (w-1/3) di HP */}
      <div className="flex flex-col items-end md:items-center justify-center w-1/3 md:w-2/4 gap-1">
        <div className="flex items-center gap-3 md:gap-5">
          <button className="hidden md:block text-[#1ED760] hover:text-[var(--text-primary)] transition text-xs relative">
            <i className="fas fa-random"></i>
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#1ED760] rounded-full"></span>
          </button>
          <button className="hidden md:block text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition text-sm">
            <i className="fas fa-step-backward"></i>
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-8 h-8 md:w-7 md:h-7 flex items-center justify-center bg-[#1ED760] text-black rounded-full hover:scale-105 transition shadow-sm"
          >
            <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'} ms-[2px] text-sm md:text-xs`}></i>
          </button>
          
          <button className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition text-sm ms-2 md:ms-0">
            <i className="fas fa-step-forward"></i>
          </button>
          
          <button className="hidden md:block text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition text-xs">
            <i className="fas fa-redo"></i>
          </button>
        </div>

        {/* Progress Bar (Hanya muncul di laptop) */}
        <div className="hidden md:flex items-center w-full max-w-[722px] gap-2 text-[11px] text-[var(--text-secondary)]">
          <span>{formatTime(currentTime)}</span>
          <input 
            type="range" 
            min="0" 
            max={duration || 100} 
            value={currentTime}
            onChange={handleProgressChange}
            className="w-full h-1 bg-[var(--border-glass)] rounded-full appearance-none cursor-pointer hover:bg-[#1ED760] accent-[#1ED760] transition"
          />
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Bagian Kanan: Lebar pasti 25% (md:w-1/4) di laptop, tersembunyi di HP */}
      <div className="hidden md:flex items-center justify-end w-1/4 gap-3 text-[var(--text-secondary)]">
        <button className="hover:text-[var(--text-primary)] transition text-xs"><i className="fas fa-microphone"></i></button>
        <button className="hover:text-[var(--text-primary)] transition text-xs"><i className="fas fa-list-ul"></i></button>
        <button className="hover:text-[var(--text-primary)] transition text-xs"><i className="fas fa-desktop"></i></button>
        <div className="flex items-center gap-2 group">
          <button className="hover:text-[var(--text-primary)] transition text-xs">
            <i className={`fas ${volume === 0 ? 'fa-volume-mute' : 'fa-volume-up'}`}></i>
          </button>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={volume}
            onChange={handleVolumeChange}
            className="w-20 h-1 bg-[var(--border-glass)] rounded-full appearance-none cursor-pointer group-hover:bg-[#1ED760] accent-[#1ED760] transition"
          />
        </div>
        <button className="hover:text-[var(--text-primary)] transition text-xs ms-2"><i className="fas fa-expand-alt"></i></button>
      </div>

    </div>
  );
}