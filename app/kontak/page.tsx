"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import ThemeToggle from '@/components/ui/ThemeToggle'; 
import { motion } from 'framer-motion';
import { ArrowRight, Mail, Phone, Headphones } from 'lucide-react';
import * as SeparatorPrimitive from '@radix-ui/react-separator';
import * as d3 from 'd3';
import { feature } from 'topojson-client';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import type { Topology, GeometryCollection, GeometryObject } from "topojson-specification";
import type { GeoPermissibleObjects } from "d3";
// --- UTILITY UNTUK TAILWIND CLASS MERGE ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const smoothEase = [0.25, 0.1, 0.25, 1] as const;

const CONTACT_LINKS = [
  { icon: Mail, label: "jardelpoliviera@gmail.com", href: "mailto:jardelpoliviera@gmail.com" },
  { icon: Phone, label: "+62 822 6972 7118", href: "https://wa.me/6282269727118" },
  { icon: Headphones, label: "Instagram @areljrdl", href: "https://instagram.com/areljrdl" },
];

interface GlobeWireframeProps {
  width?: number; height?: number; className?: string; strokeColor?: string;
  strokeWidth?: number; graticuleColor?: string; graticuleOpacity?: number;
  sphereOutlineColor?: string; sphereOutlineWidth?: number; autoRotate?: boolean;
  autoRotateSpeed?: number; rotateToLocation?: string | [number, number];
  rotateCities?: string[]; rotationSpeed?: number; initialRotation?: [number, number];
  enableInteraction?: boolean; showGraticule?: boolean; startAsGlobe?: boolean;
  countryFillColor?: string; countryHoverColor?: string;
  variant?: "wireframe" | "wireframesolid" | "solid"; scale?: number; backgroundColor?: string;
}

interface GeoFeature {
  type: string; geometry: GeometryObject; properties: Record<string, unknown>;
}

interface WorldAtlasTopology extends Topology {
  objects: { countries: GeometryCollection; };
}

interface CustomProjection extends d3.GeoProjection {
  alpha(value: number): CustomProjection;
  alpha(): number;
}

const cityCoordinates: Record<string, [number, number]> = {
  "jakarta": [-6.2088, 106.8456], "padang": [-0.9471, 100.4172],
  "san francisco": [37.7749, -122.4194], "new york": [40.7128, -74.006],
};

function orthographicRaw(x: number, y: number): [number, number] {
  const cosy = Math.cos(y); return [cosy * Math.sin(x), Math.sin(y)];
}

function equirectangularRaw(lambda: number, phi: number): [number, number] {
  return [lambda, phi];
}

function interpolateProjection(
  raw0: (lambda: number, phi: number) => [number, number],
  raw1: (lambda: number, phi: number) => [number, number],
): CustomProjection {
  let t = 0;
  const createRawProjection = (alpha: number): ((lambda: number, phi: number) => [number, number]) => {
    return (lambda: number, phi: number): [number, number] => {
      const [x0, y0] = raw0(lambda, phi);
      const [x1, y1] = raw1(lambda, phi);
      return [x0 + alpha * (x1 - x0), y0 + alpha * (y1 - y0)];
    };
  };

  const projection = d3.geoProjection(createRawProjection(t)) as unknown as CustomProjection;
  const alphaMethod = ((value?: number): CustomProjection | number => {
    if (value !== undefined) {
      t = +value;
      const newProjection = d3.geoProjection(createRawProjection(t)) as unknown as CustomProjection;
      if (projection.scale()) newProjection.scale(projection.scale());
      if (projection.translate()) newProjection.translate(projection.translate());
      if (projection.rotate()) newProjection.rotate(projection.rotate());
      if (projection.precision()) newProjection.precision(projection.precision());
      newProjection.alpha = alphaMethod as CustomProjection["alpha"];
      return newProjection;
    }
    return t;
  }) as CustomProjection["alpha"];

  projection.alpha = alphaMethod;
  return projection;
}

