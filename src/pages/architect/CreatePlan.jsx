 
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, Loader2, Send } from "lucide-react";
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

const fields = [
  {
    name: "bedrooms",
    label: "Nombre de chambres",
    type: "number",
    min: 0,
  },
  {
    name: "bathrooms",
    label: "Nombre de salles de bain",
    type: "number",
    min: 0,
  },
  {
    name: "living_rooms",
    label: "Nombre de salons",
    type: "number",
    min: 0,
  },
  {
    name: "area",
    label: "Superficie (m²)",
    type: "number",
    min: 1,
  },
  {
    name: "floors",
    label: "Nombre de niveaux",
    type: "number",
    min: 1,
  },
  {
    name: "price",
    label: "Prix du plan (FCFA)",
    type: "number",
    min: 0,
  },
];

export default function CreatePlan() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

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
      toast.error("Le titre et la description sont obligatoires.");
      return;
    }

    if (form.price !== "" && Number(form.price) < 0) {
      toast.error("Le prix ne peut pas être négatif.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        style: form.style || null,
        bedrooms: form.bedrooms || null,
        bathrooms: form.bathrooms || null,
        living_rooms: form.living_rooms || null,
        area: form.area || null,
        floors: form.floors || null,
        roof_type: form.roof_type || null,
        price: form.price || null,
        plan_document_url: form.plan_document_url.trim() || null,
      };

      const response = await api.post("/plans", payload);

      toast.success(
        response.data?.message ||
          "Plan envoyé pour validation."
      );

      setForm(initialForm);
      navigate("/dashboard/architecte/plans");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Impossible de publier le plan.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white/70 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-600/15 dark:border-white/10 dark:bg-white/5 dark:text-white";

  const labelClass =
    "mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200";

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-gray-950 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-gray-600 transition hover:bg-white dark:text-gray-300 dark:hover:bg-white/10"
        >
          <ArrowLeft size={18} />
          Retour
        </button>

        <div className="mb-8">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400">
            <FileText size={24} />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
            Publier un plan de maison
          </h1>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Présente ton projet architectural aux futurs propriétaires.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-3xl border border-gray-200/70 bg-white/80 p-5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04] sm:p-8"
        >
          <section>
            <h2 className="mb-5 text-lg font-semibold text-gray-900 dark:text-white">
              Informations générales
            </h2>

            <div className="space-y-5">
              <div>
                <label className={labelClass} htmlFor="title">
                  Titre du plan *
                </label>
                <input
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Ex. Villa moderne de 4 chambres"
                  className={inputClass}
                  maxLength={150}
                  required
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="description">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Décris les caractéristiques et les particularités du plan..."
                  className={`${inputClass} min-h-36 resize-y`}
                  maxLength={5000}
                  required
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="style">
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
                  <label className={labelClass} htmlFor="roof_type">
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

          <section>
            <h2 className="mb-5 text-lg font-semibold text-gray-900 dark:text-white">
              Caractéristiques du bâtiment
            </h2>

            <div className="grid gap-5 sm:grid-cols-2">
              {fields.map((field) => (
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
                    step={field.name === "area" || field.name === "price" ? "any" : "1"}
                    value={form[field.name]}
                    onChange={handleChange}
                    placeholder="0"
                    className={inputClass}
                  />
                </div>
              ))}
            </div>
          </section>

          <div className="h-px bg-gray-200 dark:bg-white/10" />

          <section>
            <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
              Document du plan
            </h2>

            <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">
              Ajoute le lien vers le document PDF hébergé. L’envoi direct
              de fichiers sera intégré dans une prochaine étape.
            </p>

            <label className={labelClass} htmlFor="plan_document_url">
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

          <div className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">
            Après l’envoi, ton plan sera soumis à validation par
            l’administration avant sa publication.
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-green-700 px-5 py-3.5 font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={19} className="animate-spin" />
                Envoi en cours...
              </>
            ) : (
              <>
                <Send size={18} />
                Soumettre le plan
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
 
