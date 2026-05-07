import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/axios';
import useAuthStore from '../../store/authStore';

export default function FavoriteButton({ listingId, className = '' }) {
  const [favorited, setFavorited] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) return;
    const checkFavorite = async () => {
      try {
        const res = await api.get(`/listings/${listingId}/favorite`);
        setFavorited(res.data.favorited);
      } catch (e) {}
    };
    checkFavorite();
  }, [listingId, isAuthenticated]);

  const handleToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Connectez-vous pour sauvegarder');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post(`/listings/${listingId}/favorite`);
      setFavorited(res.data.favorited);
      toast.success(res.data.favorited ? '❤️ Ajouté aux favoris' : 'Retiré des favoris');
    } catch (e) {
      toast.error('Erreur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`flex items-center justify-center w-9 h-9 rounded-full transition-all ${
        favorited
          ? 'bg-red-500 text-white shadow-lg scale-110'
          : 'bg-white/90 text-[#64748B] hover:text-red-500 hover:bg-white shadow-float'
      } ${className}`}
      title={favorited ? 'Retirer des favoris' : 'Ajouter aux favoris'}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <Heart size={16} fill={favorited ? 'currentColor' : 'none'} />
      )}
    </button>
  );
}