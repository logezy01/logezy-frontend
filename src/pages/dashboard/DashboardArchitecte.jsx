import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  UserRound,
  Files,
  PlusCircle,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  FileText,
  ChevronRight,
} from "lucide-react";

import DashboardLayout from "../../components/common/DashboardLayout";

const menuItems = [
  {
    label: "Vue d'ensemble",
    path: "/dashboard/architecte",
    icon: LayoutDashboard,
  },
  {
    label: "Mon profil",
    path: "/dashboard/architecte/profil",
    icon: UserRound,
  },
  {
    label: "Mes plans",
    path: "/dashboard/architecte/plans",
    icon: Files,
  },
  {
    label: "Publier un plan",
    path: "/dashboard/architecte/plans/nouveau",
    icon: PlusCircle,
  },
];

const quickActions = [
  {
    title: "Compléter mon profil",
    description:
      "Présente ton expérience et tes spécialités aux clients.",
    icon: UserRound,
    path: "/dashboard/architecte/profil",
    label: "Gérer mon profil",
  },
  {
    title: "Gérer mes plans",
    description:
      "Consulte tes plans et suis leur statut de validation.",
    icon: Files,
    path: "/dashboard/architecte/plans",
    label: "Voir mes plans",
  },
  {
    title: "Publier un nouveau plan",
    description:
      "Présente un nouveau projet architectural sur Logezy.",
    icon: PlusCircle,
    path: "/dashboard/architecte/plans/nouveau",
    label: "Créer un plan",
  },
];

function QuickAction({ action }) {
  const Icon = action.icon;

  return (
    <Link
      to={action.path}
      className="group rounded-2xl border border-gray-200 bg-white/70 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-green-600/30 hover:shadow-lg dark:border-white/10 dark:bg-white/[0.04] dark:hover:bg-white/[0.07]"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-700 transition-transform group-hover:scale-105 dark:bg-green-500/15 dark:text-green-400">
          <Icon size={23} />
        </div>

        <ArrowUpRight
          size={19}
          className="text-gray-400 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-green-600"
        />
      </div>

      <h3 className="mt-5 text-lg font-bold text-gray-900 dark:text-white">
        {action.title}
      </h3>

      <p className="mt-2 min-h-12 text-sm leading-6 text-gray-500 dark:text-gray-400">
        {action.description}
      </p>

      <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-green-700 dark:text-green-400">
        {action.label}
        <ChevronRight size={16} />
      </div>
    </Link>
  );
}

export default function DashboardArchitect() {
  return (
    <DashboardLayout
      title="Espace architecte"
      menuItems={menuItems}
    >
      <div className="space-y-8 p-4 sm:p-6 lg:p-8">
        {/* En-tête */}
        <section>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-medium text-green-700 dark:text-green-400">
                LOGEZY PLANS
              </p>

              <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
                Tableau de bord architecte
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 dark:text-gray-400">
                Bienvenue dans ton espace professionnel.
                Gère ton profil, publie tes réalisations et
                suis les validations de tes plans.
              </p>
            </div>

            <Link
              to="/dashboard/architecte/plans/nouveau"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-800"
            >
              <PlusCircle size={18} />
              Publier un plan
            </Link>
          </div>
        </section>

        {/* Indicateurs */}
        <section>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 bg-white/70 p-5 dark:border-white/10 dark:bg-white/[0.04]">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Mes plans
                </span>

                <Files
                  size={21}
                  className="text-green-700 dark:text-green-400"
                />
              </div>

              <p className="mt-4 text-sm font-medium text-gray-900 dark:text-white">
                Consulte tous tes projets
              </p>

              <Link
                to="/dashboard/architecte/plans"
                className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-green-700 hover:underline dark:text-green-400"
              >
                Accéder à mes plans
                <ChevronRight size={16} />
              </Link>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white/70 p-5 dark:border-white/10 dark:bg-white/[0.04]">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  En attente
                </span>

                <Clock
                  size={21}
                  className="text-amber-600"
                />
              </div>

              <p className="mt-4 text-sm font-medium text-gray-900 dark:text-white">
                Suis les plans en cours de validation
              </p>

              <Link
                to="/dashboard/architecte/plans"
                className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-green-700 hover:underline dark:text-green-400"
              >
                Voir les statuts
                <ChevronRight size={16} />
              </Link>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white/70 p-5 dark:border-white/10 dark:bg-white/[0.04]">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Profil professionnel
                </span>

                <CheckCircle2
                  size={21}
                  className="text-green-700 dark:text-green-400"
                />
              </div>

              <p className="mt-4 text-sm font-medium text-gray-900 dark:text-white">
                Mets en valeur ton expertise
              </p>

              <Link
                to="/dashboard/architecte/profil"
                className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-green-700 hover:underline dark:text-green-400"
              >
                Gérer mon profil
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* Actions rapides */}
        <section>
          <div className="mb-5">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Actions rapides
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Accède directement aux principales fonctionnalités.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {quickActions.map((action) => (
              <QuickAction
                key={action.path}
                action={action}
              />
            ))}
          </div>
        </section>

        {/* Information */}
        <section className="overflow-hidden rounded-2xl border border-green-700/15 bg-green-50/70 p-5 dark:border-green-500/15 dark:bg-green-500/[0.06] sm:p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400">
              <FileText size={22} />
            </div>

            <div>
              <h2 className="font-bold text-gray-900 dark:text-white">
                Comment fonctionne Logezy Plans ?
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
                Complète ton profil professionnel, ajoute
                tes plans architecturaux, puis suis leur
                statut. Les plans doivent être approuvés
                par l’administration avant leur publication
                dans le catalogue public.
              </p>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}