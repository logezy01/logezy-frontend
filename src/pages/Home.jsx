import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Shield, TrendingUp, Star, ArrowRight, HomeIcon, Users, CheckCircle, ChevronRight, Zap } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import ListingCard from '../components/common/ListingCard';
import Logo from '../components/common/Logo';
import api from '../lib/axios';
import useAuthStore from '../store/authStore';

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

function AnimatedSection({ children, className = '', delay = 0 }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}>
      {children}
    </div>
  );
}

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

const CITIES = ['Cotonou', 'Porto-Novo', 'Parakou', 'Abomey-Calavi', 'Bohicon', 'Natitingou', 'Ouidah', 'Lokossa'];

export default function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchCity, setSearchCity] = useState('');
  const [searchType, setSearchType] = useState('');
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
const [heroIndex, setHeroIndex] = useState(0);

useEffect(() => {
  const timer = setInterval(() => {
    setHeroIndex(prev => (prev + 1) % 5);
  }, 5000);
  return () => clearInterval(timer);
}, []);

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
    <div className="min-h-screen bg-[#F8F9FA] pb-20 md:pb-0">
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
{/* Slider d'images */}
{(() => {
  const HERO_IMAGES = [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1920&q=80',
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920&q=80',
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1920&q=80',
  ];
  return (
    <div className="absolute inset-0 z-0">
      {HERO_IMAGES.map((img, i) => (
        <div key={i} className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: heroIndex === i ? 1 : 0 }}>
          <img src={img} alt={`Maison ${i + 1}`}
            className="w-full h-full object-cover" />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

      {/* Indicateurs */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {HERO_IMAGES.map((_, i) => (
          <button key={i} onClick={() => setHeroIndex(i)}
            className={`transition-all duration-300 rounded-full ${
              heroIndex === i ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/40 hover:bg-white/70'
            }`} />
        ))}
      </div>
    </div>
  );
})()}

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 w-full">
          <div className="max-w-2xl">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-white text-sm font-medium mb-8">
              <span className="w-2 h-2 bg-[#4CAF50] rounded-full animate-pulse" />
              🇧🇯 N°1 de l'immobilier au Bénin
            </div>

            {/* Titre */}
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-[1.1]">
              Trouvez votre
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#4CAF50] to-[#81C784]">
                maison idéale
              </span>
              au Bénin
            </h1>

            <p className="text-white/75 text-lg md:text-xl mb-10 max-w-lg leading-relaxed">
              Des milliers d'annonces vérifiées à louer ou à acheter dans toutes les villes du Bénin.
            </p>

            {/* Tabs type */}
            <div className="inline-flex bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-1 mb-5 gap-1">
              {[
                { value: '', label: 'Tout voir' },
                { value: 'location', label: '🔑 Location' },
                { value: 'vente', label: '🏷️ Vente' },
              ].map(t => (
                <button key={t.value} onClick={() => setSearchType(t.value)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    searchType === t.value
                      ? 'bg-white text-[#3A7D44] shadow-lg'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* Barre de recherche premium */}
            <form onSubmit={handleSearch}
              className="bg-white/95 backdrop-blur-md rounded-2xl p-2 flex flex-col md:flex-row gap-2 shadow-[0_20px_60px_rgba(0,0,0,0.3)] max-w-xl mb-6">
              <div className="flex items-center gap-3 flex-1 px-4 py-1">
                <MapPin size={18} className="text-[#3A7D44] shrink-0" />
                <select value={searchCity} onChange={(e) => setSearchCity(e.target.value)}
                  className="flex-1 text-[#0F172A] text-sm outline-none bg-transparent font-medium py-2">
                  <option value="">Toutes les villes</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <button type="submit"
                className="bg-[#3A7D44] hover:bg-[#2D6235] text-white font-bold px-8 py-3.5 rounded-xl transition-all flex items-center gap-2 justify-center shadow-lg">
                <Search size={16} />
                Rechercher
              </button>
            </form>

            {/* Villes populaires */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-white/40 text-xs">Populaire :</span>
              {['Cotonou', 'Porto-Novo', 'Abomey-Calavi', 'Parakou'].map(city => (
                <button key={city} onClick={() => navigate(`/annonces?city=${city}`)}
                  className="text-xs text-white/70 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-all border border-white/10 hover:border-white/30">
                  {city}
                </button>
              ))}
            </div>
          </div>

          {/* Stats flottantes desktop */}
          <div className="absolute bottom-12 right-8 hidden xl:flex flex-col gap-3">
            {[
              { value: '500+', label: 'Annonces actives', emoji: '🏠' },
              { value: '1000+', label: 'Utilisateurs', emoji: '👥' },
              { value: '12', label: 'Villes couvertes', emoji: '📍' },
            ].map((stat, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-3.5 flex items-center gap-4 hover:bg-white/15 transition-all">
                <span className="text-2xl">{stat.emoji}</span>
                <div>
                  <div className="font-display font-black text-xl text-white leading-none">{stat.value}</div>
                  <div className="text-white/50 text-xs mt-0.5">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <div className="w-px h-8 bg-white/30" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
        </div>
      </section>

      {/* ── STATS BAND ───────────────────────────────────── */}
      <section className="bg-white border-b border-[#E8E8E8]">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { target: 500, suffix: '+', label: 'Annonces actives', color: 'text-[#3A7D44]', bg: 'bg-[#EBF5ED]', icon: '🏠' },
              { target: 12, suffix: '', label: 'Villes couvertes', color: 'text-[#3B82F6]', bg: 'bg-[#EFF6FF]', icon: '📍' },
              { target: 1000, suffix: '+', label: 'Utilisateurs', color: 'text-[#F59E0B]', bg: 'bg-[#FEF3C7]', icon: '👥' },
              { target: 98, suffix: '%', label: 'Satisfaction', color: 'text-purple-500', bg: 'bg-purple-50', icon: '⭐' },
            ].map((stat, i) => (
              <AnimatedSection key={i} delay={i * 100}>
                <div className="flex flex-col items-center text-center gap-3">
                  <div className={`w-14 h-14 ${stat.bg} rounded-2xl flex items-center justify-center text-2xl`}>
                    {stat.icon}
                  </div>
                  <div className={`font-display font-black text-4xl ${stat.color}`}>
                    <Counter target={stat.target} suffix={stat.suffix} />
                  </div>
                  <div className="text-sm text-[#64748B] font-medium">{stat.label}</div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── ANNONCES RÉCENTES ────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <AnimatedSection>
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#EBF5ED] text-[#3A7D44] text-xs font-bold px-3 py-1.5 rounded-full mb-3">
                <Zap size={12} />
                Nouvelles annonces
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-black text-[#0F172A]">
                Annonces récentes
              </h2>
              <p className="text-[#64748B] mt-2">
                Les dernières propriétés disponibles au Bénin
              </p>
            </div>
            <Link to="/annonces"
              className="hidden md:flex items-center gap-2 text-sm font-bold text-[#3A7D44] hover:gap-3 transition-all">
              Voir tout <ArrowRight size={16} />
            </Link>
          </div>
        </AnimatedSection>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-white h-80 animate-pulse" />
            ))}
          </div>
        ) : listings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing, i) => (
              <AnimatedSection key={listing.id} delay={i * 80}>
                <ListingCard listing={listing} />
              </AnimatedSection>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-[#94A3B8]">
            <span className="text-6xl block mb-4">🏠</span>
            <p className="font-medium text-lg">Aucune annonce disponible pour le moment</p>
            <p className="text-sm mt-1">Revenez bientôt !</p>
          </div>
        )}

        <div className="text-center mt-10 md:hidden">
          <Link to="/annonces" className="btn-primary inline-flex items-center gap-2 px-8 py-3">
            Voir toutes les annonces <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ── POURQUOI LOGEZY ──────────────────────────────── */}
      <section className="py-20 px-6 bg-white border-t border-[#E8E8E8]">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-[#EBF5ED] text-[#3A7D44] text-xs font-bold px-3 py-1.5 rounded-full mb-4">
              <CheckCircle size={12} />
              Pourquoi nous choisir
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-black text-[#0F172A] mb-4">
              La référence immobilière au Bénin
            </h2>
            <p className="text-[#64748B] max-w-xl mx-auto text-lg">
              Logezy vous offre une expérience immobilière unique, sécurisée et transparente
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: '🛡️',
                title: 'Annonces vérifiées',
                desc: 'Chaque annonce est contrôlée par notre équipe avant publication pour garantir fiabilité et sécurité.',
                color: 'from-[#EBF5ED] to-white',
                border: 'border-[#3A7D44]/20',
                tag: 'Sécurité',
              },
              {
                icon: '🔍',
                title: 'Recherche avancée',
                desc: 'Filtrez par ville, type, prix, chambres, superficie. Trouvez exactement ce que vous cherchez.',
                color: 'from-[#EFF6FF] to-white',
                border: 'border-[#3B82F6]/20',
                tag: 'Efficacité',
              },
              {
                icon: '📊',
                title: 'Marché transparent',
                desc: 'Accédez aux prix réels du marché béninois pour prendre des décisions d\'investissement éclairées.',
                color: 'from-[#FEF3C7] to-white',
                border: 'border-[#F59E0B]/20',
                tag: 'Transparence',
              },
            ].map((item, i) => (
              <AnimatedSection key={i} delay={i * 150}>
                <div className={`bg-gradient-to-br ${item.color} rounded-2xl p-6 border ${item.border} hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all hover:-translate-y-1 h-full`}>
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <div className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">{item.tag}</div>
                  <h3 className="font-display font-bold text-xl text-[#0F172A] mb-3">{item.title}</h3>
                  <p className="text-sm text-[#64748B] leading-relaxed">{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── VILLES POPULAIRES ────────────────────────────── */}
      <section className="py-20 px-6 bg-[#F8F9FA]">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-[#EBF5ED] text-[#3A7D44] text-xs font-bold px-3 py-1.5 rounded-full mb-4">
              <MapPin size={12} />
              Partout au Bénin
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-black text-[#0F172A] mb-3">
              Explorez par ville
            </h2>
            <p className="text-[#64748B]">
              Des annonces disponibles dans toutes les grandes villes du Bénin
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { city: 'Cotonou', emoji: '🏙️', desc: 'Capitale économique' },
              { city: 'Porto-Novo', emoji: '🏛️', desc: 'Capitale officielle' },
              { city: 'Abomey-Calavi', emoji: '🌿', desc: 'Ville universitaire' },
              { city: 'Parakou', emoji: '🌍', desc: 'Capitale du Nord' },
              { city: 'Bohicon', emoji: '🏘️', desc: 'Carrefour commercial' },
              { city: 'Ouidah', emoji: '⛱️', desc: 'Ville historique' },
              { city: 'Natitingou', emoji: '🏔️', desc: 'Perle de l\'Atacora' },
              { city: 'Lokossa', emoji: '🌾', desc: 'Ville du Mono' },
            ].map((item, i) => (
              <AnimatedSection key={item.city} delay={i * 60}>
                <button onClick={() => navigate(`/annonces?city=${item.city}`)}
                  className="w-full bg-white rounded-2xl p-4 text-left border border-[#E8E8E8] hover:border-[#3A7D44] hover:shadow-[0_8px_30px_rgba(58,125,68,0.1)] transition-all group hover:-translate-y-0.5">
                  <div className="text-2xl mb-2">{item.emoji}</div>
                  <div className="font-bold text-sm text-[#0F172A] group-hover:text-[#3A7D44] transition-colors">
                    {item.city}
                  </div>
                  <div className="text-xs text-[#94A3B8] mt-0.5">{item.desc}</div>
                </button>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#0F172A] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#3A7D44] rounded-full opacity-10 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#3B82F6] rounded-full opacity-10 blur-3xl" />
        </div>
        <AnimatedSection className="relative max-w-3xl mx-auto text-center">
          {user?.role === 'locataire' || !isAuthenticated ? (
            <>
              <div className="inline-flex items-center gap-2 bg-white/10 text-white/70 text-xs font-bold px-3 py-1.5 rounded-full mb-6">
                🇧🇯 Logezy — Votre logement facile
              </div>
              <h2 className="font-display text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
                Votre prochaine maison
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#4CAF50] to-[#81C784]">
                  vous attend ici
                </span>
              </h2>
              <p className="text-white/60 text-lg mb-10 max-w-lg mx-auto">
                Des milliers d'annonces vérifiées vous attendent. Commencez votre recherche maintenant.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/annonces"
                  className="bg-[#3A7D44] hover:bg-[#2D6235] text-white font-bold px-8 py-4 rounded-2xl transition-all inline-flex items-center gap-2 justify-center shadow-[0_0_30px_rgba(58,125,68,0.3)]">
                  Parcourir les annonces <ArrowRight size={18} />
                </Link>
                <Link to="/register"
                  className="bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-4 rounded-2xl transition-all inline-flex items-center gap-2 justify-center border border-white/20">
                  Créer un compte gratuit
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="inline-flex items-center gap-2 bg-white/10 text-white/70 text-xs font-bold px-3 py-1.5 rounded-full mb-6">
                🏠 Publiez gratuitement
              </div>
              <h2 className="font-display text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
                Vous avez un bien
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#4CAF50] to-[#81C784]">
                  à louer ou vendre ?
                </span>
              </h2>
              <p className="text-white/60 text-lg mb-10 max-w-lg mx-auto">
                Publiez votre annonce gratuitement et touchez des milliers d'acheteurs au Bénin.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to={user?.role === 'proprietaire' ? '/dashboard/proprietaire/publier' : '/dashboard/agent/publier'}
                  className="bg-[#3A7D44] hover:bg-[#2D6235] text-white font-bold px-8 py-4 rounded-2xl transition-all inline-flex items-center gap-2 justify-center shadow-[0_0_30px_rgba(58,125,68,0.3)]">
                  Publier une annonce <ArrowRight size={18} />
                </Link>
                <Link to="/annonces"
                  className="bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-4 rounded-2xl transition-all inline-flex items-center gap-2 justify-center border border-white/20">
                  Voir les annonces
                </Link>
              </div>
            </>
          )}
        </AnimatedSection>
      </section>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer className="bg-[#080F1A] text-white py-14 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            <div className="md:col-span-2">
              <Logo size="md" white />
              <p className="text-[#475569] text-sm mt-4 max-w-xs leading-relaxed">
                La plateforme immobilière de référence au Bénin. Trouvez, louez ou vendez en toute confiance.
              </p>
              <div className="flex items-center gap-3 mt-5">
                <a href="https://www.facebook.com/LogezyImmobilierDigitale" target="_blank"
                  className="w-9 h-9 rounded-xl bg-white/5 hover:bg-[#3A7D44] flex items-center justify-center text-sm transition-all">
                  f
                </a>
                <a href="https://wa.me/22901908212" target="_blank"
                  className="w-9 h-9 rounded-xl bg-white/5 hover:bg-[#3A7D44] flex items-center justify-center text-sm transition-all">
                  w
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-sm text-white mb-4">Navigation</h4>
              <div className="space-y-2.5">
                {[
                  { to: '/annonces', label: 'Toutes les annonces' },
                  { to: '/annonces?type=location', label: 'Location' },
                  { to: '/annonces?type=vente', label: 'Vente' },
                  ...(user?.role !== 'locataire' ? [{ to: user?.role === 'proprietaire' ? '/dashboard/proprietaire/publier' : '/dashboard/agent/publier', label: 'Publier une annonce' }] : []),
                ].map(link => (
                  <Link key={link.to} to={link.to}
                    className="flex items-center gap-1.5 text-sm text-[#475569] hover:text-white transition-colors group">
                    <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-sm text-white mb-4">À propos</h4>
              <div className="space-y-2.5">
                {[
                  { to: '/a-propos', label: 'À propos de nous' },
                  { to: '/contact', label: 'Nous contacter' },
                  { to: '/comment-ca-marche', label: 'Comment ça marche' },
                  { to: '/confidentialite', label: 'Confidentialité' },
                  { to: '/conditions', label: "Conditions d'utilisation" },
                ].map(link => (
                  <Link key={link.to} to={link.to}
                    className="flex items-center gap-1.5 text-sm text-[#475569] hover:text-white transition-colors group">
                    <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-[#334155] text-sm">© 2026 Logezy — Tous droits réservés.</p>
            <p className="text-[#334155] text-sm flex items-center gap-1">
              Made in Bénin 
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}