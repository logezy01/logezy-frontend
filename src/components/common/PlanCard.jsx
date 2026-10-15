import { Link } from 'react-router-dom';
import { BedDouble, Bath, Ruler, Layers3, FileImage } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function formatPrice(price) {
  if (price === null || price === undefined || price === '') return 'Prix sur demande';
  return `${new Intl.NumberFormat('fr-FR').format(Number(price))} FCFA`;
}

export function getCoverImage(plan) {
  const images = plan?.plan_images || [];
  const cover = images.find((img) => img.is_cover) || images[0];
  if (!cover?.image_url) return null;
  if (cover.image_url.startsWith('http')) return cover.image_url;
  return `${API_URL.replace('/api', '')}${cover.image_url}`;
}

export function Tag({ children }) {
  return (
    <span className="rounded-full bg-[#3A7D44]/10 px-2.5 py-1 text-xs font-semibold text-[#3A7D44]">
      {children}
    </span>
  );
}

export function InfoChip({ icon, value }) {
  if (!value) return null;
  return (
    <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
      <span className="h-3.5 w-3.5 [&>svg]:h-3.5 [&>svg]:w-3.5">{icon}</span>
      {value}
    </span>
  );
}

export default function PlanCard({ plan }) {
  const image = getCoverImage(plan);
  return (
    <Link
      to={`/plans/${plan.id}`}
      className="group flex flex-col overflow-hidden rounded-[26px] border border-white/60 bg-white/65 shadow-glass backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-slate-900/60"
    >
      <div className="aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800">
        {image ? (
          <img
            src={image}
            alt={plan.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-300">
            <FileImage size={32} />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        {plan.style && <Tag>{plan.style}</Tag>}
        <h3 className="mt-2 line-clamp-1 font-display text-sm font-semibold text-slate-900 dark:text-white">
          {plan.title}
        </h3>

        <div className="mt-2 flex flex-wrap items-center gap-3">
          <InfoChip icon={<BedDouble />} value={plan.bedrooms ? `${plan.bedrooms} ch.` : null} />
          <InfoChip icon={<Bath />} value={plan.bathrooms ? `${plan.bathrooms} sdb.` : null} />
          <InfoChip icon={<Ruler />} value={plan.area ? `${plan.area}m²` : null} />
          <InfoChip icon={<Layers3 />} value={plan.floors ? `R+${plan.floors}` : null} />
        </div>

        <p className="mt-auto pt-3 text-sm font-bold text-[#3A7D44]">
          {formatPrice(plan.price)}
        </p>
      </div>
    </Link>
  );
}