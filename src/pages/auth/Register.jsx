import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/axios';
import useAuthStore from '../../store/authStore';
import Logo from '../../components/common/Logo';

const ROLES = [
  { value: 'locataire', emoji: '🔍', label: 'Locataire / Acheteur', desc: 'Je cherche une maison' },
  { value: 'proprietaire', emoji: '🏠', label: 'Propriétaire', desc: 'Je publie mes biens' },
  { value: 'agent', emoji: '🤝', label: 'Agent immobilier', desc: 'Je gère plusieurs biens' },
];

export default function Register() {
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', password: '', role: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.role) { toast.error('Choisissez un type de compte'); return; }
    if (form.password.length < 6) { toast.error('Mot de passe minimum 6 caractères'); return; }
    setLoading(true);
    try {
      const res = await api.post('/auth/register', form);
      login(res.data.user, res.data.token);
      toast.success('Compte créé avec succès ! 🎉');
      switch (res.data.user.role) {
        case 'proprietaire': navigate('/dashboard/proprietaire'); break;
        case 'agent': navigate('/dashboard/agent'); break;
        default: navigate('/dashboard/locataire');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erreur création compte');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex">

      {/* Gauche */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#2D3A8C] flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#E8472A] rounded-full opacity-10 blur-3xl" />
        <Logo size="lg" white />
        <div className="relative z-10">
          <h2 className="font-display text-4xl font-black text-white mb-6 leading-tight">
            Rejoignez
            <span className="text-[#E8472A]"> la communauté</span>
            <br />Logezy
          </h2>
          <div className="space-y-3">
            {ROLES.map(role => (
              <div key={role.value} className="flex items-center gap-3 bg-white/10 rounded-xl p-3">
                <span className="text-2xl">{role.emoji}</span>
                <div>
                  <div className="font-bold text-sm text-white">{role.label}</div>
                  <div className="text-white/50 text-xs">{role.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="text-white/30 text-sm">© 2026 Logezy 🇧🇯</p>
      </div>

      {/* Droite */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-md py-8 animate-scale-in">

          <div className="mb-8 lg:hidden">
            <Logo size="md" />
          </div>

          <h1 className="font-display text-3xl font-bold text-[#0F172A] mb-2">Créer un compte</h1>
          <p className="text-[#64748B] text-sm mb-8">Rejoignez Logezy gratuitement</p>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Rôle */}
            <div>
              <label className="block text-sm font-medium text-[#334155] mb-3">Je suis...</label>
              <div className="space-y-2">
                {ROLES.map(role => (
                  <button key={role.value} type="button"
                    onClick={() => setForm({ ...form, role: role.value })}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                      form.role === role.value
                        ? 'border-[#2D3A8C] bg-[#EEF0FB]'
                        : 'border-[#E2E8F0] bg-white hover:border-[#2D3A8C]/30'
                    }`}>
                    <span className="text-xl">{role.emoji}</span>
                    <div>
                      <div className="font-bold text-sm text-[#0F172A]">{role.label}</div>
                      <div className="text-xs text-[#64748B]">{role.desc}</div>
                    </div>
                    {form.role === role.value && <span className="ml-auto text-[#2D3A8C] font-bold">✓</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Nom */}
            <div>
              <label className="block text-sm font-medium text-[#334155] mb-2">Nom complet</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                <input type="text" placeholder="Jean Dupont" value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  className="input-field pl-10" required />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#334155] mb-2">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                <input type="email" placeholder="votre@email.com" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input-field pl-10" required />
              </div>
            </div>

            {/* Téléphone */}
            <div>
              <label className="block text-sm font-medium text-[#334155] mb-2">
                Téléphone <span className="text-[#94A3B8]">(optionnel)</span>
              </label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                <input type="tel" placeholder="+229 97 00 00 00" value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="input-field pl-10" />
              </div>
            </div>

            {/* Mot de passe */}
            <div>
              <label className="block text-sm font-medium text-[#334155] mb-2">Mot de passe</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                <input type={showPassword ? 'text' : 'password'} placeholder="Minimum 6 caractères"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input-field pl-10 pr-10" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#334155]">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2">
              {loading
                ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : 'Créer mon compte →'
              }
            </button>
          </form>

          <p className="text-center text-sm text-[#64748B] mt-6">
            Déjà un compte ?{' '}
            <Link to="/login" className="text-[#2D3A8C] font-bold hover:underline">Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  );
}