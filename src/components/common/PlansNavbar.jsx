import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, LayoutDashboard, Menu, X, ChevronDown, Home, Sun, Moon, Settings, Building2 } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import NotificationBell from './NotificationBell';
import Logo from './Logo';
import toast from 'react-hot-toast';
import useThemeStore from '../../store/themeStore';

export default function PlansNavbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useThemeStore();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Déconnecté avec succès');
    navigate('/');
    setMobileOpen(false);
    setUserMenuOpen(false);
  };

  const getDashboardLink = () => {
    switch (user?.role) {
      case 'proprietaire': return '/dashboard/proprietaire';
      case 'agent': return '/dashboard/agent';
      case 'locataire': return '/dashboard/locataire';
      case 'admin': return '/dashboard/admin';
      case 'commercial': return '/dashboard/commercial';
      case 'architecte': return '/dashboard/architecte';
      default: return '/';
    }
  };

  const isActive = (path) => location.pathname === path;

  const links = [
    { path: '/plans', label: 'Accueil' },
    { path: '/plans/annonces', label: 'Tous les plans' },
    { path: '/architectes', label: 'Architectes' },
    { path: '/demander-un-plan', label: 'Demander un plan' },
  ];
  const navBg = scrolled
    ? 'bg-white/70 dark:bg-slate-950/70 backdrop-blur-2xl border-b border-white/60 dark:border-white/10 shadow-sm'
    : 'bg-white/50 dark:bg-slate-950/50 backdrop-blur-xl border-b border-white/40 dark:border-white/5';

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">

            {/* Logo + badge Plans */}
            <div className="flex items-center gap-2 pr-6 lg:pr-10">
              <Logo size="md" />
              <span className="hidden sm:inline-flex items-center rounded-full bg-[#3A7D44]/10 px-2.5 py-1 text-xs font-bold text-[#3A7D44] tracking-wide">
                PLANS
              </span>
            </div>

            {/* Liens centre — Desktop */}
            <div className="hidden lg:flex items-center gap-1.5 flex-1">
              {links.map(link => (
                <Link key={link.path} to={link.path}
                  className={`relative px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive(link.path)
                      ? 'bg-[#3A7D44]/12 text-[#3A7D44] font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-900/5 dark:hover:bg-white/5'
                  }`}>
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Droite — Desktop */}
            <div className="hidden md:flex items-center gap-3 pl-6 lg:pl-10">

              {/* Switcher Immobilier */}
              <Link to="/"
                className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 transition hover:border-[#3A7D44]/30 hover:text-[#3A7D44]">
                <Home size={15} />
                Immobilier
              </Link>

              <div className="w-px h-6 bg-slate-900/10 dark:bg-white/10" />

              <button onClick={toggleTheme}
                className="p-2.5 rounded-xl text-slate-500 dark:text-slate-300 hover:bg-slate-900/5 dark:hover:bg-white/5 transition-all">
                {theme === 'dark' ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} />}
              </button>

              {isAuthenticated ? (
                <>
                  <NotificationBell />
                  <div className="relative">
                    <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-xl hover:bg-slate-900/5 dark:hover:bg-white/5 transition-all">
                      <div className="w-9 h-9 rounded-full bg-[#3A7D44] text-white flex items-center justify-center font-bold text-sm shrink-0">
                        {user?.full_name?.charAt(0).toUpperCase()}
                      </div>
                      <ChevronDown size={14} className={`transition-transform text-slate-400 ${userMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {userMenuOpen && (
                      <div className="absolute right-0 top-14 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-white/10 z-50 overflow-hidden">
                        <div className="p-4 bg-[#3A7D44]/8 border-b border-slate-100 dark:border-white/10">
                          <p className="font-bold text-sm text-slate-900 dark:text-white truncate">{user?.full_name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                        </div>
                        <div className="p-2">
                          <Link to={getDashboardLink()} onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-600 dark:text-slate-300 hover:bg-[#3A7D44]/8 hover:text-[#3A7D44] transition-colors">
                            <LayoutDashboard size={16} /> Mon Dashboard
                          </Link>
                          <Link to="/parametres" onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-900/5 dark:hover:bg-white/5 transition-colors">
                            <Settings size={16} /> Paramètres
                          </Link>
                          <hr className="my-1.5 border-slate-100 dark:border-white/10" />
                          <button onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                            <LogOut size={16} /> Déconnexion
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <Link to="/login" className="text-sm font-bold px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-900/5 dark:hover:bg-white/5 transition-all">
                    Connexion
                  </Link>
                  <Link to="/register"
                    className="text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all duration-300 hover:-translate-y-0.5"
                    style={{ background: 'linear-gradient(135deg, #3A7D44, #2D6235)', boxShadow: '0 4px 16px rgba(58,125,68,0.35)' }}>
                    S'inscrire
                  </Link>
                </div>
              )}
            </div>

            {/* Bouton menu mobile */}
            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-900/5 dark:hover:bg-white/5 transition-all">
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Menu Mobile */}
        {mobileOpen && (
          <div className="md:hidden bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-white/10">
            <div className="px-4 py-4 space-y-1">
              {links.map(link => (
                <Link key={link.path} to={link.path} onClick={() => setMobileOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive(link.path) ? 'bg-[#3A7D44]/10 text-[#3A7D44] font-bold' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-900/5 dark:hover:bg-white/5'
                  }`}>
                  {link.label}
                </Link>
              ))}

              <Link to="/" onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-[#3A7D44] bg-[#3A7D44]/8 mt-2">
                <Home size={15} /> Passer sur Logezy Immobilier
              </Link>

              <hr className="border-slate-100 dark:border-white/10 my-2" />

              {isAuthenticated ? (
                <>
                  <Link to={getDashboardLink()} onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-900/5 dark:hover:bg-white/5 transition-colors">
                    <LayoutDashboard size={16} /> Dashboard
                  </Link>
                  <button onClick={toggleTheme}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-900/5 dark:hover:bg-white/5 transition-colors">
                    {theme === 'dark' ? <Sun size={16} className="text-yellow-400" /> : <Moon size={16} />}
                    {theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
                  </button>
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                    <LogOut size={16} /> Déconnexion
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 pt-1">
                  <Link to="/login" onClick={() => setMobileOpen(false)}
                    className="text-center py-3 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10">
                    Connexion
                  </Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)}
                    className="text-center py-3 rounded-xl text-sm font-bold bg-[#3A7D44] text-white">
                    S'inscrire gratuitement
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      <div className="h-20" />
    </>
  );
}