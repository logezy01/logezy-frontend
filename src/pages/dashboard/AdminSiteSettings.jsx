import { useEffect, useState } from 'react';
import { AlertTriangle, Save, Settings2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/axios';

const SETTING_OPTIONS = [
  {
    key: 'maintenance_mode',
    title: 'Mode maintenance',
    description: 'Masque le site aux visiteurs et suspend les API publiques. Les administrateurs conservent l’accès.',
    warning: true,
  },
  {
    key: 'registrations_enabled',
    title: 'Nouvelles inscriptions',
    description: 'Autorise la création de comptes par formulaire et via Google.',
  },
  {
    key: 'listing_submissions_enabled',
    title: 'Publication de nouvelles annonces',
    description: 'Autorise les propriétaires et agents à soumettre de nouvelles annonces.',
  },
  {
    key: 'listing_moderation_enabled',
    title: 'Validation avant publication',
    description: 'Les annonces restent en attente jusqu’à leur approbation par un administrateur. Si cette option est désactivée, les nouvelles annonces sont publiées directement.',
  },
];

export default function AdminSiteSettings() {
  const [settings, setSettings] = useState(null);
  const [savedSettings, setSavedSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    api.get('/admin/site-settings')
      .then(({ data }) => {
        setSettings(data.settings);
        setSavedSettings(data.settings);
      })
      .catch((error) => {
        setLoadError({
          code: error.response?.data?.code,
          message: error.response?.data?.error || 'Impossible de charger les réglages',
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const hasChanges = settings && savedSettings && SETTING_OPTIONS.some(
    ({ key }) => settings[key] !== savedSettings[key],
  );

  const save = async () => {
    if (!hasChanges || saving) return;
    setSaving(true);
    try {
      const changes = Object.fromEntries(
        SETTING_OPTIONS
          .filter(({ key }) => settings[key] !== savedSettings[key])
          .map(({ key }) => [key, settings[key]]),
      );
      const { data } = await api.put('/admin/site-settings', changes);
      setSettings(data.settings);
      setSavedSettings(data.settings);
      toast.success('Réglages de la plateforme enregistrés');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Impossible d’enregistrer les réglages');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="card h-48 animate-pulse" aria-label="Chargement des réglages" />;
  }

  if (!settings) {
    return (
      <div className="card space-y-3 border-l-4 border-amber-400 p-5">
        <p className="font-semibold text-[#0F172A] dark:text-white">
          {loadError?.message || 'Les réglages ne sont pas disponibles.'}
        </p>
        {loadError?.code === 'SITE_MIGRATION_REQUIRED' && (
          <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">
            Exécutez le script
            {' '}<code className="rounded bg-[#F5F5F7] px-1.5 py-0.5 dark:bg-[#2A2A2A]">
              backend/migrations/20261015_admin_controls_visitor_analytics.sql
            </code>
            {' '}dans l’éditeur SQL Supabase, puis actualisez cette page.
          </p>
        )}
      </div>
    );
  }

  return (
    <section className="space-y-5 animate-fade-in">
      <header>
        <h2 className="flex items-center gap-2 font-display font-bold text-[#0F172A] dark:text-white">
          <Settings2 size={21} className="text-[#3A7D44]" /> Réglages de la plateforme
        </h2>
        <p className="mt-1 text-sm text-[#64748B] dark:text-[#94A3B8]">
          Ces contrôles sont appliqués côté serveur, pas uniquement dans l’interface.
        </p>
      </header>

      <div className="card divide-y divide-[#E2E8F0] dark:divide-[#2A2A2A]">
        {SETTING_OPTIONS.map(({ key, title, description, warning }) => (
          <label key={key} className="flex cursor-pointer items-start gap-4 p-5 sm:p-6">
            <input
              type="checkbox"
              checked={settings[key]}
              onChange={(event) => setSettings((current) => ({
                ...current,
                [key]: event.target.checked,
              }))}
              className="mt-1 h-5 w-5 accent-[#3A7D44]"
            />
            <span className="flex-1">
              <span className="flex items-center gap-2 font-semibold text-[#0F172A] dark:text-white">
                {title}
                {warning && settings[key] && <AlertTriangle size={15} className="text-amber-500" />}
              </span>
              <span className="mt-1 block text-sm leading-relaxed text-[#64748B] dark:text-[#94A3B8]">
                {description}
              </span>
            </span>
            <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${
              settings[key]
                ? 'bg-[#EBF5ED] text-[#3A7D44]'
                : 'bg-[#F5F5F7] text-[#64748B] dark:bg-[#2A2A2A] dark:text-[#94A3B8]'
            }`}>
              {settings[key] ? 'Activé' : 'Désactivé'}
            </span>
          </label>
        ))}
      </div>

      {settings.maintenance_mode && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <AlertTriangle size={18} className="mt-0.5 shrink-0" />
          <p>Le mode maintenance sera actif dès l’enregistrement. Les administrateurs garderont l’accès au tableau de bord.</p>
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={save}
          disabled={!hasChanges || saving}
          className="btn-primary flex items-center gap-2 px-5 py-2.5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save size={16} />
          {saving ? 'Enregistrement…' : 'Enregistrer les réglages'}
        </button>
      </div>
    </section>
  );
}
