import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
ArrowLeft,
BedDouble,
Bath,
Maximize,
Layers3,
Eye,
MapPin,
UserRound,
} from 'lucide-react';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function PlanDetail() {
const { id } = useParams();

const [plan, setPlan] = useState(null);
const [loading, setLoading] = useState(true);
const [selectedImage, setSelectedImage] = useState(null);

useEffect(() => {
const fetchPlan = async () => {
try {
setLoading(true);


    const response = await fetch(`${API_URL}/api/plans/${id}`);

    if (!response.ok) {
      throw new Error('Plan introuvable');
    }

    const data = await response.json();

    setPlan(data.plan);

    if (data.plan?.plan_images?.length) {
      setSelectedImage(
        data.plan.plan_images.find((image) => image.is_cover)?.image_url ||
          data.plan.plan_images[0].image_url
      );
    }
  } catch (error) {
    console.error(error);
    toast.error('Impossible de charger ce plan.');
  } finally {
    setLoading(false);
  }
};

fetchPlan();


}, [id]);

if (loading) {
return ( <div className="min-h-screen bg-slate-50 dark:bg-[#080B14]"> <div className="mx-auto max-w-7xl animate-pulse px-4 py-10 sm:px-6 lg:px-8"> <div className="h-5 w-32 rounded bg-slate-200 dark:bg-slate-800" />


      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <div className="aspect-[4/3] rounded-2xl bg-slate-200 dark:bg-slate-800" />

        <div className="space-y-5">
          <div className="h-10 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-6 w-1/2 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-32 rounded bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>
    </div>
  </div>
);


}

if (!plan) {
return ( <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-[#080B14]"> <div className="text-center"> <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
Plan introuvable </h1>


      <p className="mt-2 text-slate-500 dark:text-slate-400">
        Ce plan n'est plus disponible.
      </p>

      <Link
        to="/plans"
        className="mt-5 inline-flex rounded-xl bg-[#3A7D44] px-5 py-2.5 text-sm font-semibold text-white"
      >
        Retour aux plans
      </Link>
    </div>
  </div>
);


}

const images = plan.plan_images || [];
const architect = plan.owner?.architect_profile;

return ( <div className="min-h-screen bg-slate-50 dark:bg-[#080B14]"> <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"> <Link
       to="/plans"
       className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#3A7D44] dark:text-slate-300"
     > <ArrowLeft className="h-4 w-4" />
Retour aux plans </Link>


    <div className="mt-6 grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
      {/* Galerie */}
      <section>
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-[#111827]">
          <div className="aspect-[4/3] bg-slate-100 dark:bg-slate-800">
            {selectedImage ? (
              <img
                src={selectedImage}
                alt={plan.title}
                className="h-full w-full object-contain"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Layers3 className="h-16 w-16 text-slate-300" />
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto p-4">
              {images.map((image) => (
                <button
                  key={image.id}
                  type="button"
                  onClick={() => setSelectedImage(image.image_url)}
                  className={`h-20 w-24 flex-shrink-0 overflow-hidden rounded-xl border-2 ${
                    selectedImage === image.image_url
                      ? 'border-[#3A7D44]'
                      : 'border-transparent'
                  }`}
                >
                  <img
                    src={image.image_url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Informations */}
      <section>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#111827]">
          <div className="flex flex-wrap gap-2">
            {plan.style && (
              <span className="rounded-full bg-[#EBF5ED] px-3 py-1 text-xs font-semibold text-[#3A7D44] dark:bg-[#16351d]">
                {plan.style}
              </span>
            )}

            {architect?.city && (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                <MapPin className="h-3 w-3" />
                {architect.city}
              </span>
            )}
          </div>

          <h1 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
            {plan.title}
          </h1>

          <p className="mt-4 text-2xl font-bold text-[#3A7D44]">
            {plan.price
              ? `${Number(plan.price).toLocaleString('fr-FR')} FCFA`
              : 'Prix sur demande'}
          </p>

          {/* Caractéristiques */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Info
              icon={<BedDouble />}
              label="Chambres"
              value={plan.bedrooms || 0}
            />

            <Info
              icon={<Bath />}
              label="Salles d'eau"
              value={plan.bathrooms || 0}
            />

            <Info
              icon={<Maximize />}
              label="Surface"
              value={plan.area ? `${plan.area} m²` : 'N/D'}
            />

            <Info
              icon={<Layers3 />}
              label="Niveaux"
              value={plan.floors || 0}
            />
          </div>

          <div className="mt-6 border-t border-slate-100 pt-6 dark:border-slate-800">
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <Eye className="h-4 w-4" />
              {plan.views_count || 0} consultation
              {(plan.views_count || 0) > 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Architecte */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#111827]">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EBF5ED] text-[#3A7D44] dark:bg-[#16351d]">
              <UserRound className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs text-slate-400">Proposé par</p>
              <p className="font-semibold text-slate-900 dark:text-white">
                {plan.owner?.full_name || 'Architecte'}
              </p>
            </div>
          </div>

          {architect?.bio && (
            <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-400">
              {architect.bio}
            </p>
          )}

          {architect?.specialties && (
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              <span className="font-medium">Spécialités :</span>{' '}
              {architect.specialties}
            </p>
          )}
        </div>
      </section>
    </div>

    {/* Description */}
    {plan.description && (
      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#111827]">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Description du plan
        </h2>

        <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600 dark:text-slate-400">
          {plan.description}
        </p>
      </section>
    )}
  </main>
</div>


);
}

function Info({ icon, label, value }) {
return ( <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60"> <div className="flex items-center gap-2 text-[#3A7D44]"> <span className="h-4 w-4 [&>svg]:h-4 [&>svg]:w-4">
{icon} </span>


    <span className="text-xs text-slate-500 dark:text-slate-400">
      {label}
    </span>
  </div>

  <p className="mt-1 font-semibold text-slate-900 dark:text-white">
    {value}
  </p>
</div>


);
}
