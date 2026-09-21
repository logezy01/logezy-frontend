import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
Building2,
BedDouble,
Bath,
Ruler,
Layers3,
Search,
SlidersHorizontal,
MapPin,
X,
ChevronLeft,
ChevronRight,
Loader2,
FileImage,
} from "lucide-react";
import api from "../lib/axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const STYLES = [
"Moderne",
"Contemporain",
"Traditionnel",
"Minimaliste",
"Africain",
"Luxe",
];

function formatPrice(price) {
if (price === null || price === undefined || price === "") {
return "Prix sur demande";
}

return `${new Intl.NumberFormat("fr-FR").format(Number(price))} FCFA`;
}

function getCoverImage(plan) {
const images = [...(plan?.plan_images || [])].sort(
(a, b) => (a.order_index || 0) - (b.order_index || 0)
);

const cover = images.find((image) => image.is_cover) || images[0];

if (!cover?.image_url) return null;

if (
cover.image_url.startsWith("http://") ||
cover.image_url.startsWith("https://")
) {
return cover.image_url;
}

return `${API_URL.replace("/api", "")}${cover.image_url}`;
}

function PlanCard({ plan }) {
const image = getCoverImage(plan);

return ( <article className="group overflow-hidden rounded-[26px] border border-white/60 bg-white/65 shadow-card backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-slate-900/60"> <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800">
{image ? ( <img
         src={image}
         alt={plan.title}
         className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
       />
) : ( <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900"> <FileImage className="h-14 w-14 text-slate-400" /> </div>
)}

```
    <div className="absolute left-4 top-4 rounded-full border border-white/70 bg-white/75 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/70 dark:text-white">
      Plan architectural
    </div>
  </div>

  <div className="p-5">
    <div className="mb-2 flex items-start justify-between gap-3">
      <h2 className="line-clamp-2 font-display text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
        {plan.title}
      </h2>

      {plan.price !== null && plan.price !== undefined && (
        <span className="shrink-0 text-sm font-bold text-[#3A7D44]">
          {formatPrice(plan.price)}
        </span>
      )}
    </div>

    {plan.description && (
      <p className="mb-4 line-clamp-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
        {plan.description}
      </p>
    )}

    <div className="mb-4 grid grid-cols-2 gap-2">
      <InfoChip
        icon={<BedDouble size={15} />}
        label={`${plan.bedrooms || 0} chambre${
          Number(plan.bedrooms) > 1 ? "s" : ""
        }`}
      />

      <InfoChip
        icon={<Bath size={15} />}
        label={`${plan.bathrooms || 0} salle${
          Number(plan.bathrooms) > 1 ? "s" : ""
        } de bain`}
      />

      <InfoChip
        icon={<Ruler size={15} />}
        label={plan.area ? `${plan.area} m²` : "Surface NC"}
      />

      <InfoChip
        icon={<Layers3 size={15} />}
        label={`${plan.floors || 0} niveau${
          Number(plan.floors) > 1 ? "x" : ""
        }`}
      />
    </div>

    <div className="mb-4 flex flex-wrap gap-2">
      {plan.style && <Tag>{plan.style}</Tag>}
      {plan.roof_type && <Tag>{plan.roof_type}</Tag>}
    </div>

    {plan.owner?.architect_profile?.city && (
      <div className="mb-4 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
        <MapPin size={16} className="text-[#3A7D44]" />
        <span>{plan.owner.architect_profile.city}</span>
      </div>
    )}

    <Link
      to={`/plans/${plan.id}`}
      className="flex w-full items-center justify-center rounded-[12px] border border-[#3A7D44]/20 bg-[#3A7D44]/10 px-4 py-3 text-sm font-semibold text-[#3A7D44] transition hover:bg-[#3A7D44]/15 active:scale-[0.98]"
    >
      Voir le plan
    </Link>
  </div>
</article>


);
}

function InfoChip({ icon, label }) {
return ( <div className="flex items-center gap-2 rounded-[12px] border border-slate-200/70 bg-white/50 px-3 py-2 text-xs text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"> <span className="text-[#3A7D44]">{icon}</span> <span className="truncate">{label}</span> </div>
);
}

function Tag({ children }) {
return ( <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-white/10 dark:text-slate-300">
{children} </span>
);
}

export default function Plans() {
const [plans, setPlans] = useState([]);
const [pagination, setPagination] = useState({
page: 1,
limit: 12,
total: 0,
totalPages: 0,
});

const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

const [filters, setFilters] = useState({
city: "",
style: "",
bedrooms: "",
min_price: "",
max_price: "",
});

const [draftFilters, setDraftFilters] = useState(filters);
const [showFilters, setShowFilters] = useState(false);

const hasFilters = useMemo(
() =>
Object.values(filters).some(
(value) => value !== null && value !== undefined && value !== ""
),
[filters]
);

const loadPlans = async (page = 1, activeFilters = filters) => {
try {
setLoading(true);
setError("");


  const params = {
    page,
    limit: 12,
  };

  Object.entries(activeFilters).forEach(([key, value]) => {
    if (value !== "") {
      params[key] = value;
    }
  });

  const response = await api.get("/plans", { params });

  setPlans(response.data?.plans || []);
  setPagination(
    response.data?.pagination || {
      page,
      limit: 12,
      total: 0,
      totalPages: 0,
    }
  );
} catch (err) {
  console.error("Erreur chargement des plans :", err);

  setPlans([]);
  setError(
    err.response?.data?.message ||
      "Impossible de charger les plans architecturaux."
  );
} finally {
  setLoading(false);
}


};

useEffect(() => {
loadPlans(1, filters);
}, [filters]);

const handleSubmit = (event) => {
event.preventDefault();
setFilters(draftFilters);
setShowFilters(false);
};

const handleReset = () => {
const emptyFilters = {
city: "",
style: "",
bedrooms: "",
min_price: "",
max_price: "",
};

```
setDraftFilters(emptyFilters);
setFilters(emptyFilters);
setShowFilters(false);
```

};

const changePage = (page) => {
if (
page < 1 ||
page > pagination.totalPages ||
page === pagination.page
) {
return;
}


loadPlans(page, filters);
window.scrollTo({ top: 0, behavior: "smooth" });


};

return ( <main className="min-h-screen bg-slate-50 pb-20 pt-24 dark:bg-slate-950"> <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
{/* En-tête */} <div className="mb-8"> <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#3A7D44]/15 bg-[#3A7D44]/10 px-3 py-1.5 text-xs font-semibold text-[#3A7D44]"> <Building2 size={15} />
Logezy Plans </div>


      <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
        Trouvez votre{" "}
        <span className="text-[#3A7D44]">plan de maison</span>
      </h1>

      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base dark:text-slate-400">
        Découvrez des plans architecturaux adaptés à vos besoins, votre
        terrain et votre budget.
      </p>
    </div>

    {/* Barre de recherche / filtres */}
    <div className="mb-8 rounded-[26px] border border-white/70 bg-white/65 p-3 shadow-glass backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/60">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 lg:flex-row"
      >
        <div className="relative flex-1">
          <MapPin
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3A7D44]"
          />

          <input
            type="text"
            value={draftFilters.city}
            onChange={(e) =>
              setDraftFilters((prev) => ({
                ...prev,
                city: e.target.value,
              }))
            }
            placeholder="Ville : Cotonou, Abomey-Calavi..."
            className="h-12 w-full rounded-[12px] border border-slate-200 bg-white/70 pl-11 pr-4 text-sm outline-none transition focus:border-[#3A7D44]/40 focus:ring-2 focus:ring-[#3A7D44]/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
          />
        </div>

        <button
          type="button"
          onClick={() => setShowFilters((value) => !value)}
          className="flex h-12 items-center justify-center gap-2 rounded-[12px] border border-slate-200 bg-white/70 px-5 text-sm font-semibold text-slate-700 transition hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
        >
          <SlidersHorizontal size={17} />
          Filtres
          {hasFilters && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#3A7D44] px-1 text-[10px] text-white">
              !
            </span>
          )}
        </button>

        <button
          type="submit"
          className="flex h-12 items-center justify-center gap-2 rounded-[12px] bg-[#3A7D44] px-6 text-sm font-semibold text-white shadow-md transition hover:bg-[#2D6235] active:scale-[0.98]"
        >
          <Search size={17} />
          Rechercher
        </button>
      </form>

      {showFilters && (
        <div className="mt-3 grid gap-3 border-t border-slate-200/70 pt-3 sm:grid-cols-2 lg:grid-cols-4 dark:border-white/10">
          <select
            value={draftFilters.style}
            onChange={(e) =>
              setDraftFilters((prev) => ({
                ...prev,
                style: e.target.value,
              }))
            }
            className="h-11 rounded-[12px] border border-slate-200 bg-white/70 px-3 text-sm outline-none focus:border-[#3A7D44]/40 dark:border-white/10 dark:bg-white/5 dark:text-white"
          >
            <option value="">Tous les styles</option>
            {STYLES.map((style) => (
              <option key={style} value={style}>
                {style}
              </option>
            ))}
          </select>

          <select
            value={draftFilters.bedrooms}
            onChange={(e) =>
              setDraftFilters((prev) => ({
                ...prev,
                bedrooms: e.target.value,
              }))
            }
            className="h-11 rounded-[12px] border border-slate-200 bg-white/70 px-3 text-sm outline-none focus:border-[#3A7D44]/40 dark:border-white/10 dark:bg-white/5 dark:text-white"
          >
            <option value="">Toutes les chambres</option>
            <option value="1">1 chambre</option>
            <option value="2">2 chambres</option>
            <option value="3">3 chambres</option>
            <option value="4">4 chambres</option>
            <option value="5">5 chambres</option>
            <option value="6">6+ chambres</option>
          </select>

          <input
            type="number"
            min="0"
            value={draftFilters.min_price}
            onChange={(e) =>
              setDraftFilters((prev) => ({
                ...prev,
                min_price: e.target.value,
              }))
            }
            placeholder="Prix minimum"
            className="h-11 rounded-[12px] border border-slate-200 bg-white/70 px-3 text-sm outline-none focus:border-[#3A7D44]/40 dark:border-white/10 dark:bg-white/5 dark:text-white"
          />

          <input
            type="number"
            min="0"
            value={draftFilters.max_price}
            onChange={(e) =>
              setDraftFilters((prev) => ({
                ...prev,
                max_price: e.target.value,
              }))
            }
            placeholder="Prix maximum"
            className="h-11 rounded-[12px] border border-slate-200 bg-white/70 px-3 text-sm outline-none focus:border-[#3A7D44]/40 dark:border-white/10 dark:bg-white/5 dark:text-white"
          />

          {hasFilters && (
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center justify-center gap-2 rounded-[12px] px-4 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 sm:col-span-2 lg:col-span-4 dark:hover:bg-white/5 dark:hover:text-white"
            >
              <X size={16} />
              Réinitialiser les filtres
            </button>
          )}
        </div>
      )}
    </div>

    {/* Résultats */}
    <div className="mb-5 flex items-center justify-between gap-4">
      <div>
        <h2 className="font-display text-xl font-semibold text-slate-900 dark:text-white">
          Plans disponibles
        </h2>

        {!loading && (
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {pagination.total} plan
            {pagination.total > 1 ? "s" : ""} architectural
            {pagination.total > 1 ? "x" : ""}
          </p>
        )}
      </div>

      {hasFilters && (
        <button
          type="button"
          onClick={handleReset}
          className="hidden items-center gap-1.5 rounded-full bg-slate-100 px-3 py-2 text-xs font-medium text-slate-600 sm:flex dark:bg-white/5 dark:text-slate-300"
        >
          <X size={14} />
          Effacer
        </button>
      )}
    </div>

    {/* Chargement */}
    {loading && (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-500 dark:text-slate-400">
          <Loader2
            size={30}
            className="animate-spin text-[#3A7D44]"
          />
          <span className="text-sm">Chargement des plans...</span>
        </div>
      </div>
    )}

    {/* Erreur */}
    {!loading && error && (
      <div className="rounded-[26px] border border-red-200 bg-red-50 p-8 text-center dark:border-red-900/30 dark:bg-red-950/20">
        <p className="font-semibold text-red-700 dark:text-red-400">
          Une erreur est survenue
        </p>

        <p className="mt-2 text-sm text-red-600/80 dark:text-red-400/80">
          {error}
        </p>

        <button
          type="button"
          onClick={() => loadPlans(pagination.page, filters)}
          className="mt-5 rounded-[12px] bg-[#3A7D44] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2D6235]"
        >
          Réessayer
        </button>
      </div>
    )}

    {/* Aucun résultat */}
    {!loading && !error && plans.length === 0 && (
      <div className="flex min-h-[360px] flex-col items-center justify-center rounded-[26px] border border-white/70 bg-white/60 px-6 text-center shadow-glass backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/50">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-[20px] bg-[#3A7D44]/10 text-[#3A7D44]">
          <Building2 size={30} />
        </div>

        <h3 className="font-display text-xl font-semibold text-slate-900 dark:text-white">
          Aucun plan disponible
        </h3>

        <p className="mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
          Aucun plan architectural actif ne correspond actuellement à
          votre recherche. Les nouveaux plans apparaîtront ici après leur
          validation.
        </p>

        {hasFilters && (
          <button
            type="button"
            onClick={handleReset}
            className="mt-5 flex items-center gap-2 rounded-[12px] bg-[#3A7D44] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2D6235]"
          >
            <X size={16} />
            Réinitialiser la recherche
          </button>
        )}
      </div>
    )}

    {/* Grille */}
    {!loading && !error && plans.length > 0 && (
      <>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-3">
            <button
              type="button"
              disabled={pagination.page <= 1}
              onClick={() => changePage(pagination.page - 1)}
              className="flex h-10 w-10 items-center justify-center rounded-[12px] border border-slate-200 bg-white/70 text-slate-600 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
              aria-label="Page précédente"
            >
              <ChevronLeft size={18} />
            </button>

            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Page {pagination.page} sur {pagination.totalPages}
            </span>

            <button
              type="button"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => changePage(pagination.page + 1)}
              className="flex h-10 w-10 items-center justify-center rounded-[12px] border border-slate-200 bg-white/70 text-slate-600 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
              aria-label="Page suivante"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </>
    )}
  </section>
</main>


);
}
