import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, Map, List } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import ListingCard from '../components/common/ListingCard';
import MapView from '../components/common/MapView';
import api from '../lib/axios';
import SaveSearch from '../components/common/SaveSearch';

const CITIES = ['Cotonou', 'Porto-Novo', 'Parakou', 'Abomey-Calavi', 'Bohicon', 'Natitingou', 'Ouidah', 'Lokossa'];

const CITY_COORDS = {
  'Cotonou': [6.3654, 2.4183],
  'Porto-Novo': [6.4969, 2.6289],
  'Parakou': [9.3370, 2.6280],
  'Abomey-Calavi': [6.4484, 2.3258],
  'Bohicon': [7.1670, 1.9900],
  'Natitingou': [10.3167, 1.3833],
  'Ouidah': [6.3667, 2.0833],
  'Lokossa': [6.6236, 1.7728],
};

export default function Listings() {
  const [searchParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' ou 'map'
  const [filters, setFilters] = useState({
    city: searchParams.get('city') || '',
    type: searchParams.get('type') || '',
    bedrooms: '',
    min_price: '',
    max_price: '',
  });

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => { if (v) params.append(k, v); });
      const res = await api.get(`/listings?${params.toString()}&limit=50`);
      setListings(res.data.listings || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchListings(); }, []);

  const handleSearch = (e) => {
    e?.preventDefault();
    fetchListings();
  };

  const handleReset = () => {
    setFilters({ city: '', type: '', bedrooms: '', min_price: '', max_price: '' });
    setTimeout(() => fetchListings(), 100);
  };

  const update = (f, v) => setFilters(p => ({ ...p, [f]: v }));

  const activeFiltersCount = Object.values(filters).filter(v => v !== '').length;

  // Centre de la carte selon la ville sélectionnée
  const mapCenter = filters.city && CITY_COORDS[filters.city]
    ? CITY_COORDS[filters.city]
    : [6.3654, 2.4183];

  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-[#0F0F0F] pb-20 md:pb-0">
      <Navbar />

      {/* Header */}
      <div className="bg-white dark:bg-[#1A1A1A] border-b border-[#E2E8F0] dark:border-[#2A2A2A] px-6 py-4 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="font-display text-xl font-bold text-[#0F172A] dark:text-[#F1F5F9]">
                Annonces immobilières
              </h1>
              <p className="text-xs text-[#64748B] mt-0.5">
                {loading ? 'Chargement...' : `${listings.length} annonce(s) trouvée(s)`}
              </p>
            </div>

                <div className="flex items-center gap-2 flex-wrap">
                    <SaveSearch filters={filters} />
                    {/* Toggle vue liste/carte */}
              <div className="flex bg-[#F5F5F7] dark:bg-[#2A2A2A] border border-[#E2E8F0] dark:border-[#3A3A3A] rounded-btn p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-btn text-xs font-bold transition-all ${
                    viewMode === 'list'
                      ? 'bg-white dark:bg-[#1A1A1A] text-[#3A7D44] shadow-sm'
                      : 'text-[#64748B] hover:text-[#0F172A] dark:hover:text-white'
                  }`}
                >
                  <List size={14} /> Liste
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-btn text-xs font-bold transition-all ${
                    viewMode === 'map'
                      ? 'bg-white dark:bg-[#1A1A1A] text-[#3A7D44] shadow-sm'
                      : 'text-[#64748B] hover:text-[#0F172A] dark:hover:text-white'
                  }`}
                >
                  <Map size={14} /> Carte
                </button>
              </div>

              {/* Bouton filtres */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-btn border-2 text-sm font-medium transition-all ${
                  showFilters || activeFiltersCount > 0
                    ? 'border-[#3A7D44] bg-[#EBF5ED] text-[#3A7D44]'
                    : 'border-[#E2E8F0] dark:border-[#2A2A2A] text-[#334155] dark:text-[#94A3B8] hover:border-[#3A7D44]'
                }`}
              >
                <SlidersHorizontal size={16} />
                Filtres
                {activeFiltersCount > 0 && (
                  <span className="bg-[#3A7D44] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Filtres */}
          {showFilters && (
            <div className="mt-4 animate-slide-down">
              <form onSubmit={handleSearch} className="bg-[#F5F5F7] dark:bg-[#2A2A2A] rounded-xl p-4 border border-[#E2E8F0] dark:border-[#3A3A3A]">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-3">
                  <div>
                    <label className="block text-xs font-medium text-[#334155] dark:text-[#94A3B8] mb-1">Ville</label>
                    <select value={filters.city} onChange={(e) => update('city', e.target.value)} className="input-field text-xs py-2">
                      <option value="">Toutes</option>
                      {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#334155] dark:text-[#94A3B8] mb-1">Type</label>
                    <select value={filters.type} onChange={(e) => update('type', e.target.value)} className="input-field text-xs py-2">
                      <option value="">Tout</option>
                      <option value="location">Location</option>
                      <option value="vente">Vente</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#334155] dark:text-[#94A3B8] mb-1">Chambres min.</label>
                    <select value={filters.bedrooms} onChange={(e) => update('bedrooms', e.target.value)} className="input-field text-xs py-2">
                      <option value="">Peu importe</option>
                      {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}+</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#334155] dark:text-[#94A3B8] mb-1">Prix min</label>
                    <input type="number" placeholder="0" value={filters.min_price}
                      onChange={(e) => update('min_price', e.target.value)} className="input-field text-xs py-2" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#334155] dark:text-[#94A3B8] mb-1">Prix max</label>
                    <input type="number" placeholder="Max" value={filters.max_price}
                      onChange={(e) => update('max_price', e.target.value)} className="input-field text-xs py-2" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button type="submit" className="btn-primary px-6 py-2 text-sm">
                    🔍 Rechercher
                  </button>
                  <button type="button" onClick={handleReset}
                    className="flex items-center gap-1 text-sm text-[#64748B] hover:text-red-500 transition-colors">
                    <X size={14} /> Réinitialiser
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Contenu */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card h-72 animate-pulse" />
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-20 text-[#94A3B8]">
            <span className="text-6xl block mb-4">🏠</span>
            <p className="font-medium text-lg dark:text-white">Aucune annonce trouvée</p>
            <p className="text-sm mt-2">Essayez d'élargir vos critères</p>
            <button onClick={handleReset} className="btn-primary mt-6 px-6 py-2 text-sm inline-block">
              Voir toutes les annonces
            </button>
          </div>
        ) : viewMode === 'list' ? (
          /* VUE LISTE */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 animate-fade-in">
            {listings.map(l => <ListingCard key={l.id} listing={l} />)}
          </div>
        ) : (
          /* VUE CARTE */
          <div className="animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Carte */}
              <div className="lg:col-span-2">
                <MapView
                  listings={listings}
                  center={mapCenter}
                  zoom={filters.city ? 13 : 11}
                  height="600px"
                />
              </div>

              {/* Liste latérale */}
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                <p className="text-sm font-bold text-[#64748B] dark:text-[#94A3B8] sticky top-0 bg-[#F5F5F7] dark:bg-[#0F0F0F] py-2">
                  {listings.length} annonce(s)
                </p>
                {listings.map(l => (
                  <a key={l.id} href={`/annonces/${l.id}`}
                    className="card p-3 flex gap-3 hover:shadow-float transition-all cursor-pointer block">
                    <div className="w-16 h-16 bg-[#EBF5ED] rounded-xl flex items-center justify-center text-2xl shrink-0">
                      🏠
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-[#0F172A] dark:text-white line-clamp-2">{l.title}</div>
                      <div className="text-xs text-[#64748B] mt-0.5">📍 {l.city}</div>
                      <div className="font-black text-xs text-[#3A7D44] mt-1">
                        {new Intl.NumberFormat('fr-FR').format(l.price)} FCFA
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}