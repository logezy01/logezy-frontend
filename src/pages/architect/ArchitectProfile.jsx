
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  UserRound,
  CheckCircle2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore';

 const API_URL = (
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
).replace(/\/+$/, '');

const INITIAL_FORM = {
  bio: '',
  years_experience: '',
  city: '',
  specialties: '',
  website_url: '',
};

export default function ArchitectProfile() {
  const { token } = useAuthStore();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [existingProfile, setExistingProfile] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      try {
        setLoading(true);

        const response = await fetch(`${API_URL}/architects/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 404) {
          if (!cancelled) {
            setExistingProfile(null);
            setForm(INITIAL_FORM);
          }
          return;
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || data.error || 'Erreur de chargement du profil.'
          );
        }

        const profile = data.architect;

        if (!profile) {
          throw new Error('Le profil reçu est invalide.');
        }

        if (!cancelled) {
          setExistingProfile(profile);
          setForm({
            bio: profile.bio || '',
            years_experience: profile.years_experience ?? '',
            city: profile.city || '',
            specialties: profile.specialties || '',
            website_url: profile.website_url || '',
          });
        }
      } catch (error) {
        console.error(error);
        if (!cancelled) {
          toast.error(error.message || 'Impossible de charger le profil.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (token) {
      loadProfile();
    } else {
      setLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [token]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!token) {
      toast.error('Vous devez être connecté.');
      return;
    }

    if (!form.city.trim()) {
      toast.error('Veuillez renseigner votre ville.');
      return;
    }

    try {
      setSaving(true);

      const isEditing = Boolean(existingProfile);
   const endpoint = `${API_URL}/architects/profile`;

      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bio: form.bio.trim() || null,
          years_experience:
            form.years_experience === ''
              ? null
              : Number(form.years_experience),
          city: form.city.trim(),
          specialties: form.specialties.trim() || null,
          website_url: form.website_url.trim() || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || data.error || 'Impossible d’enregistrer le profil.'
        );
      }

      setExistingProfile(data.architect || null);

      toast.success(
        data.message || 'Profil enregistré avec succès.'
      );

      navigate('/architecte');
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Une erreur est survenue.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-[#080B14]">
        <div className="mx-auto max-w-3xl animate-pulse">
          <div className="h-8 w-56 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="mt-6 h-96 rounded-2xl bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080B14]">
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          to="/architecte"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#3A7D44] dark:text-slate-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à mon espace
        </Link>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-[#111827]">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EBF5ED] text-[#3A7D44] dark:bg-[#16351d]">
              <UserRound className="h-6 w-6" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Mon profil architecte
              </h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Présentez votre expertise aux utilisateurs de Logezy.
              </p>
            </div>
          </div>

          {existingProfile?.is_approved && (
            <div className="mt-6 flex items-center gap-2 rounded-xl bg-green-50 p-4 text-sm text-green-700 dark:bg-green-950/30 dark:text-green-400">
              <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
              Votre profil est approuvé.
            </div>
          )}

          {existingProfile && !existingProfile.is_approved && (
            <div className="mt-6 rounded-xl bg-amber-50 p-4 text-sm text-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
              Votre profil est en attente de validation par l’administration.
              Une modification du profil peut nécessiter une nouvelle validation.
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label
                htmlFor="bio"
                className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                Présentation
              </label>
              <textarea
                id="bio"
                name="bio"
                value={form.bio}
                onChange={handleChange}
                rows={5}
                placeholder="Présentez votre parcours et votre expérience..."
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#3A7D44] dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="years_experience"
                  className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  Années d’expérience
                </label>
                <input
                  id="years_experience"
                  type="number"
                  min="0"
                  name="years_experience"
                  value={form.years_experience}
                  onChange={handleChange}
                  placeholder="Ex. 5"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-[#3A7D44] dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label
                  htmlFor="city"
                  className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  Ville *
                </label>
                <input
                  id="city"
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  required
                  placeholder="Ex. Cotonou"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-[#3A7D44] dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="specialties"
                className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                Spécialités
              </label>
              <input
                id="specialties"
                type="text"
                name="specialties"
                value={form.specialties}
                onChange={handleChange}
                placeholder="Ex. Villas modernes, logements résidentiels..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-[#3A7D44] dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label
                htmlFor="website_url"
                className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                Site web
              </label>
              <input
                id="website_url"
                type="url"
                name="website_url"
                value={form.website_url}
                onChange={handleChange}
                placeholder="https://..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-[#3A7D44] dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end border-t border-slate-100 pt-6 dark:border-slate-800">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-[#3A7D44] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#2f6637] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save className="h-4 w-4" />
                {saving ? 'Enregistrement...' : 'Enregistrer mon profil'}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
 
