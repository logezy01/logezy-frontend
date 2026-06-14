import { useNavigate } from 'react-router-dom';
import { X, GitCompare, ArrowRight } from 'lucide-react';
import useCompareStore from '../../store/compareStore';
import { getImageUrl } from '../../lib/imageUrl';

export default function CompareBar() {
  const{ items, removeItem, clearItems } = useCompareStore();
  const navigate = useNavigate();

  if (items.length === 0) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
      <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl shadow-float border border-[#E2E8F0] dark:border-[#2A2A2A] p-3 flex items-center gap-3">

        {/* Label */}
        <div className="flex items-center gap-2 px-2">
          <GitCompare size={18} className="text-[#3A7D44]" />
          <span className="text-sm font-bold text-[#0F172A] dark:text-white hidden md:block">
            Comparer
          </span>
        </div>

        <div className="w-px h-8 bg-[#E2E8F0] dark:bg-[#2A2A2A]" />

        {/* Biens sélectionnés */}
        <div className="flex items-center gap-2">
          {items.map(item => {
            const cover = item.listing_images?.find(i => i.is_cover)?.image_url;
            return (
              <div key={item.id} className="relative group">
                <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-[#3A7D44] bg-[#EBF5ED]">
                  {cover ? (
                    <img
                      src={getImageUrl(cover)}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl">🏠</div>
                  )}
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={10} />
                </button>
              </div>
            );
          })}

          {/* Slots vides */}
          {[...Array(3 - items.length)].map((_, i) => (
            <div key={i}
              className="w-12 h-12 rounded-xl border-2 border-dashed border-[#E2E8F0] dark:border-[#2A2A2A] flex items-center justify-center text-[#94A3B8] text-xs">
              +
            </div>
          ))}
        </div>

        <div className="w-px h-8 bg-[#E2E8F0] dark:bg-[#2A2A2A]" />

        {/* Actions */}
        <div className="flex items-center gap-2">
          {items.length >= 2 && (
            <button
              onClick={() => navigate('/comparer')}
              className="btn-primary text-xs px-3 py-2 flex items-center gap-1"
            >
              Comparer <ArrowRight size={12} />
            </button>
          )}
          <button
            onClick={clearItems}
            className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-[#94A3B8] hover:text-red-500 transition-colors"
            title="Tout effacer"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Hint */}
      {items.length < 2 && (
        <p className="text-center text-xs text-[#94A3B8] mt-2">
          Sélectionnez {2 - items.length} bien(s) de plus pour comparer
        </p>
      )}
    </div>
  );
}