// --- KOMPONEN GLOBE ---
function GlobeWireframe({
  width, height, className = "aspect-square w-full max-w-150",
  strokeColor = "currentColor", strokeWidth = 1.0, graticuleColor = "currentColor",
  graticuleOpacity = 0.2, sphereOutlineColor = "currentColor", sphereOutlineWidth = 1,
  autoRotate = true, autoRotateSpeed = 0.5, rotateCities = [],
  rotationSpeed = 3000, initialRotation = [0, 0], enableInteraction = true,
  showGraticule = true, startAsGlobe = true, countryFillColor,
  variant = "wireframe", scale = 1, backgroundColor,
}: GlobeWireframeProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(startAsGlobe ? 0 : 100);
  const [worldData, setWorldData] = useState<GeoFeature[]>([]);
  const [rotation, setRotation] = useState<[number, number]>(initialRotation);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState([0, 0]);
  
  // PERBAIKAN: Langsung diset 'true' agar Globe dipaksa muncul
  const [isVisible, setIsVisible] = useState(true); 
  
  const rotationInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const rotationAnimFrame = useRef<number | null>(null);
  const rotationStartTime = useRef<number | null>(null);
  const rotationFrom = useRef<[number, number]>([0, 0]);
  const rotationTo = useRef<[number, number]>([0, 0]);
  const animationFrame = useRef<number | null>(null);
  const [currentCityIndex, setCurrentCityIndex] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const resizeObserver = useRef<ResizeObserver | null>(null);
  const rotationRef = useRef(rotation);

  useEffect(() => { rotationRef.current = rotation; }, [rotation]);

  const useResponsive = !width && !height;
  const finalWidth = useResponsive ? dimensions.width : width || 800;
  const finalHeight = useResponsive ? dimensions.height : height || 500;

  const defaultStrokeColor = strokeColor || "currentColor";
  const defaultGraticuleColor = graticuleColor || "currentColor";
  const defaultSphereOutlineColor = sphereOutlineColor || "currentColor";
  const defaultCountryFillColor = countryFillColor || "none";
  const defaultBackgroundColor = backgroundColor || "transparent";

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const updateDimensions = () => {
      if (container && useResponsive) {
        const w = container.offsetWidth || 300;
        setDimensions({ width: w, height: w });
      }
    };
    updateDimensions();
    if (useResponsive) {
      resizeObserver.current = new ResizeObserver(updateDimensions);
      resizeObserver.current.observe(container);
    }
    return () => {
      if (resizeObserver.current) resizeObserver.current.disconnect();
    };
  }, [useResponsive]);

  useEffect(() => {
    const loadWorldData = async () => {
      try {
        const response = await fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json");
        const world = (await response.json()) as WorldAtlasTopology;
        const countries = feature(world, world.objects.countries).features as GeoFeature[];
        setWorldData(countries);
      } catch (error) {
        setWorldData([{
          type: "Feature", properties: {},
          geometry: { type: "Polygon", coordinates: [[[-180, -90], [180, -90], [180, 90], [-180, 90], [-180, -90]]] } as unknown as GeometryObject,
        }]);
      }
    };
    loadWorldData();
  }, []);

  useEffect(() => {
    if (!autoRotate || !isVisible || isDragging || rotateCities.length > 0) {
      if (animationFrame.current) { cancelAnimationFrame(animationFrame.current); animationFrame.current = null; }
      return;
    }
    const rotate = () => {
      setRotation((prev) => [(prev[0] + autoRotateSpeed) % 360, prev[1]]);
      animationFrame.current = requestAnimationFrame(rotate);
    };
    animationFrame.current = requestAnimationFrame(rotate);
    return () => { if (animationFrame.current) cancelAnimationFrame(animationFrame.current); };
  }, [autoRotate, autoRotateSpeed, isVisible, isDragging, rotateCities.length]);

  const animateRotationTo = useCallback((target: [number, number], duration = 1200) => {
    if (rotationAnimFrame.current) cancelAnimationFrame(rotationAnimFrame.current);
    rotationFrom.current = rotationRef.current;
    rotationTo.current = target;
    rotationStartTime.current = performance.now();

    const animate = (time: number) => {
      const elapsed = time - (rotationStartTime.current || 0);
      const t = Math.min(elapsed / duration, 1);
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      const lon = rotationFrom.current[0] + (rotationTo.current[0] - rotationFrom.current[0]) * eased;
      const lat = rotationFrom.current[1] + (rotationTo.current[1] - rotationFrom.current[1]) * eased;
      setRotation([lon, lat]);
      if (t < 1) rotationAnimFrame.current = requestAnimationFrame(animate);
    };
    rotationAnimFrame.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    if (rotateCities.length === 0 || !isVisible) return;
    const rotateToNextCity = () => {
      const nextIndex = (currentCityIndex + 1) % rotateCities.length;
      const city = rotateCities[nextIndex].toLowerCase();
      const coordinates = cityCoordinates[city];
      if (coordinates) {
        animateRotationTo([-coordinates[1], -coordinates[0]], rotationSpeed * 0.6);
        setCurrentCityIndex(nextIndex);
      }
    };
    rotationInterval.current = setInterval(rotateToNextCity, rotationSpeed);
    return () => { if (rotationInterval.current) clearInterval(rotationInterval.current); };
  }, [rotateCities, currentCityIndex, rotationSpeed, isVisible, animateRotationTo]);

  const handleMouseDown = (event: React.MouseEvent) => {
    if (!enableInteraction) return;
    setIsDragging(true);
    const rect = svgRef.current?.getBoundingClientRect();
    if (rect) setLastMouse([event.clientX - rect.left, event.clientY - rect.top]);
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isDragging || !enableInteraction) return;
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const currentMouse = [event.clientX - rect.left, event.clientY - rect.top];
    const dx = currentMouse[0] - lastMouse[0];
    const dy = currentMouse[1] - lastMouse[1];
    const sensitivity = variant === "wireframe" ? (progress / 100 < 0.5 ? 0.5 : 0.25) : 0.5;
    setRotation((prev) => [prev[0] + dx * sensitivity, Math.max(-90, Math.min(90, prev[1] - dy * sensitivity))]);
    setLastMouse(currentMouse);
  };

  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => setIsDragging(false);

  useEffect(() => {
    if (!svgRef.current || worldData.length === 0 || !isVisible || (useResponsive && dimensions.width === 0)) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    let finalCountryFill = "none", finalStrokeWidth = strokeWidth, finalOpacity = 1.0, renderGraticule = showGraticule, finalGraticuleOpacity = graticuleOpacity, finalSphereOutlineWidth = sphereOutlineWidth;

    if (variant === "wireframesolid") {
      renderGraticule = false; finalGraticuleOpacity = 0; finalSphereOutlineWidth = 1.5;
    }

    let projection: d3.GeoProjection | CustomProjection;
    const path = d3.geoPath();

    if (variant === "wireframe") {
      const alpha = Math.pow(progress / 100, 0.5);
      const baseScale = Math.min(finalWidth, finalHeight) / 2;
      const scaleRange = d3.scaleLinear().domain([0, 1]).range([baseScale * 0.9 * scale, baseScale * 0.54 * scale]);
      projection = interpolateProjection(orthographicRaw, equirectangularRaw)
        .scale(scaleRange(alpha)).translate([finalWidth / 2, finalHeight / 2])
        .rotate([rotation[0], rotation[1]]).precision(0.1);
      (projection as CustomProjection).alpha(alpha);
      path.projection(projection);
    } else {
      projection = d3.geoOrthographic()
        .scale((Math.min(finalWidth, finalHeight) / 2) * scale * 0.9).translate([finalWidth / 2, finalHeight / 2])
        .rotate([rotation[0], rotation[1]]).precision(0.1);
      path.projection(projection);
    }

    if (renderGraticule && finalGraticuleOpacity > 0) {
      try {
        const graticule = d3.geoGraticule();
        const graticulePath = path(graticule());
        if (graticulePath) {
          svg.append("path").datum(graticule()).attr("d", graticulePath).attr("fill", "none")
             .attr("stroke", defaultGraticuleColor).attr("stroke-width", 1).attr("opacity", finalGraticuleOpacity);
        }
      } catch (e) {}
    }

    svg.selectAll(".country").data(worldData).enter().append("path").attr("class", "country")
       .attr("d", (d: GeoFeature) => {
         try {
           const p = path(d as unknown as GeoPermissibleObjects);
           return (p && !p.includes("NaN")) ? p : "";
         } catch { return ""; }
       })
       .attr("fill", finalCountryFill).attr("stroke", defaultStrokeColor).attr("stroke-width", finalStrokeWidth).attr("opacity", finalOpacity);

    try {
      const sphereOutline = path({ type: "Sphere" });
      if (sphereOutline) {
        svg.append("path").datum({ type: "Sphere" }).attr("d", sphereOutline).attr("fill", "none")
           .attr("stroke", defaultSphereOutlineColor).attr("stroke-width", finalSphereOutlineWidth).attr("opacity", variant === "wireframe" ? 1.0 : 0.8);
      }
    } catch (e) {}
  }, [worldData, progress, rotation, isVisible, finalWidth, finalHeight, variant, scale, useResponsive, dimensions.width]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <svg ref={svgRef} width={finalWidth} height={finalHeight} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}
        className={useResponsive ? "w-full h-full opacity-100 transition-opacity duration-1000" : ""}
        style={{ cursor: enableInteraction ? (isDragging ? "grabbing" : "grab") : "default" }}
      />
    </div>
  );
}

