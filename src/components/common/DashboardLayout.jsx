import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Menu, Bell, Home, ChevronRight, Sparkles } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useThemeStore from '../../store/themeStore';
import toast from 'react-hot-toast';

function Particles({ dark }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.5 + 0.1,
    }));
    let animId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const color = dark ? '74, 222, 128' : '58, 125, 68';
      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, ${dark ? p.opacity : p.opacity * 0.4})`;
        ctx.fill();
      });
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 80) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${color}, ${(dark ? 0.08 : 0.04) * (1 - dist / 80)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });
      animId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animId);
  }, [dark]);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

function AnimatedHouse({ size = 32 }) {
  return (
    <div style={{ width: size, height: size }}>
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: size, height: size }}>
        <ellipse cx="32" cy="58" rx="20" ry="3" fill="rgba(74,222,128,0.15)" />
        <rect x="14" y="32" width="36" height="24" rx="2" fill="url(#hG)" />
        <path d="M8 34 L32 12 L56 34" fill="url(#rG)" />
        <rect x="26" y="44" width="12" height="12" rx="2" fill="#0A0A1A" opacity="0.6" />
        <rect x="16" y="36" width="8" height="7" rx="1" fill="rgba(255,255,200,0.8)" />
        <rect x="40" y="36" width="8" height="7" rx="1" fill="rgba(255,255,200,0.8)" />
        <rect x="42" y="18" width="6" height="10" fill="#1A6B3C" />
        <circle cx="45" cy="14" r="2" fill="rgba(255,255,255,0.3)">
          <animate attributeName="cy" values="14;8;4" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.3;0.1;0" dur="2s" repeatCount="indefinite" />
          <animate attributeName="r" values="2;3;4" dur="2s" repeatCount="indefinite" />
        </circle>
        <rect x="16" y="36" width="8" height="7" rx="1" fill="rgba(255,220,100,0.4)">
          <animate attributeName="opacity" values="0.4;0.8;0.4" dur="3s" repeatCount="indefinite" />
        </rect>
        <defs>
          <linearGradient id="hG" x1="14" y1="32" x2="50" y2="56" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1A6B3C" />
            <stop offset="100%" stopColor="#0D4A2A" />
          </linearGradient>
          <linearGradient id="rG" x1="8" y1="34" x2="56" y2="12" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#3A7D44" />
            <stop offset="100%" stopColor="#2D6235" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

export default function DashboardLayout({ children, menuItems, title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [activeGlow, setActiveGlow] = useState(null);
  const { user, logout } = useAuthStore();
  const { theme } = useThemeStore();
  const dark = theme === 'dark';
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast.success('À bientôt ! 👋');
    navigate('/');
  };

  const getRoleColor = () => {
    switch (user?.role) {
      case 'admin': return 'from-purple-500 to-purple-700';
      case 'proprietaire': return 'from-[#3A7D44] to-[#1A6B3C]';
      case 'agent': return 'from-yellow-500 to-yellow-700';
      default: return 'from-blue-500 to-blue-700';
    }
  };

  const getRoleBadge = () => {
    switch (user?.role) {
      case 'admin': return { label: 'Administrateur', color: 'text-purple-500 bg-purple-500/10' };
      case 'proprietaire': return { label: 'Propriétaire', color: 'text-emerald-600 bg-emerald-500/10' };
      case 'agent': return { label: 'Agent immobilier', color: 'text-yellow-600 bg-yellow-500/10' };
      default: return { label: 'Locataire', color: 'text-blue-500 bg-blue-500/10' };
    }
  };

  const badge = getRoleBadge();

  // Styles dynamiques selon le thème
  const sidebarStyle = dark
    ? { background: 'rgba(10, 12, 20, 0.92)', backdropFilter: 'blur(20px)', borderRight: '1px solid rgba(255,255,255,0.06)' }
    : { background: 'rgba(255, 255, 255, 0.97)', backdropFilter: 'blur(20px)', borderRight: '1px solid rgba(0,0,0,0.06)', boxShadow: '4px 0 24px rgba(0,0,0,0.06)' };

  const headerStyle = dark
    ? { background: 'rgba(8, 11, 20, 0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }
    : { background: 'rgba(255, 255, 255, 0.97)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' };

  const mainStyle = dark
    ? { background: 'linear-gradient(135deg, #080B14 0%, #0A0F1E 50%, #080B14 100%)' }
    : { background: 'linear-gradient(135deg, #F0F4F8 0%, #F8FAFC 50%, #EEF2F7 100%)' };

  return (
    <div className="min-h-screen flex" style={{ fontFamily: 'Inter, sans-serif', background: dark ? '#080B14' : '#F0F4F8' }}>

      <style>{`
        @keyframes pulse { 0%, 100% { transform: scale(1); opacity: 0.15; } 50% { transform: scale(1.1); opacity: 0.25; } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-6px); } }
        @keyframes glow { 0%, 100% { box-shadow: 0 0 20px rgba(58,125,68,0.3); } 50% { box-shadow: 0 0 40px rgba(58,125,68,0.6); } }
        .nav-item { transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); }
        .nav-item:hover { transform: translateX(4px); }
        .nav-item-active { animation: glow 2s ease-in-out infinite; }
        .shimmer-text {
          background: linear-gradient(90deg, #3A7D44, #4ade80, #3A7D44);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(58,125,68,0.3); border-radius: 2px; }
      `}</style>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)} />
      )}

      {/* ══ SIDEBAR ══════════════════════════════════════════ */}
      <aside className={`
        fixed lg:sticky top-0 inset-y-0 left-0 z-30 h-screen
        flex flex-col overflow-hidden
        transform transition-all duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${collapsed ? 'w-20' : 'w-64'}
      `} style={sidebarStyle}>

        {/* Particules */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <Particles dark={dark} />
          <div className="absolute pointer-events-none"
            style={{ top: '-50px', left: '-50px', width: 200, height: 200, borderRadius: '50%', background: '#3A7D44', filter: 'blur(100px)', opacity: dark ? 0.08 : 0.04 }} />
        </div>

        {/* Logo */}
        <div className={`relative z-10 p-5 flex items-center justify-between ${dark ? 'border-b border-white/5' : 'border-b border-black/5'}`}>
          <Link to="/" className={`flex items-center gap-3 transition-all ${collapsed ? 'justify-center' : ''}`}>
            <div className="relative">
              <AnimatedHouse size={36} />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
            </div>
            {!collapsed && (
              <div style={{ animation: 'slideIn 0.3s ease' }}>
                <div className="shimmer-text font-black text-lg leading-none">LOGEZY</div>
                <div className={`text-[10px] uppercase tracking-widest ${dark ? 'text-white/30' : 'text-[#94A3B8]'}`}>
                  Dashboard
                </div>
              </div>
            )}
          </Link>
          <button onClick={() => setCollapsed(!collapsed)}
            className={`hidden lg:flex p-1.5 rounded-lg transition-all ${dark ? 'hover:bg-white/5 text-white/30 hover:text-white/60' : 'hover:bg-black/5 text-[#94A3B8] hover:text-[#334155]'}`}>
            <ChevronRight size={14} className={`transition-transform duration-300 ${collapsed ? '' : 'rotate-180'}`} />
          </button>
        </div>

        {/* Profil */}
        {!collapsed && (
          <div className="relative z-10 mx-3 my-3 p-3 rounded-2xl overflow-hidden"
            style={{ background: dark ? 'rgba(58,125,68,0.1)' : 'rgba(58,125,68,0.06)', border: dark ? '1px solid rgba(58,125,68,0.2)' : '1px solid rgba(58,125,68,0.15)' }}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getRoleColor()} flex items-center justify-center font-black text-sm text-white shadow-lg flex-shrink-0`}
                style={{ animation: 'float 3s ease-in-out infinite' }}>
                {user?.full_name?.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className={`font-bold text-sm truncate ${dark ? 'text-white' : 'text-[#0F172A]'}`}>
                  {user?.full_name}
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${badge.color}`}>
                  {badge.label}
                </span>
              </div>
            </div>
          </div>
        )}

        {collapsed && (
          <div className="relative z-10 flex justify-center my-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getRoleColor()} flex items-center justify-center font-black text-sm text-white`}>
              {user?.full_name?.charAt(0).toUpperCase()}
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="relative z-10 flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {!collapsed && (
            <div className={`text-[10px] uppercase tracking-widest px-3 mb-2 font-bold ${dark ? 'text-white/20' : 'text-[#94A3B8]'}`}>
              Navigation
            </div>
          )}
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}
                onClick={() => setSidebarOpen(false)}
                onMouseEnter={() => setActiveGlow(index)}
                onMouseLeave={() => setActiveGlow(null)}
                className={`nav-item ${isActive ? 'nav-item-active' : ''} relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium overflow-hidden group`}
                style={{
                  background: isActive
                    ? dark
                      ? 'linear-gradient(135deg, rgba(58,125,68,0.4), rgba(26,107,60,0.2))'
                      : 'linear-gradient(135deg, rgba(58,125,68,0.15), rgba(26,107,60,0.08))'
                    : activeGlow === index
                    ? dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'
                    : 'transparent',
                  border: isActive
                    ? dark ? '1px solid rgba(58,125,68,0.4)' : '1px solid rgba(58,125,68,0.25)'
                    : '1px solid transparent',
                  animation: `fadeUp 0.3s ease ${index * 0.05}s both`,
                }}>

                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-emerald-500 rounded-r-full" />
                )}

                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `radial-gradient(circle at left, ${dark ? 'rgba(58,125,68,0.1)' : 'rgba(58,125,68,0.06)'}, transparent 70%)` }} />

                <span className={`text-xl relative z-10 transition-transform duration-200 group-hover:scale-110 ${collapsed ? 'mx-auto' : ''}`}>
                  {item.icon}
                </span>

                {!collapsed && (
                  <>
                    <span className={`relative z-10 flex-1 transition-colors ${
                      isActive
                        ? 'text-emerald-500 font-bold'
                        : dark
                        ? 'text-white/60 group-hover:text-white'
                        : 'text-[#64748B] group-hover:text-[#0F172A]'
                    }`}>
                      {item.label}
                    </span>
                    {item.badge && (
                      <span className="relative z-10 bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full animate-pulse">
                        {item.badge}
                      </span>
                    )}
                    {isActive && <Sparkles size={12} className="text-emerald-400 relative z-10" />}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer sidebar */}
        <div className={`relative z-10 p-3 space-y-1 ${dark ? 'border-t border-white/5' : 'border-t border-black/5'}`}>
          <Link to="/"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all group ${dark ? 'text-white/40 hover:text-white/70 hover:bg-white/5' : 'text-[#94A3B8] hover:text-[#334155] hover:bg-black/5'}`}>
            <Home size={16} className="group-hover:scale-110 transition-transform" />
            {!collapsed && <span>Retour au site</span>}
          </Link>
          <button onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all group ${dark ? 'text-white/40 hover:text-red-400 hover:bg-red-500/10' : 'text-[#94A3B8] hover:text-red-500 hover:bg-red-500/8'}`}>
            <LogOut size={16} className="group-hover:scale-110 transition-transform" />
            {!collapsed && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* ══ CONTENU PRINCIPAL ════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">

        {/* Header */}
        <header className="sticky top-0 z-10 h-16 px-6 flex items-center justify-between" style={headerStyle}>
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)}
              className={`lg:hidden p-2 rounded-xl transition-all ${dark ? 'hover:bg-white/5 text-white/50 hover:text-white' : 'hover:bg-black/5 text-[#64748B] hover:text-[#0F172A]'}`}>
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2">
              <span className={`text-sm hidden md:block ${dark ? 'text-white/20' : 'text-[#94A3B8]'}`}>
                Dashboard
              </span>
              <ChevronRight size={14} className={`hidden md:block ${dark ? 'text-white/20' : 'text-[#94A3B8]'}`} />
              <h1 className={`font-bold text-sm md:text-base ${dark ? 'text-white' : 'text-[#0F172A]'}`}>
                {title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)' }}>
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-xs text-emerald-500 font-medium">En ligne</span>
            </div>

            <button className={`relative p-2.5 rounded-xl transition-all group ${dark ? 'hover:bg-white/5 text-white/50 hover:text-white' : 'hover:bg-black/5 text-[#64748B] hover:text-[#0F172A]'}`}>
              <Bell size={18} className="group-hover:scale-110 transition-transform" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            </button>

            <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${getRoleColor()} flex items-center justify-center font-black text-xs text-white cursor-pointer hover:scale-110 transition-transform shadow-lg`}>
              {user?.full_name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto" style={mainStyle}>
          <div className="fixed inset-0 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle, ${dark ? 'rgba(58,125,68,0.03)' : 'rgba(58,125,68,0.04)'} 1px, transparent 1px)`,
              backgroundSize: '32px 32px',
              zIndex: 0,
            }} />
          <div className="relative z-10" style={{ animation: 'fadeUp 0.4s ease' }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}