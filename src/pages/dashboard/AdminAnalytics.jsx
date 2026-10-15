import { useEffect, useMemo, useState } from 'react';
import { BarChart3, Globe2, MapPin, Users, Eye, RefreshCw } from 'lucide-react';
import api from '../../lib/axios';

const PERIODS = [7, 30, 90];
const SESSION_PERIODS = [7, 30, 90, 365];
const formatNumber = new Intl.NumberFormat('fr-FR');
const regionNames = new Intl.DisplayNames(['fr'], { type: 'region' });
const dateTimeFormat = new Intl.DateTimeFormat('fr-FR', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

function locationName(code) {
  if (!code) return 'Localisation inconnue';
  try {
    return regionNames.of(code) || code;
  } catch {
    return code;
  }
}

export default function AdminAnalytics() {
  const [days, setDays] = useState(30);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [sessionDays, setSessionDays] = useState(30);
  const [sessionPage, setSessionPage] = useState(1);
  const [sessionData, setSessionData] = useState(null);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [sessionsError, setSessionsError] = useState(null);

  useEffect(() => {
    let active = true;
    api.get('/admin/analytics', { params: { days } })
      .then(({ data }) => {
        if (active) {
          setAnalytics({ days, data: data.analytics });
          setLoadError(null);
        }
      })
      .catch((error) => {
        if (active) {
          setLoadError({
            code: error.response?.data?.code,
            message: error.response?.data?.error || 'Impossible de charger les statistiques de visite',
          });
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [days]);

  useEffect(() => {
    let active = true;
    const loadSessions = () => {
      api.get('/admin/user-sessions', {
        params: { days: sessionDays, page: sessionPage },
      })
        .then(({ data }) => {
          if (active) {
            setSessionData(data);
            setSessionsError(null);
          }
        })
        .catch((error) => {
          if (active) {
            setSessionsError({
              code: error.response?.data?.code,
              message: error.response?.data?.error || 'Impossible de charger l’historique des connexions',
            });
          }
        })
        .finally(() => {
          if (active) setSessionsLoading(false);
        });
    };

    loadSessions();
    const refreshTimer = window.setInterval(loadSessions, 30_000);
    return () => {
      active = false;
      window.clearInterval(refreshTimer);
    };
  }, [sessionDays, sessionPage]);

  const refreshAnalytics = async () => {
    setRefreshing(true);
    try {
      const { data } = await api.get('/admin/analytics', { params: { days } });
      setAnalytics({ days, data: data.analytics });
      setLoadError(null);
    } catch (error) {
      setLoadError({
        code: error.response?.data?.code,
        message: error.response?.data?.error || 'Impossible de charger les statistiques de visite',
      });
    } finally {
      setRefreshing(false);
    }
  };

  const refreshSessions = async () => {
    setSessionsLoading(true);
    try {
      const { data } = await api.get('/admin/user-sessions', {
        params: { days: sessionDays, page: sessionPage },
      });
      setSessionData(data);
      setSessionsError(null);
    } catch (error) {
      setSessionsError({
        code: error.response?.data?.code,
        message: error.response?.data?.error || 'Impossible de charger l’historique des connexions',
      });
    } finally {
      setSessionsLoading(false);
    }
  };

  const daily = useMemo(() => {
    const byDate = new Map((analytics?.data?.daily || []).map((item) => [item.date, item]));
    return Array.from({ length: days }, (_, index) => {
      const date = new Date();
      date.setUTCDate(date.getUTCDate() - (days - index - 1));
      const key = date.toISOString().slice(0, 10);
      return {
        date: key,
        visits: Number(byDate.get(key)?.visits || 0),
        visitors: Number(byDate.get(key)?.visitors || 0),
      };
    });
  }, [analytics, days]);

  const maxVisits = Math.max(1, ...daily.map((item) => item.visits));
  const currentAnalytics = analytics?.days === days ? analytics.data : null;
  const pending = loading || !currentAnalytics;

  const formatDuration = (totalSeconds) => {
    const totalMinutes = Math.floor(Number(totalSeconds || 0) / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours === 0) return `${minutes} min`;
    return `${hours} h ${String(minutes).padStart(2, '0')} min`;
  };

  const formatDateTime = (value) => {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? 'Date inconnue' : dateTimeFormat.format(date);
  };

  return (
    <section className="space-y-6 animate-fade-in">
      {loadError ? (
        <div className="space-y-5">
        <header>
          <h2 className="flex items-center gap-2 font-display font-bold text-[#0F172A] dark:text-white">
            <BarChart3 size={21} className="text-[#3A7D44]" /> Visites de la plateforme
          </h2>
          <p className="mt-1 text-sm text-[#64748B] dark:text-[#94A3B8]">
            Pages consultées et localisation approximative, sans conservation d’adresse IP.
          </p>
        </header>
        <div className="card space-y-3 border-l-4 border-amber-400 p-5">
          <p className="font-semibold text-[#0F172A] dark:text-white">{loadError.message}</p>
          {loadError.code === 'SITE_MIGRATION_REQUIRED' && (
            <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">
              Exécutez le script
              {' '}<code className="rounded bg-[#F5F5F7] px-1.5 py-0.5 dark:bg-[#2A2A2A]">
                backend/migrations/20261015_admin_controls_visitor_analytics.sql
              </code>
              {' '}dans l’éditeur SQL Supabase, puis redémarrez le backend.
            </p>
          )}
          <button type="button" onClick={refreshAnalytics} disabled={refreshing} className="btn-secondary px-4 py-2 text-sm">
            {refreshing ? 'Vérification…' : 'Réessayer'}
          </button>
        </div>
        </div>
      ) : (
        <>
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 font-display font-bold text-[#0F172A] dark:text-white">
            <BarChart3 size={21} className="text-[#3A7D44]" /> Visites de la plateforme
          </h2>
          <p className="mt-1 text-sm text-[#64748B] dark:text-[#94A3B8]">
            Pages consultées et localisation approximative, sans conservation d’adresse IP.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={days}
            onChange={(event) => setDays(Number(event.target.value))}
            className="input-field py-2 text-sm"
            aria-label="Période des statistiques"
          >
            {PERIODS.map((period) => (
              <option key={period} value={period}>Derniers {period} jours</option>
            ))}
          </select>
          <button
            type="button"
            onClick={refreshAnalytics}
            disabled={refreshing}
            className="btn-secondary flex items-center gap-2 px-3 py-2 text-sm"
            aria-label="Actualiser les statistiques"
          >
            <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
            Actualiser
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="card flex items-center gap-4 p-5">
          <span className="rounded-xl bg-[#EBF5ED] p-3 text-[#3A7D44]"><Eye size={22} /></span>
          <div>
            <div className="text-2xl font-black text-[#0F172A] dark:text-white">
              {pending ? '…' : formatNumber.format(Number(currentAnalytics.visits || 0))}
            </div>
            <div className="text-sm text-[#64748B] dark:text-[#94A3B8]">Pages consultées</div>
          </div>
        </div>
        <div className="card flex items-center gap-4 p-5">
          <span className="rounded-xl bg-blue-50 p-3 text-blue-600"><Users size={22} /></span>
          <div>
            <div className="text-2xl font-black text-[#0F172A] dark:text-white">
              {pending ? '…' : formatNumber.format(Number(currentAnalytics.unique_visitors || 0))}
            </div>
            <div className="text-sm text-[#64748B] dark:text-[#94A3B8]">Visiteurs (sessions anonymes)</div>
          </div>
        </div>
      </div>

      <div className="card p-5 sm:p-6">
        <h3 className="mb-5 font-display font-bold text-[#0F172A] dark:text-white">Activité quotidienne</h3>
        {pending ? (
          <div className="h-48 animate-pulse rounded-xl bg-[#F5F5F7] dark:bg-[#2A2A2A]" />
        ) : (
          <div className="flex h-48 items-end gap-1 overflow-x-auto pb-7">
            {daily.map((item) => (
              <div
                key={item.date}
                className="group relative flex min-w-[8px] flex-1 items-end justify-center"
                title={`${item.date} : ${formatNumber.format(item.visits)} pages`}
              >
                <div
                  className="w-full min-w-[6px] rounded-t bg-[#3A7D44] transition-opacity group-hover:opacity-70"
                  style={{ height: `${Math.max(item.visits ? 4 : 1, (item.visits / maxVisits) * 100)}%` }}
                />
                <span className="absolute top-full mt-2 whitespace-nowrap text-[10px] text-[#64748B] dark:text-[#94A3B8]">
                  {days <= 7 || item.date.endsWith('-01') || item.date.endsWith('-15')
                    ? new Date(`${item.date}T00:00:00Z`).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', timeZone: 'UTC' })
                    : ''}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card overflow-hidden">
          <div className="flex items-center gap-2 border-b border-[#E2E8F0] p-5 dark:border-[#2A2A2A]">
            <Globe2 size={17} className="text-[#3A7D44]" />
            <h3 className="font-display font-bold text-[#0F172A] dark:text-white">Pays des visiteurs</h3>
          </div>
          {pending ? <div className="h-32 animate-pulse bg-[#F5F5F7] dark:bg-[#2A2A2A]" /> :
            currentAnalytics.countries?.length ? (
              <div className="divide-y divide-[#E2E8F0] dark:divide-[#2A2A2A]">
                {currentAnalytics.countries.map((item) => (
                  <div key={item.country_code} className="flex items-center justify-between px-5 py-3 text-sm">
                    <span className="text-[#334155] dark:text-[#CBD5E1]">{locationName(item.country_code)}</span>
                    <strong className="text-[#0F172A] dark:text-white">{formatNumber.format(Number(item.visits))}</strong>
                  </div>
                ))}
              </div>
            ) : <p className="p-5 text-sm text-[#64748B] dark:text-[#94A3B8]">Aucune localisation disponible pour cette période.</p>}
        </div>

        <div className="card overflow-hidden">
          <div className="flex items-center gap-2 border-b border-[#E2E8F0] p-5 dark:border-[#2A2A2A]">
            <MapPin size={17} className="text-[#3A7D44]" />
            <h3 className="font-display font-bold text-[#0F172A] dark:text-white">Villes approximatives</h3>
          </div>
          {pending ? <div className="h-32 animate-pulse bg-[#F5F5F7] dark:bg-[#2A2A2A]" /> :
            currentAnalytics.cities?.length ? (
              <div className="divide-y divide-[#E2E8F0] dark:divide-[#2A2A2A]">
                {currentAnalytics.cities.map((item) => (
                  <div key={`${item.country_code}-${item.city}`} className="flex items-center justify-between px-5 py-3 text-sm">
                    <span className="text-[#334155] dark:text-[#CBD5E1]">
                      {item.city}{item.country_code ? `, ${locationName(item.country_code)}` : ''}
                    </span>
                    <strong className="text-[#0F172A] dark:text-white">{formatNumber.format(Number(item.visits))}</strong>
                  </div>
                ))}
              </div>
            ) : <p className="p-5 text-sm text-[#64748B] dark:text-[#94A3B8]">Aucune ville transmise par le fournisseur d’hébergement.</p>}
        </div>
      </div>
      <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
        Les villes ne sont affichées que si le proxy de confiance les fournit. Les données de localisation peuvent être imprécises ; aucune adresse IP ni identité de compte n’est enregistrée.
      </p>
        </>
      )}

      <section className="space-y-4 border-t border-[#E2E8F0] pt-6 dark:border-[#2A2A2A]">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-display text-lg font-bold text-[#0F172A] dark:text-white">
              Connexions des utilisateurs inscrits
            </h3>
            <p className="mt-1 text-sm text-[#64748B] dark:text-[#94A3B8]">
              Début de session et temps actif estimé. Historique conservé 12 mois.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={sessionDays}
              onChange={(event) => {
                setSessionPage(1);
                setSessionDays(Number(event.target.value));
              }}
              className="input-field py-2 text-sm"
              aria-label="Période des connexions"
            >
              {SESSION_PERIODS.map((period) => (
                <option key={period} value={period}>Derniers {period} jours</option>
              ))}
            </select>
            <button
              type="button"
              onClick={refreshSessions}
              disabled={sessionsLoading}
              className="btn-secondary flex items-center gap-2 px-3 py-2 text-sm"
              aria-label="Actualiser l’historique des connexions"
            >
              <RefreshCw size={15} className={sessionsLoading ? 'animate-spin' : ''} />
              Actualiser
            </button>
          </div>
        </header>

        {sessionsError ? (
          <div className="card space-y-3 border-l-4 border-amber-400 p-5">
            <p className="font-semibold text-[#0F172A] dark:text-white">{sessionsError.message}</p>
            {sessionsError.code === 'USER_SESSIONS_MIGRATION_REQUIRED' && (
              <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">
                Exécutez
                {' '}<code className="rounded bg-[#F5F5F7] px-1.5 py-0.5 dark:bg-[#2A2A2A]">
                  backend/migrations/20261015_authenticated_user_sessions.sql
                </code>
                {' '}dans Supabase, puis redémarrez l’API et reconnectez les utilisateurs.
              </p>
            )}
            <button type="button" onClick={refreshSessions} disabled={sessionsLoading} className="btn-secondary px-4 py-2 text-sm">
              {sessionsLoading ? 'Vérification…' : 'Réessayer'}
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="card p-4">
                <div className="text-2xl font-black text-[#0F172A] dark:text-white">
                  {sessionsLoading ? '…' : formatNumber.format(sessionData?.total || 0)}
                </div>
                <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">Connexions sur la période</p>
              </div>
              <div className="card p-4">
                <div className="text-2xl font-black text-[#3A7D44] dark:text-green-400">
                  {sessionsLoading ? '…' : formatNumber.format(sessionData?.sessions?.filter((session) => session.is_online).length || 0)}
                </div>
                <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">En ligne actuellement (sur cette page)</p>
              </div>
              <div className="card p-4">
                <div className="text-2xl font-black text-[#0F172A] dark:text-white">
                  {sessionsLoading ? '…' : formatNumber.format(sessionData?.total_pages || 0)}
                </div>
                <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">Pages d’historique</p>
              </div>
            </div>

            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px]">
                  <thead className="border-b border-[#E2E8F0] bg-[#F5F5F7] dark:border-[#2A2A2A] dark:bg-[#2A2A2A]">
                    <tr>
                      {['Utilisateur', 'Rôle', 'Connexion', 'Dernière activité', 'Temps actif', 'État'].map((heading) => (
                        <th key={heading} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-[#64748B]">
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#2A2A2A]">
                    {sessionsLoading ? (
                      <tr><td colSpan="6" className="px-4 py-8 text-center text-sm text-[#64748B]">Chargement des connexions…</td></tr>
                    ) : sessionData?.sessions?.length ? sessionData.sessions.map((session) => (
                      <tr key={session.id} className="hover:bg-[#F8FAFC] dark:hover:bg-[#1F2937]">
                        <td className="px-4 py-3">
                          <div className="text-sm font-semibold text-[#0F172A] dark:text-white">
                            {session.users?.full_name || 'Utilisateur'}
                          </div>
                          <div className="text-xs text-[#64748B] dark:text-[#94A3B8]">{session.users?.email || '—'}</div>
                        </td>
                        <td className="px-4 py-3 text-sm capitalize text-[#334155] dark:text-[#CBD5E1]">{session.users?.role || '—'}</td>
                        <td className="px-4 py-3 text-sm text-[#334155] dark:text-[#CBD5E1]">{formatDateTime(session.started_at)}</td>
                        <td className="px-4 py-3 text-sm text-[#334155] dark:text-[#CBD5E1]">{formatDateTime(session.last_seen_at)}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-[#0F172A] dark:text-white">{formatDuration(session.active_seconds)}</td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                            session.is_online
                              ? 'bg-[#EBF5ED] text-[#3A7D44]'
                              : 'bg-[#F5F5F7] text-[#64748B] dark:bg-[#2A2A2A] dark:text-[#94A3B8]'
                          }`}>
                            {session.is_online ? 'En ligne' : session.ended_at ? 'Déconnecté' : 'Inactif'}
                          </span>
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan="6" className="px-4 py-8 text-center text-sm text-[#64748B] dark:text-[#94A3B8]">
                        Aucune connexion enregistrée sur cette période.
                      </td></tr>
                    )}
                  </tbody>
                </table>
              </div>
              <footer className="flex items-center justify-between border-t border-[#E2E8F0] px-4 py-3 dark:border-[#2A2A2A]">
                <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                  {sessionData?.total || 0} connexion(s), 50 par page
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSessionPage((page) => Math.max(1, page - 1))}
                    disabled={sessionPage <= 1 || sessionsLoading}
                    className="btn-secondary px-3 py-1.5 text-sm disabled:opacity-50"
                  >
                    Précédent
                  </button>
                  <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                    {sessionPage} / {Math.max(1, sessionData?.total_pages || 1)}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSessionPage((page) => Math.min(sessionData?.total_pages || 1, page + 1))}
                    disabled={sessionPage >= (sessionData?.total_pages || 1) || sessionsLoading}
                    className="btn-secondary px-3 py-1.5 text-sm disabled:opacity-50"
                  >
                    Suivant
                  </button>
                </div>
              </footer>
            </div>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
              Le temps actif est estimé à partir d’un signal toutes les 30 secondes lorsque la page est visible. Le temps non confirmé après une fermeture brutale peut être légèrement sous-estimé ; aucune adresse IP n’est stockée.
            </p>
          </>
        )}
      </section>
    </section>
  );
}
