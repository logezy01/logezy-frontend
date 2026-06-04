import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Shield, TrendingUp, Star, ArrowRight, HomeIcon, Users, Building } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import ListingCard from '../components/common/ListingCard';
import Logo from '../components/common/Logo';
import api from '../lib/axios';
import useAuthStore from '../store/authStore';

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
  const { user, isAuthenticated } = useAuthStore();     

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
<section className="relative min-h-[90vh] flex items-center overflow-hidden">
  {/* Image de fond */}
  <div className="absolute inset-0 z-0">
    <img
      src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80"
      alt="Belle maison"
      className="w-full h-full object-cover"
    />
    {/* Overlay gradient */}
    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
  </div>

  <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 w-full">
    <div className="max-w-2xl">

      {/* Badge */}
      <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full text-white text-sm font-medium mb-8 animate-fade-in">
        <span className="w-2 h-2 bg-[#3A7D44] rounded-full animate-pulse" />
        🇧🇯 N°1 de l'immobilier au Bénin
      </div>

      {/* Titre */}
      <h1 className="font-display text-5xl md:text-7xl font-black text-white mb-6 leading-tight animate-slide-up">
        Trouvez votre
        <span className="block text-[#4CAF50]">maison idéale</span>
        au Bénin
      </h1>

      <p className="text-white/80 text-xl mb-10 max-w-xl animate-fade-in leading-relaxed">
        Des milliers d'annonces vérifiées à louer ou à acheter partout au Bénin.
      </p>

      {/* Tabs */}
      <div className="inline-flex bg-white/10 backdrop-blur-sm rounded-xl p-1 mb-6 gap-1">
        {[
          { value: '', label: 'Tout' },
          { value: 'location', label: '🔑 Location' },
          { value: 'vente', label: '🏷️ Vente' },
        ].map(t => (
          <button
            key={t.value}
            onClick={() => setSearchType(t.value)}
            className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
              searchType === t.value
                ? 'bg-white text-[#3A7D44] shadow-md'
                : 'text-white hover:bg-white/10'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Barre de recherche */}
      <form onSubmit={handleSearch} className="bg-white rounded-2xl p-2 flex flex-col md:flex-row gap-2 shadow-2xl animate-scale-in max-w-xl">
        <div className="flex items-center gap-2 flex-1 px-3">
          <MapPin size={18} className="text-[#3A7D44] shrink-0" />
          <select
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            className="flex-1 text-[#0F172A] text-sm outline-none py-2 bg-transparent font-medium"
          >
            <option value="">Toutes les villes</option>
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <button type="submit" className="btn-primary flex items-center gap-2 justify-center px-8 py-3 rounded-xl">
          <Search size={16} />
          Rechercher
        </button>
      </form>

      {/* Recherches populaires */}
      <div className="flex flex-wrap items-center gap-2 mt-5">
        <span className="text-white/50 text-xs">Populaire :</span>
        {['Cotonou', 'Porto-Novo', 'Abomey-Calavi', 'Parakou'].map(city => (
          <button
            key={city}
            onClick={() => navigate(`/annonces?city=${city}`)}
            className="text-xs text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-all border border-white/10"
          >
            {city}
          </button>
        ))}
      </div>
    </div>

    {/* Stats flottantes */}
    <div className="absolute bottom-8 right-6 hidden lg:flex flex-col gap-3">
      {[
        { value: '500+', label: 'Annonces', emoji: '🏠' },
        { value: '1000+', label: 'Utilisateurs', emoji: '👥' },
        { value: '98%', label: 'Satisfaction', emoji: '⭐' },
      ].map((stat, i) => (
        <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 flex items-center gap-3">
          <span className="text-2xl">{stat.emoji}</span>
          <div>
            <div className="font-display font-black text-white text-lg leading-none">{stat.value}</div>
            <div className="text-white/60 text-xs">{stat.label}</div>
          </div>
        </div>
      ))}
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
<section className="relative bg-[#3A7D44] py-16 px-6 overflow-hidden">
  <div className="absolute inset-0 opacity-10">
    <div className="absolute top-0 right-0 w-64 h-64 bg-[#E8472A] rounded-full blur-3xl" />
  </div>
  <AnimatedSection className="relative max-w-3xl mx-auto text-center">
    {user?.role === 'locataire' || !isAuthenticated ? (
      <>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
          Trouvez votre maison idéale au Bénin
        </h2>
        <p className="text-white/70 mb-8 max-w-lg mx-auto">
          Des milliers d'annonces vérifiées vous attendent. Commencez votre recherche maintenant.
        </p>
        <Link to="/annonces" className="bg-white text-[#3A7D44] font-bold px-8 py-4 rounded-btn hover:bg-[#EBF5ED] transition-all inline-flex items-center gap-2 justify-center">
          Parcourir les annonces <ArrowRight size={16} />
        </Link>
      </>
    ) : (
      <>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
          Vous avez un bien à louer ou à vendre ?
        </h2>
        <p className="text-white/70 mb-8 max-w-lg mx-auto">
          Publiez votre annonce gratuitement et touchez des milliers d'acheteurs et locataires potentiels.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/register" className="bg-white text-[#3A7D44] font-bold px-8 py-4 rounded-btn hover:bg-[#EBF5ED] transition-all inline-flex items-center gap-2 justify-center">
            Publier une annonce <ArrowRight size={16} />
          </Link>
          <Link to="/annonces" className="bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-4 rounded-btn transition-all inline-flex items-center gap-2 justify-center">
            Parcourir les annonces
          </Link>
        </div>
      </>
    )}
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
      ...(user?.role !== 'locataire' ? [{ to: '/register', label: 'Publier une annonce' }] : []),
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
      { to: '/a-propos', label: 'À propos' },
      { to: '/contact', label: 'Contact' },
      { to: '/confidentialite', label: 'Confidentialité' },
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
            <p className="text-[#64748B] text-sm">Made in Bénin 🇧🇯</p>
          </div>
        </div>
      </footer>
    </div>
  );
}