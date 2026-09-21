import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
UserRound,
Plus,
LayoutDashboard,
Clock3,
CheckCircle2,
XCircle,
Home,
} from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function ArchitectDashboard() {
const { token } = useAuthStore();

const [profile, setProfile] = useState(null);
const [plans, setPlans] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
const loadDashboard = async () => {
try {
setLoading(true);


    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const [profileResponse, plansResponse] = await Promise.all([
      fetch(`${API_URL}/api/architects/me`, { headers }),
      fetch(`${API_URL}/api/plans/my`, { headers }),
    ]);

    if (profileResponse.ok) {
      const profileData = await profileResponse.json();
      setProfile(profileData.architect || profileData.profile || profileData);
    }

    if (plansResponse.ok) {
      const plansData = await plansResponse.json();
      setPlans(plansData.plans || []);
    }
  } catch (error) {
    console.error(error);
    toast.error('Impossible de charger votre espace architecte.');
  } finally {
    setLoading(false);
  }
};

if (token) {
  loadDashboard();
}


}, [token]);

if (loading) {
return ( <div className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-[#080B14]"> <div className="mx-auto max-w-7xl animate-pulse space-y-6"> <div className="h-10 w-64 rounded bg-slate-200 dark:bg-slate-800" /> <div className="h-32 rounded-2xl bg-slate-200 dark:bg-slate-800" /> <div className="h-64 rounded-2xl bg-slate-200 dark:bg-slate-800" /> </div> </div>
);
}

const isApproved = profile?.is_approved === true;

const pendingPlans = plans.filter(
(plan) => plan.status === 'pending'
).length;

const activePlans = plans.filter(
(plan) => plan.status === 'active'
).length;

const rejectedPlans = plans.filter(
(plan) => plan.status === 'rejected'
).length;

return ( <div className="min-h-screen bg-slate-50 dark:bg-[#080B14]"> <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
{/* En-tête */} <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"> <div> <div className="flex items-center gap-2 text-sm text-[#3A7D44]"> <LayoutDashboard className="h-4 w-4" />
Espace architecte </div>


        <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
          Bonjour {profile?.user?.full_name || 'Architecte'}
        </h1>

        <p className="mt-1 text-slate-500 dark:text-slate-400">
          Gérez votre profil et vos plans de maison.
        </p>
      </div>

      {isApproved && (
        <Link
          to="/dashboard/architecte/plans/nouveau"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#3A7D44] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2f6637]"
        >
          <Plus className="h-4 w-4" />
          Ajouter un plan
        </Link>
      )}
    </div>

    {/* Statut du profil */}
    <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#111827]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EBF5ED] text-[#3A7D44] dark:bg-[#16351d]">
            <UserRound className="h-6 w-6" />
          </div>

          <div>
            <h2 className="font-bold text-slate-900 dark:text-white">
              Profil architecte
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {profile
                ? 'Votre profil architecte est enregistré.'
                : 'Vous devez créer votre profil architecte.'}
            </p>
          </div>
        </div>

        <StatusBadge profile={profile} />
      </div>

      {!profile && (
        <div className="mt-5">
          <Link
           to="/dashboard/architecte/profil"
            className="inline-flex rounded-xl bg-[#3A7D44] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#2f6637]"
          >
            Créer mon profil
          </Link>
        </div>
      )}

      {profile && !isApproved && (
        <div className="mt-5 rounded-xl bg-amber-50 p-4 text-sm text-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
          Votre profil doit être validé par l'équipe Logezy avant de
          pouvoir publier des plans.
        </div>
      )}
    </section>

    {/* Statistiques */}
    <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        icon={<Home />}
        label="Total des plans"
        value={plans.length}
      />

      <StatCard
        icon={<CheckCircle2 />}
        label="Plans actifs"
        value={activePlans}
      />

      <StatCard
        icon={<Clock3 />}
        label="En attente"
        value={pendingPlans}
      />

      <StatCard
        icon={<XCircle />}
        label="Refusés"
        value={rejectedPlans}
      />
    </section>

    {/* Plans */}
    <section className="mt-8">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Mes plans
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Retrouvez ici tous les plans que vous avez soumis.
          </p>
        </div>
      </div>

      {plans.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-[#111827]">
          <Home className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-600" />

          <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">
            Aucun plan pour le moment
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
            {isApproved
              ? 'Commencez par ajouter votre premier plan de maison.'
              : 'Votre profil doit être validé avant de pouvoir publier un plan.'}
          </p>

          {isApproved && (
            <Link
              to="/dashboard/architecte/plans/nouveau"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#3A7D44] px-5 py-2.5 text-sm font-semibold text-white"
            >
              <Plus className="h-4 w-4" />
              Ajouter un plan
            </Link>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#111827]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50">
                <tr>
                  <th className="px-5 py-4 font-semibold text-slate-700 dark:text-slate-300">
                    Plan
                  </th>
                  <th className="px-5 py-4 font-semibold text-slate-700 dark:text-slate-300">
                    Prix
                  </th>
                  <th className="px-5 py-4 font-semibold text-slate-700 dark:text-slate-300">
                    Statut
                  </th>
                  <th className="px-5 py-4 font-semibold text-slate-700 dark:text-slate-300">
                    Vues
                  </th>
                </tr>
              </thead>

              <tbody>
                {plans.map((plan) => (
                  <tr
                    key={plan.id}
                    className="border-b border-slate-100 last:border-0 dark:border-slate-800"
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {plan.title}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {plan.bedrooms || 0} chambres ·{' '}
                        {plan.area ? `${plan.area} m²` : 'Surface N/D'}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                      {plan.price
                        ? `${Number(plan.price).toLocaleString('fr-FR')} FCFA`
                        : 'Sur demande'}
                    </td>

                    <td className="px-5 py-4">
                      <PlanStatus status={plan.status} />
                    </td>

                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                      {plan.views_count || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  </main>
</div>


);
}

function StatusBadge({ profile }) {
if (!profile) {
return ( <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
Profil non créé </span>
);
}

if (profile.is_approved) {
return ( <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700 dark:bg-green-950/30 dark:text-green-400"> <CheckCircle2 className="h-3.5 w-3.5" />
Profil approuvé </span>
);
}

return ( <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"> <Clock3 className="h-3.5 w-3.5" />
En attente de validation </span>
);
}

function PlanStatus({ status }) {
const config = {
active: {
label: 'Actif',
className:
'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400',
},
pending: {
label: 'En attente',
className:
'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400',
},
rejected: {
label: 'Refusé',
className:
'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400',
},
inactive: {
label: 'Inactif',
className:
'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
},
};

const item = config[status] || config.pending;

return (
<span
className={`rounded-full px-3 py-1.5 text-xs font-semibold ${item.className}`}
>
{item.label} </span>
);
}

function StatCard({ icon, label, value }) {
return ( <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#111827]"> <div className="flex items-center justify-between"> <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EBF5ED] text-[#3A7D44] dark:bg-[#16351d]">
{icon} </div>


    <span className="text-2xl font-bold text-slate-900 dark:text-white">
      {value}
    </span>
  </div>

  <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">
    {label}
  </p>
</div>


);
}
