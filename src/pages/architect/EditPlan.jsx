import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Loader2,
  FileText,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../lib/axios";

const initialForm = {
  title: "",
  description: "",
  style: "",
  bedrooms: "",
  bathrooms: "",
  living_rooms: "",
  area: "",
  floors: "",
  roof_type: "",
  price: "",
  plan_document_url: "",
};

const numericFields = [
  {
    name: "bedrooms",
    label: "Nombre de chambres",
    min: 0,
    step: 1,
  },
  {
    name: "bathrooms",
    label: "Nombre de salles de bain",
    min: 0,
    step: 1,
  },
  {
    name: "living_rooms",
    label: "Nombre de salons",
    min: 0,
    step: 1,
  },
  {
    name: "area",
    label: "Superficie (m²)",
    min: 1,
    step: "any",
  },
  {
    name: "floors",
    label: "Nombre de niveaux",
    min: 1,
    step: 1,
  },
  {
    name: "price",
    label: "Prix du plan (FCFA)",
    min: 0,
    step: "any",
  },
];

export default function EditPlan() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadPlan = async () => {
      setLoading(true);

      try {
        const response = await api.get("/plans/my");
        const plans = response.data?.plans || [];

        const plan = plans.find(
          (item) => String(item.id) === String(id)
        );

        if (!plan) {
          toast.error("Plan introuvable dans tes plans.");

          navigate("/dashboard/architecte/plans", {
            replace: true,
          });

          return;
        }

        if (cancelled) return;

        setForm({
          title: plan.title || "",
          description: plan.description || "",
          style: plan.style || "",
          bedrooms: plan.bedrooms ?? "",
          bathrooms: plan.bathrooms ?? "",
          living_rooms: plan.living_rooms ?? "",
          area: plan.area ?? "",
          floors: plan.floors ?? "",
          roof_type: plan.roof_type || "",
          price: plan.price ?? "",
          plan_document_url: plan.plan_document_url || "",
        });
      } catch (error) {
        if (cancelled) return;

        toast.error(
          error.response?.data?.message ||
            error.response?.data?.error ||
            "Impossible de charger ce plan."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadPlan();

    return () => {
      cancelled = true;
    };
  }, [id, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.title.trim() || !form.description.trim()) {
      toast.error(
        "Le titre et la description sont obligatoires."
      );
      return;
    }

    for (const field of numericFields) {
      const value = form[field.name];

      if (
        value !== "" &&
        !Number.isFinite(Number(value))
      ) {
        toast.error(`Valeur invalide : ${field.label}.`);
        return;
      }

      if (
        value !== "" &&
        Number(value) < field.min
      ) {
        toast.error(
          `${field.label} doit être supérieur ou égal à ${field.min}.`
        );
        return;
      }

      if (
        field.step === 1 &&
        value !== "" &&
        !Number.isInteger(Number(value))
      ) {
        toast.error(
          `${field.label} doit être un nombre entier.`
        );
        return;
      }
    }

    setSaving(true);

    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        style: form.style || null,

        bedrooms:
          form.bedrooms === ""
            ? null
            : Number(form.bedrooms),

        bathrooms:
          form.bathrooms === ""
            ? null
            : Number(form.bathrooms),

        living_rooms:
          form.living_rooms === ""
            ? null
            : Number(form.living_rooms),

        area:
          form.area === ""
            ? null
            : Number(form.area),

        floors:
          form.floors === ""
            ? null
            : Number(form.floors),

        roof_type: form.roof_type || null,

        price:
          form.price === ""
            ? null
            : Number(form.price),

        plan_document_url:
          form.plan_document_url.trim() || null,
      };

      const response = await api.put(
        `/plans/${id}`,
        payload
      );

      toast.success(
        response.data?.message ||
          "Plan modifié avec succès."
      );

      navigate("/dashboard/architecte/plans");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Impossible de modifier ce plan."
      );
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white/70 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-600/15 dark:border-white/10 dark:bg-white/5 dark:text-white";

  const labelClass =
    "mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200";

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2
          size={32}
          className="animate-spin text-green-700"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-gray-950 sm:px-6">
      <div className="mx-auto max-w-4xl">

        {/* Retour */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-gray-600 transition hover:bg-white dark:text-gray-300 dark:hover:bg-white/10"
        >
          <ArrowLeft size={18} />
          Retour
        </button>

        {/* En-tête */}
        <div className="mb-8">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400">
            <FileText size={24} />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
            Modifier le plan
          </h1>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Mets à jour les informations de ton projet architectural.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-3xl border border-gray-200/70 bg-white/80 p-5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04] sm:p-8"
        >
          {/* Informations générales */}
          <section>
            <h2 className="mb-5 text-lg font-semibold text-gray-900 dark:text-white">
              Informations générales
            </h2>

            <div className="space-y-5">
              <div>
                <label
                  className={labelClass}
                  htmlFor="title"
                >
                  Titre du plan *
                </label>

                <input
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className={inputClass}
                  maxLength={150}
                  required
                />
              </div>

              <div>
                <label
                  className={labelClass}
                  htmlFor="description"
                >
                  Description *
                </label>

                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className={`${inputClass} min-h-36 resize-y`}
                  maxLength={5000}
                  required
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    className={labelClass}
                    htmlFor="style"
                  >
                    Style architectural
                  </label>

                  <select
                    id="style"
                    name="style"
                    value={form.style}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="">Choisir un style</option>
                    <option value="moderne">Moderne</option>
                    <option value="contemporain">Contemporain</option>
                    <option value="traditionnel">Traditionnel</option>
                    <option value="minimaliste">Minimaliste</option>
                    <option value="africain">Africain</option>
                    <option value="bioclimatique">Bioclimatique</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>

                <div>
                  <label
                    className={labelClass}
                    htmlFor="roof_type"
                  >
                    Type de toiture
                  </label>

                  <select
                    id="roof_type"
                    name="roof_type"
                    value={form.roof_type}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="">Choisir un type</option>
                    <option value="dalle">Dalle</option>
                    <option value="toiture_tole">Tôle</option>
                    <option value="tuile">Tuile</option>
                    <option value="terrasse">Toit-terrasse</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          <div className="h-px bg-gray-200 dark:bg-white/10" />

          {/* Caractéristiques */}
          <section>
            <h2 className="mb-5 text-lg font-semibold text-gray-900 dark:text-white">
              Caractéristiques du bâtiment
            </h2>

            <div className="grid gap-5 sm:grid-cols-2">
              {numericFields.map((field) => (
                <div key={field.name}>
                  <label
                    className={labelClass}
                    htmlFor={field.name}
                  >
                    {field.label}
                  </label>

                  <input
                    id={field.name}
                    name={field.name}
                    type="number"
                    min={field.min}
                    step={field.step}
                    value={form[field.name]}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              ))}
            </div>
          </section>

          <div className="h-px bg-gray-200 dark:bg-white/10" />

          {/* Document */}
          <section>
            <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
              Document du plan
            </h2>

            <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">
              Tu peux modifier le lien vers ton document PDF.
            </p>

            <label
              className={labelClass}
              htmlFor="plan_document_url"
            >
              URL du document PDF
            </label>

            <input
              id="plan_document_url"
              name="plan_document_url"
              type="url"
              value={form.plan_document_url}
              onChange={handleChange}
              placeholder="https://..."
              className={inputClass}
            />
          </section>

          {/* Avertissement */}
          <div className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">
            Toute modification peut soumettre à nouveau le
            plan à la validation de l’administration.
          </div>

          {/* Bouton */}
          <button
            type="submit"
            disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-green-700 px-5 py-3.5 font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2
                  size={19}
                  className="animate-spin"
                />
                Enregistrement...
              </>
            ) : (
              <>
                <Save size={18} />
                Enregistrer les modifications
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}