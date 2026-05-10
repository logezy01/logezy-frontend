import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Maximize } from 'lucide-react';
import { getImageUrl } from '../../lib/imageUrl';
import FavoriteButton from './FavoriteButton';
import CompareButton from './CompareButton';


export default function ListingCard({ listing }) {
  const coverImagePath = listing.listing_images?.find(img => img.is_cover)?.image_url;
const coverImage = getImageUrl(coverImagePath);
const baseURL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

  const formatPrice = (price, period) => {
    const formatted = new Intl.NumberFormat('fr-FR').format(price);
    return period ? `${formatted} FCFA/${period}` : `${formatted} FCFA`;
  };

  return (
    <Link to={`/annonces/${listing.id}`} className="card overflow-hidden hover:shadow-float transition-shadow duration-200 group block">
      
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-[#E8F5EE] to-[#DBEAFE] overflow-hidden">
        {coverImage ? (
          <img
            src={coverImage}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl">🏠</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3">
          <span className={listing.type === 'location' ? 'badge-location' : 'badge-vente'}>
            {listing.type === 'location' ? 'Location' : 'Vente'}
          </span>
        </div>

       <div className="absolute top-3 right-3 flex flex-col gap-2">
  {listing.users?.is_verified && (
    <div className="bg-white text-[#3A7D44] text-xs font-bold px-2 py-1 rounded-full">
      ✓ Vérifié
    </div>
  )}
  <FavoriteButton listingId={listing.id} />
  <CompareButton listing={listing} />
</div>
      </div>

      {/* Contenu */}
      <div className="p-4">
        <h3 className="font-bold text-sm text-[#0F172A] mb-1 line-clamp-2 leading-snug">
          {listing.title}
        </h3>

        <div className="flex items-center gap-1 text-[#64748B] text-xs mb-3">
          <MapPin size={12} />
          <span>{listing.neighborhood ? `${listing.neighborhood}, ` : ''}{listing.city}</span>
        </div>

        {/* Specs */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {listing.bedrooms > 0 && (
            <span className="flex items-center gap-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-full px-2 py-1 text-xs text-[#334155]">
              <Bed size={10} /> {listing.bedrooms} ch.
            </span>
          )}
          {listing.bathrooms > 0 && (
            <span className="flex items-center gap-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-full px-2 py-1 text-xs text-[#334155]">
              <Bath size={10} /> {listing.bathrooms} sdb.
            </span>
          )}
          {listing.area && (
            <span className="flex items-center gap-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-full px-2 py-1 text-xs text-[#334155]">
              <Maximize size={10} /> {listing.area}m²
            </span>
          )}
        </div>

        {/* Prix */}
        <div className="font-black text-base text-[#1A6B3C]">
          {formatPrice(listing.price, listing.price_period)}
        </div>
      </div>
    </Link>
  );
}