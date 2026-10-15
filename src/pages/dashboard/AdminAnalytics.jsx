import { useEffect, useMemo, useState } from 'react';
import { BarChart3, Globe2, MapPin, Users, Eye, RefreshCw } from 'lucide-react';
import api from '../../lib/axios';

const PERIODS = [7, 30, 90];
const formatNumber = new Intl.NumberFormat('fr-FR');
const regionNames = new Intl.DisplayNames(['fr'], { type: 'region' });

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

  if (loadError) {
    return (
      <section className="space-y-5 animate-fade-in">
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
      </section>
    );
  }

  return (
    <section className="space-y-6 animate-fade-in">
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
    </section>
  );
}
