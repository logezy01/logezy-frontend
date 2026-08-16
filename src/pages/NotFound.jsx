import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0A0A0A] flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">

        {/* Illustration */}
        <div className="relative mx-auto w-40 h-40 mb-6">
          <div className="absolute inset-0 bg-[#EBF5ED] dark:bg-[#1A2E20] rounded-full animate-pulse" />
          <div className="relative w-full h-full flex items-center justify-center">
            <span className="text-7xl">🏚️</span>
          </div>
        </div>

        {/* Code erreur */}
        <div className="font-display text-6xl font-black text-[#3A7D44] mb-2">404</div>

        <h1 className="font-display text-xl font-bold text-[#0F172A] dark:text-white mb-3">
          Cette annonce a déménagé... ou n'a jamais existé
        </h1>
        <p className="text-sm text-[#64748B] dark:text-[#94A3B8] mb-8">
          La page que vous cherchez est introuvable. Elle a peut-être été supprimée,
          ou l'adresse contient une erreur.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto bg-[#3A7D44] hover:bg-[#2D6235] text-white font-bold px-6 py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-all"
          >
            <Home size={16} />
            Retour à l'accueil
          </Link>
          <Link
            to="/annonces"
            className="w-full sm:w-auto border-2 border-[#E8E8E8] dark:border-[#2A2A2A] hover:border-[#3A7D44] text-[#334155] dark:text-[#94A3B8] hover:text-[#3A7D44] font-bold px-6 py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-all"
          >
            <Search size={16} />
            Parcourir les annonces
          </Link>
        </div>

        <button
          onClick={() => window.history.back()}
          className="mt-6 text-xs text-[#94A3B8] hover:text-[#3A7D44] flex items-center gap-1 mx-auto transition-colors"
        >
          <ArrowLeft size={12} />
          Retour à la page précédente
        </button>
      </div>
    </div>
  );
}