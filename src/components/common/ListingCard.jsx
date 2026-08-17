import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Bed, Bath, Maximize, Eye, ArrowUpRight, Film } from 'lucide-react';
import { getImageUrl } from '../../lib/imageUrl';
import FavoriteButton from './FavoriteButton';
import CompareButton from './CompareButton';
import { useState } from 'react';
import useAuthStore from '../../store/authStore';
import AuthGateModal from './AuthGateModal';

export default function ListingCard({ listing }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const coverImagePath = listing.listing_images?.find(img => img.is_cover)?.image_url;
  const coverImage = getImageUrl(coverImagePath);

  const formatPrice = (price, period) => {
    const formatted = new Intl.NumberFormat('fr-FR').format(price);
    return period ? `${formatted} FCFA/${period}` : `${formatted} FCFA`;
  };

    const photoCount = listing.listing_images?.length || 0;

  const isNew = listing.created_at
    ? (Date.now() - new Date(listing.created_at).getTime()) < 7 * 24 * 60 * 60 * 1000
    : false;

  return (
    <>
      <div
        onClick={() => {
          if (!isAuthenticated) { setShowAuthModal(true); return; }
          navigate(`/annonces/${listing.id}`);
        }}
        role="link"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key !== 'Enter') return;
          if (!isAuthenticated) { setShowAuthModal(true); return; }
          navigate(`/annonces/${listing.id}`);
        }}
        className="group block bg-white dark:bg-[#161616] rounded-[20px] overflow-hidden border border-[#F0F0F0] dark:border-[#262626] cursor-pointer"
        style={{
          transition: 'transform 0.4s cubic-bezier(0.23,1,0.32,1), box-shadow 0.4s cubic-bezier(0.23,1,0.32,1)',
          boxShadow: '0 1px 3px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.04)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-6px)';
          e.currentTarget.style.boxShadow = '0 24px 48px -12px rgba(15,23,42,0.18), 0 8px 16px -8px rgba(15,23,42,0.08)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 1px 3px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.04)';
        }}
      >
        {/* Image */}
        <div className="relative h-52 overflow-hidden bg-[#F5F5F7] dark:bg-[#222222]">
          {coverImage ? (
            <>
              {/* Shimmer pendant chargement */}
              {!imgLoaded && (
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(90deg, #EEEEEE 25%, #F5F5F5 50%, #EEEEEE 75%)',
                    backgroundSize: '200% 100%',
                    animation: 'cardShimmer 1.4s ease-in-out infinite',
                  }}
                />
              )}
              <img
                src={coverImage}
                alt={listing.title}
                loading="lazy"
                onLoad={() => setImgLoaded(true)}
                className="w-full h-full object-cover"
                style={{
                  opacity: imgLoaded ? 1 : 0,
                  transition: 'opacity 0.4s ease, transform 0.6s cubic-bezier(0.23,1,0.32,1)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.06)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
              />
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
              <div className="w-16 h-16 rounded-2xl bg-[#EBF5ED] dark:bg-[#1A2E20] flex items-center justify-center">
                <span className="text-3xl">🏠</span>
              </div>
              <span className="text-xs text-[#94A3B8]">Pas de photo</span>
            </div>
          )}

          {/* Overlay gradient bas — plus doux */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

          {/* Badges haut gauche — type, coup de cœur, nouveau, vidéo */}
          <div className="absolute top-3 left-3 right-3 flex flex-wrap items-center gap-1.5">
            <span
              className={`text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-md ${
                listing.type === 'location'
                  ? 'bg-[#3A7D44]/85 text-white'
                  : 'bg-[#F59E0B]/85 text-white'
              }`}
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
            >
              {listing.type === 'location' ? '🔑 Location' : '🏷️ Vente'}
            </span>

            {listing.is_featured && (
              <span
                className="text-xs font-bold px-2.5 py-1.5 rounded-full text-white backdrop-blur-md flex items-center gap-1"
                style={{
                  background: 'linear-gradient(135deg, rgba(236,72,153,0.9), rgba(217,70,239,0.9))',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                }}
              >
                💜 Coup de cœur
              </span>
            )}

            {isNew && (
              <span
                className="text-xs font-bold px-2.5 py-1.5 rounded-full bg-[#3B82F6]/85 text-white backdrop-blur-md flex items-center gap-1"
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
              >
                ✨ Nouveau
              </span>
            )}

            {listing.listing_videos?.length > 0 && (
              <span
                className="text-xs font-bold px-2.5 py-1.5 rounded-full bg-black/60 text-white backdrop-blur-md flex items-center gap-1"
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
              >
                <Film size={11} /> Vidéo
              </span>
            )}
          </div>

          {/* Actions top right */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            {listing.users?.is_verified && (
              <span
                className="bg-white/85 backdrop-blur-md text-[#3A7D44] text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1"
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
              >
                ✓ Vérifié
              </span>
            )}
            <FavoriteButton listingId={listing.id} />
            <CompareButton listing={listing} />
          </div>

          {/* Nombre de photos */}
          {photoCount > 1 && (
            <div
              className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/45 backdrop-blur-md text-white text-xs px-2 py-1 rounded-full"
            >
              <Eye size={10} />
              {photoCount} photos
            </div>
          )}

          {/* Flèche hover */}
          <div
            className="absolute bottom-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
            style={{
              transition: 'all 0.35s cubic-bezier(0.23,1,0.32,1)',
              boxShadow: '0 8px 20px rgba(0,0,0,0.18)',
            }}
          >
            <ArrowUpRight size={16} className="text-[#3A7D44]" />
          </div>
        </div>

        {/* Contenu */}
        <div className="p-4">

          {/* Localisation */}
          <div className="flex items-center gap-1.5 text-[#94A3B8] text-xs mb-2">
            <MapPin size={11} className="text-[#3A7D44] shrink-0" />
            <span className="truncate">
              {listing.neighborhood ? `${listing.neighborhood}, ` : ''}{listing.city}
            </span>
          </div>

          {/* Badge agence */}
          {listing.users?.agencies && (
            <Link
              to={`/agences/${listing.users.agencies.id}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 mb-3 w-fit bg-[#EBF5ED] dark:bg-[#1A2E20] pl-1 pr-3 py-1 rounded-full hover:bg-[#DCEEE0] dark:hover:bg-[#20402A] transition-colors border border-[#3A7D44]/20"
            >
              {listing.users.agencies.logo_url ? (
                <img
                  src={listing.users.agencies.logo_url}
                  alt={listing.users.agencies.name}
                  className="w-6 h-6 rounded-full object-cover shrink-0"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-[#3A7D44] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  {listing.users.agencies.name?.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="text-xs font-bold text-[#3A7D44] truncate max-w-[120px]">
                🏢 {listing.users.agencies.name}
              </span>
            </Link>
          )}

          {/* Titre */}
          <h3 className="font-bold text-[15px] text-[#0F172A] dark:text-white mb-3 line-clamp-2 leading-snug group-hover:text-[#3A7D44] transition-colors" style={{ letterSpacing: '-0.01em' }}>
            {listing.title}
          </h3>

          {/* Specs */}
          {(listing.bedrooms > 0 || listing.bathrooms > 0 || listing.area) && (
            <div className="flex items-center gap-3 mb-3 pb-3 border-b border-[#F0F0F0] dark:border-[#262626]">
              {listing.bedrooms > 0 && (
                <div className="flex items-center gap-1 text-xs text-[#64748B] dark:text-[#94A3B8]">
                  <Bed size={12} className="text-[#3A7D44]" />
                  <span>{listing.bedrooms} ch.</span>
                </div>
              )}
              {listing.bathrooms > 0 && (
                <div className="flex items-center gap-1 text-xs text-[#64748B] dark:text-[#94A3B8]">
                  <Bath size={12} className="text-[#3A7D44]" />
                  <span>{listing.bathrooms} sdb.</span>
                </div>
              )}
              {listing.area && (
                <div className="flex items-center gap-1 text-xs text-[#64748B] dark:text-[#94A3B8]">
                  <Maximize size={12} className="text-[#3A7D44]" />
                  <span>{listing.area}m²</span>
                </div>
              )}
            </div>
          )}

          {/* Prix + propriétaire */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-black text-xl text-[#3A7D44] leading-none" style={{ letterSpacing: '-0.02em' }}>
                {new Intl.NumberFormat('fr-FR').format(listing.price)}
              </div>
              <div className="text-xs text-[#94A3B8] mt-1 font-medium">
                FCFA{listing.type === 'location' && listing.price_period && `/${listing.price_period}`}
              </div>
            </div>

            {listing.users && (
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#3A7D44] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  {listing.users.full_name?.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block">
                  <div className="text-xs font-medium text-[#334155] dark:text-[#94A3B8] truncate max-w-[80px]">
                    {listing.users.full_name?.split(' ')[0]}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes cardShimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      <AuthGateModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}