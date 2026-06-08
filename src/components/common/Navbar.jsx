import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, LayoutDashboard, Menu, X, ChevronDown, Plus } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import NotificationBell from './NotificationBell';
import Logo from './Logo';
import toast from 'react-hot-toast';
import useThemeStore from '../../store/themeStore';
import { Sun, Moon } from 'lucide-react';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useThemeStore();

  // Effet scroll pour navbar transparente sur home
  const isHome = location.pathname === '/';
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
      default: return '/';
    }
  };

  const getPublishLink = () => {
    if (user?.role === 'proprietaire') return '/dashboard/proprietaire/publier';
    if (user?.role === 'agent') return '/dashboard/agent/publier';
    return '/register';
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/annonces', label: 'Annonces' },
    { path: '/annonces?type=location', label: 'Location' },
    { path: '/annonces?type=vente', label: 'Vente' },
    { path: '/comment-ca-marche', label: 'Comment ça marche' },
    { path: '/a-propos', label: 'À propos' },
    { path: '/contact', label: 'Contact' },
  ];

  const navBg = isHome && !scrolled
    ? 'bg-transparent border-transparent'
    : 'bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-md border-[#E8E8E8] dark:border-[#2A2A2A] shadow-sm';

  const linkColor = isHome && !scrolled
    ? 'text-white/80 hover:text-white hover:bg-white/10'
    : 'text-[#334155] dark:text-[#94A3B8] hover:bg-[#F5F5F7] dark:hover:bg-[#2A2A2A] hover:text-[#0F172A] dark:hover:text-white';

  const activeColor = isHome && !scrolled
    ? 'bg-white/20 text-white font-bold'
    : 'bg-[#EBF5ED] text-[#3A7D44] font-bold';

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${navBg}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Logo size="md" white={isHome && !scrolled} />

            {/* Liens centre — Desktop */}
            <div className="hidden lg:flex items-center gap-0.5">
              {navLinks.map(link => (
                <Link key={link.path} to={link.path}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive(link.path) ? activeColor : linkColor
                  }`}>
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Droite — Desktop */}
            <div className="hidden md:flex items-center gap-2">
              {isAuthenticated ? (
                <>
                  {/* Bouton publier */}
                  {user?.role !== 'locataire' && (
                    <Link to={getPublishLink()}
                      className="hidden lg:flex items-center gap-2 bg-[#3A7D44] hover:bg-[#2D6235] text-white text-sm font-bold px-4 py-2 rounded-xl transition-all shadow-sm">
                      <Plus size={14} />
                      Publier
                    </Link>
                  )}

                  {/* Toggle thème */}
                  <button onClick={toggleTheme}
                    className={`p-2 rounded-xl transition-all ${
                      isHome && !scrolled
                        ? 'text-white/70 hover:text-white hover:bg-white/10'
                        : 'text-[#64748B] dark:text-[#94A3B8] hover:bg-[#F5F5F7] dark:hover:bg-[#2A2A2A]'
                    }`}>
                    {theme === 'dark'
                      ? <Sun size={18} className="text-yellow-400" />
                      : <Moon size={18} />
                    }
                  </button>

                  <NotificationBell />

                  {/* Menu utilisateur */}
                  <div className="relative">
                    <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className={`flex items-center gap-2 px-2 py-1.5 rounded-xl transition-all ${
                        isHome && !scrolled
                          ? 'hover:bg-white/10'
                          : 'hover:bg-[#F5F5F7] dark:hover:bg-[#2A2A2A]'
                      }`}>
                      <div className="w-8 h-8 rounded-full bg-[#3A7D44] text-white flex items-center justify-center font-bold text-sm">
                        {user?.full_name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="text-left hidden lg:block">
                        <div className={`text-sm font-bold ${isHome && !scrolled ? 'text-white' : 'text-[#0F172A] dark:text-white'}`}>
                          {user?.full_name?.split(' ')[0]}
                        </div>
                        <div className={`text-xs capitalize ${isHome && !scrolled ? 'text-white/60' : 'text-[#64748B] dark:text-[#94A3B8]'}`}>
                          {user?.role}
                        </div>
                      </div>
                      <ChevronDown size={14} className={`transition-transform ${userMenuOpen ? 'rotate-180' : ''} ${isHome && !scrolled ? 'text-white/60' : 'text-[#64748B]'}`} />
                    </button>

                    {/* Dropdown */}
                    {userMenuOpen && (
                      <div className="absolute right-0 top-12 w-56 bg-white dark:bg-[#1A1A1A] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-[#E8E8E8] dark:border-[#2A2A2A] z-50 overflow-hidden animate-scale-in">
                        {/* Header user */}
                        <div className="p-4 bg-gradient-to-r from-[#EBF5ED] to-white dark:from-[#2A2A2A] dark:to-[#1A1A1A] border-b border-[#E8E8E8] dark:border-[#2A2A2A]">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#3A7D44] text-white flex items-center justify-center font-bold">
                              {user?.full_name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-sm text-[#0F172A] dark:text-white truncate">{user?.full_name}</div>
                              <div className="text-xs text-[#64748B] dark:text-[#94A3B8] truncate">{user?.email}</div>
                              <span className="text-xs font-bold text-[#3A7D44] capitalize">{user?.role}</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-2">
                          <Link to={getDashboardLink()} onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#334155] dark:text-[#94A3B8] hover:bg-[#EBF5ED] dark:hover:bg-[#2A2A2A] hover:text-[#3A7D44] transition-colors">
                            <LayoutDashboard size={16} />
                            <span className="font-medium">Mon Dashboard</span>
                          </Link>

                          {user?.role !== 'locataire' && (
                            <Link to={getPublishLink()} onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#334155] dark:text-[#94A3B8] hover:bg-[#EBF5ED] dark:hover:bg-[#2A2A2A] hover:text-[#3A7D44] transition-colors">
                              <Plus size={16} />
                              <span className="font-medium">Publier une annonce</span>
                            </Link>
                          )}

                          <Link to="/parametres" onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#334155] dark:text-[#94A3B8] hover:bg-[#F5F5F7] dark:hover:bg-[#2A2A2A] transition-colors">
                            <span>⚙️</span>
                            <span className="font-medium">Paramètres</span>
                          </Link>

                          <hr className="my-1.5 border-[#E8E8E8] dark:border-[#2A2A2A]" />

                          <button onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                            <LogOut size={16} />
                            <span className="font-medium">Déconnexion</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login"
                    className={`text-sm font-bold px-4 py-2 rounded-xl transition-all ${
                      isHome && !scrolled
                        ? 'text-white/80 hover:text-white hover:bg-white/10'
                        : 'text-[#334155] dark:text-[#94A3B8] hover:bg-[#F5F5F7] dark:hover:bg-[#2A2A2A]'
                    }`}>
                    Connexion
                  </Link>
                  <Link to="/register"
                    className="bg-[#3A7D44] hover:bg-[#2D6235] text-white text-sm font-bold px-5 py-2 rounded-xl transition-all shadow-sm">
                    S'inscrire
                  </Link>
                </div>
              )}
            </div>

            {/* Bouton menu mobile */}
            <button onClick={() => setMobileOpen(!mobileOpen)}
              className={`md:hidden p-2 rounded-xl transition-all ${
                isHome && !scrolled
                  ? 'text-white hover:bg-white/10'
                  : 'text-[#334155] dark:text-[#94A3B8] hover:bg-[#F5F5F7] dark:hover:bg-[#2A2A2A]'
              }`}>
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Menu Mobile */}
        {mobileOpen && (
          <div className="md:hidden bg-white dark:bg-[#0F172A] border-t border-[#E8E8E8] dark:border-[#2A2A2A] animate-slide-down">
            <div className="px-4 py-4 space-y-1">

              {navLinks.map(link => (
                <Link key={link.path} to={link.path} onClick={() => setMobileOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? 'bg-[#EBF5ED] text-[#3A7D44] font-bold'
                      : 'text-[#334155] dark:text-[#94A3B8] hover:bg-[#F5F5F7] dark:hover:bg-[#2A2A2A]'
                  }`}>
                  {link.label}
                </Link>
              ))}

              <hr className="border-[#E8E8E8] dark:border-[#2A2A2A] my-2" />

              {isAuthenticated ? (
                <>
                  {/* User info mobile */}
                  <div className="flex items-center gap-3 px-4 py-3 bg-[#EBF5ED] dark:bg-[#2A2A2A] rounded-xl mb-2">
                    <div className="w-10 h-10 rounded-full bg-[#3A7D44] text-white flex items-center justify-center font-bold text-sm">
                      {user?.full_name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-[#0F172A] dark:text-white">{user?.full_name}</div>
                      <div className="text-xs text-[#64748B] dark:text-[#94A3B8] capitalize">{user?.role}</div>
                    </div>
                  </div>

                  <Link to={getDashboardLink()} onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-[#334155] dark:text-[#94A3B8] hover:bg-[#F5F5F7] dark:hover:bg-[#2A2A2A] transition-colors">
                    <LayoutDashboard size={16} /> <span className="font-medium">Dashboard</span>
                  </Link>

                  {user?.role !== 'locataire' && (
                    <Link to={getPublishLink()} onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-[#3A7D44] bg-[#EBF5ED] hover:bg-[#3A7D44] hover:text-white transition-colors font-bold">
                      <Plus size={16} /> Publier une annonce
                    </Link>
                  )}

                  {/* Toggle thème mobile */}
                  <button onClick={toggleTheme}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-[#334155] dark:text-[#94A3B8] hover:bg-[#F5F5F7] dark:hover:bg-[#2A2A2A] transition-colors">
                    {theme === 'dark' ? <Sun size={16} className="text-yellow-400" /> : <Moon size={16} />}
                    <span className="font-medium">{theme === 'dark' ? 'Mode clair' : 'Mode sombre'}</span>
                  </button>

                  <Link to="/parametres" onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-[#334155] dark:text-[#94A3B8] hover:bg-[#F5F5F7] dark:hover:bg-[#2A2A2A] transition-colors">
                    <span>⚙️</span> <span className="font-medium">Paramètres</span>
                  </Link>

                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                    <LogOut size={16} /> <span className="font-medium">Déconnexion</span>
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 pt-1">
                  <Link to="/login" onClick={() => setMobileOpen(false)}
                    className="text-center py-3 rounded-xl text-sm font-bold text-[#334155] dark:text-[#94A3B8] border border-[#E8E8E8] dark:border-[#2A2A2A] hover:bg-[#F5F5F7] dark:hover:bg-[#2A2A2A] transition-colors">
                    Connexion
                  </Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)}
                    className="text-center py-3 rounded-xl text-sm font-bold bg-[#3A7D44] text-white hover:bg-[#2D6235] transition-colors">
                    S'inscrire gratuitement
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Spacer pour compenser la navbar fixed */}
      {!isHome && <div className="h-16" />}
    </>
  );
}