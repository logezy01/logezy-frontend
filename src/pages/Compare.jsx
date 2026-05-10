import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Check, X } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import useCompareStore from '../store/compareStore';
import { getImageUrl } from '../lib/imageUrl';

const formatPrice = (price, period) => {
  const formatted = new Intl.NumberFormat('fr-FR').format(price);
  return period ? `${formatted} FCFA/${period}` : `${formatted} FCFA`;
};

const CRITERIA = [
  { key: 'price', label: '💰 Prix', format: (l) => formatPrice(l.price, l.price_period) },
  { key: 'type', label: '🏷️ Type', format: (l) => l.type === 'location' ? '🔑 Location' : '🏷️ Vente' },
  { key: 'city', label: '📍 Ville', format: (l) => `${l.neighborhood ? `${l.neighborhood}, ` : ''}${l.city}` },
  { key: 'bedrooms', label: '🛏 Chambres', format: (l) => l.bedrooms || '—' },
  { key: 'bathrooms', label: '🚿 Salles de bain', format: (l) => l.bathrooms || '—' },
  { key: 'living_rooms', label: '🛋 Salons', format: (l) => l.living_rooms || '—' },
  { key: 'area', label: '📐 Superficie', format: (l) => l.area ? `${l.area} m²` : '—' },
  { key: 'floors', label: '🏢 Étages', format: (l) => l.floors || '0' },
  { key: 'is_furnished', label: '🛋 Meublé', type: 'bool' },
  { key: 'has_parking', label: '🚗 Parking', type: 'bool' },
  { key: 'has_garden', label: '🌿 Jardin', type: 'bool' },
  { key: 'has_pool', label: '🏊 Piscine', type: 'bool' },
  { key: 'has_security', label: '🔒 Sécurité', type: 'bool' },
];

export default function Compare() {
  const { items, removeItem, clearItems } = useCompareStore();
  const navigate = useNavigate();

  if (items.length < 2) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] dark:bg-[#0F0F0F] pb-20 md:pb-0">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <span className="text-6xl block mb-4">🔍</span>
          <h1 className="font-display text-2xl font-bold text-[#0F172A] dark:text-white mb-3">
            Sélectionnez des biens à comparer
          </h1>
          <p className="text-[#64748B] mb-6">
            Vous avez besoin d'au moins 2 biens pour faire une comparaison.
          </p>
          <button onClick={() => navigate('/annonces')} className="btn-primary px-6 py-3">
            Parcourir les annonces
          </button>
        </div>
      </div>
    );
  }

  // Trouver les valeurs différentes pour les surligner
  const isDifferent = (key) => {
    const values = items.map(l => l[key]);
    return new Set(values).size > 1;
  };

  // Trouver le meilleur prix
  const bestPrice = Math.min(...items.map(l => l.price));

  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-[#0F0F0F] pb-20 md:pb-0">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-6 animate-fade-in">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)}
              className="p-2 rounded-btn hover:bg-white dark:hover:bg-[#1A1A1A] text-[#64748B] transition-colors">
              <ChevronLeft size={20} />
            </button>
            <div>
              <h1 className="font-display text-xl font-bold text-[#0F172A] dark:text-white">
                Comparaison de biens
              </h1>
              <p className="text-xs text-[#64748B]">{items.length} biens sélectionnés</p>
            </div>
          </div>
          <button onClick={clearItems}
            className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors">
            Tout effacer
          </button>
        </div>

        {/* Tableau comparatif */}
        <div className="card overflow-hidden animate-scale-in">
          <div className="overflow-x-auto">
            <table className="w-full">

              {/* Photos + titres */}
              <thead>
                <tr className="border-b border-[#E2E8F0] dark:border-[#2A2A2A]">
                  <th className="text-left p-4 w-32 bg-[#F5F5F7] dark:bg-[#2A2A2A]">
                    <span className="text-xs font-bold text-[#64748B]">Critères</span>
                  </th>
                  {items.map(listing => {
                    const cover = listing.listing_images?.find(i => i.is_cover)?.image_url;
                    return (
                      <th key={listing.id} className="p-4 text-left min-w-48">
                        <div className="relative">
                          {/* Bouton supprimer */}
                          <button
                            onClick={() => removeItem(listing.id)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors z-10"
                          >
                            <X size={12} />
                          </button>

                          {/* Image */}
                          <div className="h-32 bg-[#EBF5ED] rounded-xl overflow-hidden mb-3">
                            {cover ? (
                              <img src={getImageUrl(cover)} alt={listing.title}
                                className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-4xl">🏠</div>
                            )}
                          </div>

                          {/* Titre */}
                          <p className="font-bold text-sm text-[#0F172A] dark:text-white line-clamp-2 mb-1">
                            {listing.title}
                          </p>
                          <p className="text-xs text-[#64748B]">📍 {listing.city}</p>

                          {/* Bouton voir */}
                          <button
                            onClick={() => navigate(`/annonces/${listing.id}`)}
                            className="mt-2 text-xs text-[#3A7D44] font-bold hover:underline"
                          >
                            Voir l'annonce →
                          </button>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>

              {/* Critères */}
              <tbody>
                {CRITERIA.map((criterion, i) => {
                  const different = isDifferent(criterion.key);
                  return (
                    <tr
                      key={criterion.key}
                      className={`border-b border-[#E2E8F0] dark:border-[#2A2A2A] transition-colors ${
                        different ? 'bg-[#FEF3C7]/30 dark:bg-yellow-900/10' : ''
                      } ${i % 2 === 0 ? 'bg-[#F5F5F7]/50 dark:bg-[#1A1A1A]/50' : ''}`}
                    >
                      {/* Label */}
                      <td className="p-4 text-sm font-medium text-[#334155] dark:text-[#94A3B8] bg-[#F5F5F7] dark:bg-[#2A2A2A] whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {criterion.label}
                          {different && (
                            <span className="w-2 h-2 bg-yellow-400 rounded-full" title="Valeurs différentes" />
                          )}
                        </div>
                      </td>

                      {/* Valeurs */}
                      {items.map(listing => {
                        const isBestPrice = criterion.key === 'price' && listing.price === bestPrice;
                        return (
                          <td key={listing.id} className="p-4">
                            {criterion.type === 'bool' ? (
                              <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full ${
                                listing[criterion.key]
                                  ? 'bg-[#EBF5ED] text-[#3A7D44]'
                                  : 'bg-[#F5F5F7] dark:bg-[#2A2A2A] text-[#94A3B8]'
                              }`}>
                                {listing[criterion.key]
                                  ? <Check size={14} />
                                  : <X size={14} />
                                }
                              </span>
                            ) : (
                              <span className={`text-sm font-medium ${
                                isBestPrice
                                  ? 'text-[#3A7D44] font-black'
                                  : 'text-[#0F172A] dark:text-white'
                              }`}>
                                {criterion.format(listing)}
                                {isBestPrice && (
                                  <span className="ml-2 text-xs bg-[#EBF5ED] text-[#3A7D44] px-2 py-0.5 rounded-full font-bold">
                                    Meilleur prix
                                  </span>
                                )}
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Légende */}
        <div className="flex items-center gap-4 mt-4 text-xs text-[#64748B]">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-yellow-400 rounded-full" />
            Valeurs différentes
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 bg-[#EBF5ED] rounded-full inline-block" />
            Meilleur prix
          </div>
        </div>
      </div>
    </div>
  );
}