import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserRound, MapPin, Building2, Search, X, Loader2 } from 'lucide-react';
import PlansNavbar from '../components/common/PlansNavbar';
import api from '../lib/axios';

function ArchitectCard({ architect }) {
  const plansCount = architect.house_plans?.length;
  return (
    <Link
      to={`/architectes/${architect.id}`}
      className="group flex flex-col rounded-[26px] border border-white/60 bg-white/65 p-6 shadow-card backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-slate-900/60"
    >
      <div className="flex items-center gap-4">
        {architect.user?.avatar_url ? (
          <img
            src={architect.user.avatar_url}
            alt={architect.user.full_name}
            className="h-14 w-14 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#EBF5ED] text-[#3A7D44] dark:bg-[#16351d]">
            <UserRound size={24} />
          </div>
        )}
        <div className="min-w-0">
          <h3 className="truncate font-display text-lg font-semibold text-slate-900 dark:text-white">
            {architect.user?.full_name || 'Architecte'}
          </h3>
          {architect.city && (
            <p className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
              <MapPin size={13} className="text-[#3A7D44]" />
              {architect.city}
            </p>
          )}
        </div>
      </div>

      {architect.bio && (
        <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
          {architect.bio}
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {architect.years_experience > 0 && (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-white/10 dark:text-slate-300">
            {architect.years_experience} an{architect.years_experience > 1 ? 's' : ''} d'expérience
          </span>
        )}
        {architect.specialties && (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-white/10 dark:text-slate-300">
            {architect.specialties}
          </span>
        )}
      </div>

      <div className="mt-5 flex items-center justify-center rounded-[12px] border border-[#3A7D44]/20 bg-[#3A7D44]/10 px-4 py-3 text-sm font-semibold text-[#3A7D44] transition group-hover:bg-[#3A7D44]/15">
        Voir le profil
      </div>
    </Link>
  );
}

export default function ArchitectsDirectory() {
  const [architects, setArchitects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [city, setCity] = useState('');
  const [draftCity, setDraftCity] = useState('');

  const loadArchitects = async (cityFilter = '') => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (cityFilter) params.city = cityFilter;
      const res = await api.get('/architects', { params });
      setArchitects(res.data?.architects || []);
    } catch (err) {
      console.error('Erreur chargement architectes :', err);
      setError(err.response?.data?.message || err.response?.data?.error || "Impossible de charger l'annuaire des architectes.");
      setArchitects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadArchitects(); }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setCity(draftCity);
    loadArchitects(draftCity);
  };

  const handleReset = () => {
    setDraftCity('');
    setCity('');
    loadArchitects('');
  };

  return (
    <>
      <PlansNavbar />
      <main className="min-h-screen bg-slate-50 pb-20 pt-28 dark:bg-slate-950">
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mb-8">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#3A7D44]/15 bg-[#3A7D44]/10 px-3 py-1.5 text-xs font-semibold text-[#3A7D44]">
              <Building2 size={15} />
              Logezy Plans
            </div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
              Nos <span className="text-[#3A7D44]">architectes</span>
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base dark:text-slate-400">
              Trouvez un architecte vérifié pour concevoir ou adapter le plan de votre future maison.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mb-8 flex flex-col gap-3 rounded-[26px] border border-white/70 bg-white/65 p-3 shadow-glass backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/60 sm:flex-row">
            <div className="relative flex-1">
              <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3A7D44]" />
              <input
                type="text"
                value={draftCity}
                onChange={(e) => setDraftCity(e.target.value)}
                placeholder="Ville : Cotonou, Abomey-Calavi..."
                className="h-12 w-full rounded-[12px] border border-slate-200 bg-white/70 pl-11 pr-4 text-sm outline-none transition focus:border-[#3A7D44]/40 focus:ring-2 focus:ring-[#3A7D44]/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
              />
            </div>
            <button
              type="submit"
              className="flex h-12 items-center justify-center gap-2 rounded-[12px] bg-[#3A7D44] px-6 text-sm font-semibold text-white shadow-md transition hover:bg-[#2D6235] active:scale-[0.98]"
            >
              <Search size={17} />
              Rechercher
            </button>
            {city && (
              <button
                type="button"
                onClick={handleReset}
                className="flex h-12 items-center justify-center gap-2 rounded-[12px] border border-slate-200 bg-white/70 px-5 text-sm font-semibold text-slate-700 transition hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
              >
                <X size={16} />
                Effacer
              </button>
            )}
          </form>

          {loading && (
            <div className="flex min-h-[300px] items-center justify-center">
              <div className="flex flex-col items-center gap-3 text-slate-500 dark:text-slate-400">
                <Loader2 size={30} className="animate-spin text-[#3A7D44]" />
                <span className="text-sm">Chargement des architectes...</span>
              </div>
            </div>
          )}

          {!loading && error && (
            <div className="rounded-[26px] border border-red-200 bg-red-50 p-8 text-center dark:border-red-900/30 dark:bg-red-950/20">
              <p className="font-semibold text-red-700 dark:text-red-400">Une erreur est survenue</p>
              <p className="mt-2 text-sm text-red-600/80 dark:text-red-400/80">{error}</p>
            </div>
          )}

          {!loading && !error && architects.length === 0 && (
            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-[26px] border border-white/70 bg-white/60 px-6 text-center shadow-glass backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/50">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-[20px] bg-[#3A7D44]/10 text-[#3A7D44]">
                <UserRound size={30} />
              </div>
              <h3 className="font-display text-xl font-semibold text-slate-900 dark:text-white">
                Aucun architecte trouvé
              </h3>
              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
                Aucun architecte vérifié ne correspond à cette recherche pour le moment.
              </p>
            </div>
          )}

          {!loading && !error && architects.length > 0 && (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {architects.map((architect) => (
                <ArchitectCard key={architect.id} architect={architect} />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}