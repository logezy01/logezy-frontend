import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate} from 'react-router-dom';
import {
  MapPin, Bed, Bath, Home, Maximize, ChevronLeft, ChevronRight,
  Heart, Share2, Eye, Calendar, Shield, MessageSquare,
  Phone, CheckCircle, ArrowLeft, ZoomIn, X, Layers,
  Sofa, Car, Trees, Waves, Lock, Star
} from 'lucide-react';
import Navbar from '../components/common/Navbar';
import api from '../lib/axios';
import useAuthStore from '../store/authStore';
import useCompareStore from '../store/compareStore';
import toast from 'react-hot-toast';

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
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const heroRef = useRef(null);


  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const nextPhoto = () => setCurrentPhoto(p => (p + 1) % photos.length);
  const prevPhoto = () => setCurrentPhoto(p => (p - 1 + photos.length) % photos.length);

  useEffect(() => {
    if (!lightbox) return;
    const handler = (e) => {
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'ArrowLeft') prevPhoto();
      if (e.key === 'Escape') setLightbox(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightbox, photos.length]);

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
        toast.success('Ajouté aux favoris ❤️');
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
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#080B14]">
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

  return (
    <div className="min-h-screen bg-[#F4F5F7] dark:bg-[#080B14] pb-24 md:pb-12">
      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-slide { animation: fadeSlide 0.5s ease both; }
        .photo-thumb { transition: all 0.2s ease; }
        .photo-thumb:hover { transform: scale(1.05); }
        .photo-thumb.active { ring: 2px solid #3A7D44; transform: scale(1.05); }
        .sticky-bar {
          transition: all 0.3s ease;
        }
      `}</style>

      {/* Navbar */}
      <Navbar />

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 pt-4 pb-2">
        <div className="flex items-center gap-2 text-sm text-[#94A3B8]">
          <button onClick={() => navigate('/annonces')}
            className="flex items-center gap-1 hover:text-[#3A7D44] transition-colors font-medium">
            <ArrowLeft size={15} />
            Annonces
          </button>
          <span>/</span>
          <span className="text-[#334155] dark:text-white font-medium truncate max-w-xs">
            {listing.title}
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">

        {/* ══ GALERIE PRINCIPALE ══ */}
        <FadeIn>
          <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[380px] md:h-[460px] rounded-2xl overflow-hidden mb-6">

            {/* Photo principale */}
            <div className="col-span-4 md:col-span-3 row-span-2 relative group cursor-pointer"
              onClick={() => setLightbox(true)}>
              {photos.length > 0 ? (
                <img src={photos[currentPhoto]?.image_url} alt={listing.title}
                  className="w-full h-full object-cover"
                  loading="lazy" />
              ) : (
                <div className="w-full h-full bg-[#E8E8E8] dark:bg-[#1A1A1A] flex items-center justify-center">
                  <Home size={64} className="text-[#CBD5E1]" />
                </div>
              )}

              {/* Overlay hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2 text-sm font-bold text-[#0F172A]">
                  <ZoomIn size={16} />
                  Voir en grand
                </div>
              </div>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                  listing.type === 'location'
                    ? 'bg-[#3A7D44] text-white'
                    : 'bg-[#F59E0B] text-white'
                }`}>
                  {listing.type === 'location' ? '🔑 Location' : '🏷️ Vente'}
                </span>
                {listing.is_featured && (
                  <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-purple-500 text-white">
                    ⭐ Vedette
                  </span>
                )}
              </div>

              {/* Compteur photos */}
              {photos.length > 1 && (
                <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full">
                  {currentPhoto + 1} / {photos.length}
                </div>
              )}

              {/* Navigation photos */}
              {photos.length > 1 && (
                <>
                  <button onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110">
                    <ChevronLeft size={18} className="text-[#0F172A]" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110">
                    <ChevronRight size={18} className="text-[#0F172A]" />
                  </button>
                </>
              )}

              {/* Bouton zoom */}
              <button className="absolute bottom-4 right-4 w-9 h-9 bg-black/60 backdrop-blur-sm hover:bg-black/80 rounded-full flex items-center justify-center transition-all">
                <ZoomIn size={16} className="text-white" />
              </button>
            </div>

            {/* Miniatures côté droit — desktop seulement */}
            {photos.slice(1, 3).map((photo, i) => (
              <div key={i}
                className="hidden md:block relative cursor-pointer overflow-hidden group"
                onClick={() => { setCurrentPhoto(i + 1); }}>
                <img src={photo.image_url} alt={`Photo ${i + 2}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy" />
                {i === 1 && photos.length > 3 && (
                  <div onClick={(e) => { e.stopPropagation(); setLightbox(true); }}
                    className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer">
                    <span className="text-white font-bold text-lg">+{photos.length - 3}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </FadeIn>

        {/* ══ MINIATURES HORIZONTALES (mobile) ══ */}
        {photos.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-3 mb-6 md:hidden scrollbar-hide">
            {photos.map((photo, i) => (
              <button key={i} onClick={() => setCurrentPhoto(i)}
                className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                  currentPhoto === i ? 'border-[#3A7D44] scale-105' : 'border-transparent opacity-60'
                }`}>
                <img src={photo.image_url} alt={`Miniature ${i + 1}`}
                  className="w-full h-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>
        )}

        {/* ══ CONTENU PRINCIPAL ══ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── COLONNE GAUCHE (2/3) ── */}
          <div className="lg:col-span-2 space-y-4">

            {/* Bloc titre + actions */}
            <FadeIn delay={100}>
              <div className="bg-white dark:bg-[#111827] rounded-2xl p-5 shadow-sm border border-[#E8E8E8] dark:border-[#1F2937]">

                {/* Localisation */}
                <div className="flex items-center gap-1.5 text-[#3A7D44] text-sm font-medium mb-2">
                  <MapPin size={14} />
                  {listing.neighborhood && `${listing.neighborhood}, `}{listing.city}
                </div>

                {/* Titre */}
                <h1 className="text-xl md:text-2xl font-black text-[#0F172A] dark:text-white leading-tight mb-3">
                  {listing.title}
                </h1>

                {/* Prix */}
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-black text-[#3A7D44]">
                    {formatPrice(listing.price)}
                  </span>
                  <span className="text-[#64748B] dark:text-[#94A3B8] font-medium">
                    FCFA{listing.type === 'location' && listing.price_period && `/${listing.price_period}`}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-4 border-t border-[#F1F5F9] dark:border-[#1F2937]">
                  <button onClick={handleFavorite} disabled={favoriteLoading}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
                      isFavorite
                        ? 'bg-red-50 border-red-200 text-red-500'
                        : 'bg-[#F8F9FA] dark:bg-[#1F2937] border-[#E8E8E8] dark:border-[#374151] text-[#64748B] dark:text-[#94A3B8] hover:border-red-200 hover:text-red-400'
                    }`}>
                    <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
                    {isFavorite ? 'Favori' : 'Sauvegarder'}
                  </button>

                  <button onClick={handleShare}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-[#F8F9FA] dark:bg-[#1F2937] border border-[#E8E8E8] dark:border-[#374151] text-[#64748B] dark:text-[#94A3B8] hover:border-[#3A7D44] hover:text-[#3A7D44] transition-all">
                    <Share2 size={16} />
                    Partager
                  </button>

                  <button onClick={() => addToCompare(listing)}
                    disabled={(compareList || []).some(l => l.id === listing.id)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-[#F8F9FA] dark:bg-[#1F2937] border border-[#E8E8E8] dark:border-[#374151] text-[#64748B] dark:text-[#94A3B8] hover:border-[#3A7D44] hover:text-[#3A7D44] transition-all disabled:opacity-40">
                    <Layers size={16} />
                    Comparer
                  </button>

                  {/* Méta */}
                  <div className="ml-auto flex items-center gap-3 text-xs text-[#94A3B8]">
                    <span className="flex items-center gap-1">
                      <Eye size={13} />
                      {listing.views_count || 0} vues
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={13} />
                      {new Date(listing.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Onglets */}
            <FadeIn delay={150}>
              <div className="bg-white dark:bg-[#111827] rounded-2xl shadow-sm border border-[#E8E8E8] dark:border-[#1F2937] overflow-hidden">
                <div className="flex border-b border-[#F1F5F9] dark:border-[#1F2937]">
                  {[
                    { id: 'details', label: 'Caractéristiques' },
                    { id: 'description', label: 'Description' },
                    { id: 'equipements', label: 'Équipements' },
                  ].map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 py-3.5 text-sm font-semibold transition-all relative ${
                        activeTab === tab.id
                          ? 'text-[#3A7D44]'
                          : 'text-[#94A3B8] hover:text-[#334155] dark:hover:text-white'
                      }`}>
                      {tab.label}
                      {activeTab === tab.id && (
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-[#3A7D44] rounded-full" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="p-5">
                  {/* Onglet Caractéristiques */}
                  {activeTab === 'details' && (
                    <div className="fade-slide">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                        {listing.bedrooms > 0 && (
                          <div className="flex flex-col items-center gap-2 p-4 bg-[#F8F9FA] dark:bg-[#1F2937] rounded-xl">
                            <Bed size={22} className="text-[#3A7D44]" />
                            <span className="text-xl font-black text-[#0F172A] dark:text-white">{listing.bedrooms}</span>
                            <span className="text-xs text-[#94A3B8] font-medium">Chambres</span>
                          </div>
                        )}
                        {listing.bathrooms > 0 && (
                          <div className="flex flex-col items-center gap-2 p-4 bg-[#F8F9FA] dark:bg-[#1F2937] rounded-xl">
                            <Bath size={22} className="text-[#3A7D44]" />
                            <span className="text-xl font-black text-[#0F172A] dark:text-white">{listing.bathrooms}</span>
                            <span className="text-xs text-[#94A3B8] font-medium">Salles de bain</span>
                          </div>
                        )}
                        {listing.living_rooms > 0 && (
                          <div className="flex flex-col items-center gap-2 p-4 bg-[#F8F9FA] dark:bg-[#1F2937] rounded-xl">
                            <Sofa size={22} className="text-[#3A7D44]" />
                            <span className="text-xl font-black text-[#0F172A] dark:text-white">{listing.living_rooms}</span>
                            <span className="text-xs text-[#94A3B8] font-medium">Salons</span>
                          </div>
                        )}
                        {listing.area && (
                          <div className="flex flex-col items-center gap-2 p-4 bg-[#F8F9FA] dark:bg-[#1F2937] rounded-xl">
                            <Maximize size={22} className="text-[#3A7D44]" />
                            <span className="text-xl font-black text-[#0F172A] dark:text-white">{listing.area}</span>
                            <span className="text-xs text-[#94A3B8] font-medium">m²</span>
                          </div>
                        )}
                      </div>

                      {/* Infos supplémentaires */}
                      {listing.info_supplementaires && (
                        <div className="bg-[#EBF5ED] dark:bg-[#1F2937] border border-[#3A7D44]/20 rounded-xl p-4">
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
                  )}

                  {/* Onglet Description */}
                  {activeTab === 'description' && (
                    <div className="fade-slide">
                      {listing.description ? (
                        <p className="text-[#334155] dark:text-[#94A3B8] leading-relaxed text-sm whitespace-pre-wrap">
                          {listing.description}
                        </p>
                      ) : (
                        <p className="text-[#94A3B8] italic text-sm">Aucune description fournie.</p>
                      )}
                    </div>
                  )}

                  {/* Onglet Équipements */}
                  {activeTab === 'equipements' && (
                    <div className="fade-slide">
                      {equipements.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {equipements.map(({ label, icon: Icon }) => (
                            <div key={label} className="flex items-center gap-3 p-3 bg-[#F8F9FA] dark:bg-[#1F2937] rounded-xl">
                              <div className="w-8 h-8 bg-[#EBF5ED] rounded-lg flex items-center justify-center shrink-0">
                                <Icon size={16} className="text-[#3A7D44]" />
                              </div>
                              <span className="text-sm font-semibold text-[#334155] dark:text-white">{label}</span>
                              <CheckCircle size={14} className="text-[#3A7D44] ml-auto" />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[#94A3B8] italic text-sm">Aucun équipement spécifié.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </FadeIn>

            {/* Vignettes photos desktop */}
            {photos.length > 1 && (
              <FadeIn delay={200}>
                <div className="hidden md:block bg-white dark:bg-[#111827] rounded-2xl p-4 shadow-sm border border-[#E8E8E8] dark:border-[#1F2937]">
                  <p className="text-sm font-bold text-[#0F172A] dark:text-white mb-3">
                    Toutes les photos ({photos.length})
                  </p>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {photos.map((photo, i) => (
                      <button key={i} onClick={() => { setCurrentPhoto(i); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                          currentPhoto === i ? 'border-[#3A7D44] scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                        }`}>
                        <img src={photo.image_url} alt={`Photo ${i + 1}`}
                          className="w-full h-full object-cover" loading="lazy" />
                      </button>
                    ))}
                  </div>
                </div>
              </FadeIn>
            )}
          </div>

          {/* ── COLONNE DROITE (1/3) ── */}
          <div className="space-y-4">

            {/* Card prix + contact */}
            <FadeIn delay={200}>
              <div className="bg-white dark:bg-[#111827] rounded-2xl p-5 shadow-sm border border-[#E8E8E8] dark:border-[#1F2937] sticky top-20">

                {/* Prix */}
                <div className="mb-4 pb-4 border-b border-[#F1F5F9] dark:border-[#1F2937]">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-black text-[#3A7D44]">
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

                {/* Boutons contact */}
                <div className="space-y-2.5 mb-4">
                  <button onClick={handleContact}
                    className="w-full bg-[#3A7D44] hover:bg-[#2D6235] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-[#3A7D44]/30 active:scale-95">
                    <MessageSquare size={17} />
                    Contacter le propriétaire
                  </button>

                  <button onClick={handleWhatsApp}
                    className="w-full bg-[#25D366] hover:bg-[#1db954] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95">
                    <Phone size={16} />
                    WhatsApp
                  </button>
                </div>

                {/* Badge vérification */}
                <div className="flex items-center gap-2 py-2.5 px-3 bg-[#EBF5ED] dark:bg-[#1F2937] rounded-xl">
                  <Shield size={15} className="text-[#3A7D44] shrink-0" />
                  <p className="text-xs text-[#3A7D44] font-semibold">Annonce vérifiée par Logezy</p>
                </div>

                {/* Propriétaire */}
                {listing.users && (
                  <div className="mt-4 pt-4 border-t border-[#F1F5F9] dark:border-[#1F2937]">
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
                  </div>
                )}
              </div>
            </FadeIn>

            {/* Résumé */}
            <FadeIn delay={250}>
              <div className="bg-white dark:bg-[#111827] rounded-2xl p-5 shadow-sm border border-[#E8E8E8] dark:border-[#1F2937]">
                <p className="text-sm font-bold text-[#0F172A] dark:text-white mb-3">Résumé</p>
                <div className="space-y-2.5">
                  {[
                    { label: 'Type', value: listing.type === 'location' ? '🔑 Location' : '🏷️ Vente' },
                    { label: 'Ville', value: `📍 ${listing.city}` },
                    listing.neighborhood && { label: 'Quartier', value: listing.neighborhood },
                    listing.floors > 0 && { label: 'Étages', value: `${listing.floors} étage(s)` },
                    { label: 'Vues', value: `👁️ ${listing.views_count || 0}` },
                    { label: 'Publié le', value: new Date(listing.created_at).toLocaleDateString('fr-FR') },
                  ].filter(Boolean).map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between py-1.5 border-b border-[#F8F9FA] dark:border-[#1F2937] last:border-0">
                      <span className="text-xs text-[#94A3B8] font-medium">{label}</span>
                      <span className="text-xs font-semibold text-[#334155] dark:text-white">{value}</span>
                    </div>
                  ))}
                </div>
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
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all z-10">
            <X size={20} />
          </button>

          <button onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all">
            <ChevronLeft size={22} />
          </button>

          <img src={photos[currentPhoto]?.image_url} alt={listing.title}
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl"
            onClick={e => e.stopPropagation()} />

          <button onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all">
            <ChevronRight size={22} />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
            {photos.map((_, i) => (
              <button key={i} onClick={(e) => { e.stopPropagation(); setCurrentPhoto(i); }}
                className={`rounded-full transition-all ${
                  currentPhoto === i ? 'w-5 h-2 bg-white' : 'w-2 h-2 bg-white/40 hover:bg-white/60'
                }`} />
            ))}
          </div>

          <div className="absolute bottom-4 right-4 text-white/60 text-sm">
            {currentPhoto + 1} / {photos.length}
          </div>
        </div>
      )}
    </div>
  );
}