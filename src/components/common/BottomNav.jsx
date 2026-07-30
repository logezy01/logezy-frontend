import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Heart, MessageSquare, User } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useThemeStore from '../../store/themeStore';

export default function BottomNav() {
  const location = useLocation();
  const { isAuthenticated, user } = useAuthStore();
  const { theme } = useThemeStore();
  const dark = theme === 'dark';

  // Cacher la nav sur les dashboards et les pages auth
  const hiddenPaths = ['/login', '/register', '/auth/'];
  const isDashboard = location.pathname.startsWith('/dashboard');
  const isHidden = hiddenPaths.some(p => location.pathname.startsWith(p));
  if (isDashboard || isHidden) return null;

  const getDashboardPath = () => {
    if (!isAuthenticated) return '/login';
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
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
      style={{
        background: dark ? 'rgba(15, 20, 30, 0.95)' : 'rgba(255, 255, 255, 0.97)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: dark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.08)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        boxShadow: dark
          ? '0 -4px 24px rgba(0,0,0,0.4)'
          : '0 -4px 24px rgba(0,0,0,0.08)',
      }}
    >
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab.path);

          return (
            <Link
              key={tab.id}
              to={tab.path}
              className="flex flex-col items-center justify-center flex-1 h-full gap-1 relative"
              style={{
                // Zone de touch minimum 44x44px recommandée par Apple
                minHeight: 44,
                minWidth: 44,
              }}
            >
              {/* Indicateur actif en haut */}
              {active && (
                <span
                  className="absolute top-0 left-1/2 -translate-x-1/2 rounded-full"
                  style={{
                    width: 32,
                    height: 3,
                    background: 'linear-gradient(90deg, #3A7D44, #4ade80)',
                    borderRadius: '0 0 4px 4px',
                  }}
                />
              )}

              {/* Fond pill sur l'icône active */}
              <div
                className="flex items-center justify-center rounded-2xl transition-all duration-200"
                style={{
                  width: 44,
                  height: 28,
                  background: active
                    ? dark ? 'rgba(58,125,68,0.2)' : 'rgba(58,125,68,0.1)'
                    : 'transparent',
                  transform: active ? 'scale(1.05)' : 'scale(1)',
                }}
              >
                <Icon
                  size={20}
                  strokeWidth={active ? 2.5 : 1.8}
                  style={{
                    color: active
                      ? '#3A7D44'
                      : dark ? '#64748B' : '#94A3B8',
                    transition: 'all 0.2s ease',
                    // Rempli si actif pour les icônes qui le supportent
                    fill: active && (tab.id === 'favorites' || tab.id === 'home')
                      ? 'rgba(58,125,68,0.15)'
                      : 'none',
                  }}
                />
              </div>

              {/* Label */}
              <span
                className="text-[10px] font-semibold leading-none"
                style={{
                  color: active
                    ? '#3A7D44'
                    : dark ? '#64748B' : '#94A3B8',
                  transition: 'color 0.2s ease',
                }}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}