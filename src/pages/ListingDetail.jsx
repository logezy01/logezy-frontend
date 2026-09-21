import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  MapPin, Bed, Bath, Home, Maximize, ChevronLeft, ChevronRight,
  Heart, Share2, Eye, Calendar, Shield, MessageSquare,
  Phone, CheckCircle, ZoomIn, X, Layers,
  Sofa, Car, Trees, Waves, Lock, Star, Play, Key, Tag, Images
} from 'lucide-react';
import Navbar from '../components/common/Navbar';
import api from '../lib/axios';
import useAuthStore from '../store/authStore';
import useCompareStore from '../store/compareStore';
import toast from 'react-hot-toast';
import { getCategoryIcon, getCategoryLabel } from '../data/listingCategories';

// Hook pour détecter si l'élément est visible
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
function FadeIn({ children, delay = 0, className = '' }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(24px)',
        transition: `all 0.6s cubic-bezier(0.23, 1, 0.32, 1) ${delay}ms`,
      }}>
      {children}
    </div>
  );
}

export default function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const compareStore = useCompareStore();
  const addToCompare = compareStore?.addToCompare || (() => {});
  const compareList = compareStore?.compareList || [];

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await api.get(`/listings/${id}`);
        setListing(res.data.listing);
        if (isAuthenticated) {
          const favRes = await api.get(`/listings/${id}/favorite`);
          setIsFavorite(favRes.data.isFavorite || false);
        }
      } catch {
        toast.error('Annonce introuvable');
        navigate('/annonces');
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  const photos = listing?.listing_images || [];
  const videos = listing?.listing_videos || [];

  const media = [
    ...photos.map(p => ({ type: 'image', url: p.image_url })),
    ...videos.map(v => ({ type: 'video', url: v.video_url })),
  ];

  const nextPhoto = () => setCurrentPhoto(p => (p + 1) % media.length);
  const prevPhoto = () => setCurrentPhoto(p => (p - 1 + media.length) % media.length);

  useEffect(() => {
    if (!lightbox) return;
    const handler = (e) => {
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'ArrowLeft') prevPhoto();
      if (e.key === 'Escape') setLightbox(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightbox, media.length]);

  const formatTitle = (title) => {
    if (!title) return '';
    const cleaned = title.replace(/[*_#]+/g, '').trim();
    const isShouting = cleaned === cleaned.toUpperCase() && /[A-Z]/.test(cleaned);
    if (!isShouting) return cleaned;
    return cleaned
      .toLowerCase()
      .replace(/(^|\s)\S/g, (c) => c.toUpperCase());
  };

  const handleFavorite = async () => {
    if (!isAuthenticated) { toast.error('Connectez-vous pour ajouter aux favoris'); return; }
    setFavoriteLoading(true);
    try {
      if (isFavorite) {
        await api.delete(`/listings/${id}/favorite`);
        setIsFavorite(false);
        toast.success('Retiré des favoris');
      } else {
        await api.post(`/listings/${id}/favorite`);
        setIsFavorite(true);
        toast.success('Ajouté aux favoris');
      }
    } catch { toast.error('Erreur'); }
    finally { setFavoriteLoading(false); }
  };

  const handleContact = async () => {
    if (!isAuthenticated) { toast.error('Connectez-vous pour contacter'); navigate('/login'); return; }
    if (user?.id === listing?.owner_id) { toast.error('Vous ne pouvez pas vous contacter vous-même'); return; }

    try {
      const res = await api.post('/chat/conversations', {
        listing_id: listing.id,
        owner_id: listing.owner_id,
      });
      const conversationId = res.data.conversation.id;

      const path = user?.role === 'proprietaire' ? `/dashboard/proprietaire/messages`
        : user?.role === 'agent' ? `/dashboard/agent/messages`
        : `/dashboard/locataire/messages`;
      navigate(path, { state: { openConversationId: conversationId } });
    } catch (e) {
      toast.error('Erreur lors de la création de la conversation');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: listing?.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Lien copié !');
    }
  };

  const handleWhatsApp = () => {
    const text = `Bonjour, je suis intéressé(e) par cette annonce sur Logezy : ${listing?.title} — ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const formatPrice = (price) => new Intl.NumberFormat('fr-FR').format(price);

  if (loading) return (
    <div className="min-h-screen bg-paper dark:bg-[#080B14]">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 pt-8">
        <div className="h-[420px] rounded-2xl bg-[#E8E8E8] dark:bg-[#1A1A1A] animate-pulse mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 rounded-xl bg-[#E8E8E8] dark:bg-[#1A1A1A] animate-pulse" />
            ))}
          </div>
          <div className="h-64 rounded-xl bg-[#E8E8E8] dark:bg-[#1A1A1A] animate-pulse" />
        </div>
      </div>
    </div>
  );

  if (!listing) return null;

  const equipements = [
    { key: 'is_furnished', label: 'Meublé', icon: Sofa },
    { key: 'has_parking', label: 'Parking', icon: Car },
    { key: 'has_garden', label: 'Jardin', icon: Trees },
    { key: 'has_pool', label: 'Piscine', icon: Waves },
    { key: 'has_security', label: 'Sécurité', icon: Lock },
  ].filter(e => listing[e.key]);

  const caracteristiques = [
    listing.bedrooms > 0 && { label: 'Chambres', value: listing.bedrooms, icon: Bed },
    listing.bathrooms > 0 && { label: 'Salles de bain', value: listing.bathrooms, icon: Bath },
    listing.living_rooms > 0 && { label: 'Salons', value: listing.living_rooms, icon: Sofa },
    listing.area && { label: 'Superficie', value: `${listing.area} m²`, icon: Maximize },
    listing.floors > 0 && { label: 'Étages', value: listing.floors, icon: Home },
    { label: 'Vues', value: listing.views_count || 0, icon: Eye },
  ].filter(Boolean);

  const CategoryIcon = listing.category ? getCategoryIcon(listing.category) : null;
  const pricePerM2 = listing.area ? Math.round(listing.price / listing.area) : null;

  const visibleThumbs = media.slice(1, 5);
  const remainingCount = media.length - 5;

  return (
    <div className="min-h-screen bg-paper dark:bg-[#080B14] pb-24 md:pb-12">
      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-slide { animation: fadeSlide 0.5s ease both; }

        /* ═══ LIQUID GLASS — variantes pour cette page ═══ */
        .glass-chip {
          background: rgba(255,255,255,0.75);
          backdrop-filter: blur(16px) saturate(180%);
          -webkit-backdrop-filter: blur(16px) saturate(180%);
          border: 1px solid rgba(255,255,255,0.7);
          box-shadow: 0 2px 12px rgba(15,23,42,0.06), inset 0 1px 0 rgba(255,255,255,0.7);
        }
        .dark .glass-chip {
          background: rgba(30,35,48,0.6);
          border-color: rgba(255,255,255,0.1);
          box-shadow: 0 2px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08);
        }
        .glass-icon-round {
          background: rgba(255,255,255,0.6);
          backdrop-filter: blur(16px) saturate(180%);
          -webkit-backdrop-filter: blur(16px) saturate(180%);
          border: 1px solid rgba(255,255,255,0.65);
          box-shadow: 0 3px 14px rgba(15,23,42,0.08), inset 0 1px 0 rgba(255,255,255,0.6);
          transition: transform 0.3s cubic-bezier(0.23,1,0.32,1), background 0.3s ease, box-shadow 0.3s ease;
        }
        .glass-icon-round:hover {
          background: rgba(255,255,255,0.85);
          transform: scale(1.06);
        }
        .glass-icon-round:active { transform: scale(0.94); }
        .dark .glass-icon-round {
          background: rgba(30,35,48,0.55);
          border-color: rgba(255,255,255,0.1);
        }
        .glass-panel-light {
          background: rgba(255,255,255,0.7);
          backdrop-filter: blur(24px) saturate(180%);
          -webkit-backdrop-filter: blur(24px) saturate(180%);
          border: 1px solid rgba(255,255,255,0.7);
          box-shadow: 0 8px 32px rgba(15,23,42,0.08), inset 0 1px 0 rgba(255,255,255,0.6);
        }
        .dark .glass-panel-light {
          background: rgba(17,24,39,0.6);
          border-color: rgba(255,255,255,0.08);
          box-shadow: 0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06);
        }
        .glass-on-media {
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(14px) saturate(180%);
          -webkit-backdrop-filter: blur(14px) saturate(180%);
        }
        .glass-lightbox-btn {
          background: rgba(255,255,255,0.12);
          backdrop-filter: blur(16px) saturate(180%);
          -webkit-backdrop-filter: blur(16px) saturate(180%);
          border: 1px solid rgba(255,255,255,0.18);
          transition: transform 0.3s cubic-bezier(0.23,1,0.32,1), background 0.3s ease;
        }
        .glass-lightbox-btn:hover {
          background: rgba(255,255,255,0.22);
          transform: scale(1.06);
        }
        .glass-lightbox-btn:active { transform: scale(0.94); }
      `}</style>

      {/* Navbar */}
      <Navbar />

      {/* Fil d'Ariane */}
      <div className="max-w-6xl mx-auto px-4 pt-4 pb-2">
        <div className="flex items-center gap-1.5 text-sm text-[#94A3B8] flex-wrap">
          <Link to="/" className="hover:text-[#3A7D44] transition-colors font-medium">Accueil</Link>
          <ChevronRight size={13} className="text-[#CBD5E1]" />
          <Link to={`/annonces?type=${listing.type}`} className="hover:text-[#3A7D44] transition-colors font-medium capitalize">
            {listing.type === 'location' ? 'Location' : 'Vente'}
          </Link>
          <ChevronRight size={13} className="text-[#CBD5E1]" />
          <Link to={`/annonces?city=${listing.city}`} className="hover:text-[#3A7D44] transition-colors font-medium">
            {listing.city}
          </Link>
          {listing.neighborhood && (
            <>
              <ChevronRight size={13} className="text-[#CBD5E1]" />
              <span className="text-[#334155] dark:text-white font-medium truncate max-w-[160px]">
                {listing.neighborhood}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">

        {/* ══ EN-TÊTE : badges, titre, prix, actions ══ */}
        <FadeIn>
          <div className="mb-5">

            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <span className="glass-chip flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full text-[#0F172A] dark:text-white">
                {listing.type === 'location' ? <Key size={12} className="text-[#3A7D44]" /> : <Tag size={12} className="text-[#B45309]" />}
                {listing.type === 'location' ? 'Location' : 'Vente'}
              </span>

              {listing.category && CategoryIcon && (
                <span className="glass-chip flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full text-[#334155] dark:text-[#94A3B8]">
                  <CategoryIcon size={12} className="text-[#3A7D44]" />
                  {getCategoryLabel(listing.category)}
                </span>
              )}

              {listing.is_featured && (
                <span className="glass-chip flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full text-purple-600">
                  <Star size={12} fill="currentColor" />
                  Coup de cœur
                </span>
              )}

              {listing.users?.is_verified && (
                <span className="glass-chip flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full text-[#3A7D44]">
                  <Shield size={12} />
                  Propriétaire vérifié
                </span>
              )}
            </div>

            {/* Titre */}
            <h1 className="font-serif font-bold text-2xl md:text-3xl text-[#0F172A] dark:text-white leading-tight mb-2">
              {formatTitle(listing.title)}
            </h1>

            {/* Méta ligne */}
            <div className="flex items-center gap-4 flex-wrap text-sm text-[#64748B] dark:text-[#94A3B8] mb-4">
              <span className="flex items-center gap-1.5">
                <MapPin size={14} className="text-[#3A7D44]" />
                {listing.neighborhood ? `${listing.neighborhood}, ` : ''}{listing.city}
              </span>
              <span className="flex items-center gap-1.5">
                <Eye size={14} />
                {listing.views_count || 0} vues
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={14} />
                Publiée le {new Date(listing.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>

            {/* Prix + actions */}
            <div className="flex items-end justify-between flex-wrap gap-3 pb-5 border-b border-[#E8E8E8] dark:border-[#1F2937]">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-3xl md:text-4xl font-bold text-[#0F172A] dark:text-white">
                    {formatPrice(listing.price)}
                  </span>
                  <span className="text-[#64748B] dark:text-[#94A3B8] font-medium">
                    FCFA{listing.type === 'location' && listing.price_period && `/${listing.price_period}`}
                  </span>
                </div>
                {pricePerM2 && (
                  <p className="text-xs text-[#94A3B8] mt-0.5">
                    {formatPrice(pricePerM2)} FCFA / m²
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button onClick={handleShare}
                  className="glass-icon-round w-10 h-10 rounded-full flex items-center justify-center text-[#64748B] dark:text-[#94A3B8]">
                  <Share2 size={16} />
                </button>
                <button onClick={() => addToCompare(listing)}
                  disabled={(compareList || []).some(l => l.id === listing.id)}
                  className="glass-icon-round w-10 h-10 rounded-full flex items-center justify-center text-[#64748B] dark:text-[#94A3B8] disabled:opacity-40">
                  <Layers size={16} />
                </button>
                <button onClick={handleFavorite} disabled={favoriteLoading}
                  className="glass-icon-round flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold"
                  style={
                    isFavorite
                      ? { borderColor: 'rgba(239,68,68,0.45)', boxShadow: '0 3px 14px rgba(239,68,68,0.2), inset 0 1px 0 rgba(255,255,255,0.6)' }
                      : undefined
                  }
                >
                  <Heart size={15} className={isFavorite ? 'text-red-500' : 'text-[#334155] dark:text-[#94A3B8]'} fill={isFavorite ? 'currentColor' : 'none'} />
                  <span className={isFavorite ? 'text-red-500' : 'text-[#334155] dark:text-[#94A3B8]'}>
                    {isFavorite ? 'Sauvegardé' : 'Sauvegarder'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* ══ GALERIE ASYMÉTRIQUE ══ */}
        <FadeIn delay={50}>
          <div className="grid grid-cols-5 grid-rows-2 gap-2 h-[340px] md:h-[420px] rounded-[26px] overflow-hidden mb-2">

            {/* Média principal */}
            <div className="col-span-5 md:col-span-3 row-span-2 relative group cursor-pointer"
              onClick={() => setLightbox(true)}>
              {media.length > 0 ? (
                media[currentPhoto]?.type === 'video' ? (
                  <>
                    <video src={media[currentPhoto].url} className="w-full h-full object-cover" muted />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <div className="glass-on-media w-16 h-16 rounded-full flex items-center justify-center">
                        <Play size={28} className="text-[#3A7D44] ml-1" fill="currentColor" />
                      </div>
                    </div>
                  </>
                ) : (
                  <img src={media[currentPhoto].url} alt={listing.title}
                    className="w-full h-full object-cover"
                    loading="lazy" />
                )
              ) : (
                <div className="w-full h-full bg-[#E8E8E8] dark:bg-[#1A1A1A] flex items-center justify-center">
                  <Home size={64} className="text-[#CBD5E1]" />
                </div>
              )}

              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                <div className="glass-on-media opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-full px-4 py-2 flex items-center gap-2 text-sm font-bold text-[#0F172A]">
                  <ZoomIn size={16} />
                  Voir en grand
                </div>
              </div>

              {media.length > 1 && (
                <div className="glass-lightbox-btn absolute bottom-4 left-4 text-white text-xs font-medium px-3 py-1.5 rounded-full">
                  {currentPhoto + 1} / {media.length}
                </div>
              )}

              {media.length > 1 && (
                <>
                  <button onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
                    className="glass-icon-round absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center">
                    <ChevronLeft size={18} className="text-[#0F172A]" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
                    className="glass-icon-round absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center">
                    <ChevronRight size={18} className="text-[#0F172A]" />
                  </button>
                </>
              )}
            </div>

            {/* Miniatures 2x2 — desktop seulement */}
            {visibleThumbs.map((item, i) => {
              const mediaIndex = i + 1;
              const isActive = currentPhoto === mediaIndex;
              return (
                <div key={i}
                  className={`hidden md:block relative cursor-pointer overflow-hidden group rounded-lg transition-all ${
                    isActive ? 'ring-2 ring-[#3A7D44] ring-offset-2 ring-offset-paper dark:ring-offset-[#080B14]' : ''
                  }`}
                  onClick={() => setCurrentPhoto(mediaIndex)}>
                  {item.type === 'video' ? (
                    <>
                      <video src={item.url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" muted />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <Play size={18} className="text-white" fill="currentColor" />
                      </div>
                    </>
                  ) : (
                    <img src={item.url} alt={`Média ${mediaIndex + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy" />
                  )}
                </div>
              );
            })}
          </div>
        </FadeIn>

        {/* Bouton "+N photos" */}
        {remainingCount > 0 && (
          <FadeIn delay={80}>
            <button onClick={() => setLightbox(true)}
              className="glass-chip hidden md:flex w-full items-center justify-center gap-2 py-3 mb-6 rounded-2xl text-sm font-semibold text-[#334155] dark:text-[#94A3B8]">
              <Images size={15} className="text-[#3A7D44]" />
              +{remainingCount} photo{remainingCount > 1 ? 's' : ''}
            </button>
          </FadeIn>
        )}

        {/* Miniatures horizontales — mobile */}
        {media.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-3 mb-6 md:hidden scrollbar-hide">
            {media.map((item, i) => (
              <button key={i} onClick={() => setCurrentPhoto(i)}
                className={`relative shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                  currentPhoto === i ? 'border-[#3A7D44] scale-105' : 'border-transparent opacity-60'
                }`}>
                {item.type === 'video' ? (
                  <>
                    <video src={item.url} className="w-full h-full object-cover" muted />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Play size={14} className="text-white" fill="currentColor" />
                    </div>
                  </>
                ) : (
                  <img src={item.url} alt={`Miniature ${i + 1}`}
                    className="w-full h-full object-cover" loading="lazy" />
                )}
              </button>
            ))}
          </div>
        )}

        {/* ══ CONTENU PRINCIPAL ══ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── COLONNE GAUCHE (2/3) ── */}
          <div className="lg:col-span-2 space-y-4">

            {/* Description */}
            <FadeIn delay={100}>
              <div className="glass-panel-light rounded-[26px] p-5">
                <h2 className="font-serif text-lg font-bold text-[#0F172A] dark:text-white mb-3">Description</h2>
                {listing.description ? (
                  <p className="text-[#334155] dark:text-[#94A3B8] leading-relaxed text-sm whitespace-pre-wrap">
                    {listing.description}
                  </p>
                ) : (
                  <p className="text-[#94A3B8] italic text-sm">Aucune description fournie.</p>
                )}

                {listing.info_supplementaires && (
                  <div className="glass-chip mt-4 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Star size={15} className="text-[#3A7D44]" />
                      <span className="text-sm font-bold text-[#3A7D44]">Informations supplémentaires</span>
                    </div>
                    <p className="text-sm text-[#334155] dark:text-[#94A3B8] leading-relaxed">
                      {listing.info_supplementaires}
                    </p>
                  </div>
                )}
              </div>
            </FadeIn>

            {/* Caractéristiques */}
            {caracteristiques.length > 0 && (
              <FadeIn delay={150}>
                <div className="glass-panel-light rounded-[26px] p-5">
                  <h2 className="font-serif text-lg font-bold text-[#0F172A] dark:text-white mb-4">Caractéristiques</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {caracteristiques.map(({ label, value, icon: Icon }) => (
                      <div key={label} className="glass-chip flex items-center gap-3 p-3 rounded-2xl">
                        <div className="w-9 h-9 rounded-xl bg-[#3A7D44]/10 flex items-center justify-center shrink-0">
                          <Icon size={16} className="text-[#3A7D44]" />
                        </div>
                        <div>
                          <p className="text-xs text-[#94A3B8] font-medium">{label}</p>
                          <p className="text-sm font-bold text-[#0F172A] dark:text-white">{value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>
            )}

            {/* Équipements */}
            {equipements.length > 0 && (
              <FadeIn delay={200}>
                <div className="glass-panel-light rounded-[26px] p-5">
                  <h2 className="font-serif text-lg font-bold text-[#0F172A] dark:text-white mb-4">Équipements & confort</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {equipements.map(({ label, icon: Icon }) => (
                      <div key={label} className="glass-chip flex items-center gap-3 p-3 rounded-2xl">
                        <div className="w-8 h-8 rounded-lg bg-[#3A7D44]/10 flex items-center justify-center shrink-0">
                          <Icon size={16} className="text-[#3A7D44]" />
                        </div>
                        <span className="text-sm font-semibold text-[#334155] dark:text-white flex-1">{label}</span>
                        <CheckCircle size={14} className="text-[#3A7D44]" />
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>
            )}
          </div>

          {/* ── COLONNE DROITE (1/3) ── */}
          <div className="space-y-4">

            {/* Card contact */}
            <FadeIn delay={200}>
              <div className="glass-panel-light rounded-[26px] p-5 sticky top-20">

                <div className="mb-4 pb-4 border-b border-[#0F172A]/5 dark:border-white/5">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-serif text-2xl font-bold text-[#0F172A] dark:text-white">
                      {formatPrice(listing.price)}
                    </span>
                    <span className="text-sm text-[#64748B] font-medium">
                      FCFA{listing.type === 'location' && listing.price_period && `/${listing.price_period}`}
                    </span>
                  </div>
                  <p className="text-xs text-[#94A3B8] mt-0.5">
                    {listing.type === 'location' ? 'Charges selon accord' : 'Prix négociable'}
                  </p>
                </div>

                <div className="space-y-2.5 mb-4">
                  <button onClick={handleContact}
                    className="w-full bg-[#3A7D44] hover:bg-[#2D6235] text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-[#3A7D44]/30 active:scale-95">
                    <MessageSquare size={17} />
                    Contacter le propriétaire
                  </button>

                  <button onClick={handleWhatsApp}
                    className="w-full bg-[#25D366] hover:bg-[#1db954] text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95">
                    <Phone size={16} />
                    WhatsApp
                  </button>
                </div>

                <div className="glass-chip flex items-center gap-2 py-2.5 px-3 rounded-2xl">
                  <Shield size={15} className="text-[#3A7D44] shrink-0" />
                  <p className="text-xs text-[#3A7D44] font-semibold">Annonce vérifiée par Logezy</p>
                </div>

                {listing.users && (
                  <div className="mt-4 pt-4 border-t border-[#0F172A]/5 dark:border-white/5">
                    <p className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-3">Publié par</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#3A7D44] text-white flex items-center justify-center font-black text-sm shrink-0">
                        {listing.users.full_name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-[#0F172A] dark:text-white">
                          {listing.users.full_name}
                        </p>
                        <p className="text-xs text-[#94A3B8] capitalize flex items-center gap-1">
                          <CheckCircle size={11} className="text-[#3A7D44]" />
                          {listing.users.role === 'agent' ? 'Agent immobilier' : 'Propriétaire vérifié'}
                        </p>
                      </div>
                    </div>

                    {listing.users.agencies && (
                      <button
                        onClick={() => navigate(`/agences/${listing.users.agencies.id}`)}
                        className="glass-chip w-full flex items-center gap-3 mt-3 p-3 rounded-2xl hover:bg-[#3A7D44]/8 transition-colors"
                      >
                        {listing.users.agencies.logo_url ? (
                          <img
                            src={listing.users.agencies.logo_url}
                            alt={listing.users.agencies.name}
                            className="w-10 h-10 rounded-xl object-cover shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-[#3A7D44] text-white flex items-center justify-center font-black text-sm shrink-0">
                            {listing.users.agencies.name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="text-left flex-1 min-w-0">
                          <p className="text-xs text-[#94A3B8]">Publié via l'agence</p>
                          <p className="font-bold text-sm text-[#3A7D44] truncate">
                            {listing.users.agencies.name}
                          </p>
                        </div>
                        <ChevronRight size={16} className="text-[#3A7D44] shrink-0" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* ══ LIGHTBOX ══ */}
      {lightbox && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          onClick={() => setLightbox(false)}>
          <button onClick={() => setLightbox(false)}
            className="glass-lightbox-btn absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-white z-10">
            <X size={20} />
          </button>

          <button onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
            className="glass-lightbox-btn absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center text-white">
            <ChevronLeft size={22} />
          </button>

          {media[currentPhoto]?.type === 'video' ? (
            <video src={media[currentPhoto].url}
              className="max-w-[90vw] max-h-[85vh] rounded-2xl"
              controls autoPlay
              onClick={e => e.stopPropagation()} />
          ) : (
            <img src={media[currentPhoto]?.url} alt={listing.title}
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-2xl"
              onClick={e => e.stopPropagation()} />
          )}

          <button onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
            className="glass-lightbox-btn absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center text-white">
            <ChevronRight size={22} />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
            {media.map((_, i) => (
              <button key={i} onClick={(e) => { e.stopPropagation(); setCurrentPhoto(i); }}
                className={`rounded-full transition-all ${
                  currentPhoto === i ? 'w-5 h-2 bg-white' : 'w-2 h-2 bg-white/40 hover:bg-white/60'
                }`} />
            ))}
          </div>

          <div className="glass-lightbox-btn absolute bottom-4 right-4 text-white/90 text-sm px-3 py-1.5 rounded-full">
            {currentPhoto + 1} / {media.length}
          </div>
        </div>
      )}
    </div>
  );
}