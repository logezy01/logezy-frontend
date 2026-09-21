import { Link } from 'react-router-dom';
import {
BedDouble,
Bath,
Maximize,
Layers3,
ArrowRight,
} from 'lucide-react';

export default function PlanCard({ plan }) {
const coverImage =
plan?.plan_images?.find((image) => image.is_cover)?.image_url ||
plan?.plan_images?.[0]?.image_url ||
null;

const architect = plan?.owner?.architect_profile;
const ownerName = plan?.owner?.full_name || 'Architecte Logezy';

return ( <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-[#111827]">
{/* Image */}
<Link to={`/plans/${plan.id}`} className="block"> <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800">
{coverImage ? ( <img
           src={coverImage}
           alt={plan.title}
           className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
           loading="lazy"
         />
) : ( <div className="flex h-full items-center justify-center"> <Layers3 className="h-14 w-14 text-slate-300 dark:text-slate-600" /> </div>
)}


      {plan.style && (
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur dark:bg-slate-900/90 dark:text-slate-200">
          {plan.style}
        </span>
      )}
    </div>
  </Link>

  {/* Contenu */}
  <div className="p-5">
    <Link to={`/plans/${plan.id}`}>
      <h3 className="line-clamp-2 text-lg font-bold text-slate-900 transition-colors group-hover:text-[#3A7D44] dark:text-white">
        {plan.title}
      </h3>
    </Link>

    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
      Par {ownerName}
    </p>

    {architect?.city && (
      <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
        {architect.city}
      </p>
    )}

    {/* Caractéristiques */}
    <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-slate-600 dark:text-slate-300">
      <div className="flex items-center gap-2">
        <BedDouble className="h-4 w-4 text-[#3A7D44]" />
        <span>{plan.bedrooms || 0} chambres</span>
      </div>

      <div className="flex items-center gap-2">
        <Bath className="h-4 w-4 text-[#3A7D44]" />
        <span>{plan.bathrooms || 0} salles d'eau</span>
      </div>

      <div className="flex items-center gap-2">
        <Maximize className="h-4 w-4 text-[#3A7D44]" />
        <span>
          {plan.area ? `${plan.area} m²` : 'Surface N/D'}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Layers3 className="h-4 w-4 text-[#3A7D44]" />
        <span>{plan.floors || 0} niveau(x)</span>
      </div>
    </div>

    {/* Prix + bouton */}
    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
      <div>
        <p className="text-xs text-slate-400">Prix</p>
        <p className="text-lg font-bold text-[#3A7D44]">
          {plan.price
            ? `${Number(plan.price).toLocaleString('fr-FR')} FCFA`
            : 'Sur demande'}
        </p>
      </div>

      <Link
        to={`/plans/${plan.id}`}
        className="flex items-center gap-1 rounded-xl bg-[#3A7D44] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#2f6637]"
      >
        Voir
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  </div>
</article>


);
}
