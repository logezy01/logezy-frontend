import { useState } from 'react';
import { Bell, X, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/axios';
import useAuthStore from '../../store/authStore';

export default function SaveSearch({ filters = {} }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuthStore();

  const handleSave = async () => {
    if (!isAuthenticated) {
      toast.error('Connectez-vous pour sauvegarder une recherche');
      return;
    }
    if (!name.trim()) {
      toast.error('Donnez un nom à votre alerte');
      return;
    }

    setLoading(true);
    try {
      await api.post('/alerts', {
        name,
        city: filters.city || null,
        type: filters.type || null,
        bedrooms: filters.bedrooms || null,
        min_price: filters.min_price || null,
        max_price: filters.max_price || null,
      });
      toast.success('🔔 Alerte créée ! Vous serez notifié par email.');
      setOpen(false);
      setName('');
    } catch (e) {
      toast.error(e.response?.data?.error || 'Erreur création alerte');
    } finally {
      setLoading(false);
    }
  };

  // Résumé des filtres actifs
  const filterSummary = () => {
    const parts = [];
    if (filters.city) parts.push(`📍 ${filters.city}`);
    if (filters.type) parts.push(filters.type === 'location' ? '🔑 Location' : '🏷️ Vente');
    if (filters.bedrooms) parts.push(`🛏 ${filters.bedrooms}+ chambres`);
    if (filters.min_price) parts.push(`Min: ${new Intl.NumberFormat('fr-FR').format(filters.min_price)} FCFA`);
    if (filters.max_price) parts.push(`Max: ${new Intl.NumberFormat('fr-FR').format(filters.max_price)} FCFA`);
    return parts.length > 0 ? parts.join(' · ') : 'Toutes les annonces';
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 rounded-btn border-2 border-[#3A7D44] text-[#3A7D44] text-sm font-bold hover:bg-[#EBF5ED] transition-all dark:border-[#4CAF50] dark:text-[#4CAF50] dark:hover:bg-[#2A2A2A]"
      >
        <Bell size={16} />
        Créer une alerte
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-80 bg-white dark:bg-[#1A1A1A] rounded-2xl shadow-float border border-[#E2E8F0] dark:border-[#2A2A2A] z-50 p-4 animate-slide-down">

          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-bold text-[#0F172A] dark:text-white text-sm">
              🔔 Nouvelle alerte
            </h3>
            <button onClick={() => setOpen(false)}
              className="p-1 rounded-lg hover:bg-[#F5F5F7] dark:hover:bg-[#2A2A2A] text-[#94A3B8]">
              <X size={14} />
            </button>
          </div>

          {/* Critères */}
          <div className="bg-[#EBF5ED] dark:bg-[#2A2A2A] rounded-xl p-3 mb-3">
            <p className="text-xs font-bold text-[#3A7D44] dark:text-[#4CAF50] mb-1">Critères de l'alerte :</p>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">{filterSummary()}</p>
          </div>

          {/* Nom de l'alerte */}
          <div className="mb-3">
            <label className="block text-xs font-medium text-[#334155] dark:text-[#94A3B8] mb-1">
              Nom de l'alerte
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Villa Cotonou 3 chambres"
              className="input-field text-sm"
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
          </div>

          <p className="text-xs text-[#94A3B8] mb-3">
            📧 Vous recevrez un email dès qu'une annonce correspondra à vos critères.
          </p>

          <button
            onClick={handleSave}
            disabled={loading}
            className="btn-primary w-full py-2.5 flex items-center justify-center gap-2 text-sm"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Check size={16} />
                Sauvegarder l'alerte
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}