import { Link, useLocation } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';

export default function ChatBot() {
  const location = useLocation();

  if (location.pathname === '/assistant') return null;

  return (
    <Link
      to="/assistant"
      aria-label="Ouvrir l’assistant immobilier Logezy"
      title="Parler à l’assistant Logezy"
      className="fixed bottom-20 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-white/40 bg-[#3A7D44] text-white shadow-[0_10px_32px_rgba(29,40,32,0.3)] transition duration-200 hover:-translate-y-1 hover:bg-[#2D6235] hover:shadow-[0_14px_36px_rgba(29,40,32,0.34)] active:scale-95 md:bottom-8 md:right-8"
    >
      <MessageCircle size={23} strokeWidth={1.9} />
      <span className="absolute right-0 top-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-400" />
    </Link>
  );
}
