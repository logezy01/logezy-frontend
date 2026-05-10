import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, LayoutDashboard, Menu, X, ChevronDown } from 'lucide-react';
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
  const { theme, toggleTheme } = useThemeStore();

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

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/annonces', label: 'Annonces' },
    { path: '/annonces?type=location', label: 'Location' },
    { path: '/annonces?type=vente', label: 'Vente' },
  ];

  return (
    <>
      <nav className="bg-white border-b border-[#E2E8F0] sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Logo size="md" />

            {/* Liens centre — Desktop */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-btn text-sm font-medium transition-all duration-200 ${
                    isActive(link.path)
                      ? 'bg-[#EEF0FB] text-[#2D3A8C] font-bold'
                      : 'text-[#334155] hover:bg-[#F5F5F7] hover:text-[#2D3A8C]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Droite — Desktop */}
            <div className="hidden md:flex items-center gap-2">
              {isAuthenticated ? (
                <>
                {/* Toggle thème */}
                  <button
                    onClick={toggleTheme}
                    className="p-2 rounded-btn hover:bg-[#EBF5ED] dark:hover:bg-[#2A2A2A] text-[#64748B] dark:text-[#94A3B8] transition-all"
                    title={theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
                  >
                    {theme === 'dark'
                      ? <Sun size={18} className="text-yellow-400" />
                      : <Moon size={18} />
                    }
                  </button>
                  <NotificationBell />

                  {/* Menu utilisateur */}
                  <div className="relative">
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2 px-3 py-2 rounded-btn hover:bg-[#EEF0FB] transition-all"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#2D3A8C] text-white flex items-center justify-center font-bold text-sm">
                        {user?.full_name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="text-left hidden lg:block">
                        <div className="text-sm font-bold text-[#0F172A]">
                          {user?.full_name?.split(' ')[0]}
                        </div>
                        <div className="text-xs text-[#64748B] capitalize">{user?.role}</div>
                      </div>
                      <ChevronDown size={14} className={`text-[#64748B] transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown menu */}
                    {userMenuOpen && (
                      <div className="absolute right-0 top-12 w-52 bg-white rounded-card shadow-float border border-[#E2E8F0] z-50 animate-slide-down overflow-hidden">
                        <div className="p-3 border-b border-[#E2E8F0] bg-[#F5F5F7]">
                          <div className="font-bold text-sm text-[#0F172A]">{user?.full_name}</div>
                          <div className="text-xs text-[#64748B]">{user?.email}</div>
                        </div>
                        <div className="p-1">
                          <Link
                            to={getDashboardLink()}
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 rounded-btn text-sm text-[#334155] hover:bg-[#EEF0FB] hover:text-[#2D3A8C] transition-colors"
                          >
                            <LayoutDashboard size={16} />
                            Dashboard
                          </Link>
                          <Link
                            to="/parametres"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 rounded-btn text-sm text-[#334155] hover:bg-[#EEF0FB] hover:text-[#2D3A8C] transition-colors"
                          >
                            ⚙️ Paramètres
                          </Link>
                          <Link
                            to="/confidentialite"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 rounded-btn text-sm text-[#334155] hover:bg-[#EEF0FB] hover:text-[#2D3A8C] transition-colors"
                          >
                            🔒 Confidentialité
                          </Link>
                          <hr className="my-1 border-[#E2E8F0]" />
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-btn text-sm text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <LogOut size={16} />
                            Déconnexion
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn-ghost text-sm px-4 py-2">
                    Connexion
                  </Link>
                  <Link to="/register" className="btn-primary text-sm px-4 py-2">
                    Inscription gratuite
                  </Link>
                </>
              )}
            </div>

            {/* Bouton menu mobile */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-btn hover:bg-[#F5F5F7] text-[#334155]"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Menu Mobile */}
        {mobileOpen && (
          <div className="md:hidden border-t border-[#E2E8F0] bg-white animate-slide-down">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center px-3 py-3 rounded-btn text-sm font-medium text-[#334155] hover:bg-[#EEF0FB] hover:text-[#2D3A8C] transition-colors"
                >
                  {link.label}
                </Link>
              ))}

              <hr className="border-[#E2E8F0] my-2" />

              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-3 px-3 py-2">
                    <div className="w-10 h-10 rounded-full bg-[#2D3A8C] text-white flex items-center justify-center font-bold">
                      {user?.full_name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-sm">{user?.full_name}</div>
                      <div className="text-xs text-[#64748B] capitalize">{user?.role}</div>
                    </div>
                  </div>
                  <Link to={getDashboardLink()} onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-3 py-3 rounded-btn text-sm text-[#334155] hover:bg-[#EEF0FB] transition-colors">
                    <LayoutDashboard size={16} /> Dashboard
                  </Link>
                  <Link to="/parametres" onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-3 py-3 rounded-btn text-sm text-[#334155] hover:bg-[#EEF0FB] transition-colors">
                    ⚙️ Paramètres
                  </Link>
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-3 rounded-btn text-sm text-red-500 hover:bg-red-50 transition-colors">
                    <LogOut size={16} /> Déconnexion
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 pt-2">
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-secondary text-center py-3">
                    Connexion
                  </Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary text-center py-3">
                    Inscription gratuite
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}