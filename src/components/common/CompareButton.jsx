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
        toast.success('Ajouté à la comparaison');
      }
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`glass-icon-btn flex items-center justify-center w-9 h-9 rounded-2xl ${className}`}
      style={
        inCompare
          ? { borderColor: 'rgba(58,125,68,0.5)', boxShadow: '0 4px 16px rgba(58,125,68,0.25), inset 0 1px 0 rgba(255,255,255,0.6)' }
          : undefined
      }
      title={inCompare ? 'Retirer de la comparaison' : 'Ajouter à la comparaison'}
    >
      <GitCompare size={16} className={inCompare ? 'text-[#3A7D44]' : 'text-[#64748B]'} strokeWidth={inCompare ? 2.5 : 2} />
    </button>
  );
}