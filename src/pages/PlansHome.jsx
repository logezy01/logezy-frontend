import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, Building2, DraftingCompass, ClipboardList, ArrowRight,
  Bed, Maximize, Layers, CheckCircle, MessageSquare, Sparkles, UserRound
} from 'lucide-react';
import PlansNavbar from '../components/common/PlansNavbar';
import api from '../lib/axios';

const STYLES = [
  { value: 'moderne', label: 'Moderne' },
  { value: 'contemporain', label: 'Contemporain' },
  { value: 'traditionnel', label: 'Traditionnel' },
  { value: 'minimaliste', label: 'Minimaliste' },
  { value: 'africain', label: 'Africain' },
  { value: 'bioclimatique', label: 'Bioclimatique' },
];

function formatPrice(price) {
  if (!price) return 'Prix sur demande';
  return `${new Intl.NumberFormat('fr-FR').format(Number(price))} FCFA`;
}

function PlanPreviewCard({ plan }) {
  const cover = (plan.plan_images || []).find(i => i.is_cover) || (plan.plan_images || [])[0];
  return (
    <Link to={`/plans/${plan.id}`}
      className="group overflow-hidden rounded-[26px] border border-white/60 bg-white/65 shadow-glass backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-slate-900/60">
      <div className="aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800">
        {cover ? (
          <img src={cover.image_url} alt={plan.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Building2 size={32} className="text-slate-400" />
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="line-clamp-1 font-display text-sm font-semibold text-slate-900 dark:text-white">
          {plan.title}
        </h3>
        <div className="mt-1.5 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          {plan.bedrooms > 0 && <span className="flex items-center gap-1"><Bed size={12} /> {plan.bedrooms} ch.</span>}
          {plan.area && <span className="flex items-center gap-1"><Maximize size={12} /> {plan.area}m²</span>}
        </div>
        <p className="mt-2 text-sm font-bold text-[#3A7D44]">{formatPrice(plan.price)}</p>
      </div>
    </Link>
  );
}

export default function PlansHome() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ plans: 0, architects: 0 });
  const [search, setSearch] = useState({ style: '', bedrooms: '' });

  useEffect(() => {
    const load = async () => {
      try {
        const [plansRes, architectsRes] = await Promise.all([
          api.get('/plans', { params: { limit: 6 } }),
          api.get('/architects'),
        ]);
        setPlans(plansRes.data?.plans || []);
        setStats({
          plans: plansRes.data?.total ?? (plansRes.data?.plans || []).length,
          architects: (architectsRes.data?.architects || []).length,
        });
      } catch (e) {
        console.error('Erreur chargement PlansHome :', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search.style) params.append('style', search.style);
    if (search.bedrooms) params.append('bedrooms', search.bedrooms);
    navigate(`/plans/annonces?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <style>{`
        .liquid-glass {
          position: relative;
          background: rgba(255,255,255,0.6);
          backdrop-filter: blur(24px) saturate(180%);
          -webkit-backdrop-filter: blur(24px) saturate(180%);
          border: 1px solid rgba(255,255,255,0.6);
          box-shadow: 0 8px 32px rgba(15,23,42,0.08), inset 0 1px 0 rgba(255,255,255,0.5);
        }
        .dark .liquid-glass {
          background: rgba(22,26,36,0.55);
          border-color: rgba(255,255,255,0.12);
          box-shadow: 0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.1);
        }
        .liquid-glass-dark {
          background: rgba(18,22,32,0.45);
          backdrop-filter: blur(28px) saturate(160%);
          -webkit-backdrop-filter: blur(28px) saturate(160%);
          border: 1px solid rgba(255,255,255,0.14);
          box-shadow: 0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.12);
        }
        @keyframes plansFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>

      <PlansNavbar />

      {/* ══ HERO ══ */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0A1510 0%, #0F1B15 45%, #071410 100%)' }}>
        <div className="absolute inset-0 opacity-40" style={{
          backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(58,125,68,0.35) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(74,222,128,0.15) 0%, transparent 50%)',
        }} />
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(58,125,68,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(58,125,68,0.04) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }} />

        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-16 sm:px-6 lg:px-8 lg:pb-24 lg:pt-20">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#4ade80]/20 bg-[#3A7D44]/15 px-3 py-1.5 text-xs font-semibold text-[#4ade80]">
            <Sparkles size={14} />
            Logezy Plans
          </div>

          <h1 className="font-display max-w-2xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
            Trouvez le plan de <span className="text-[#4ade80]">votre future maison</span>
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-white/60 sm:text-base">
            Des centaines de plans conçus par des architectes vérifiés au Bénin. Parcourez, comparez, ou demandez un plan sur mesure.
          </p>

          {/* Barre de recherche */}
          <form onSubmit={handleSearch} className="liquid-glass-dark mt-8 flex max-w-xl flex-col gap-2 rounded-[22px] p-2 sm:flex-row">
            <select
              value={search.style}
              onChange={(e) => setSearch(p => ({ ...p, style: e.target.value }))}
              className="h-12 flex-1 rounded-[14px] bg-transparent px-4 text-sm text-white outline-none [&>option]:text-slate-900"
            >
              <option value="">Tous les styles</option>
              {STYLES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
            <select
              value={search.bedrooms}
              onChange={(e) => setSearch(p => ({ ...p, bedrooms: e.target.value }))}
              className="h-12 flex-1 rounded-[14px] bg-transparent px-4 text-sm text-white outline-none [&>option]:text-slate-900"
            >
              <option value="">Chambres</option>
              {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}+ chambres</option>)}
            </select>
            <button type="submit"
              className="flex h-12 items-center justify-center gap-2 rounded-[14px] bg-[#3A7D44] px-6 text-sm font-bold text-white transition hover:bg-[#2D6235]">
              <Search size={16} />
              Rechercher
            </button>
          </form>

          {/* Stats */}
          <div className="mt-10 flex gap-8">
            <div>
              <div className="font-display text-2xl font-bold text-white">{loading ? '—' : stats.plans}+</div>
              <div className="text-xs text-white/50">Plans disponibles</div>
            </div>
            <div>
              <div className="font-display text-2xl font-bold text-white">{loading ? '—' : stats.architects}+</div>
              <div className="text-xs text-white/50">Architectes vérifiés</div>
            </div>
            <div>
              <div className="font-display text-2xl font-bold text-white">100%</div>
              <div className="text-xs text-white/50">Béninois</div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ STYLES ══ */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
            Parcourez par <span className="text-[#3A7D44]">style</span>
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Trouvez le style qui correspond à votre projet.</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {STYLES.map(s => (
            <Link key={s.value} to={`/plans/annonces?style=${s.value}`}
              className="liquid-glass group flex flex-col items-center gap-3 rounded-[22px] p-5 text-center transition-all hover:-translate-y-1 dark:text-white">
              <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#3A7D44]/10 text-[#3A7D44] transition group-hover:bg-[#3A7D44] group-hover:text-white">
                <Layers size={20} />
              </div>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{s.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ══ PLANS RÉCENTS ══ */}
      <section className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
              Plans <span className="text-[#3A7D44]">récents</span>
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Les dernières publications de nos architectes.</p>
          </div>
          <Link to="/plans/annonces" className="hidden items-center gap-1.5 text-sm font-semibold text-[#3A7D44] hover:underline sm:flex">
            Voir tout <ArrowRight size={15} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
            {[...Array(6)].map((_, i) => <div key={i} className="aspect-[4/3] animate-pulse rounded-[26px] bg-slate-200 dark:bg-slate-800" />)}
          </div>
        ) : plans.length === 0 ? (
          <div className="liquid-glass rounded-[26px] p-10 text-center text-slate-500 dark:text-slate-400">
            Aucun plan disponible pour le moment.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
            {plans.map(p => <PlanPreviewCard key={p.id} plan={p} />)}
          </div>
        )}

        <Link to="/plans/annonces" className="mt-6 flex items-center justify-center gap-1.5 text-sm font-semibold text-[#3A7D44] hover:underline sm:hidden">
          Voir tous les plans <ArrowRight size={15} />
        </Link>
      </section>

      {/* ══ COMMENT ÇA MARCHE ══ */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="mb-10 text-center font-display text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
          Comment ça marche
        </h2>
        <div className="grid gap-5 sm:grid-cols-3">
          {[
            { icon: Search, title: 'Parcourez ou décrivez', desc: 'Explorez notre catalogue ou décrivez le plan que vous avez en tête.' },
            { icon: MessageSquare, title: 'Échangez avec un architecte', desc: 'Contactez directement l\'architecte pour affiner les détails.' },
            { icon: CheckCircle, title: 'Recevez votre plan', desc: 'Obtenez votre plan 2D/3D complet, prêt pour la construction.' },
          ].map((step, i) => (
            <div key={i} className="liquid-glass rounded-[26px] p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#3A7D44]/10 text-[#3A7D44]">
                <step.icon size={20} />
              </div>
              <h3 className="mt-4 font-display font-bold text-slate-900 dark:text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ CTA DOUBLE ══ */}
      <section className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="liquid-glass-dark relative overflow-hidden rounded-[26px] p-8">
            <ClipboardList size={28} className="text-[#4ade80]" />
            <h3 className="mt-4 font-display text-xl font-bold text-white">Un projet précis en tête ?</h3>
            <p className="mt-2 text-sm text-white/60">Décrivez votre projet, nos architectes vous recontactent avec une proposition adaptée.</p>
            <Link to="/demander-un-plan"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#3A7D44] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#2D6235]">
              Demander un plan sur mesure <ArrowRight size={15} />
            </Link>
          </div>
          <div className="liquid-glass relative overflow-hidden rounded-[26px] p-8">
            <UserRound size={28} className="text-[#3A7D44]" />
            <h3 className="mt-4 font-display text-xl font-bold text-slate-900 dark:text-white">Découvrez nos architectes</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Des professionnels vérifiés, prêts à concevoir la maison de vos rêves.</p>
            <Link to="/architectes"
              className="mt-5 inline-flex items-center gap-2 rounded-xl border border-[#3A7D44]/30 bg-[#3A7D44]/10 px-5 py-2.5 text-sm font-bold text-[#3A7D44] transition hover:bg-[#3A7D44]/15">
              Voir l'annuaire <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      <div className="h-16" />
    </div>
  );
}