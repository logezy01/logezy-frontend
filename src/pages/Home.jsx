import { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Shield, TrendingUp, ArrowRight, CheckCircle, ChevronRight, Zap, Star, Play } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import ListingCard from '../components/common/ListingCard';
import Logo from '../components/common/Logo';
import api from '../lib/axios';
import useAuthStore from '../store/authStore';
import SkeletonCard from '../components/common/SkeletonCard';

// ── Hook InView ───────────────────────────────────────────────
function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return [ref, inView];
}

// ── Section animée ────────────────────────────────────────────
function AnimatedSection({ children, className = '', delay = 0 }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      style={{
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0) scale(1)' : 'translateY(28px) scale(0.98)',
        transitionProperty: 'opacity, transform',
        transitionDuration: '800ms',
      }}
      className={className}
    >
      {children}
    </div>
  );
}
// ── Compteur animé ────────────────────────────────────────────
function Counter({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView();
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 20);
    return () => clearInterval(timer);
  }, [inView, target]);
  return <span ref={ref}>{count}{suffix}</span>;
}

// ── Particules 3D canvas ──────────────────────────────────────
function ParticlesCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      z: Math.random() * 400,
      size: Math.random() * 3 + 0.5,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      speedZ: Math.random() * 0.5,
      opacity: Math.random() * 0.6 + 0.1,
      color: Math.random() > 0.5 ? '74, 222, 128' : '255, 255, 255',
    }));

    let mouseX = canvas.width / 2, mouseY = canvas.height / 2;
    canvas.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

    let animId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.speedX + (mouseX - canvas.width / 2) * 0.00005;
        p.y += p.speedY + (mouseY - canvas.height / 2) * 0.00005;
        p.z -= p.speedZ;
        if (p.z <= 0) p.z = 400;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        const perspective = 400 / (400 - p.z);
        const projX = (p.x - canvas.width / 2) * perspective + canvas.width / 2;
        const projY = (p.y - canvas.height / 2) * perspective + canvas.height / 2;
        const projSize = p.size * perspective;

        ctx.beginPath();
        ctx.arc(projX, projY, projSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.opacity * perspective * 0.5})`;
        ctx.fill();
      });

      // Connexions
      particles.forEach((p1, i) => {
        particles.slice(i + 1, i + 5).forEach(p2 => {
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(74, 222, 128, ${0.05 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animId = requestAnimationFrame(animate);
    };
    animate();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 2 }} />;
}

// ── Maison 3D SVG animée ──────────────────────────────────────
function House3D({ style = {} }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        transform: hovered ? 'rotateY(15deg) rotateX(-5deg) scale(1.05)' : 'rotateY(0deg) rotateX(0deg) scale(1)',
        transition: 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
        transformStyle: 'preserve-3d',
        ...style,
      }}>
      <svg viewBox="0 0 200 180" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        {/* Ombre portée */}
        <ellipse cx="100" cy="172" rx="70" ry="8" fill="rgba(0,0,0,0.3)" />

        {/* Corps maison - face */}
        <rect x="35" y="90" width="130" height="80" rx="4" fill="url(#bodyGrad)" />

        {/* Corps maison - côté droit (effet 3D) */}
        <path d="M165 90 L185 78 L185 158 L165 170 Z" fill="url(#sideGrad)" />

        {/* Toit - face */}
        <path d="M25 95 L100 35 L175 95 Z" fill="url(#roofGrad)" />

        {/* Toit - côté droit (effet 3D) */}
        <path d="M175 95 L195 83 L120 23 L100 35 Z" fill="url(#roofSideGrad)" />

        {/* Porte */}
        <rect x="83" y="130" width="34" height="40" rx="17" fill="url(#doorGrad)" />
        <circle cx="112" cy="152" r="2.5" fill="rgba(255,220,100,0.8)" />

        {/* Fenêtre gauche */}
        <rect x="45" y="105" width="30" height="25" rx="4" fill="url(#winGrad)" />
        <line x1="60" y1="105" x2="60" y2="130" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        <line x1="45" y1="117" x2="75" y2="117" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />

        {/* Fenêtre droite */}
        <rect x="125" y="105" width="30" height="25" rx="4" fill="url(#winGrad)" />
        <line x1="140" y1="105" x2="140" y2="130" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        <line x1="125" y1="117" x2="155" y2="117" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />

        {/* Cheminée */}
        <rect x="140" y="55" width="16" height="28" rx="2" fill="#1A3A2A" />
        <rect x="137" y="50" width="22" height="8" rx="3" fill="#2D6235" />

        {/* Fumée */}
        <circle cx="148" cy="42" r="5" fill="rgba(255,255,255,0.2)">
          <animate attributeName="cy" values="42;30;20" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.2;0.1;0" dur="3s" repeatCount="indefinite" />
          <animate attributeName="r" values="5;8;12" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="152" cy="38" r="4" fill="rgba(255,255,255,0.15)">
          <animate attributeName="cy" values="38;26;16" dur="3s" begin="0.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.15;0.08;0" dur="3s" begin="0.5s" repeatCount="indefinite" />
          <animate attributeName="r" values="4;7;10" dur="3s" begin="0.5s" repeatCount="indefinite" />
        </circle>

        {/* Lumière fenêtre animée */}
        <rect x="45" y="105" width="30" height="25" rx="4" fill="rgba(255,220,80,0.15)">
          <animate attributeName="opacity" values="0.15;0.35;0.15" dur="4s" repeatCount="indefinite" />
        </rect>
        <rect x="125" y="105" width="30" height="25" rx="4" fill="rgba(255,220,80,0.1)">
          <animate attributeName="opacity" values="0.1;0.3;0.1" dur="3s" begin="1s" repeatCount="indefinite" />
        </rect>

        {/* Jardin */}
        <rect x="35" y="168" width="130" height="6" rx="3" fill="url(#grassGrad)" />

        {/* Arbres */}
        <ellipse cx="22" cy="150" rx="14" ry="18" fill="url(#treeGrad)" />
        <rect x="19" y="162" width="6" height="10" rx="2" fill="#5D4037" />
        <ellipse cx="180" cy="148" rx="12" ry="15" fill="url(#treeGrad)" />
        <rect x="177" y="158" width="6" height="10" rx="2" fill="#5D4037" />

        {/* Étoiles / lucioles autour */}
        {[...Array(6)].map((_, i) => (
          <circle key={i}
            cx={20 + i * 28}
            cy={20 + (i % 2) * 15}
            r="1.5"
            fill="rgba(255,220,100,0.8)">
            <animate
              attributeName="opacity"
              values={i % 2 === 0 ? "0.8;0.2;0.8" : "0.2;0.8;0.2"}
              dur={`${2 + i * 0.3}s`}
              repeatCount="indefinite" />
          </circle>
        ))}

        <defs>
          <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2D5A3D" />
            <stop offset="100%" stopColor="#1A3A2A" />
          </linearGradient>
          <linearGradient id="sideGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1A3A2A" />
            <stop offset="100%" stopColor="#0F2318" />
          </linearGradient>
          <linearGradient id="roofGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3A7D44" />
            <stop offset="100%" stopColor="#2D6235" />
          </linearGradient>
          <linearGradient id="roofSideGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2D6235" />
            <stop offset="100%" stopColor="#1A4A25" />
          </linearGradient>
          <linearGradient id="doorGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0D2018" />
            <stop offset="100%" stopColor="#050F0C" />
          </linearGradient>
          <linearGradient id="winGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(135,206,250,0.6)" />
            <stop offset="100%" stopColor="rgba(100,180,240,0.3)" />
          </linearGradient>
          <linearGradient id="grassGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2D6235" />
            <stop offset="50%" stopColor="#3A7D44" />
            <stop offset="100%" stopColor="#2D6235" />
          </linearGradient>
          <linearGradient id="treeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4CAF50" />
            <stop offset="100%" stopColor="#2D6235" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

// ── Carte flottante 3D ────────────────────────────────────────
function FloatingCard({ children, delay = 0, style = {} }) {
  return (
    <div style={{
      animation: `float3d ${3 + delay}s ease-in-out infinite`,
      animationDelay: `${delay}s`,
      ...style,
    }}>
      {children}
    </div>
  );
}

const CITIES = ['Cotonou', 'Porto-Novo', 'Parakou', 'Abomey-Calavi', 'Bohicon', 'Natitingou', 'Ouidah', 'Lokossa'];
const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1920&q=80',
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920&q=80',
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1920&q=80',
];

export default function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchCity, setSearchCity] = useState('');
  const [searchType, setSearchType] = useState('');
  const [heroIndex, setHeroIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    const timer = setInterval(() => setHeroIndex(prev => (prev + 1) % HERO_IMAGES.length), 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width - 0.5) * 20,
        y: ((e.clientY - rect.top) / rect.height - 0.5) * 10,
      });
    };
    const hero = heroRef.current;
    hero?.addEventListener('mousemove', handleMouseMove);
    return () => hero?.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await api.get('/listings?limit=6');
        setListings(res.data.listings || []);
      } catch (error) { console.error(error); }
      finally { setLoading(false); }
    };
    fetchListings();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchCity) params.append('city', searchCity);
    if (searchType) params.append('type', searchType);
    navigate(`/annonces?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-paper pb-20 md:pb-0 font-sans">

      <style>{`
        @keyframes float3d {
          0%, 100% { transform: translateY(0px) rotateX(0deg); }
          50% { transform: translateY(-12px) rotateX(2deg); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-60px) rotateY(-10deg); }
          to { opacity: 1; transform: translateX(0) rotateY(0deg); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(60px) rotateY(10deg); }
          to { opacity: 1; transform: translateX(0) rotateY(0deg); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes rotateIn {
          from { opacity: 0; transform: rotate(-10deg) scale(0.8); }
          to { opacity: 1; transform: rotate(0deg) scale(1); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes pulse3d {
          0%, 100% { box-shadow: 0 0 0 0 rgba(58,125,68,0.4); transform: scale(1); }
          50% { box-shadow: 0 0 30px 10px rgba(58,125,68,0.1); transform: scale(1.02); }
        }
        @keyframes moveGradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes typewriter {
          from { width: 0; }
          to { width: 100%; }
        }
          @keyframes kenburns {
          0% { transform: scale(1); }
          100% { transform: scale(1.08); }
        }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        .shimmer-green {
          background: linear-gradient(90deg, #3A7D44, #4ade80, #86efac, #4ade80, #3A7D44);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 4s linear infinite;
        }
        .card-3d {
          transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
          transform-style: preserve-3d;
        }
        .card-3d:hover {
          transform: translateY(-8px) rotateX(5deg) rotateY(2deg);
          box-shadow: 0 20px 60px rgba(0,0,0,0.2), 0 0 0 1px rgba(58,125,68,0.3);
        }


        .btn-3d {
          position: relative;
          transition: transform 0.35s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.35s cubic-bezier(0.23, 1, 0.32, 1);
          transform-style: preserve-3d;
        }
        .btn-3d:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 10px 40px rgba(58,125,68,0.4), 0 0 0 1px rgba(58,125,68,0.5);
        }
        .btn-3d:active {
          transform: translateY(0px) scale(0.96);
          transition: transform 0.1s ease;
        }


        .city-card {
          transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
          transform-style: preserve-3d;
        }
        .city-card:hover {
          transform: translateY(-6px) rotateX(8deg) scale(1.03);
          box-shadow: 0 20px 40px rgba(58,125,68,0.15);
        }
        .hero-text { animation: slideInLeft 1s cubic-bezier(0.23, 1, 0.32, 1) both; }
        .hero-img { animation: slideInRight 1.2s cubic-bezier(0.23, 1, 0.32, 1) 0.3s both; }
        .stat-badge { animation: fadeInUp 0.6s cubic-bezier(0.23, 1, 0.32, 1) both; }
        .perspective-1000 { perspective: 1000px; }
      `}</style>

      <Navbar />

      {/* ══ HERO 3D ════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #050A10 0%, #0A1520 40%, #071210 100%)' }}>

        {/* Images de fond avec parallaxe */}
        <div className="absolute inset-0 z-0">
          {HERO_IMAGES.map((img, i) => (
            <div key={i} className="absolute inset-0"
              style={{
                opacity: heroIndex === i ? 1 : 0,
                transition: 'opacity 1.5s ease',
              }}>
              <img
                src={img}
                alt=""
                className="w-full h-full object-cover"
                style={{
                  transform: `translate(${mousePos.x * 0.02}px, ${mousePos.y * 0.02}px)`,
                  animation: heroIndex === i ? 'kenburns 6s ease-out forwards' : 'none',
                  transition: 'transform 0.1s ease',
                }}
              />
            </div>
          ))}
          {/* Couche 1 — assombrissement directionnel gauche→droite (lisibilité du texte) */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(115deg, rgba(3,7,12,0.95) 0%, rgba(5,10,16,0.82) 35%, rgba(5,10,16,0.55) 65%, rgba(5,10,16,0.35) 100%)' }} />

          {/* Couche 2 — vignette radiale (concentre le regard au centre-gauche) */}
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 20% 40%, rgba(5,10,16,0.3) 0%, transparent 60%)' }} />

          {/* Couche 3 — fondu bas (ancre le texte et la barre de recherche) */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(3,7,12,0.85) 0%, rgba(3,7,12,0.3) 35%, transparent 60%)' }} />

          {/* Couche 4 — fondu haut subtil (intègre la navbar) */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(3,7,12,0.5) 0%, transparent 20%)' }} />

          {/* Couche 5 — teinte verte de marque très légère, cohérence avec le shimmer du titre */}
          <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 15% 85%, rgba(58,125,68,0.12) 0%, transparent 45%)' }} />
        </div>

        {/* Particules 3D */}
        

        {/* Grille futuriste */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1,
          backgroundImage: 'linear-gradient(rgba(58,125,68,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(58,125,68,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        {/* Orbes lumineux */}
        <div className="absolute pointer-events-none" style={{ top: '10%', left: '5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(58,125,68,0.15) 0%, transparent 70%)', zIndex: 1 }} />
        <div className="absolute pointer-events-none" style={{ bottom: '10%', right: '5%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)', zIndex: 1 }} />

        {/* Contenu */}
        <div className="relative w-full max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center" style={{ zIndex: 3 }}>

          {/* Texte gauche */}
          <div className="hero-text">

            {/* Badge animé */}
            <div className="inline-flex items-center gap-2 mb-8"
              style={{ background: 'rgba(58,125,68,0.15)', border: '1px solid rgba(58,125,68,0.3)', backdropFilter: 'blur(10px)', borderRadius: 100, padding: '8px 16px', animation: 'pulse3d 3s ease-in-out infinite' }}>
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-emerald-400 text-sm font-bold">🇧🇯 N°1 de l'immobilier au Bénin</span>
            </div>

            {/* Titre avec effet 3D */}
            <div className="mb-5" style={{ perspective: '1000px' }}>
              <h1 className="font-display font-black" style={{ fontSize: 'clamp(2.8rem, 7vw, 5.5rem)', color: 'white', lineHeight: 1.02, letterSpacing: '-0.03em' }}>
                Trouvez votre
                <span className="block shimmer-green">maison idéale</span>
                <span style={{ color: 'white' }}>au Bénin</span>
              </h1>
            </div>

            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '1.05rem', fontWeight: 400, lineHeight: 1.6, marginBottom: '2.25rem', maxWidth: 420, letterSpacing: '-0.01em' }}>
              Des milliers d'annonces vérifiées, partout au Bénin.
            </p>

            {/* Tabs */}
            <div className="inline-flex mb-5 p-1 rounded-2xl gap-1" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)' }}>
              {[
                { value: '', label: 'Tout voir' },
                { value: 'location', label: '🔑 Location' },
                { value: 'vente', label: '🏷️ Vente' },
              ].map(t => (
                <button key={t.value} onClick={() => setSearchType(t.value)}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300"
                  style={{
                    background: searchType === t.value ? 'white' : 'transparent',
                    color: searchType === t.value ? '#3A7D44' : 'rgba(255,255,255,0.7)',
                    boxShadow: searchType === t.value ? '0 4px 20px rgba(0,0,0,0.2)' : 'none',
                    transform: searchType === t.value ? 'scale(1.02)' : 'scale(1)',
                  }}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* Barre de recherche 3D — glassmorphism */}
            <form onSubmit={handleSearch} className="mb-6 max-w-xl">
              <div
                className="flex flex-col md:flex-row gap-2 p-2 rounded-2xl"
                style={{
                  background: 'rgba(255,255,255,0.12)',
                  backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  boxShadow: '0 25px 70px rgba(0,0,0,0.45)',
                  transition: 'all 0.35s cubic-bezier(0.23,1,0.32,1)',
                }}
                onFocus={(e) => { e.currentTarget.style.border = '1px solid rgba(74,222,128,0.6)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 30px 80px rgba(0,0,0,0.5), 0 0 0 4px rgba(74,222,128,0.12)'; }}
                onBlur={(e) => { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.25)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 25px 70px rgba(0,0,0,0.45)'; }}
              >
                <div className="flex items-center gap-3 flex-1 px-4 py-1">
                  <MapPin size={18} className="text-emerald-400 shrink-0" />
                  <select value={searchCity} onChange={e => setSearchCity(e.target.value)}
                    className="flex-1 text-white text-sm outline-none bg-transparent font-medium py-2"
                    style={{ colorScheme: 'dark' }}>
                    <option value="" style={{ color: '#0F172A' }}>Toutes les villes</option>
                    {CITIES.map(c => <option key={c} value={c} style={{ color: '#0F172A' }}>{c}</option>)}
                  </select>
                </div>
                <button type="submit" className="btn-3d bg-[#3A7D44] hover:bg-[#2D6235] text-white font-bold px-8 py-3.5 rounded-xl flex items-center gap-2 justify-center">
                  <Search size={16} />
                  Rechercher
                </button>
              </div>
            </form>

            {/* Villes populaires */}
            <div className="flex flex-wrap items-center gap-2 mb-8">
              <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>Populaire :</span>
              {['Cotonou', 'Porto-Novo', 'Abomey-Calavi', 'Parakou'].map((city, i) => (
                <button key={city} onClick={() => navigate(`/annonces?city=${city}`)}
                  style={{
                    fontSize: 12, color: 'rgba(255,255,255,0.7)',
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 100, padding: '6px 14px',
                     transition: 'all 0.35s cubic-bezier(0.23,1,0.32,1)',
                    animation: `fadeInUp 0.5s ease ${0.8 + i * 0.1}s both`,
                  }}
                  onMouseEnter={e => { e.target.style.background = 'rgba(58,125,68,0.3)'; e.target.style.borderColor = 'rgba(58,125,68,0.5)'; e.target.style.color = 'white'; }}
                  onMouseLeave={e => { e.target.style.background = 'rgba(255,255,255,0.08)'; e.target.style.borderColor = 'rgba(255,255,255,0.12)'; e.target.style.color = 'rgba(255,255,255,0.7)'; }}>
                  {city}
                </button>
              ))}
            </div>

            {/* Stats inline */}
            <div className="flex items-center gap-6">
              {[
                { value: '500+', label: 'Annonces' },
                { value: '12', label: 'Villes' },
                { value: '1000+', label: 'Utilisateurs' },
              ].map((s, i) => (
                <div key={i} className="stat-badge text-center" style={{ animationDelay: `${1 + i * 0.15}s` }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#4ade80' }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

{/* Visuel droit — Stats premium */}
<div className="hero-img hidden lg:flex flex-col gap-4 items-end justify-center relative">

  {/* Carte principale */}
  <div style={{ background: 'rgba(10,20,15,0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(58,125,68,0.3)', borderRadius: 20, padding: '24px', minWidth: 280 }}>
    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: 8 }}>🏠 Annonces disponibles</div>
    <div style={{ color: '#4ade80', fontSize: 42, fontWeight: 900, lineHeight: 1 }}>500+</div>
    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 4 }}>dans 12 villes du Bénin</div>
    <div style={{ marginTop: 16, display: 'flex', gap: 6 }}>
      {['Cotonou', 'Porto-Novo', 'Parakou'].map(c => (
        <span key={c} style={{ fontSize: 10, background: 'rgba(58,125,68,0.2)', color: '#4ade80', border: '1px solid rgba(58,125,68,0.3)', borderRadius: 100, padding: '4px 10px', fontWeight: 600 }}>
          {c}
        </span>
      ))}
    </div>
  </div>

  {/* Carte satisfaction */}
  <FloatingCard delay={0.5} style={{ alignSelf: 'flex-start' }}>
    <div style={{ background: 'rgba(10,20,15,0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 16, padding: '16px 20px', minWidth: 200 }}>
      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, marginBottom: 6 }}>⭐ Satisfaction clients</div>
      <div style={{ display: 'flex', gap: 2, marginBottom: 4 }}>
        {[...Array(5)].map((_, i) => <span key={i} style={{ color: '#FCD34D', fontSize: 16 }}>★</span>)}
      </div>
      <div style={{ color: 'white', fontSize: 22, fontWeight: 900 }}>98%</div>
    </div>
  </FloatingCard>

  {/* Carte nouvelle annonce */}
  <FloatingCard delay={1}>
    <div style={{ background: 'rgba(10,20,15,0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 16, padding: '14px 18px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80' }} className="animate-pulse" />
        <span style={{ color: '#4ade80', fontSize: 11, fontWeight: 700 }}>EN DIRECT</span>
      </div>
      <div style={{ color: 'white', fontSize: 13, fontWeight: 700, marginTop: 4 }}>🔥 +12 annonces aujourd'hui</div>
    </div>
  </FloatingCard>

  {/* Carte utilisateurs */}
  <FloatingCard delay={1.5} style={{ alignSelf: 'flex-start' }}>
    <div style={{ background: 'rgba(10,20,15,0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 16, padding: '14px 18px' }}>
      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, marginBottom: 4 }}>👥 Utilisateurs actifs</div>
      <div style={{ color: '#a78bfa', fontSize: 24, fontWeight: 900 }}>1 000+</div>
    </div>
  </FloatingCard>
</div>
        </div>

        {/* Indicateurs slider */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2" style={{ zIndex: 5 }}>
          {HERO_IMAGES.map((_, i) => (
            <button key={i} onClick={() => setHeroIndex(i)}
              style={{
                width: heroIndex === i ? 24 : 8, height: 8,
                borderRadius: 100,
                background: heroIndex === i ? '#4ade80' : 'rgba(255,255,255,0.3)',
                border: 'none', cursor: 'pointer',
                transition: 'all 0.3s ease',
              }} />
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 right-8 hidden lg:flex flex-col items-center gap-2" style={{ zIndex: 5 }}>
          <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, letterSpacing: 2, writingMode: 'vertical-rl' }}>SCROLL</div>
          <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, rgba(74,222,128,0.5), transparent)', animation: 'float3d 2s ease-in-out infinite' }} />
        </div>
      </section>

      {/* ══ STATS BAND 3D ══════════════════════════════════════ */}
      <section style={{ background: 'white', borderBottom: '1px solid #E8E8E8', position: 'relative', overflow: 'hidden' }}>
        {/* Fond animé */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(58,125,68,0.02) 0%, transparent 50%, rgba(59,130,246,0.02) 100%)', animation: 'moveGradient 8s ease infinite', backgroundSize: '200% 200%' }} />
        <div className="max-w-5xl mx-auto px-6 py-14 relative z-10">

        </div>
      </section>

      {/* ══ ANNONCES RÉCENTES ══════════════════════════════════ */}
<section className="max-w-7xl mx-auto px-6 py-20">
  <AnimatedSection>
    <div className="flex items-end justify-between mb-10">
      <div>
        <div className="inline-flex items-center gap-2 mb-3 px-3 py-1.5 rounded-full text-xs font-bold"
          style={{ background: 'rgba(58,125,68,0.1)', color: '#3A7D44', border: '1px solid rgba(58,125,68,0.2)' }}>
          <Zap size={12} />
          Nouvelles annonces
        </div>
        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 900, color: '#0F172A', lineHeight: 1.1 }}>
          Annonces récentes
        </h2>
        <p style={{ color: '#64748B', marginTop: 8 }}>Les dernières propriétés disponibles au Bénin</p>
      </div>
      <Link to="/annonces" className="hidden md:flex items-center gap-2 font-bold text-sm btn-3d px-5 py-2.5 rounded-xl"
        style={{ color: '#3A7D44', background: 'rgba(58,125,68,0.08)', border: '1px solid rgba(58,125,68,0.2)' }}>
        Voir tout <ArrowRight size={16} />
      </Link>
    </div>
  </AnimatedSection>

{loading ? (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
    </div>
  ) : listings.length > 0 ? (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing, i) => (
          <AnimatedSection key={listing.id} delay={i * 80}>
            <div className="card-3d">
              <ListingCard listing={listing} />
            </div>
          </AnimatedSection>
        ))}
      </div>

      {/* Bouton "Voir tout" — mobile uniquement */}
      <Link to="/annonces" className="md:hidden flex items-center justify-center gap-2 font-bold text-sm px-5 py-3.5 rounded-xl mt-6"
        style={{ color: '#3A7D44', background: 'rgba(58,125,68,0.08)', border: '1px solid rgba(58,125,68,0.2)' }}>
        Voir toutes les annonces <ArrowRight size={16} />
      </Link>
    </>
  ) : (
    <div className="text-center py-20" style={{ color: '#94A3B8' }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🏠</div>
      <p style={{ fontSize: 18, fontWeight: 600 }}>Aucune annonce pour le moment</p>
    </div>
  )}
</section>

      {/* ══ POURQUOI LOGEZY 3D ═════════════════════════════════ */}
      <section style={{ padding: '80px 24px', background: 'linear-gradient(135deg, #0A1520 0%, #071210 50%, #0A1520 100%)', position: 'relative', overflow: 'hidden' }}>
        {/* Effet de fond */}
        <div style={{ position: 'absolute', top: '20%', left: '10%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(58,125,68,0.15) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', bottom: '20%', right: '10%', width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)', filter: 'blur(60px)' }} />

        {/* Grille */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(58,125,68,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(58,125,68,0.04) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

        <div className="max-w-6xl mx-auto relative z-10">
          <AnimatedSection className="text-center mb-14">
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full text-xs font-bold"
              style={{ background: 'rgba(58,125,68,0.15)', color: '#4ade80', border: '1px solid rgba(58,125,68,0.3)' }}>
              <CheckCircle size={12} />
              Pourquoi nous choisir
            </div>
            <h2 className="shimmer-green" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 900, marginBottom: 12 }}>
              La référence immobilière au Bénin
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', maxWidth: 500, margin: '0 auto', fontSize: '1.05rem' }}>
              Logezy vous offre une expérience immobilière unique, sécurisée et transparente
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '🛡️', title: 'Annonces vérifiées', desc: 'Chaque annonce est contrôlée par notre équipe avant publication pour garantir fiabilité et sécurité.', color: '#3A7D44', glow: 'rgba(58,125,68,0.15)', border: 'rgba(58,125,68,0.3)', tag: 'SÉCURITÉ' },
              { icon: '🔍', title: 'Recherche avancée', desc: 'Filtrez par ville, type, prix, chambres, superficie. Trouvez exactement ce que vous cherchez.', color: '#3B82F6', glow: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.3)', tag: 'EFFICACITÉ' },
              { icon: '📊', title: 'Marché transparent', desc: "Accédez aux prix réels du marché béninois pour prendre des décisions d'investissement éclairées.", color: '#F59E0B', glow: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.3)', tag: 'TRANSPARENCE' },
            ].map((item, i) => (
              <AnimatedSection key={i} delay={i * 150}>
                <div className="card-3d h-full p-6 rounded-2xl"
                  style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${item.border}`, backdropFilter: 'blur(10px)' }}
                  onMouseEnter={e => e.currentTarget.style.background = `${item.glow}`}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}>
                  <div style={{ fontSize: 40, marginBottom: 16, animation: `float3d ${3 + i}s ease-in-out infinite` }}>{item.icon}</div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: item.color, letterSpacing: 2, marginBottom: 8 }}>{item.tag}</div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white', marginBottom: 10 }}>{item.title}</h3>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ══ VILLES 3D ══════════════════════════════════════════ */}
      <section style={{ padding: '80px 24px', background: '#F8F9FA' }}>
        <div className="max-w-6xl mx-auto">
          <AnimatedSection className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full text-xs font-bold"
              style={{ background: 'rgba(58,125,68,0.1)', color: '#3A7D44', border: '1px solid rgba(58,125,68,0.2)' }}>
              <MapPin size={12} />
              Partout au Bénin
            </div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 900, color: '#0F172A', marginBottom: 8 }}>
              Explorez par ville
            </h2>
            <p style={{ color: '#64748B' }}>Des annonces disponibles dans toutes les grandes villes du Bénin</p>
          </AnimatedSection>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { city: 'Cotonou', emoji: '🏙️', desc: 'Capitale économique', color: '#3A7D44' },
              { city: 'Porto-Novo', emoji: '🏛️', desc: 'Capitale officielle', color: '#3B82F6' },
              { city: 'Abomey-Calavi', emoji: '🌿', desc: 'Ville universitaire', color: '#10B981' },
              { city: 'Parakou', emoji: '🌍', desc: 'Capitale du Nord', color: '#F59E0B' },
              { city: 'Bohicon', emoji: '🏘️', desc: 'Carrefour commercial', color: '#8B5CF6' },
              { city: 'Ouidah', emoji: '⛱️', desc: 'Ville historique', color: '#EF4444' },
              { city: 'Natitingou', emoji: '🏔️', desc: "Perle de l'Atacora", color: '#06B6D4' },
              { city: 'Lokossa', emoji: '🌾', desc: 'Ville du Mono', color: '#F97316' },
            ].map((item, i) => (
              <AnimatedSection key={item.city} delay={i * 60}>
                <button onClick={() => navigate(`/annonces?city=${item.city}`)}
                  className="city-card w-full text-left p-4 rounded-2xl"
                  style={{ background: 'white', border: '1px solid #E8E8E8' }}>
                  <div style={{ fontSize: 28, marginBottom: 8, animation: `float3d ${3 + i * 0.3}s ease-in-out infinite` }}>{item.emoji}</div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#0F172A', marginBottom: 2 }}>{item.city}</div>
                  <div style={{ fontSize: 11, color: '#94A3B8' }}>{item.desc}</div>
                  <div style={{ marginTop: 8, width: 20, height: 2, borderRadius: 1, background: item.color, transition: 'width 0.3s ease' }}
                    onMouseEnter={e => e.target.style.width = '100%'}
                    onMouseLeave={e => e.target.style.width = '20px'} />
                </button>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA FINAL 3D ═══════════════════════════════════════ */}
      <section style={{ padding: '100px 24px', background: 'linear-gradient(135deg, #050A10 0%, #071210 50%, #050A10 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(58,125,68,0.12) 0%, transparent 70%)', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(58,125,68,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(58,125,68,0.03) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        <AnimatedSection className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full text-xs font-bold"
            style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)' }}>
            🇧🇯 Logezy — Votre logement facile
          </div>

          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, color: 'white', lineHeight: 1.1, marginBottom: 20 }}>
            Votre prochaine maison
            <span className="block shimmer-green">vous attend ici</span>
          </h2>

          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.1rem', marginBottom: 40, maxWidth: 480, margin: '0 auto 40px' }}>
            Des milliers d'annonces vérifiées vous attendent. Commencez votre recherche maintenant.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/annonces" className="btn-3d font-bold px-8 py-4 rounded-2xl inline-flex items-center gap-2 justify-center"
              style={{ background: '#3A7D44', color: 'white', boxShadow: '0 0 40px rgba(58,125,68,0.4)' }}>
              Parcourir les annonces <ArrowRight size={18} />
            </Link>
            <Link to="/register" className="btn-3d font-bold px-8 py-4 rounded-2xl inline-flex items-center gap-2 justify-center"
              style={{ background: 'rgba(255,255,255,0.08)', color: 'white', border: '1px solid rgba(255,255,255,0.15)' }}>
              Créer un compte gratuit
            </Link>
          </div>
        </AnimatedSection>
      </section>

      {/* ══ FOOTER ═════════════════════════════════════════════ */}
      <footer style={{ background: '#030810', color: 'white', padding: '56px 24px' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            <div className="md:col-span-2">
              <Logo size="md" white />
              <p style={{ color: '#475569', fontSize: 14, marginTop: 16, maxWidth: 280, lineHeight: 1.7 }}>
                La plateforme immobilière de référence au Bénin. Trouvez, louez ou vendez en toute confiance.
              </p>
              <div className="flex items-center gap-3 mt-5">
                <a href="https://www.facebook.com/LogezyImmobilierDigitale" target="_blank"
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-sm transition-all font-bold"
                  style={{ background: 'rgba(255,255,255,0.05)', color: 'white' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#3A7D44'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
                  f
                </a>
                <a href="https://wa.me/22901908212" target="_blank"
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-sm transition-all font-bold"
                  style={{ background: 'rgba(255,255,255,0.05)', color: 'white' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#25D366'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
                  w
                </a>
              </div>
            </div>
            <div>
              <h4 style={{ fontWeight: 700, fontSize: 14, color: 'white', marginBottom: 16 }}>Navigation</h4>
              <div className="space-y-2.5">
                {[
                  { to: '/annonces', label: 'Toutes les annonces' },
                  { to: '/annonces?type=location', label: 'Location' },
                  { to: '/annonces?type=vente', label: 'Vente' },
                ].map(link => (
                  <Link key={link.to} to={link.to}
                    className="flex items-center gap-1.5 text-sm transition-colors group"
                    style={{ color: '#475569' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'white'}
                    onMouseLeave={e => e.currentTarget.style.color = '#475569'}>
                    <ChevronRight size={12} />
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h4 style={{ fontWeight: 700, fontSize: 14, color: 'white', marginBottom: 16 }}>À propos</h4>
              <div className="space-y-2.5">
                {[
                  { to: '/a-propos', label: 'À propos de nous' },
                  { to: '/contact', label: 'Nous contacter' },
                  { to: '/comment-ca-marche', label: 'Comment ça marche' },
                  { to: '/confidentialite', label: 'Confidentialité' },
                  { to: '/conditions', label: "Conditions d'utilisation" },
                ].map(link => (
                  <Link key={link.to} to={link.to}
                    className="flex items-center gap-1.5 text-sm transition-colors"
                    style={{ color: '#475569' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'white'}
                    onMouseLeave={e => e.currentTarget.style.color = '#475569'}>
                    <ChevronRight size={12} />
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <p style={{ color: '#334155', fontSize: 14 }}>© 2026 Logezy — Tous droits réservés.</p>
            <p style={{ color: '#334155', fontSize: 14 }}>Made in Bénin 🇧🇯</p>
          </div>
        </div>
      </footer>
    </div>
  );
}