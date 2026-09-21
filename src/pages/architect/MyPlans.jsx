import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  FileText,
  Eye,
  Pencil,
  Trash2,
  RefreshCw,
  Loader2,
  House,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../lib/axios";

const STATUS = {
  pending: {
    label: "En attente",
    classes:
      "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
  },
 approved: {
    label: "Publié",
    classes:
      "bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-300",
  },
  rejected: {
    label: "Refusé",
    classes:
      "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-300",
  },
  inactive: {
    label: "Inactif",
    classes:
      "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300",
  },
};

function formatPrice(price) {
  if (price === null || price === undefined || price === "") {
    return "Prix non défini";
  }

  return `${Number(price).toLocaleString("fr-FR")} FCFA`;
}

function formatDate(date) {
  if (!date) return "Date inconnue";

  return new Date(date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function MyPlans() {
  const navigate = useNavigate();

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchPlans = useCallback(async () => {
    setLoading(true);

    try {
      const response = await api.get("/plans/my");
      setPlans(response.data?.plans || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Impossible de charger tes plans."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const handleDelete = async (plan) => {
    const confirmed = window.confirm(
      `Supprimer définitivement le plan « ${plan.title} » ?`
    );

    if (!confirmed) return;

    setDeletingId(plan.id);

    try {
      const response = await api.delete(`/plans/${plan.id}`);

      setPlans((current) =>
        current.filter((item) => item.id !== plan.id)
      );

      toast.success(
        response.data?.message || "Plan supprimé."
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Impossible de supprimer ce plan."
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2
          className="animate-spin text-green-700"
          size={32}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-gray-950 sm:px-6">
      <div className="mx-auto max-w-6xl">

        {/* En-tête */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium text-green-700 dark:text-green-400">
              Espace architecte
            </p>

            <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
              Mes plans
            </h1>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Gère tes plans architecturaux et suis leur validation.
            </p>
          </div>

          <Link
            to="/dashboard/architecte/plans/nouveau"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3 font-semibold text-white transition hover:bg-green-800"
          >
            <Plus size={19} />
            Nouveau plan
          </Link>
        </div>

        {/* Statistiques */}
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.04]">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total des plans
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
              {plans.length}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.04]">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              En attente
            </p>

            <p className="mt-2 text-3xl font-bold text-amber-600">
              {plans.filter((plan) => plan.status === "pending").length}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.04]">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Publiés
            </p>

            <p className="mt-2 text-3xl font-bold text-green-700 dark:text-green-400">
              {plans.filter((plan) => plan.status === "approved").length}
            </p>
          </div>
        </div>

        {/* Actualisation */}
        <div className="mb-5 flex justify-end">
          <button
            type="button"
            onClick={fetchPlans}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-100 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:hover:bg-white/10"
          >
            <RefreshCw size={16} />
            Actualiser
          </button>
        </div>

        {/* Liste des plans */}
        {plans.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center dark:border-white/15 dark:bg-white/[0.03]">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400">
              <House size={30} />
            </div>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Aucun plan pour le moment
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">
              Publie ton premier plan pour commencer à présenter
              tes réalisations sur Logezy.
            </p>

            <Link
              to="/dashboard/architecte/plans/nouveau"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-green-700 px-5 py-3 font-semibold text-white hover:bg-green-800"
            >
              <Plus size={18} />
              Créer un plan
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {plans.map((plan) => {
              const status =
                STATUS[plan.status] || STATUS.pending;

              const cover =
                plan.plan_images?.find(
                  (image) => image.is_cover
                ) || plan.plan_images?.[0];

              return (
                <article
                  key={plan.id}
                  className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.04]"
                >
                  {/* Image de couverture */}
                  <div className="relative flex h-48 items-center justify-center bg-gray-100 dark:bg-white/5">
                    {cover?.image_url ? (
                      <img
                        src={cover.image_url}
                        alt={plan.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <FileText
                        size={48}
                        className="text-gray-400"
                      />
                    )}

                    <span
                      className={`absolute right-3 top-3 rounded-full px-3 py-1.5 text-xs font-semibold ${status.classes}`}
                    >
                      {status.label}
                    </span>
                  </div>

                  {/* Informations */}
                  <div className="p-5">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                      {plan.title}
                    </h2>

                    <p className="mt-2 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                      {plan.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-600 dark:text-gray-300">
                      {plan.bedrooms != null && (
                        <span className="rounded-lg bg-gray-100 px-3 py-1.5 dark:bg-white/10">
                          {plan.bedrooms} chambre(s)
                        </span>
                      )}

                      {plan.area != null && (
                        <span className="rounded-lg bg-gray-100 px-3 py-1.5 dark:bg-white/10">
                          {plan.area} m²
                        </span>
                      )}

                      {plan.floors != null && (
                        <span className="rounded-lg bg-gray-100 px-3 py-1.5 dark:bg-white/10">
                          {plan.floors} niveau(x)
                        </span>
                      )}
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <span className="font-bold text-green-700 dark:text-green-400">
                        {formatPrice(plan.price)}
                      </span>

                      <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <Eye size={14} />
                        {plan.views_count || 0} vue(s)
                      </span>
                    </div>

                    <p className="mt-2 text-xs text-gray-400">
                      Créé le {formatDate(plan.created_at)}
                    </p>

                    {/* Actions */}
                    <div className="mt-5 flex flex-wrap gap-2 border-t border-gray-100 pt-4 dark:border-white/10">
                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/plans/${plan.id}`)
                        }
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-white/10 dark:text-gray-200 dark:hover:bg-white/10"
                      >
                        <Eye size={16} />
                        Voir
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/dashboard/architecte/plans/${plan.id}/modifier`
                          )
                        }
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-white/10 dark:text-gray-200 dark:hover:bg-white/10"
                      >
                        <Pencil size={16} />
                        Modifier
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(plan)}
                        disabled={deletingId === plan.id}
                        aria-label={`Supprimer ${plan.title}`}
                        className="inline-flex items-center justify-center rounded-xl border border-red-200 px-3 py-2.5 text-red-600 hover:bg-red-50 disabled:opacity-50 dark:border-red-500/20 dark:hover:bg-red-500/10"
                      >
                        {deletingId === plan.id ? (
                          <Loader2
                            size={16}
                            className="animate-spin"
                          />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}