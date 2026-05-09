import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Shield, TrendingUp, Star, ArrowRight, HomeIcon, Users, Building } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import ListingCard from '../components/common/ListingCard';
import Logo from '../components/common/Logo';
import api from '../lib/axios';

// Hook pour les animations au scroll
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

// Composant section animée
function AnimatedSection({ children, className = '' }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} className={`transition-all duration-700 ${
      inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    } ${className}`}>
      {children}
    </div>
  );
}

// Compteur animé
function Counter({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView();

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / 50;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 30);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

const CITIES = ['Cotonou', 'Porto-Novo', 'Parakou', 'Abomey-Calavi', 'Bohicon', 'Natitingou', 'Ouidah', 'Lokossa'];

export default function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchCity, setSearchCity] = useState('');
  const [searchType, setSearchType] = useState('');
  const [activeType, setActiveType] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await api.get('/listings?limit=6');
        setListings(res.data.listings || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
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
    <div className="min-h-screen bg-[#F5F5F7] pb-20 md:pb-0">
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative bg-[#2D3A8C] overflow-hidden">
        {/* Motif décoratif */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-[#E8472A] blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-white blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full text-white text-sm font-medium mb-8 animate-fade-in">
              <span className="w-2 h-2 bg-[#E8472A] rounded-full animate-pulse" />
              🇧🇯 N°1 de l'immobilier au Bénin
            </div>

            {/* Titre */}
            <h1 className="font-display text-4xl md:text-6xl font-black text-white mb-6 leading-tight animate-slide-up">
              Trouvez votre
              <span className="text-[#E8472A]"> maison idéale</span>
              <br />au Bénin
            </h1>

            <p className="text-white/70 text-lg mb-10 max-w-xl mx-auto animate-fade-in">
              Des milliers d'annonces vérifiées à louer ou à acheter partout au Bénin.
            </p>

            {/* Tabs Location/Vente */}
            <div className="inline-flex bg-white/10 backdrop-blur rounded-btn p-1 mb-6">
              {[
                { value: '', label: 'Tout' },
                { value: 'location', label: '🔑 Location' },
                { value: 'vente', label: '🏷️ Vente' },
              ].map(t => (
                <button
                  key={t.value}
                  onClick={() => setSearchType(t.value)}
                  className={`px-5 py-2 rounded-btn text-sm font-bold transition-all ${
                    searchType === t.value
                      ? 'bg-white text-[#2D3A8C]'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Barre de recherche */}
            <form onSubmit={handleSearch} className="bg-white rounded-2xl p-2 flex flex-col md:flex-row gap-2 shadow-2xl animate-scale-in">
              <div className="flex items-center gap-2 flex-1 px-3">
                <MapPin size={18} className="text-[#E8472A] shrink-0" />
                <select
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  className="flex-1 text-[#0F172A] text-sm outline-none py-2 bg-transparent"
                >
                  <option value="">Toutes les villes</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="w-px bg-[#E2E8F0] hidden md:block" />
              <button type="submit" className="btn-accent flex items-center gap-2 justify-center px-8 py-3">
                <Search size={16} />
                Rechercher
              </button>
            </form>

            {/* Recherches populaires */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
              <span className="text-white/50 text-xs">Populaire :</span>
              {['Cotonou', 'Porto-Novo', 'Abomey-Calavi', 'Parakou'].map(city => (
                <button
                  key={city}
                  onClick={() => { setSearchCity(city); navigate(`/annonces?city=${city}`); }}
                  className="text-xs text-white/70 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full transition-all"
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────── */}
      <section className="bg-white border-b border-[#E2E8F0]">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { target: 500, suffix: '+', label: 'Annonces actives', icon: <HomeIcon size={24} className="text-[#2D3A8C]" /> },
              { target: 12, suffix: '', label: 'Villes couvertes', icon: <MapPin size={24} className="text-[#E8472A]" /> },
              { target: 1000, suffix: '+', label: 'Utilisateurs', icon: <Users size={24} className="text-[#2D3A8C]" /> },
              { target: 98, suffix: '%', label: 'Satisfaction', icon: <Star size={24} className="text-[#E8472A]" /> },
            ].map((stat, i) => (
              <AnimatedSection key={i}>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-2xl bg-[#F5F5F7] flex items-center justify-center">
                    {stat.icon}
                  </div>
                  <div className="font-display font-black text-3xl text-[#0F172A]">
                    <Counter target={stat.target} suffix={stat.suffix} />
                  </div>
                  <div className="text-xs text-[#64748B] font-medium">{stat.label}</div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── ANNONCES RÉCENTES ─────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <AnimatedSection>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-3xl font-bold text-[#0F172A]">
                Annonces récentes
              </h2>
              <p className="text-[#64748B] text-sm mt-1">
                Les dernières propriétés disponibles
              </p>
            </div>
            <Link to="/annonces" className="btn-secondary text-sm px-4 py-2 flex items-center gap-2 hidden md:flex">
              Voir tout <ArrowRight size={14} />
            </Link>
          </div>
        </AnimatedSection>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card h-72 animate-pulse" />
            ))}
          </div>
        ) : listings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing, i) => (
              <AnimatedSection key={listing.id}>
                <ListingCard listing={listing} />
              </AnimatedSection>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-[#94A3B8]">
            <span className="text-5xl block mb-4">🏠</span>
            <p>Aucune annonce disponible pour le moment.</p>
          </div>
        )}

        <div className="text-center mt-8 md:hidden">
          <Link to="/annonces" className="btn-primary inline-flex items-center gap-2">
            Voir toutes les annonces <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ── POURQUOI LOGEZY ───────────────────────────────── */}
      <section className="bg-white py-16 px-6 border-t border-[#E2E8F0]">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-[#0F172A] mb-3">
              Pourquoi choisir Logezy ?
            </h2>
            <p className="text-[#64748B] max-w-xl mx-auto">
              La plateforme immobilière de confiance au Bénin
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Shield size={28} className="text-[#2D3A8C]" />,
                title: 'Annonces vérifiées',
                desc: 'Chaque annonce est contrôlée par notre équipe pour garantir la fiabilité et la sécurité.',
                bg: 'bg-[#EEF0FB]',
              },
              {
                icon: <Search size={28} className="text-[#E8472A]" />,
                title: 'Recherche avancée',
                desc: 'Filtrez par ville, prix, nombre de chambres, superficie et bien plus encore.',
                bg: 'bg-[#FDF0ED]',
              },
              {
                icon: <TrendingUp size={28} className="text-[#2D3A8C]" />,
                title: 'Marché transparent',
                desc: 'Accédez aux prix du marché et prenez des décisions éclairées pour votre investissement.',
                bg: 'bg-[#EEF0FB]',
              },
            ].map((item, i) => (
              <AnimatedSection key={i}>
                <div className="card-hover p-6">
                  <div className={`w-14 h-14 ${item.bg} rounded-2xl flex items-center justify-center mb-4`}>
                    {item.icon}
                  </div>
                  <h3 className="font-display font-bold text-[#0F172A] mb-2 text-lg">{item.title}</h3>
                  <p className="text-sm text-[#64748B] leading-relaxed">{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="relative bg-[#2D3A8C] py-16 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#E8472A] blur-3xl" />
        </div>
        <AnimatedSection className="relative max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Vous avez un bien à louer ou à vendre ?
          </h2>
          <p className="text-white/70 mb-8 max-w-lg mx-auto">
            Publiez votre annonce gratuitement et touchez des milliers d'acheteurs et locataires potentiels.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/register" className="btn-accent inline-flex items-center gap-2 justify-center px-8 py-4">
              Publier une annonce <ArrowRight size={16} />
            </Link>
            <Link to="/annonces" className="bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-4 rounded-btn transition-all inline-flex items-center gap-2 justify-center">
              Parcourir les annonces
            </Link>
          </div>
        </AnimatedSection>
      </section>

      {/* ── FOOTER ────────────────────────────────────────── */}
      <footer className="bg-[#0F172A] text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <Logo size="md" white />
              <p className="text-[#64748B] text-sm mt-3 max-w-xs leading-relaxed">
                La plateforme immobilière de référence au Bénin. Trouvez, louez ou vendez en toute confiance.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-3">Navigation</h4>
              <div className="space-y-2">
                {[
                  { to: '/annonces', label: 'Annonces' },
                  { to: '/annonces?type=location', label: 'Location' },
                  { to: '/annonces?type=vente', label: 'Vente' },
                  { to: '/register', label: 'Publier une annonce' },
                ].map(link => (
                  <Link key={link.to} to={link.to}
                    className="block text-sm text-[#64748B] hover:text-white transition-colors">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-3">Légal</h4>
              <div className="space-y-2">
                {[
                  { to: '/confidentialite', label: 'Politique de confidentialité' },
                  { to: '/conditions', label: "Conditions d'utilisation" },
                  { to: '/parametres', label: 'Paramètres' },
                ].map(link => (
                  <Link key={link.to} to={link.to}
                    className="block text-sm text-[#64748B] hover:text-white transition-colors">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-[#64748B] text-sm">© 2026 Logezy — Tous droits réservés.</p>
            <p className="text-[#64748B] text-sm">Made with ❤️ in Bénin 🇧🇯</p>
          </div>
        </div>
      </footer>
    </div>
  );
}