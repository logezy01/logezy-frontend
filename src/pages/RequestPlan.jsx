import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ClipboardList, MapPin, Bed, Banknote, Send, CheckCircle2, LogIn, UserRound, X } from 'lucide-react';
import toast from 'react-hot-toast';
import PlansNavbar from '../components/common/PlansNavbar';
import api from '../lib/axios';
import useAuthStore from '../store/authStore';
import { CITIES } from '../data/beninLocations';

export default function RequestPlan() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialArchitectId = searchParams.get('architect_user_id') || '';
  const initialReferencePlanId = searchParams.get('reference_plan_id') || '';
  const [form, setForm] = useState({
    description: '',
    city: '',
    bedrooms: '',
    budget_min: '',
    budget_max: '',
    architect_user_id: initialArchitectId,
    reference_plan_id: initialReferencePlanId,
  });
  const [architects, setArchitects] = useState([]);
  const [referencePlan, setReferencePlan] = useState(null);
  const [architectsError, setArchitectsError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const response = await api.get('/architects');
        setArchitects(response.data?.architects || []);
      } catch (error) {
        console.error('Erreur chargement des architectes :', error);
        setArchitectsError("Impossible de charger la liste des architectes.");
      }

      if (!initialReferencePlanId) return;
      try {
        const response = await api.get(`/plans/${initialReferencePlanId}`);
        const plan = response.data?.plan;
        if (!plan) return;
        setReferencePlan(plan);
        if (!initialArchitectId && plan.owner?.id) {
          setForm(previous => ({ ...previous, architect_user_id: plan.owner.id }));
        }
      } catch (error) {
        console.error('Erreur chargement du plan de référence :', error);
        setForm(previous => ({ ...previous, reference_plan_id: '' }));
      }
    };
    loadOptions();
  }, [initialArchitectId, initialReferencePlanId]);

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
      await api.post('/plan-requests', {
        ...form,
        architect_user_id: form.architect_user_id || null,
        reference_plan_id: form.reference_plan_id || null,
      });
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
                {form.architect_user_id
                  ? 'Votre demande a été transmise à l’architecte choisi, qui pourra vous recontacter prochainement.'
                  : 'Notre équipe va étudier votre projet et vous recontacter prochainement.'}
              </p>
              {referencePlan && (
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Plan de référence : <span className="font-semibold">{referencePlan.title}</span>
                </p>
              )}
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

              {referencePlan && (
                <div className="mb-5 flex items-start justify-between gap-3 rounded-2xl border border-[#3A7D44]/20 bg-[#3A7D44]/5 p-4 dark:bg-[#3A7D44]/10">
                  <div className="flex min-w-0 items-start gap-3">
                    <ClipboardList size={18} className="mt-0.5 shrink-0 text-[#3A7D44]" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Plan utilisé comme référence</p>
                      <Link to={`/plans/${referencePlan.id}`} className="mt-1 block truncate text-sm font-bold text-[#3A7D44] hover:underline">
                        {referencePlan.title}
                      </Link>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setReferencePlan(null);
                      update('reference_plan_id', '');
                    }}
                    aria-label="Retirer le plan de référence"
                    className="rounded-lg p-1 text-slate-400 transition hover:bg-white hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}

              <div className="mb-5">
                <label htmlFor="architect_user_id" className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-200">
                  <UserRound size={15} className="text-[#3A7D44]" /> Architecte souhaité
                </label>
                <select
                  id="architect_user_id"
                  value={form.architect_user_id}
                  onChange={(e) => update('architect_user_id', e.target.value)}
                  className="h-12 w-full rounded-[12px] border border-slate-200 bg-white/70 px-3 text-sm outline-none focus:border-[#3A7D44]/40 dark:border-white/10 dark:bg-white/5 dark:text-white"
                >
                  <option value="">Laisser Logezy m’orienter</option>
                  {form.architect_user_id && referencePlan?.owner?.id === form.architect_user_id &&
                    !architects.some(architect => architect.user?.id === form.architect_user_id) && (
                      <option value={form.architect_user_id}>
                        {referencePlan.owner.full_name || 'Architecte du plan de référence'}
                      </option>
                    )}
                  {architects.map(architect => (
                    <option key={architect.user?.id || architect.id} value={architect.user?.id || ''}>
                      {architect.user?.full_name || 'Architecte'}{architect.city ? ` — ${architect.city}` : ''}
                    </option>
                  ))}
                </select>
                {architectsError ? (
                  <p className="mt-2 text-xs text-amber-700 dark:text-amber-300">{architectsError}</p>
                ) : (
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    Choisissez un architecte précis ou laissez Logezy vous orienter.
                  </p>
                )}
              </div>

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