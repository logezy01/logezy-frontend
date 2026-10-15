import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Banknote,
  BedDouble,
  Building2,
  ClipboardList,
  Files,
  Loader2,
  Mail,
  MapPin,
  PlusCircle,
  Phone,
  RefreshCw,
  UserRound,
} from 'lucide-react';
import DashboardLayout from '../../components/common/DashboardLayout';
import api from '../../lib/axios';

const menuItems = [
  { label: "Vue d'ensemble", path: '/dashboard/architecte', icon: Building2 },
  { label: 'Mes demandes', path: '/dashboard/architecte/demandes-plans', icon: ClipboardList },
  { label: 'Mon profil', path: '/dashboard/architecte/profil', icon: UserRound },
  { label: 'Mes plans', path: '/dashboard/architecte/plans', icon: Files },
  { label: 'Publier un plan', path: '/dashboard/architecte/plans/nouveau', icon: PlusCircle },
];

function formatBudget(value) {
  return new Intl.NumberFormat('fr-FR').format(Number(value));
}

export default function ArchitectPlanRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadRequests = useCallback(async () => {
    try {
      const response = await api.get('/plan-requests/assigned');
      setError('');
      setRequests(response.data?.requests || []);
    } catch (requestError) {
      console.error('Erreur chargement des demandes de plans :', requestError);
      setError(requestError.response?.data?.error || 'Impossible de charger vos demandes.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isCurrent = true;
    api.get('/plan-requests/assigned')
      .then(response => {
        if (!isCurrent) return;
        setError('');
        setRequests(response.data?.requests || []);
      })
      .catch(requestError => {
        if (!isCurrent) return;
        console.error('Erreur chargement des demandes de plans :', requestError);
        setError(requestError.response?.data?.error || 'Impossible de charger vos demandes.');
      })
      .finally(() => {
        if (isCurrent) setLoading(false);
      });
    return () => {
      isCurrent = false;
    };
  }, []);

  return (
    <DashboardLayout title="Demandes de plans" menuItems={menuItems}>
      <main className="space-y-6 p-4 sm:p-6 lg:p-8">
        <header className="flex flex-col justify-between gap-4 rounded-2xl bg-gradient-to-br from-[#163A2B] via-[#24573D] to-[#3A7D44] p-6 text-white sm:flex-row sm:items-center">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold text-white/80">
              <ClipboardList size={17} /> LOGEZY PLANS
            </p>
            <h1 className="mt-2 font-display text-2xl font-bold">Demandes de plans sur mesure</h1>
            <p className="mt-2 text-sm text-white/75">
              Retrouvez les projets qui vous sont adressés et contactez directement les clients.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              loadRequests();
            }}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold transition hover:bg-white/20 disabled:opacity-60"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Actualiser
          </button>
        </header>

        {loading ? (
          <div className="flex min-h-48 items-center justify-center text-[#3A7D44]">
            <Loader2 size={30} className="animate-spin" />
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-300">
            <p className="font-semibold">{error}</p>
            <button
              type="button"
              onClick={() => {
                setLoading(true);
                loadRequests();
              }}
              className="mt-3 font-semibold underline"
            >
              Réessayer
            </button>
          </div>
        ) : requests.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center dark:border-white/10 dark:bg-white/[0.04]">
            <ClipboardList size={32} className="mx-auto text-[#3A7D44]" />
            <h2 className="mt-3 font-display text-lg font-bold text-slate-900 dark:text-white">Aucune demande pour le moment</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Les demandes qui vous seront adressées apparaîtront ici.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {requests.map(request => (
              <article key={request.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#3A7D44]">
                      {new Date(request.created_at).toLocaleDateString('fr-FR')}
                    </p>
                    <h2 className="mt-2 font-display text-lg font-bold text-slate-900 dark:text-white">
                      Projet sur mesure
                    </h2>
                  </div>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                    {request.status === 'nouveau' ? 'Nouveau' : request.status === 'en_cours' ? 'En cours' : 'Traité'}
                  </span>
                </div>

                <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700 dark:text-slate-300">
                  {request.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  {request.city && (
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-slate-700 dark:bg-white/10 dark:text-slate-200">
                      <MapPin size={13} /> {request.city}
                    </span>
                  )}
                  {request.bedrooms != null && (
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-slate-700 dark:bg-white/10 dark:text-slate-200">
                      <BedDouble size={13} /> {request.bedrooms} chambres
                    </span>
                  )}
                  {(request.budget_min != null || request.budget_max != null) && (
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-slate-700 dark:bg-white/10 dark:text-slate-200">
                      <Banknote size={13} />
                      {request.budget_min != null ? formatBudget(request.budget_min) : '—'}
                      {' – '}
                      {request.budget_max != null ? formatBudget(request.budget_max) : '—'} FCFA
                    </span>
                  )}
                </div>

                {request.reference_plan && (
                  <div className="mt-4 rounded-xl border border-[#3A7D44]/15 bg-[#3A7D44]/5 p-3 dark:bg-[#3A7D44]/10">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Plan de référence</p>
                    <Link to={`/plans/${request.reference_plan.id}`} className="mt-1 inline-block text-sm font-semibold text-[#3A7D44] hover:underline">
                      {request.reference_plan.title}
                    </Link>
                  </div>
                )}

                <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Demandeur</p>
                    <p className="mt-0.5 text-sm font-semibold text-slate-900 dark:text-white">{request.requester?.full_name || 'Utilisateur Logezy'}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {request.requester?.phone && (
                      <a href={`tel:${request.requester.phone}`} className="inline-flex items-center gap-2 rounded-lg bg-[#3A7D44] px-3 py-2 text-xs font-semibold text-white hover:bg-[#2D6235]">
                        <Phone size={13} /> Appeler
                      </a>
                    )}
                    {request.requester?.email && (
                      <a href={`mailto:${request.requester.email}`} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/10">
                        <Mail size={13} /> Écrire
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </DashboardLayout>
  );
}
