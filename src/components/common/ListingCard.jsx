import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Maximize, Eye, ArrowUpRight } from 'lucide-react';
import { getImageUrl } from '../../lib/imageUrl';
import FavoriteButton from './FavoriteButton';
import CompareButton from './CompareButton';

export default function ListingCard({ listing }) {
  const coverImagePath = listing.listing_images?.find(img => img.is_cover)?.image_url;
  const coverImage = getImageUrl(coverImagePath);

  const formatPrice = (price, period) => {
    const formatted = new Intl.NumberFormat('fr-FR').format(price);
    return period ? `${formatted} FCFA/${period}` : `${formatted} FCFA`;
  };

  const photoCount = listing.listing_images?.length || 0;

  return (
    <Link
      to={`/annonces/${listing.id}`}
      className="group block bg-white dark:bg-[#1A1A1A] rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)] hover:-translate-y-1 border border-[#F0F0F0] dark:border-[#2A2A2A]"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-[#F5F5F7] dark:bg-[#2A2A2A]">
        {coverImage ? (
          <img
            src={coverImage}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <div className="w-16 h-16 rounded-2xl bg-[#EBF5ED] flex items-center justify-center">
              <span className="text-3xl">🏠</span>
            </div>
            <span className="text-xs text-[#94A3B8]">Pas de photo</span>
          </div>
        )}

        {/* Overlay gradient bas */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Badge type */}
        <div className="absolute top-3 left-3">
          <span className={`text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm ${
            listing.type === 'location'
              ? 'bg-[#3A7D44]/90 text-white'
              : 'bg-[#F59E0B]/90 text-white'
          }`}>
            {listing.type === 'location' ? '🔑 Location' : '🏷️ Vente'}
          </span>
        </div>

        {/* Actions top right */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {listing.users?.is_verified && (
            <span className="bg-white/90 backdrop-blur-sm text-[#3A7D44] text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
              ✓ Vérifié
            </span>
          )}
          <FavoriteButton listingId={listing.id} />
          <CompareButton listing={listing} />
        </div>

        {/* Nombre de photos */}
        {photoCount > 1 && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
            <Eye size={10} />
            {photoCount} photos
          </div>
        )}

        {/* Flèche hover */}
        <div className="absolute bottom-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 shadow-lg">
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

        {/* Titre */}
        <h3 className="font-bold text-sm text-[#0F172A] dark:text-white mb-3 line-clamp-2 leading-snug group-hover:text-[#3A7D44] transition-colors">
          {listing.title}
        </h3>

        {/* Specs */}
        {(listing.bedrooms > 0 || listing.bathrooms > 0 || listing.area) && (
          <div className="flex items-center gap-3 mb-3 pb-3 border-b border-[#F0F0F0] dark:border-[#2A2A2A]">
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
            <div className="font-black text-lg text-[#3A7D44] leading-none">
              {new Intl.NumberFormat('fr-FR').format(listing.price)}
            </div>
            <div className="text-xs text-[#94A3B8] mt-0.5">
              FCFA{listing.price_period ? `/${listing.price_period}` : ''}
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
    </Link>
  );
}