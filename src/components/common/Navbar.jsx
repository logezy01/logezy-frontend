import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, LayoutDashboard, Menu, X, ChevronDown, Plus, Settings } from 'lucide-react';
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
  const [annoncesMenuOpen, setAnnoncesMenuOpen] = useState(false);
  const [decouvrirMenuOpen, setDecouvrirMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useThemeStore();

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
    case 'admin':
      return '/dashboard/admin';

    case 'commercial':
      return '/dashboard/commercial';

    case 'architecte':
      return '/dashboard/architecte';

    case 'proprietaire':
      return '/dashboard/proprietaire';

    case 'agent':
      return '/dashboard/agent';

    case 'locataire':
      return '/dashboard/locataire';

    default:
      return '/';
  }
};

  const getPublishLink = () => {
    if (user?.role === 'proprietaire') return '/dashboard/proprietaire/publier';
    if (user?.role === 'agent') return '/dashboard/agent/publier';
    return '/register';
  };

  const isActive = (path) => location.pathname === path;

  const annoncesLinks = [
    { path: '/annonces', label: 'Toutes les annonces' },
    { path: '/annonces?type=location', label: 'Location' },
    { path: '/annonces?type=vente', label: 'Vente' },
  ];

  const decouvrirLinks = [
    { path: '/comment-ca-marche', label: 'Comment ça marche' },
    { path: '/a-propos', label: 'À propos' },
    { path: '/contact', label: 'Contact' },
  ];

  const isAnnoncesActive = location.pathname === '/annonces';
  const isDecouvrirActive = ['/comment-ca-marche', '/a-propos', '/contact'].includes(location.pathname);

  const navGlass = isHome && !scrolled ? '' : 'liquid-glass';

  const linkColor = isHome && !scrolled
    ? 'text-white/80 hover:text-white hover:bg-white/10'
    : 'text-[#334155] dark:text-[#94A3B8] hover:bg-white/40 dark:hover:bg-white/5 hover:text-[#0F172A] dark:hover:text-white';

  const activeColor = isHome && !scrolled
    ? 'bg-white/20 text-white font-bold'
    : 'bg-[#3A7D44]/12 text-[#3A7D44] font-bold';

  const dividerColor = isHome && !scrolled ? 'bg-white/15' : 'bg-[#0F172A]/10 dark:bg-white/10';

  return (
    <>
      <style>{`
        /* ═══ LIQUID GLASS — iOS 26 inspiré ═══ */
        .liquid-glass {
          position: relative;
          background: rgba(255,255,255,0.6);
          backdrop-filter: blur(24px) saturate(180%);
          -webkit-backdrop-filter: blur(24px) saturate(180%);
          border: 1px solid rgba(255,255,255,0.6);
          box-shadow: 0 8px 32px rgba(15,23,42,0.08), inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(15,23,42,0.04);
          transition: background 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease;
        }
        .liquid-glass::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.06) 40%, rgba(255,255,255,0) 60%);
          pointer-events: none;
        }
        .dark .liquid-glass {
          background: rgba(22,26,36,0.55);
          border-color: rgba(255,255,255,0.12);
          box-shadow: 0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.25);
        }
        .dark .liquid-glass::before {
          background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 40%, rgba(255,255,255,0) 60%);
        }

        .liquid-glass-dark {
          position: relative;
          background: rgba(18,22,32,0.45);
          backdrop-filter: blur(28px) saturate(160%);
          -webkit-backdrop-filter: blur(28px) saturate(160%);
          border: 1px solid rgba(255,255,255,0.14);
          box-shadow: 0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.2);
          transition: background 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease;
        }
        .liquid-glass-dark::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: linear-gradient(135deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.02) 40%, rgba(255,255,255,0) 60%);
          pointer-events: none;
        }

        .glass-pill { border-radius: 999px; }
        .glass-squircle { border-radius: 26px; }
        .glass-squircle-sm { border-radius: 16px; }
        .glass-squircle-lg { border-radius: 34px; }
      `}</style>

      <nav className={`fixed top-0 left-0 right-0 z-50 ${navGlass}`}
        style={{ transition: 'background-color 0.45s cubic-bezier(0.23,1,0.32,1), backdrop-filter 0.45s cubic-bezier(0.23,1,0.32,1), border-color 0.45s cubic-bezier(0.23,1,0.32,1), box-shadow 0.45s cubic-bezier(0.23,1,0.32,1)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">

            {/* Logo */}
            <div className="flex items-center pr-6 lg:pr-10">
              <Logo size="md" white={isHome && !scrolled} />
            </div>

            {/* Liens centre — Desktop */}
            <div className="hidden lg:flex items-center gap-1.5 flex-1">

              {/* Menu Annonces */}
              <div className="relative" onMouseEnter={() => setAnnoncesMenuOpen(true)} onMouseLeave={() => setAnnoncesMenuOpen(false)}>
                <Link to="/annonces"
                  className={`relative flex items-center gap-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isAnnoncesActive ? activeColor : linkColor
                  }`}>
                  Annonces
                  <ChevronDown size={13} className={`transition-transform duration-300 ${annoncesMenuOpen ? 'rotate-180' : ''}`} />
                </Link>
                {annoncesMenuOpen && (
                  <div className="absolute left-0 top-full pt-2 w-52 animate-scale-in">
                    <div className="liquid-glass glass-squircle p-2 overflow-hidden">
                      {annoncesLinks.map(link => (
                        <Link key={link.label} to={link.path}
                          className="block px-3 py-2.5 rounded-xl text-sm font-medium text-[#334155] dark:text-[#94A3B8] hover:bg-[#3A7D44]/10 hover:text-[#3A7D44] transition-colors">
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Agences */}
              <Link to="/agences"
                className={`relative px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group/navlink ${
                  isActive('/agences') ? activeColor : linkColor
                }`}>
                Agences
                <span
                  className={`absolute left-4 right-4 -bottom-0.5 h-[2px] rounded-full transition-transform duration-300 origin-left ${
                    isActive('/agences') ? 'scale-x-100' : 'scale-x-0 group-hover/navlink:scale-x-100'
                  }`}
                  style={{ background: isHome && !scrolled ? 'white' : '#3A7D44' }}
                />
              </Link>

              {/* Menu Découvrir */}
              <div className="relative" onMouseEnter={() => setDecouvrirMenuOpen(true)} onMouseLeave={() => setDecouvrirMenuOpen(false)}>
                <button
                  className={`relative flex items-center gap-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isDecouvrirActive ? activeColor : linkColor
                  }`}>
                  Découvrir
                  <ChevronDown size={13} className={`transition-transform duration-300 ${decouvrirMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {decouvrirMenuOpen && (
                  <div className="absolute left-0 top-full pt-2 w-52 animate-scale-in">
                    <div className="liquid-glass glass-squircle p-2 overflow-hidden">
                      {decouvrirLinks.map(link => (
                        <Link key={link.path} to={link.path}
                          className="block px-3 py-2.5 rounded-xl text-sm font-medium text-[#334155] dark:text-[#94A3B8] hover:bg-[#3A7D44]/10 hover:text-[#3A7D44] transition-colors">
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Droite — Desktop */}
            <div className="hidden md:flex items-center gap-3 pl-6 lg:pl-10">
              {isAuthenticated ? (
                <>
                  {/* Bouton publier */}
                  {user?.role !== 'locataire' && user?.role !== 'commercial' && (
                    <Link to={getPublishLink()}
                      className="hidden lg:flex items-center gap-2 bg-[#3A7D44] hover:bg-[#2D6235] text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm hover:-translate-y-0.5 duration-300">
                      <Plus size={15} />
                      Publier
                    </Link>
                  )}

                  {/* Séparateur */}
                  <div className={`hidden lg:block w-px h-6 ${dividerColor}`} />

                  {/* Toggle thème */}
                  <button onClick={toggleTheme}
                    className={`p-2.5 rounded-xl transition-all ${
                      isHome && !scrolled
                        ? 'text-white/70 hover:text-white hover:bg-white/10'
                        : 'text-[#64748B] dark:text-[#94A3B8] hover:bg-white/40 dark:hover:bg-white/5'
                    }`}>
                    {theme === 'dark'
                      ? <Sun size={18} className="text-yellow-400" />
                      : <Moon size={18} />
                    }
                  </button>

                  <NotificationBell />

                  {/* Séparateur */}
                  <div className={`hidden lg:block w-px h-6 ${dividerColor}`} />

                  {/* Menu utilisateur */}
                  <div className="relative">
                    <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className={`flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-xl transition-all ${
                        isHome && !scrolled
                          ? 'hover:bg-white/10'
                          : 'hover:bg-white/40 dark:hover:bg-white/5'
                      }`}>
                      <div className="w-9 h-9 rounded-full bg-[#3A7D44] text-white flex items-center justify-center font-bold text-sm shrink-0">
                        {user?.full_name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="text-left hidden lg:block leading-tight">
                        <div className={`text-sm font-bold ${isHome && !scrolled ? 'text-white' : 'text-[#0F172A] dark:text-white'}`}>
                          {user?.full_name?.split(' ')[0]}
                        </div>
                        <div className={`text-[11px] capitalize ${isHome && !scrolled ? 'text-white/60' : 'text-[#94A3B8]'}`}>
                          {user?.role}
                        </div>
                      </div>
                      <ChevronDown size={14} className={`transition-transform ${userMenuOpen ? 'rotate-180' : ''} ${isHome && !scrolled ? 'text-white/60' : 'text-[#94A3B8]'}`} />
                    </button>

                    {/* Dropdown */}
                    {userMenuOpen && (
                      <div className="absolute right-0 top-14 w-60 liquid-glass glass-squircle z-50 overflow-hidden animate-scale-in">
                        <div className="p-4 bg-gradient-to-r from-[#3A7D44]/10 to-transparent border-b border-[#0F172A]/5 dark:border-white/5">
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
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#334155] dark:text-[#94A3B8] hover:bg-[#3A7D44]/10 hover:text-[#3A7D44] transition-colors">
                            <LayoutDashboard size={16} />
                            <span className="font-medium">Mon Dashboard</span>
                          </Link>

                          {user?.role !== 'locataire' && user?.role !== 'commercial' && (
                            <Link to={getPublishLink()} onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#334155] dark:text-[#94A3B8] hover:bg-[#3A7D44]/10 hover:text-[#3A7D44] transition-colors">
                              <Plus size={16} />
                              <span className="font-medium">Publier une annonce</span>
                            </Link>
                          )}

                          <Link to="/parametres" onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#334155] dark:text-[#94A3B8] hover:bg-[#0F172A]/5 dark:hover:bg-white/5 transition-colors">
                            <Settings size={16} />
                            <span className="font-medium">Paramètres</span>
                          </Link>

                          <hr className="my-1.5 border-[#0F172A]/5 dark:border-white/10" />

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
                <div className="flex items-center gap-3">
                  <Link to="/login"
                    className={`text-sm font-bold px-4 py-2.5 rounded-xl transition-all ${
                      isHome && !scrolled
                        ? 'text-white/80 hover:text-white hover:bg-white/10'
                        : 'text-[#334155] dark:text-[#94A3B8] hover:bg-white/40 dark:hover:bg-white/5'
                    }`}>
                    Connexion
                  </Link>
                  <Link to="/register"
                    className="text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all duration-300 hover:-translate-y-0.5"
                    style={{
                      background: 'linear-gradient(135deg, #3A7D44, #2D6235)',
                      boxShadow: '0 4px 16px rgba(58,125,68,0.35)',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 8px 28px rgba(58,125,68,0.5)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(58,125,68,0.35)'; }}
                  >
                    S'inscrire
                  </Link>
                </div>
              )}
            </div>

            {/* Bouton menu mobile */}
            <button onClick={() => setMobileOpen(!mobileOpen)}
              className={`md:hidden p-2.5 rounded-xl transition-all ${
                isHome && !scrolled
                  ? 'text-white hover:bg-white/10'
                  : 'text-[#334155] dark:text-[#94A3B8] hover:bg-white/40 dark:hover:bg-white/5'
              }`}>
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Menu Mobile */}
        {mobileOpen && (
          <div className="md:hidden liquid-glass animate-slide-down" style={{ borderRadius: 0, borderLeft: 'none', borderRight: 'none', borderBottom: 'none' }}>
            <div className="px-4 py-4 space-y-1">

              {[...annoncesLinks, { path: '/agences', label: 'Agences' }, ...decouvrirLinks].map(link => (
                <Link key={link.path} to={link.path} onClick={() => setMobileOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? 'bg-[#3A7D44]/12 text-[#3A7D44] font-bold'
                      : 'text-[#334155] dark:text-[#94A3B8] hover:bg-white/40 dark:hover:bg-white/5'
                  }`}>
                  {link.label}
                </Link>
              ))}

              <hr className="border-[#0F172A]/5 dark:border-white/10 my-2" />

              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-3 bg-[#3A7D44]/8 rounded-xl mb-2">
                    <div className="w-10 h-10 rounded-full bg-[#3A7D44] text-white flex items-center justify-center font-bold text-sm">
                      {user?.full_name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-[#0F172A] dark:text-white">{user?.full_name}</div>
                      <div className="text-xs text-[#64748B] dark:text-[#94A3B8] capitalize">{user?.role}</div>
                    </div>
                  </div>

                  <Link to={getDashboardLink()} onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-[#334155] dark:text-[#94A3B8] hover:bg-white/40 dark:hover:bg-white/5 transition-colors">
                    <LayoutDashboard size={16} /> <span className="font-medium">Dashboard</span>
                  </Link>

                  {user?.role !== 'locataire' && user?.role !== 'commercial' && (
                    <Link to={getPublishLink()} onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-[#3A7D44] bg-[#3A7D44]/10 hover:bg-[#3A7D44] hover:text-white transition-colors font-bold">
                      <Plus size={16} /> Publier une annonce
                    </Link>
                  )}

                  <button onClick={toggleTheme}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-[#334155] dark:text-[#94A3B8] hover:bg-white/40 dark:hover:bg-white/5 transition-colors">
                    {theme === 'dark' ? <Sun size={16} className="text-yellow-400" /> : <Moon size={16} />}
                    <span className="font-medium">{theme === 'dark' ? 'Mode clair' : 'Mode sombre'}</span>
                  </button>

                  <Link to="/parametres" onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-[#334155] dark:text-[#94A3B8] hover:bg-white/40 dark:hover:bg-white/5 transition-colors">
                    <Settings size={16} /> <span className="font-medium">Paramètres</span>
                  </Link>

                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                    <LogOut size={16} /> <span className="font-medium">Déconnexion</span>
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 pt-1">
                  <Link to="/login" onClick={() => setMobileOpen(false)}
                    className="text-center py-3 rounded-xl text-sm font-bold text-[#334155] dark:text-[#94A3B8] liquid-glass">
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
      {!isHome && <div className="h-20" />}
    </>
  );
}