// --- KOMPONEN PEMISAH (DOTS) ---
const FormDots = React.forwardRef<React.ComponentRef<typeof SeparatorPrimitive.Root>, React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>>(
  ({ className, orientation = "horizontal", decorative = true, ...props }, ref) => {
    const isHorizontal = orientation === "horizontal";
    return (
      <SeparatorPrimitive.Root ref={ref} decorative={decorative} orientation={orientation} className={cn("shrink-0 flex items-center justify-center overflow-hidden opacity-50", isHorizontal ? "w-full" : "h-full", className)} {...props}>
        <div className={cn("relative", isHorizontal ? "w-full h-4" : "h-full w-4")}>
          <div className={cn("absolute inset-0 bg-repeat text-[var(--text-secondary)]")}
            style={{
              backgroundImage: "radial-gradient(circle, currentColor 0.8px, transparent 0.8px)", backgroundSize: isHorizontal ? "6px 100%" : "100% 6px",
              maskImage: isHorizontal ? "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)" : "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
            }}
          />
        </div>
      </SeparatorPrimitive.Root>
    );
  }
);
FormDots.displayName = "FormDots";

// --- HALAMAN UTAMA KONTAK ---
export default function Kontak() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget;
    if (form.checkValidity()) {
      setShowSuccess(true);
      setShowError(false);
    } else {
      setShowError(true);
      setShowSuccess(false);
    }
    form.classList.add("was-validated");
  };

  return (
    <>
      {/* --- NAVBAR MOBILE --- */}
      <nav className="navbar navbar-dark bg-black fixed-top d-md-none z-50">
        <div className="container-fluid">
          <Link className="navbar-brand fw-bold" href="/">
            <i className="text-success"></i> My Portfolio
          </Link>
          <button 
            className="navbar-toggler" 
            type="button" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          
          {/* 3. Tambahkan class 'show' secara dinamis jika state isMobileMenuOpen bernilai true */}
          <div className={`collapse navbar-collapse ${isMobileMenuOpen ? 'show' : ''}`} id="mobileMenu">
            {/* Beri sedikit padding bawah (pb-3) dan warna background agar tidak transparan */}
            <ul className="navbar-nav ms-auto pb-3 pt-2">
              {/* Tambahkan onClick pada setiap Link agar menu tertutup otomatis saat link ditekan */}
              <li className="nav-item">
                <Link className="nav-link" href="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href="/about" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active" href="/portofolio" onClick={() => setIsMobileMenuOpen(false)}>Portfolio</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href="/kontak" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
              </li>
              <li className="nav-item mt-2">
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
          <li className="nav-item"><Link href="/portofolio" className="nav-link"><i className="fas fa-book-open"></i> Portfolio</Link></li>
          <li className="nav-item"><Link href="/kontak" className="nav-link active"><i className="fas fa-envelope"></i> Contact</Link></li>
          <li className="nav-item mt-4"><ThemeToggle /></li>
        </ul>
      </nav>

      {/* --- KONTEN UTAMA --- */}
      <main className="main-content d-flex flex-column min-vh-100 p-0">
        
        <div className="flex-grow-1 relative w-full overflow-hidden py-16 md:py-24 z-10 pt-5 mt-5">
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
            
            {/* Header Bagian Atas */}
            <div className="flex flex-col items-center text-center gap-4 mb-12 mt-5">
              <motion.div
                initial={{ opacity: 0, y: -12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: smoothEase }}
                className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#1ED760]/10 border border-[#1ED760]/30"
              >
                <span className="text-sm text-[#1ED760] font-medium">Contact</span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.15, ease: smoothEase }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--text-primary)]"
              >
                Hubungi Saya
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.3, ease: smoothEase }}
                className="text-base text-[var(--text-secondary)] max-w-md"
              >
                Silakan hubungi saya melalui form di bawah atau melalui media sosial. Saya akan segera membalas pesan Anda.
              </motion.p>
            </div>

            {/* Grid Form dan Globe */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto items-start">
              
              {/* Kolom Kiri: Info Kontak & Globe */}
              <motion.div
                initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1.0, delay: 0.2, ease: smoothEase }}
                className="flex flex-col gap-6"
              >
                <div className="flex flex-col gap-1">
                  <h3 className="text-xl font-semibold text-[var(--text-primary)]">Get in touch</h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-xs">
                    Pilih salah satu jalur kontak di bawah ini. Saya akan merespons secepat mungkin.
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  {CONTACT_LINKS.map(({ icon: Icon, label, href }, i) => (
                    <motion.a
                      key={label} href={href} target="_blank" rel="noopener noreferrer"
                      initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.3 + i * 0.1, ease: smoothEase }}
                      className="group flex items-center gap-3 w-fit text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-200"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[var(--bg-glass)] border border-[var(--border-glass)] group-hover:border-[#1ED760]/50 group-hover:bg-[#1ED760]/10 flex items-center justify-center shrink-0 transition-all duration-200">
                        <Icon className="w-3.5 h-3.5 text-[var(--text-secondary)] group-hover:text-[#1ED760] transition-colors duration-200" />
                      </div>
                      {label}
                    </motion.a>
                  ))}
                </div>

                {/* PERBAIKAN GLOBE: Dipaksa menggunakan warna hijau agar terlihat kontras */}
                <div className="relative overflow-hidden h-72 w-full mt-4">
                  <GlobeWireframe
                    className="w-full h-full absolute top-0 left-0"
                    variant="wireframesolid" 
                    autoRotate 
                    autoRotateSpeed={0.45} 
                    strokeWidth={1.2} 
                    strokeColor="#1ED760" 
                    sphereOutlineColor="#1ED760"
                    rotateCities={["jakarta", "padang"]}
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[var(--grad-bg)] to-transparent" />
                </div>
              </motion.div>

              {/* PERBAIKAN FORM: Kolom Kanan kini sepenuhnya Glassmorphic */}
              <motion.div
                initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1.0, delay: 0.35, ease: smoothEase }}
                className="rounded-3xl border border-[var(--border-glass)] bg-[var(--bg-glass)] backdrop-blur-xl p-6 sm:p-8 flex flex-col gap-5 shadow-[0_12px_40px_rgba(0,0,0,0.3)]"
              >
                <div>
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-0.5">Send a message</h3>
                  <p className="text-sm text-[var(--text-secondary)]">Isi form ini dan saya akan menghubungi Anda kembali.</p>
                </div>

                {/* Notifikasi Alert */}
                <div className={`alert alert-success bg-[#1ED760]/20 text-[#1ED760] border border-[#1ED760]/50 py-2 text-sm ${showSuccess ? '' : 'd-none'}`}>Pesan berhasil dikirim!</div>
                <div className={`alert alert-danger bg-red-500/20 text-red-400 border border-red-500/50 py-2 text-sm ${showError ? '' : 'd-none'}`}>Harap isi semua kolom wajib!</div>

                <FormDots />

                <form id="contactForm" noValidate onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold tracking-widest uppercase text-[var(--text-secondary)]">Nama Lengkap *</label>
                      <input type="text" placeholder="Jardel Poliviera" required
                        className="w-full bg-[rgba(0,0,0,0.15)] border border-[var(--border-glass)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] outline-none focus:border-[#1ED760] focus:bg-[var(--bg-glass-hover)] transition-all duration-200"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold tracking-widest uppercase text-[var(--text-secondary)]">Subjek *</label>
                      <select required className="w-full bg-[rgba(0,0,0,0.15)] border border-[var(--border-glass)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-secondary)] outline-none focus:border-[#1ED760] focus:bg-[var(--bg-glass-hover)] transition-all duration-200">
                        <option value="" className="bg-[#121212]">Pilih Subjek</option>
                        <option value="Project" className="bg-[#121212]">Project / Kerjasama</option>
                        <option value="Job" className="bg-[#121212]">Tawaran Pekerjaan</option>
                        <option value="Other" className="bg-[#121212]">Lainnya</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold tracking-widest uppercase text-[var(--text-secondary)]">Alamat Email *</label>
                    <input type="email" placeholder="email@contoh.com" required
                      className="w-full bg-[rgba(0,0,0,0.15)] border border-[var(--border-glass)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] outline-none focus:border-[#1ED760] focus:bg-[var(--bg-glass-hover)] transition-all duration-200"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold tracking-widest uppercase text-[var(--text-secondary)]">Pesan *</label>
                    <textarea placeholder="Tulis pesan Anda di sini" rows={4} required
                      className="w-full bg-[rgba(0,0,0,0.15)] border border-[var(--border-glass)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] outline-none focus:border-[#1ED760] focus:bg-[var(--bg-glass-hover)] resize-none transition-all duration-200"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="agreeCheck" required className="rounded border-[var(--border-glass)] bg-transparent accent-[#1ED760]" />
                    <label htmlFor="agreeCheck" className="text-xs text-[var(--text-secondary)]">Saya setuju dengan syarat dan ketentuan</label>
                  </div>

                  <button type="submit" className="w-fit h-11 px-8 rounded-xl font-semibold text-sm bg-[#1ED760] hover:bg-[#1db954] text-black group flex items-center gap-2 transition-all mt-2">
                    Submit
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </button>
                </form>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="pb-28"></div>
        
      </main>

      {/* Panggil komponen SpotifyFooter di sini */}

      <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" strategy="lazyOnload" />
    </>
  );
}