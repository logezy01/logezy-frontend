import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, UserRound, MapPin, Globe, Building2, Loader2 } from 'lucide-react';
import PlansNavbar from '../components/common/PlansNavbar';
import api from '../lib/axios';

function formatPrice(price) {
  if (price === null || price === undefined || price === '') return 'Prix sur demande';
  return `${new Intl.NumberFormat('fr-FR').format(Number(price))} FCFA`;
}

export default function ArchitectPublicProfile() {
  const { id } = useParams();
  const [architect, setArchitect] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArchitect = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await api.get(`/architects/${id}`);
        setArchitect(res.data?.architect || null);
      } catch (err) {
        console.error('Erreur chargement architecte :', err);
        setError(err.response?.data?.message || err.response?.data?.error || 'Architecte introuvable.');
      } finally {
        setLoading(false);
      }
    };
    fetchArchitect();
  }, [id]);

  const activePlans = (architect?.house_plans || []).filter(p => p.status === 'active');

  if (loading) {
    return (
      <>
        <PlansNavbar />
        <div className="flex min-h-screen items-center justify-center bg-slate-50 pt-16 dark:bg-slate-950">
          <Loader2 size={30} className="animate-spin text-[#3A7D44]" />
        </div>
      </>
    );
  }

  if (error || !architect) {
    return (
      <>
        <PlansNavbar />
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 pt-16 text-center dark:bg-slate-950">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Architecte introuvable</h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">{error || "Ce profil n'est plus disponible."}</p>
          <Link to="/architectes" className="mt-5 inline-flex rounded-xl bg-[#3A7D44] px-5 py-2.5 text-sm font-semibold text-white">
            Retour à l'annuaire
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <PlansNavbar />
      <main className="min-h-screen bg-slate-50 pb-20 pt-28 dark:bg-slate-950">
        <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

          <Link to="/architectes" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#3A7D44] dark:text-slate-300">
            <ArrowLeft className="h-4 w-4" />
            Retour à l'annuaire
          </Link>

          <div className="mt-6 rounded-[26px] border border-white/70 bg-white/65 p-6 shadow-glass backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/60 sm:p-8">
            <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
              {architect.user?.avatar_url ? (
                <img src={architect.user.avatar_url} alt={architect.user.full_name} className="h-20 w-20 rounded-full object-cover" />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#EBF5ED] text-[#3A7D44] dark:bg-[#16351d]">
                  <UserRound size={32} />
                </div>
              )}
              <div>
                <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
                  {architect.user?.full_name || 'Architecte'}
                </h1>
                <div className="mt-2 flex flex-wrap justify-center gap-3 sm:justify-start">
                  {architect.city && (
                    <span className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                      <MapPin size={14} className="text-[#3A7D44]" />
                      {architect.city}
                    </span>
                  )}
                  {architect.years_experience > 0 && (
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {architect.years_experience} an{architect.years_experience > 1 ? 's' : ''} d'expérience
                    </span>
                  )}
                  {architect.website_url && (
                    <a href={architect.website_url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm font-medium text-[#3A7D44] hover:underline">
                      <Globe size={14} />
                      Site web
                    </a>
                  )}
                </div>
              </div>
            </div>

            {architect.bio && (
              <p className="mt-6 text-sm leading-7 text-slate-600 dark:text-slate-400">
                {architect.bio}
              </p>
            )}

            {architect.specialties && (
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                <span className="font-medium text-slate-700 dark:text-slate-300">Spécialités :</span> {architect.specialties}
              </p>
            )}
          </div>

          <div className="mt-8">
            <h2 className="mb-4 flex items-center gap-2 font-display text-xl font-semibold text-slate-900 dark:text-white">
              <Building2 size={20} className="text-[#3A7D44]" />
              Plans publiés ({activePlans.length})
            </h2>

            {activePlans.length === 0 ? (
              <div className="rounded-[26px] border border-white/70 bg-white/60 p-8 text-center shadow-glass backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/50">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Cet architecte n'a pas encore de plan publié.
                </p>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {activePlans.map((plan) => {
                  const cover = [...(plan.plan_images || [])].sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
                  const image = (cover.find(i => i.is_cover) || cover[0])?.image_url;
                  return (
                    <Link key={plan.id} to={`/plans/${plan.id}`}
                      className="group overflow-hidden rounded-[26px] border border-white/60 bg-white/65 shadow-card backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-slate-900/60">
                      <div className="aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800">
                        {image ? (
                          <img src={image} alt={plan.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
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
                        <p className="mt-1 text-sm font-bold text-[#3A7D44]">
                          {formatPrice(plan.price)}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}