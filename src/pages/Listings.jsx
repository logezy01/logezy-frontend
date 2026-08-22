import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, Map, Bell, Search, ChevronDown, Loader2 } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import ListingCard from '../components/common/ListingCard';
import MapView from '../components/common/MapView';
import SaveSearch from '../components/common/SaveSearch';
import api from '../lib/axios';
import SkeletonCard from '../components/common/SkeletonCard';
import { LISTING_CATEGORIES } from '../data/listingCategories';


const CITIES = ['Cotonou', 'Porto-Novo', 'Parakou', 'Abomey-Calavi', 'Bohicon', 'Natitingou', 'Ouidah', 'Lokossa'];
const CITY_COORDS = {
  'Cotonou': [6.3654, 2.4183], 'Porto-Novo': [6.4969, 2.6289],
  'Parakou': [9.3370, 2.6280], 'Abomey-Calavi': [6.4484, 2.3258],
  'Bohicon': [7.1670, 1.9900], 'Natitingou': [10.3167, 1.3833],
  'Ouidah': [6.3667, 2.0833], 'Lokossa': [6.6236, 1.7728],
};
const PAGE_SIZE = 12;

export default function Listings() {
  const [searchParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showAlertHelper, setShowAlertHelper] = useState(false);
  const [filters, setFilters] = useState({
    city: searchParams.get('city') || '',
    type: searchParams.get('type') || '',
    category: searchParams.get('category') || '',
    bedrooms: '',
    min_price: '',
    max_price: '',
  });
  const sentinelRef = useRef(null);

  // Chargement initial ou nouvelle recherche (reset)
  const fetchListings = async (currentFilters = filters) => {
    setLoading(true);
    setHasMore(true);
    try {
      const params = new URLSearchParams();
      Object.entries(currentFilters).forEach(([k, v]) => { if (v) params.append(k, v); });
      params.append('page', 1);
      params.append('limit', PAGE_SIZE);
      const res = await api.get(`/listings?${params.toString()}`);
      const data = res.data.listings || [];
      setListings(data);
      setPage(1);
      setHasMore(data.length === PAGE_SIZE);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Chargement de la page suivante (append)
  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore || loading) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => { if (v) params.append(k, v); });
      params.append('page', nextPage);
      params.append('limit', PAGE_SIZE);
      const res = await api.get(`/listings?${params.toString()}`);
      const data = res.data.listings || [];
      setListings(prev => [...prev, ...data]);
      setPage(nextPage);
      setHasMore(data.length === PAGE_SIZE);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingMore(false);
    }
  }, [page, filters, hasMore, loadingMore, loading]);

  useEffect(() => { fetchListings(); }, []);

  // Observer la sentinelle en bas de la grille
  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: '400px' }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [loadMore]);

  const handleSearch = (e) => { e?.preventDefault(); fetchListings(); };
  const handleReset = () => {
    const cleared = { city: '', type: '', category: '', bedrooms: '', min_price: '', max_price: '' };
    setFilters(cleared);
    setTimeout(() => fetchListings(cleared), 100);
  };
  const update = (f, v) => setFilters(p => ({ ...p, [f]: v }));
  const activeFiltersCount = Object.values(filters).filter(v => v !== '').length;
  const mapCenter = filters.city && CITY_COORDS[filters.city] ? CITY_COORDS[filters.city] : [6.3654, 2.4183];

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0A0A0A] pb-20 md:pb-0">
      <Navbar />

      {/* Header sticky premium */}
      <div className="bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-md border-b border-[#E8E8E8] dark:border-[#2A2A2A] sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">

            {/* Titre + résultats */}
            <div className="flex items-center gap-4">
              <div>
                <h1 className="font-display text-lg font-black text-[#0F172A] dark:text-white">
                  Annonces immobilières
                </h1>
                <div className="text-xs text-[#94A3B8] mt-0.5 flex items-center gap-1">
                  {!loading && (
                    <span>
                      <strong className="text-[#3A7D44]">{listings.length}</strong> annonce(s) affichée(s)
                      {filters.city && ` à ${filters.city}`}
                    </span>
                  )}
                </div>
              </div>

              {/* Filtres actifs */}
              {activeFiltersCount > 0 && (
                <div className="hidden md:flex items-center gap-2">
                  {filters.type && (
                    <span className="text-xs bg-[#EBF5ED] text-[#3A7D44] font-bold px-2 py-1 rounded-full">
                      {filters.type === 'location' ? '🔑 Location' : '🏷️ Vente'}
                    </span>
                  )}
                  {filters.city && (
                    <span className="text-xs bg-[#EFF6FF] text-[#3B82F6] font-bold px-2 py-1 rounded-full">
                      📍 {filters.city}
                    </span>
                  )}

                    {filters.category && (
                    <span className="text-xs bg-[#FEF3C7] text-[#92400E] font-bold px-2 py-1 rounded-full">
                      {LISTING_CATEGORIES.find(c => c.value === filters.category)?.icon} {LISTING_CATEGORIES.find(c => c.value === filters.category)?.label}
                    </span>
                  )}
                  <button onClick={handleReset}
                    className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1">
                    <X size={10} /> Tout effacer
                  </button>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">

              {/* Vue carte */}
              <button onClick={() => setShowMap(!showMap)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 text-sm font-bold transition-all ${
                  showMap
                    ? 'border-[#3A7D44] bg-[#EBF5ED] text-[#3A7D44]'
                    : 'border-[#E8E8E8] dark:border-[#2A2A2A] text-[#64748B] dark:text-[#94A3B8] hover:border-[#3A7D44] hover:text-[#3A7D44]'
                }`}>
                <Map size={15} />
                <span className="hidden sm:inline">{showMap ? 'Masquer carte' : 'Carte'}</span>
              </button>

              {/* Alerte */}
              <div className="relative">
                <button onClick={() => { setShowMap(false); setShowAlertHelper(!showAlertHelper); }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 text-sm font-bold transition-all ${
                    showAlertHelper
                      ? 'border-[#3A7D44] bg-[#EBF5ED] text-[#3A7D44]'
                      : 'border-[#3A7D44] text-[#3A7D44] hover:bg-[#EBF5ED]'
                  }`}>
                  <Bell size={15} />
                  <span className="hidden sm:inline">Alerte</span>
                </button>

                {showAlertHelper && (
                  <div className="absolute right-0 top-12 w-80 bg-white dark:bg-[#1A1A1A] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-[#E8E8E8] dark:border-[#2A2A2A] z-50 p-5 animate-scale-in">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-sm text-[#0F172A] dark:text-white flex items-center gap-2">
                        🔔 Créer une alerte
                      </h3>
                      <button onClick={() => setShowAlertHelper(false)}
                        className="p-1.5 rounded-lg hover:bg-[#F5F5F7] dark:hover:bg-[#2A2A2A] text-[#94A3B8]">
                        <X size={14} />
                      </button>
                    </div>
                    <div className="space-y-3 mb-4">
                      {[
                        { step: '1', title: 'Définissez vos critères', desc: 'Utilisez les filtres ci-dessous.' },
                        { step: '2', title: 'Nommez votre alerte', desc: 'Donnez un nom à cette recherche.' },
                        { step: '3', title: 'Recevez des emails', desc: 'Notification dès qu\'une annonce correspond.' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-[#3A7D44] text-white text-xs font-bold flex items-center justify-center shrink-0">
                            {item.step}
                          </div>
                          <div>
                            <div className="font-medium text-xs text-[#0F172A] dark:text-white">{item.title}</div>
                            <div className="text-xs text-[#94A3B8] mt-0.5">{item.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <SaveSearch filters={filters} onSaved={() => setShowAlertHelper(false)} />
                  </div>
                )}
              </div>

              {/* Filtres */}
              <button onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 text-sm font-bold transition-all ${
                  showFilters || activeFiltersCount > 0
                    ? 'border-[#3A7D44] bg-[#EBF5ED] text-[#3A7D44]'
                    : 'border-[#E8E8E8] dark:border-[#2A2A2A] text-[#64748B] dark:text-[#94A3B8] hover:border-[#3A7D44] hover:text-[#3A7D44]'
                }`}>
                <SlidersHorizontal size={15} />
                <span className="hidden sm:inline">Filtres</span>
                {activeFiltersCount > 0 && (
                  <span className="bg-[#3A7D44] text-white text-xs font-black w-5 h-5 rounded-full flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
                <ChevronDown size={14} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {/* Panel filtres */}
          {showFilters && (
            <div className="mt-4 animate-slide-down">
              <form onSubmit={handleSearch}
                className="bg-[#F8F9FA] dark:bg-[#1A1A1A] rounded-2xl p-4 border border-[#E8E8E8] dark:border-[#2A2A2A]">
                              <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-4">
                  {[
                    {
                      label: 'Ville', field: 'city', type: 'select',
                      options: [{ value: '', label: 'Toutes les villes' }, ...CITIES.map(c => ({ value: c, label: c }))]
                    },
                    {
                      label: 'Type', field: 'type', type: 'select',
                      options: [{ value: '', label: 'Tout type' }, { value: 'location', label: '🔑 Location' }, { value: 'vente', label: '🏷️ Vente' }]
                    },
                    {
                      label: 'Catégorie', field: 'category', type: 'select',
                      options: [{ value: '', label: 'Toute catégorie' }, ...LISTING_CATEGORIES.map(c => ({ value: c.value, label: `${c.icon} ${c.label}` }))]
                    },
                    {
                      label: 'Chambres min.', field: 'bedrooms', type: 'select',
                      options: [{ value: '', label: 'Peu importe' }, ...[1,2,3,4,5].map(n => ({ value: n, label: `${n}+` }))]
                    },
                    { label: 'Prix min (FCFA)', field: 'min_price', type: 'number', placeholder: 'Ex: 50 000' },
                    { label: 'Prix max (FCFA)', field: 'max_price', type: 'number', placeholder: 'Ex: 500 000' },
                  ].map(f => (
                    <div key={f.field}>
                      <label className="block text-xs font-bold text-[#334155] dark:text-[#94A3B8] mb-1.5">
                        {f.label}
                      </label>
                      {f.type === 'select' ? (
                        <select value={filters[f.field]} onChange={(e) => update(f.field, e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border-2 border-[#E8E8E8] dark:border-[#2A2A2A] bg-white dark:bg-[#2A2A2A] text-[#0F172A] dark:text-white text-xs outline-none focus:border-[#3A7D44] transition-colors">
                          {f.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                      ) : (
                        <input type="number" placeholder={f.placeholder} value={filters[f.field]}
                          onChange={(e) => update(f.field, e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border-2 border-[#E8E8E8] dark:border-[#2A2A2A] bg-white dark:bg-[#2A2A2A] text-[#0F172A] dark:text-white text-xs outline-none focus:border-[#3A7D44] transition-colors placeholder:text-[#C0C0C0]" />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <button type="submit"
                    className="bg-[#3A7D44] hover:bg-[#2D6235] text-white font-bold px-6 py-2.5 rounded-xl text-sm flex items-center gap-2 transition-all">
                    <Search size={14} /> Rechercher
                  </button>
                  {activeFiltersCount > 0 && (
                    <button type="button" onClick={handleReset}
                      className="flex items-center gap-1.5 text-sm text-[#94A3B8] hover:text-red-500 transition-colors font-medium">
                      <X size={14} /> Réinitialiser
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Carte */}
      {showMap && (
        <div className="relative w-full animate-slide-down" style={{ height: '420px' }}>
          <MapView listings={listings} center={mapCenter} zoom={filters.city ? 13 : 11} height="420px" />
          <button onClick={() => setShowMap(false)}
            className="absolute top-4 right-4 z-[1000] w-10 h-10 bg-white dark:bg-[#1A1A1A] rounded-full shadow-lg flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all border border-[#E8E8E8]">
            <X size={18} />
          </button>
          <div className="absolute top-4 left-4 z-[1000] bg-white dark:bg-[#1A1A1A] rounded-xl shadow-lg px-3 py-2 text-xs font-bold text-[#3A7D44] border border-[#E8E8E8]">
            🗺️ {listings.filter(l => l.latitude && l.longitude).length} biens géolocalisés
          </div>
        </div>
      )}

      {/* Grille annonces */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-white dark:bg-[#1A1A1A] h-72 animate-pulse" />
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-24 h-24 bg-[#EBF5ED] rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🏠</span>
            </div>
            <h3 className="font-display text-xl font-bold text-[#0F172A] dark:text-white mb-2">
              Aucune annonce trouvée
            </h3>
            <p className="text-[#64748B] dark:text-[#94A3B8] text-sm mb-6">
              Essayez d'élargir vos critères de recherche
            </p>
            <button onClick={handleReset}
              className="bg-[#3A7D44] hover:bg-[#2D6235] text-white font-bold px-8 py-3 rounded-2xl text-sm transition-all inline-flex items-center gap-2">
              Voir toutes les annonces
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 animate-fade-in">
              {listings.map(l => <ListingCard key={l.id} listing={l} />)}
            </div>

            {/* Sentinelle pour déclencher le chargement suivant */}
            {hasMore && (
              <div ref={sentinelRef} className="flex items-center justify-center py-10">
                {loadingMore && (
                  <div className="flex items-center gap-2 text-[#3A7D44] text-sm font-medium">
                    <Loader2 size={18} className="animate-spin" />
                    Chargement d'autres annonces...
                  </div>
                )}
              </div>
            )}

            {!hasMore && listings.length > PAGE_SIZE && (
              <p className="text-center text-xs text-[#94A3B8] py-10">
                Vous avez vu toutes les annonces disponibles 🎉
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}