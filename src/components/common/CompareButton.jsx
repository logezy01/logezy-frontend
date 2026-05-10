import { GitCompare } from 'lucide-react';
import toast from 'react-hot-toast';
import useCompareStore from '../../store/compareStore';

export default function CompareButton({ listing, className = '' }) {
  const { addItem, removeItem, isInCompare } = useCompareStore();
  const inCompare = isInCompare(listing.id);

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (inCompare) {
      removeItem(listing.id);
      toast.success('Retiré de la comparaison');
    } else {
      const result = addItem(listing);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success('Ajouté à la comparaison ✅');
      }
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`flex items-center justify-center w-9 h-9 rounded-full transition-all ${
        inCompare
          ? 'bg-[#3A7D44] text-white shadow-lg scale-110'
          : 'bg-white/90 text-[#64748B] hover:text-[#3A7D44] hover:bg-white shadow-float'
      } ${className}`}
      title={inCompare ? 'Retirer de la comparaison' : 'Ajouter à la comparaison'}
    >
      <GitCompare size={16} />
    </button>
  );
}