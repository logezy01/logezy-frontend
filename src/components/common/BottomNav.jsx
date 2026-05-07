import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Heart, MessageSquare, User } from 'lucide-react';
import useAuthStore from '../../store/authStore';

export default function BottomNav() {
  const location = useLocation();
  const { isAuthenticated, user } = useAuthStore();

  const getDashboardPath = () => {
    switch (user?.role) {
      case 'proprietaire': return '/dashboard/proprietaire/messages';
      case 'agent': return '/dashboard/agent/messages';
      case 'locataire': return '/dashboard/locataire/messages';
      default: return '/login';
    }
  };

  const getProfilePath = () => {
    switch (user?.role) {
      case 'proprietaire': return '/dashboard/proprietaire';
      case 'agent': return '/dashboard/agent';
      case 'locataire': return '/dashboard/locataire';
      case 'admin': return '/dashboard/admin';
      default: return '/register';
    }
  };

  const tabs = [
    { id: 'home', path: '/', icon: Home, label: 'Accueil' },
    { id: 'search', path: '/annonces', icon: Search, label: 'Recherche' },
    { id: 'favorites', path: '/favoris', icon: Heart, label: 'Favoris' },
    { id: 'messages', path: getDashboardPath(), icon: MessageSquare, label: 'Messages' },
    { id: 'profile', path: getProfilePath(), icon: User, label: 'Profil' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E2E8F0] z-40 md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab.path);
          return (
            <Link
              key={tab.id}
              to={tab.path}
              className="flex flex-col items-center justify-center flex-1 h-full gap-0.5 relative"
            >
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#1A6B3C] rounded-full" />
              )}
              <Icon
                size={22}
                className={active ? 'text-[#1A6B3C]' : 'text-[#94A3B8]'}
                strokeWidth={active ? 2.5 : 1.5}
              />
              <span className={`text-xs font-medium ${active ? 'text-[#1A6B3C] font-bold' : 'text-[#94A3B8]'}`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}