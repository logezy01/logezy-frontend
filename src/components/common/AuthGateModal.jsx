import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { X, Lock } from 'lucide-react';

export default function AuthGateModal({ open, onClose }) {
  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-[#1A1A1A] rounded-2xl shadow-[0_25px_80px_rgba(0,0,0,0.4)] w-full max-w-sm p-6 relative animate-scale-in"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-[#F5F5F7] dark:hover:bg-[#2A2A2A] text-[#94A3B8] transition-colors"
        >
          <X size={18} />
        </button>

        <div className="w-14 h-14 rounded-2xl bg-[#EBF5ED] dark:bg-[#1A2E20] flex items-center justify-center mb-4">
          <Lock size={24} className="text-[#3A7D44]" />
        </div>

        <h3 className="font-display text-xl font-bold text-[#0F172A] dark:text-white mb-2">
          Connectez-vous pour continuer
        </h3>
        <p className="text-sm text-[#64748B] dark:text-[#94A3B8] mb-6">
          Créez un compte gratuit ou connectez-vous pour voir les détails de cette annonce et contacter le propriétaire.
        </p>

        <div className="flex flex-col gap-2.5">
          <Link
            to="/login"
            className="w-full bg-[#3A7D44] hover:bg-[#2D6235] text-white font-bold py-3 rounded-xl text-center transition-all"
          >
            Connexion
          </Link>
          <Link
            to="/register"
            className="w-full border-2 border-[#E8E8E8] dark:border-[#2A2A2A] hover:border-[#3A7D44] text-[#334155] dark:text-[#94A3B8] hover:text-[#3A7D44] font-bold py-3 rounded-xl text-center transition-all"
          >
            Créer un compte gratuit
          </Link>
        </div>
      </div>
    </div>,
    document.body
  );
} 