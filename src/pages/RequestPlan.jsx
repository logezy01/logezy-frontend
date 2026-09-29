import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ClipboardList, MapPin, Bed, Banknote, Send, CheckCircle2, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';
import PlansNavbar from '../components/common/PlansNavbar';
import api from '../lib/axios';
import useAuthStore from '../store/authStore';
import { CITIES } from '../data/beninLocations';

export default function RequestPlan() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    description: '', city: '', bedrooms: '', budget_min: '', budget_max: '',
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const update = (f, v) => setForm(p => ({ ...p, [f]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Connectez-vous pour envoyer votre demande');
      navigate('/login');
      return;
    }
    if (!form.description.trim()) {
      toast.error('Décrivez votre projet');
      return;
    }
    setLoading(true);
    try {
      await api.post('/plan-requests', form);
      setSent(true);
      toast.success('Demande envoyée !');
    } catch (err) {
      toast.error(err.response?.data?.error || "Erreur lors de l'envoi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PlansNavbar />
      <main className="min-h-screen bg-slate-50 pb-20 pt-28 dark:bg-slate-950">
        <section className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">

          <div className="mb-8 text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#3A7D44]/15 bg-[#3A7D44]/10 px-3 py-1.5 text-xs font-semibold text-[#3A7D44]">
              <ClipboardList size={15} />
              Logezy Plans
            </div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
              Demander un plan <span className="text-[#3A7D44]">sur mesure</span>
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base dark:text-slate-400">
              Décrivez votre projet, nos architectes vous recontactent avec une proposition adaptée.
            </p>
          </div>

          {sent ? (
            <div className="rounded-[26px] border border-white/70 bg-white/65 p-10 text-center shadow-glass backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/60">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[20px] bg-[#3A7D44]/10 text-[#3A7D44]">
                <CheckCircle2 size={30} />
              </div>
              <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                Demande envoyée !
              </h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Notre équipe va étudier votre projet et vous recontacter prochainement.
              </p>
              <Link to="/plans/annonces" className="mt-6 inline-flex rounded-xl bg-[#3A7D44] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#2D6235]">
                Parcourir les plans existants
              </Link>
            </div>
          ) : !isAuthenticated ? (
            <div className="rounded-[26px] border border-white/70 bg-white/65 p-10 text-center shadow-glass backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/60">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[20px] bg-[#3A7D44]/10 text-[#3A7D44]">
                <LogIn size={28} />
              </div>
              <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                Connectez-vous pour continuer
              </h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Créez un compte gratuit ou connectez-vous pour envoyer votre demande de plan.
              </p>
              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <Link to="/login" className="rounded-xl bg-[#3A7D44] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#2D6235]">
                  Connexion
                </Link>
                <Link to="/register" className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
                  Créer un compte
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="rounded-[26px] border border-white/70 bg-white/65 p-6 shadow-glass backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/60 sm:p-8">

              <div className="mb-5">
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Décrivez votre projet *
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => update('description', e.target.value)}
                  placeholder="Ex: Je cherche un plan de villa 4 chambres, style moderne, avec un salon spacieux et un garage..."
                  rows={5}
                  required
                  className="w-full rounded-[14px] border border-slate-200 bg-white/70 p-4 text-sm outline-none transition focus:border-[#3A7D44]/40 focus:ring-2 focus:ring-[#3A7D44]/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
                />
              </div>

              <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-200">
                    <MapPin size={14} className="text-[#3A7D44]" /> Ville
                  </label>
                  <select
                    value={form.city}
                    onChange={(e) => update('city', e.target.value)}
                    className="h-12 w-full rounded-[12px] border border-slate-200 bg-white/70 px-3 text-sm outline-none focus:border-[#3A7D44]/40 dark:border-white/10 dark:bg-white/5 dark:text-white"
                  >
                    <option value="">Indifférent</option>
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-200">
                    <Bed size={14} className="text-[#3A7D44]" /> Chambres souhaitées
                  </label>
                  <input
                    type="number" min="0"
                    value={form.bedrooms}
                    onChange={(e) => update('bedrooms', e.target.value)}
                    placeholder="Ex: 4"
                    className="h-12 w-full rounded-[12px] border border-slate-200 bg-white/70 px-3 text-sm outline-none focus:border-[#3A7D44]/40 dark:border-white/10 dark:bg-white/5 dark:text-white"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-200">
                  <Banknote size={14} className="text-[#3A7D44]" /> Budget approximatif (FCFA)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number" min="0"
                    value={form.budget_min}
                    onChange={(e) => update('budget_min', e.target.value)}
                    placeholder="Min"
                    className="h-12 w-full rounded-[12px] border border-slate-200 bg-white/70 px-3 text-sm outline-none focus:border-[#3A7D44]/40 dark:border-white/10 dark:bg-white/5 dark:text-white"
                  />
                  <input
                    type="number" min="0"
                    value={form.budget_max}
                    onChange={(e) => update('budget_max', e.target.value)}
                    placeholder="Max"
                    className="h-12 w-full rounded-[12px] border border-slate-200 bg-white/70 px-3 text-sm outline-none focus:border-[#3A7D44]/40 dark:border-white/10 dark:bg-white/5 dark:text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-[12px] bg-[#3A7D44] text-sm font-bold text-white shadow-md transition hover:bg-[#2D6235] disabled:opacity-60"
              >
                {loading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <><Send size={16} /> Envoyer ma demande</>
                )}
              </button>
            </form>
          )}
        </section>
      </main>
    </>
  );
}