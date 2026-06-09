import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Maximize, Shield, ChevronLeft, MessageSquare, Phone, Eye, Calendar, Share2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../components/common/Navbar';
import api from '../lib/axios';
import useAuthStore from '../store/authStore';
import PhotoGallery from '../components/common/PhotoGallery';
import { getImageUrl } from '../lib/imageUrl';
import FavoriteButton from '../components/common/FavoriteButton';

export default function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contacting, setContacting] = useState(false);
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`/listings/${id}`);
        setListing(res.data.listing);
      } catch (e) {
        toast.error('Annonce introuvable');
        navigate('/annonces');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleContact = async () => {
    if (!isAuthenticated) {
      toast.error('Connectez-vous pour contacter le propriétaire');
      navigate('/login');
      return;
    }
    if (user?.id === listing?.owner_id) {
      toast.error('Vous ne pouvez pas vous contacter vous-même');
      return;
    }
    setContacting(true);
    try {
      await api.post('/chat/conversations', {
        listing_id: listing.id,
        owner_id: listing.owner_id,
      });
      toast.success('Conversation ouverte ! Allez dans vos messages.');
      setTimeout(() => {
        switch (user?.role) {
          case 'proprietaire': navigate('/dashboard/proprietaire/messages'); break;
          case 'agent': navigate('/dashboard/agent/messages'); break;
          default: navigate('/dashboard/locataire/messages');
        }
      }, 1000);
    } catch (e) {
      toast.error('Erreur lors de la mise en contact');
    } finally {
      setContacting(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: listing.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Lien copié !');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0A0A0A]">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-4">
        <div className="rounded-2xl bg-white dark:bg-[#1A1A1A] h-96 animate-pulse" />
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 rounded-2xl bg-white dark:bg-[#1A1A1A] h-48 animate-pulse" />
          <div className="rounded-2xl bg-white dark:bg-[#1A1A1A] h-48 animate-pulse" />
        </div>
      </div>
    </div>
  );

  if (!listing) return null;

  const images = listing.listing_images || [];
  const EQUIPMENTS = [
    { key: 'is_furnished', label: 'Meublé', icon: '🛋️' },
    { key: 'has_parking', label: 'Parking', icon: '🚗' },
    { key: 'has_garden', label: 'Jardin', icon: '🌿' },
    { key: 'has_pool', label: 'Piscine', icon: '🏊' },
    { key: 'has_security', label: 'Sécurité', icon: '🔒' },
  ];

  const equippedCount = EQUIPMENTS.filter(e => listing[e.key]).length;

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0A0A0A] pb-20 md:pb-0">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-6">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-6">
          <Link to="/annonces"
            className="flex items-center gap-1 text-[#64748B] dark:text-[#94A3B8] hover:text-[#3A7D44] transition-colors font-medium">
            <ChevronLeft size={16} /> Annonces
          </Link>
          <span className="text-[#C0C0C0]">/</span>
          <span className="text-[#0F172A] dark:text-white font-medium truncate max-w-xs">{listing.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-5">

            {/* Galerie */}
            <div className="relative rounded-2xl overflow-hidden">
              <PhotoGallery images={listing.listing_images || []} title={listing.title} />
              <div className="absolute top-4 left-4 flex gap-2 z-10">
                <span className={`text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm ${
                  listing.type === 'location'
                    ? 'bg-[#3A7D44]/90 text-white'
                    : 'bg-[#F59E0B]/90 text-white'
                }`}>
                  {listing.type === 'location' ? '🔑 Location' : '🏷️ Vente'}
                </span>
                {listing.users?.is_verified && (
                  <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-[#3A7D44]">
                    ✓ Vérifié
                  </span>
                )}
              </div>
              <div className="absolute top-4 right-4 z-10 flex gap-2">
                <button onClick={handleShare}
                  className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-sm">
                  <Share2 size={16} className="text-[#334155]" />
                </button>
                <FavoriteButton listingId={listing.id} />
              </div>
            </div>

            {/* Titre + infos principales */}
            <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl p-6 border border-[#E8E8E8] dark:border-[#2A2A2A]">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="font-display text-2xl font-black text-[#0F172A] dark:text-white mb-2 leading-tight">
                    {listing.title}
                  </h1>
                  <div className="flex items-center gap-1.5 text-[#64748B] dark:text-[#94A3B8]">
                    <MapPin size={14} className="text-[#3A7D44] shrink-0" />
                    <span className="text-sm">
                      {listing.neighborhood ? `${listing.neighborhood}, ` : ''}{listing.city}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-black text-2xl text-[#3A7D44]">
                    {new Intl.NumberFormat('fr-FR').format(listing.price)}
                  </div>
                  <div className="text-sm text-[#94A3B8]">
                    FCFA{listing.price_period ? `/${listing.price_period}` : ''}
                  </div>
                </div>
              </div>

              {/* Specs */}
              {(listing.bedrooms > 0 || listing.bathrooms > 0 || listing.area || listing.living_rooms > 0) && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 pb-4 border-b border-[#E8E8E8] dark:border-[#2A2A2A]">
                  {[
                    { value: listing.bedrooms, label: 'Chambres', icon: '🛏️', show: listing.bedrooms > 0 },
                    { value: listing.bathrooms, label: 'Salles de bain', icon: '🚿', show: listing.bathrooms > 0 },
                    { value: listing.living_rooms, label: 'Salons', icon: '🛋️', show: listing.living_rooms > 0 },
                    { value: listing.area ? `${listing.area}m²` : null, label: 'Superficie', icon: '📐', show: !!listing.area },
                  ].filter(s => s.show).map((s, i) => (
                    <div key={i} className="bg-[#F8F9FA] dark:bg-[#2A2A2A] rounded-xl p-3 text-center">
                      <div className="text-xl mb-1">{s.icon}</div>
                      <div className="font-black text-lg text-[#0F172A] dark:text-white">{s.value}</div>
                      <div className="text-xs text-[#94A3B8]">{s.label}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-[#94A3B8]">
                <div className="flex items-center gap-1">
                  <Eye size={12} />
                  {listing.views_count || 0} vues
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={12} />
                  Publié le {new Date(listing.created_at).toLocaleDateString('fr-FR')}
                </div>
                {listing.floors > 0 && (
                  <div>🏢 {listing.floors} étage(s)</div>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-[#E8E8E8] dark:border-[#2A2A2A] overflow-hidden">
              <div className="flex border-b border-[#E8E8E8] dark:border-[#2A2A2A]">
                {[
                  { key: 'info', label: '📋 Description' },
                  { key: 'equipments', label: `✨ Équipements ${equippedCount > 0 ? `(${equippedCount})` : ''}` },
                ].map(tab => (
                  <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                    className={`flex-1 py-3.5 text-sm font-bold transition-all ${
                      activeTab === tab.key
                        ? 'text-[#3A7D44] border-b-2 border-[#3A7D44] bg-[#EBF5ED]/50'
                        : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white hover:bg-[#F8F9FA] dark:hover:bg-[#2A2A2A]'
                    }`}>
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {activeTab === 'info' && (
                  <div>
                    {listing.description ? (
                      <p className="text-[#334155] dark:text-[#94A3B8] leading-relaxed text-sm">
                        {listing.description}
                      </p>
                    ) : (
                      <div className="text-center py-8 text-[#94A3B8]">
                        <span className="text-3xl block mb-2">📝</span>
                        <p className="text-sm">Aucune description disponible</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'equipments' && (
                  <div>
                    {equippedCount === 0 ? (
                      <div className="text-center py-8 text-[#94A3B8]">
                        <span className="text-3xl block mb-2">🏠</span>
                        <p className="text-sm">Aucun équipement spécifié</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {EQUIPMENTS.map(eq => (
                          <div key={eq.key}
                            className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all ${
                              listing[eq.key]
                                ? 'border-[#3A7D44] bg-[#EBF5ED] dark:bg-[#3A7D44]/10'
                                : 'border-[#E8E8E8] dark:border-[#2A2A2A] opacity-40'
                            }`}>
                            <span className="text-xl">{eq.icon}</span>
                            <span className={`text-sm font-bold ${
                              listing[eq.key] ? 'text-[#3A7D44]' : 'text-[#94A3B8]'
                            }`}>
                              {eq.label}
                            </span>
                            {listing[eq.key] && <span className="ml-auto text-[#3A7D44] text-xs font-black">✓</span>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">

            {/* Prix + CTA sticky */}
            <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl p-5 border border-[#E8E8E8] dark:border-[#2A2A2A] sticky top-24">

              {/* Prix */}
              <div className="pb-4 mb-4 border-b border-[#E8E8E8] dark:border-[#2A2A2A]">
                <div className="font-black text-3xl text-[#3A7D44] leading-none">
                  {new Intl.NumberFormat('fr-FR').format(listing.price)}
                </div>
                <div className="text-sm text-[#94A3B8] mt-1">
                  FCFA{listing.price_period ? `/${listing.price_period}` : ''}
                </div>
              </div>

              {/* Boutons */}
              <div className="space-y-3">
                <button onClick={handleContact} disabled={contacting}
                  className="w-full bg-[#3A7D44] hover:bg-[#2D6235] disabled:opacity-50 text-white font-bold py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(58,125,68,0.3)]">
                  {contacting
                    ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <><MessageSquare size={16} /> Contacter</>
                  }
                </button>

                {listing.users?.phone && (
                  <a href={`tel:${listing.users.phone}`}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-[#E8E8E8] dark:border-[#2A2A2A] text-sm font-bold text-[#334155] dark:text-[#94A3B8] hover:border-[#3A7D44] hover:text-[#3A7D44] transition-all">
                    <Phone size={16} />
                    {listing.users.phone}
                  </a>
                )}

                {/* WhatsApp */}
                {listing.users?.phone && (
                  <a href={`https://wa.me/${listing.users.phone.replace(/\s/g, '')}?text=Bonjour, je suis intéressé par votre annonce "${listing.title}" sur Logezy.`}
                    target="_blank" rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#25D366] hover:bg-[#128C7E] text-white text-sm font-bold transition-all">
                    💬 WhatsApp
                  </a>
                )}
              </div>

              {/* Sécurité */}
              <div className="mt-4 pt-4 border-t border-[#E8E8E8] dark:border-[#2A2A2A] flex items-center gap-2">
                <Shield size={14} className="text-[#3A7D44] shrink-0" />
                <span className="text-xs text-[#94A3B8]">Annonce vérifiée par Logezy</span>
              </div>
            </div>

            {/* Propriétaire */}
            <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl p-5 border border-[#E8E8E8] dark:border-[#2A2A2A]">
              <h3 className="font-bold text-sm text-[#0F172A] dark:text-white mb-4">Publié par</h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#3A7D44] text-white flex items-center justify-center font-black text-lg shrink-0">
                  {listing.users?.full_name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-bold text-sm text-[#0F172A] dark:text-white">{listing.users?.full_name}</div>
                  {listing.users?.is_verified && (
                    <span className="text-xs text-[#3A7D44] font-bold">✓ Propriétaire vérifié</span>
                  )}
                  <div className="text-xs text-[#94A3B8] mt-0.5 capitalize">{listing.users?.role}</div>
                </div>
              </div>
            </div>

            {/* Résumé */}
            <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl p-5 border border-[#E8E8E8] dark:border-[#2A2A2A]">
              <h3 className="font-bold text-sm text-[#0F172A] dark:text-white mb-4">Résumé</h3>
              <div className="space-y-3">
                {[
                  { label: 'Type', value: listing.type === 'location' ? '🔑 Location' : '🏷️ Vente' },
                  { label: 'Ville', value: `📍 ${listing.city}` },
                  listing.neighborhood && { label: 'Quartier', value: listing.neighborhood },
                  listing.area && { label: 'Superficie', value: `${listing.area}m²` },
                  { label: 'Vues', value: `👁️ ${listing.views_count || 0}` },
                  { label: 'Publié le', value: new Date(listing.created_at).toLocaleDateString('fr-FR') },
                ].filter(Boolean).map((item, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className="text-xs text-[#94A3B8]">{item.label}</span>
                    <span className="text-xs font-bold text-[#0F172A] dark:text-white">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}