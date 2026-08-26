import { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Shield, TrendingUp, ArrowRight, CheckCircle, ChevronRight, Zap, Star, Play, Phone, Mail, Home as HomeIcon, Key, Tag, Flame, Users } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import ListingCard from '../components/common/ListingCard';
import Logo from '../components/common/Logo';
import api from '../lib/axios';
import useAuthStore from '../store/authStore';
import SkeletonCard from '../components/common/SkeletonCard';
import { LISTING_CATEGORIES } from '../data/listingCategories';

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

        .category-card {
          transition: transform 0.4s cubic-bezier(0.23,1,0.32,1), box-shadow 0.4s cubic-bezier(0.23,1,0.32,1), border-color 0.4s ease;
        }
        .category-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 32px -8px rgba(15,23,42,0.12);
          border-color: rgba(58,125,68,0.3) !important;
        }
        .category-card:hover .category-arrow {
          transform: translateX(3px);
        }

        .city-card {
          transition: transform 0.45s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.45s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .city-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 24px 48px -12px rgba(15,23,42,0.25);
        }
        .city-card:hover .h-\\[2px\\] {
          width: 48px !important;
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
          <div className="absolute inset-0" style={{ background: 'linear-gradient(115deg, rgba(3,7,12,0.95) 0%, rgba(5,10,16,0.82) 35%, rgba(5,10,16,0.55) 65%, rgba(5,10,16,0.35) 100%)' }} />
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 20% 40%, rgba(5,10,16,0.3) 0%, transparent 60%)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(3,7,12,0.85) 0%, rgba(3,7,12,0.3) 35%, transparent 60%)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(3,7,12,0.5) 0%, transparent 20%)' }} />
          <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 15% 85%, rgba(58,125,68,0.12) 0%, transparent 45%)' }} />
        </div>

        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1,
          backgroundImage: 'linear-gradient(rgba(58,125,68,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(58,125,68,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        <div className="absolute pointer-events-none" style={{ top: '10%', left: '5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(58,125,68,0.15) 0%, transparent 70%)', zIndex: 1 }} />
        <div className="absolute pointer-events-none" style={{ bottom: '10%', right: '5%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)', zIndex: 1 }} />

        <div className="relative w-full max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center" style={{ zIndex: 3 }}>

          <div className="hero-text">

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
                { value: '', label: 'Tout voir', icon: null },
                { value: 'location', label: 'Location', icon: Key },
                { value: 'vente', label: 'Vente', icon: Tag },
              ].map(t => (
                <button key={t.value} onClick={() => setSearchType(t.value)}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300"
                  style={{
                    background: searchType === t.value ? 'white' : 'transparent',
                    color: searchType === t.value ? '#3A7D44' : 'rgba(255,255,255,0.7)',
                    boxShadow: searchType === t.value ? '0 4px 20px rgba(0,0,0,0.2)' : 'none',
                    transform: searchType === t.value ? 'scale(1.02)' : 'scale(1)',
                  }}>
                  {t.icon && <t.icon size={14} strokeWidth={2.5} />}
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

            <FloatingCard delay={0.5} style={{ alignSelf: 'flex-start' }}>
              <div style={{ background: 'rgba(10,20,15,0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 16, padding: '16px 20px', minWidth: 200 }}>
                <div className="flex items-center gap-1.5" style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, marginBottom: 6 }}>
                  <Star size={12} /> Satisfaction clients
                </div>
                <div style={{ display: 'flex', gap: 2, marginBottom: 4 }}>
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#FCD34D" color="#FCD34D" />)}
                </div>
                <div style={{ color: 'white', fontSize: 22, fontWeight: 900 }}>98%</div>
              </div>
            </FloatingCard>

            <FloatingCard delay={1}>
              <div style={{ background: 'rgba(10,20,15,0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 16, padding: '14px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80' }} className="animate-pulse" />
                  <span style={{ color: '#4ade80', fontSize: 11, fontWeight: 700 }}>EN DIRECT</span>
                </div>
                <div className="flex items-center gap-1.5" style={{ color: 'white', fontSize: 13, fontWeight: 700, marginTop: 4 }}>
                  <Flame size={14} className="text-orange-400" />
                  +12 annonces aujourd'hui
                </div>
              </div>
            </FloatingCard>

            <FloatingCard delay={1.5} style={{ alignSelf: 'flex-start' }}>
              <div style={{ background: 'rgba(10,20,15,0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 16, padding: '14px 18px' }}>
                <div className="flex items-center gap-1.5" style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, marginBottom: 4 }}>
                  <Users size={12} /> Utilisateurs actifs
                </div>
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

        <div className="absolute bottom-10 right-8 hidden lg:flex flex-col items-center gap-2" style={{ zIndex: 5 }}>
          <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, letterSpacing: 2, writingMode: 'vertical-rl' }}>SCROLL</div>
          <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, rgba(74,222,128,0.5), transparent)', animation: 'float3d 2s ease-in-out infinite' }} />
        </div>
      </section>

      {/* ══ STATS BAND 3D ══════════════════════════════════════ */}
      <section style={{ background: 'white', borderBottom: '1px solid #E8E8E8', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(58,125,68,0.02) 0%, transparent 50%, rgba(59,130,246,0.02) 100%)', animation: 'moveGradient 8s ease infinite', backgroundSize: '200% 200%' }} />
        <div className="max-w-5xl mx-auto px-6 py-14 relative z-10">
        </div>
      </section>

            {/* ══ CATÉGORIES ═════════════════════════════════════════ */}
      <section style={{ padding: '80px 24px', background: '#F8F9FA' }}>
        <div className="max-w-6xl mx-auto">
          <AnimatedSection className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full text-xs font-bold"
              style={{ background: 'rgba(58,125,68,0.1)', color: '#3A7D44', border: '1px solid rgba(58,125,68,0.2)' }}>
              <HomeIcon size={12} />
              Que cherchez-vous ?
            </div>
            <h2 className="font-display" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 900, color: '#0F172A', marginBottom: 8 }}>
              Trouvez par type de bien
            </h2>
            <p style={{ color: '#64748B' }}>Villa, appartement, terrain... affinez votre recherche en un clic</p>
          </AnimatedSection>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {LISTING_CATEGORIES.map((cat, i) => (
              <AnimatedSection key={cat.value} delay={i * 60}>
                <button
                  onClick={() => navigate(`/annonces?category=${cat.value}`)}
                  className="category-card w-full text-left p-5 rounded-2xl bg-white"
                  style={{ border: '1px solid #E8E8E8' }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                    style={{ background: '#EBF5ED' }}
                  >
                    <cat.icon size={22} className="text-[#3A7D44]" strokeWidth={2} />
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: '#0F172A' }}>{cat.label}</div>
                  <div className="flex items-center gap-1 mt-2 text-xs font-semibold" style={{ color: '#3A7D44' }}>
                    Voir les annonces
                    <ArrowRight size={12} className="category-arrow transition-transform duration-300" />
                  </div>
                </button>
              </AnimatedSection>
            ))}
          </div>
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
              <h2 className="font-display" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 900, color: '#0F172A', lineHeight: 1.1 }}>
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
                  <ListingCard listing={listing} />
                </AnimatedSection>
              ))}
            </div>

            <Link to="/annonces" className="md:hidden flex items-center justify-center gap-2 font-bold text-sm px-5 py-3.5 rounded-xl mt-6"
              style={{ color: '#3A7D44', background: 'rgba(58,125,68,0.08)', border: '1px solid rgba(58,125,68,0.2)' }}>
              Voir toutes les annonces <ArrowRight size={16} />
            </Link>
          </>
        ) : (
          <div className="text-center py-20" style={{ color: '#94A3B8' }}>
            <HomeIcon size={56} className="mx-auto mb-4" strokeWidth={1.5} />
            <p style={{ fontSize: 18, fontWeight: 600 }}>Aucune annonce pour le moment</p>
          </div>
        )}
      </section>

      {/* ══ POURQUOI LOGEZY 3D ═════════════════════════════════ */}
      <section style={{ padding: '80px 24px', background: 'linear-gradient(135deg, #0A1520 0%, #071210 50%, #0A1520 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '20%', left: '10%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(58,125,68,0.15) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', bottom: '20%', right: '10%', width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(58,125,68,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(58,125,68,0.04) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

        <div className="max-w-6xl mx-auto relative z-10">
          <AnimatedSection className="text-center mb-14">
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full text-xs font-bold"
              style={{ background: 'rgba(58,125,68,0.15)', color: '#4ade80', border: '1px solid rgba(58,125,68,0.3)' }}>
              <CheckCircle size={12} />
              Pourquoi nous choisir
            </div>
            <h2 className="shimmer-green font-display" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 900, marginBottom: 12 }}>
              La référence immobilière au Bénin
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', maxWidth: 500, margin: '0 auto', fontSize: '1.05rem' }}>
              Logezy vous offre une expérience immobilière unique, sécurisée et transparente
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: 'Annonces vérifiées', desc: 'Chaque annonce est contrôlée par notre équipe avant publication pour garantir fiabilité et sécurité.', color: '#3A7D44', glow: 'rgba(58,125,68,0.08)', border: 'rgba(58,125,68,0.25)', tag: 'SÉCURITÉ' },
              { icon: Search, title: 'Recherche avancée', desc: 'Filtrez par ville, type, prix, chambres, superficie. Trouvez exactement ce que vous cherchez.', color: '#3B82F6', glow: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.25)', tag: 'EFFICACITÉ' },
              { icon: TrendingUp, title: 'Marché transparent', desc: "Accédez aux prix réels du marché béninois pour prendre des décisions d'investissement éclairées.", color: '#F59E0B', glow: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.25)', tag: 'TRANSPARENCE' },
            ].map((item, i) => (
              <AnimatedSection key={i} delay={i * 150}>
                <div className="h-full p-6 rounded-2xl"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: `1px solid ${item.border}`,
                    backdropFilter: 'blur(10px)',
                    transition: 'background 0.4s cubic-bezier(0.23,1,0.32,1), transform 0.4s cubic-bezier(0.23,1,0.32,1)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = item.glow; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: item.glow, animation: `float3d ${3 + i}s ease-in-out infinite` }}>
                    <item.icon size={26} color={item.color} strokeWidth={2} />
                  </div>
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
            <h2 className="font-display" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 900, color: '#0F172A', marginBottom: 8 }}>
              Explorez par ville
            </h2>
            <p style={{ color: '#64748B' }}>Des annonces disponibles dans toutes les grandes villes du Bénin</p>
          </AnimatedSection>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { city: 'Cotonou', desc: 'Capitale économique', image: 'https://images.unsplash.com/photo-1753818268536-b3227488c3f8?w=600&q=80&auto=format&fit=crop' },
              { city: 'Porto-Novo', desc: 'Capitale officielle', image: 'https://images.unsplash.com/photo-1600241005059-71de13374958?w=600&q=80&auto=format&fit=crop' },
              { city: 'Abomey-Calavi', desc: 'Ville universitaire', image: 'https://www.gouv.bj/upload/images/banners/790640216943001733641533.jpg' },
              { city: 'Parakou', desc: 'Capitale du Nord', image: 'https://images.unsplash.com/photo-1646459273661-66884c54f2f1?w=600&q=80&auto=format&fit=crop' },
              { city: 'Bohicon', desc: 'Carrefour commercial', image: 'https://images.unsplash.com/photo-1772965243005-b64da960038c?w=600&q=80&auto=format&fit=crop' },
              { city: 'Ouidah', desc: 'Ville historique', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Porte_du_non-retour_au_Benin.jpg?width=600' },
              { city: 'Natitingou', desc: "Perle de l'Atacora", image: 'https://images.unsplash.com/photo-1684860078704-5b07ac577c2e?w=600&q=80&auto=format&fit=crop' },
              { city: 'Lokossa', desc: 'Ville du Mono', image: 'https://images.unsplash.com/photo-1684860085919-968e99ba0337?w=600&q=80&auto=format&fit=crop' },
            ].map((item, i) => (
              <AnimatedSection key={item.city} delay={i * 60}>
                <button
                  onClick={() => navigate(`/annonces?city=${item.city}`)}
                  className="city-card group relative w-full text-left rounded-2xl overflow-hidden h-44"
                  style={{ boxShadow: '0 1px 3px rgba(15,23,42,0.08)' }}
                >
                  <img
                    src={item.image}
                    alt={item.city}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(to top, rgba(5,10,16,0.92) 0%, rgba(5,10,16,0.45) 55%, rgba(5,10,16,0.05) 100%)' }}
                  />
                  <div className="absolute inset-0 flex flex-col justify-end p-4">
                    <div className="text-white font-bold text-base mb-0.5" style={{ letterSpacing: '-0.01em' }}>
                      {item.city}
                    </div>
                    <div className="text-white/70 text-xs font-medium">{item.desc}</div>
                    <div
                      className="mt-2 h-[2px] rounded-full bg-[#4ade80] transition-all duration-500"
                      style={{ width: 24 }}
                    />
                  </div>
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

          <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, color: 'white', lineHeight: 1.1, marginBottom: 20 }}>
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
      <footer style={{ background: '#030810', color: 'white', padding: '56px 24px 32px' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            <div className="md:col-span-2">
              <Logo size="md" white />
              <p style={{ color: '#64748B', fontSize: 14, marginTop: 16, maxWidth: 320, lineHeight: 1.7 }}>
                La plateforme immobilière de référence au Bénin. Trouvez, louez ou vendez en toute confiance.
              </p>

              <div className="mt-5 space-y-2">
                <a href="tel:+2290190821282" className="flex items-center gap-2 text-sm transition-colors"
                  style={{ color: '#64748B' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'white'}
                  onMouseLeave={e => e.currentTarget.style.color = '#64748B'}>
                  <Phone size={14} /> +229 01 90 82 12 82
                </a>
                <a href="mailto:logezyafrique@gmail.com" className="flex items-center gap-2 text-sm transition-colors"
                  style={{ color: '#64748B' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'white'}
                  onMouseLeave={e => e.currentTarget.style.color = '#64748B'}>
                  <Mail size={14} /> logezyafrique@gmail.com
                </a>
              </div>

              <div className="flex items-center gap-3 mt-5">
                <a href="https://www.facebook.com/LogezyImmobilierDigitale" target="_blank" rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
                  style={{ background: 'rgba(255,255,255,0.06)', color: 'white' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#3A7D44'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/></svg>
                </a>
                <a href="https://wa.me/22901908212" target="_blank" rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
                  style={{ background: 'rgba(255,255,255,0.06)', color: 'white' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#25D366'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.44.79 3.06 1.2 4.72 1.2h.02c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2m0 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 012.41 5.82c0 4.54-3.7 8.23-8.24 8.23-1.48 0-2.93-.4-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.188 8.188 0 01-1.26-4.38c.01-4.54 3.7-8.23 8.25-8.23m-4.83 4.72c-.15 0-.4.06-.61.29-.21.24-.8.79-.8 1.92 0 1.13.82 2.22.94 2.38.11.15 1.6 2.52 3.97 3.44 1.97.76 2.37.61 2.79.57.43-.04 1.38-.56 1.58-1.11.19-.54.19-1.01.14-1.11-.06-.1-.21-.16-.44-.27-.24-.12-1.38-.68-1.6-.76-.21-.08-.37-.12-.53.12-.16.24-.6.76-.74.91-.13.16-.27.18-.5.06-.24-.12-1-.37-1.9-1.18-.7-.62-1.18-1.39-1.31-1.63-.14-.24-.01-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.31-.02-.43-.06-.12-.53-1.32-.74-1.8-.19-.47-.39-.4-.53-.41-.14-.01-.29-.01-.44-.01"/></svg>
                </a>
                <a href="https://www.linkedin.com/in/miracle-lohounme-293366379" target="_blank" rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
                  style={{ background: 'rgba(255,255,255,0.06)', color: 'white' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#0A66C2'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.14 1.44-2.14 2.94v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.59 0 4.26 2.37 4.26 5.45v6.29zM5.34 7.43a2.06 2.06 0 110-4.12 2.06 2.06 0 010 4.12zM7.12 20.45H3.56V9h3.56v11.45z"/></svg>
                </a>
              </div>
            </div>

            <div>
              <h4 style={{ fontWeight: 700, fontSize: 14, color: 'white', marginBottom: 16 }}>Annonces</h4>
              <div className="space-y-2.5">
                {[
                  { to: '/annonces', label: 'Toutes les annonces' },
                  { to: '/annonces?type=location', label: 'Location' },
                  { to: '/annonces?type=vente', label: 'Vente' },
                  { to: '/agences', label: 'Agences' },
                ].map(link => (
                  <Link key={link.to} to={link.to}
                    className="flex items-center gap-1.5 text-sm transition-colors"
                    style={{ color: '#64748B' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'white'}
                    onMouseLeave={e => e.currentTarget.style.color = '#64748B'}>
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
                    style={{ color: '#64748B' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'white'}
                    onMouseLeave={e => e.currentTarget.style.color = '#64748B'}>
                    <ChevronRight size={12} />
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <p style={{ color: '#475569', fontSize: 13 }}>© 2026 Logezy — Tous droits réservés.</p>
            <p style={{ color: '#475569', fontSize: 13 }}>Made in Bénin 🇧🇯</p>
          </div>
        </div>
      </footer>
    </div>
  );
}