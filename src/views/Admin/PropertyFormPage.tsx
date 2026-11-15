import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  createProperty,
  getImageUrl,
  getProperty,
  updateProperty,
  uploadImage,
  type PropertyInput,
} from "../../lib/api";

const initialForm: PropertyInput = {
  image: "",
  title: "",
  description: "",
  price: "",
  bathrooms: "",
  garage: "",
  bedrooms: "",
};

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];

export default function PropertyFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [form, setForm] = useState<PropertyInput>(initialForm);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const loadProperty = async () => {
      try {
        setLoading(true);
        setError("");

        const property = await getProperty(Number(id));
        setForm({
          image: property.image,
          title: property.title,
          description: property.description,
          price: property.price,
          bathrooms: property.bathrooms,
          garage: property.garage,
          bedrooms: property.bedrooms,
        });
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "No fue posible cargar la propiedad."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProperty();
  }, [id]);

  // Genera una vista previa local y libera la URL al cambiar o desmontar.
  useEffect(() => {
    if (selectedImage) {
      const objectUrl = URL.createObjectURL(selectedImage);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }

    setPreviewUrl(getImageUrl(form.image));
    return undefined;
  }, [selectedImage, form.image]);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    const numericFields = ["price", "bathrooms", "garage", "bedrooms"];

    setForm((previous) => ({
      ...previous,
      [name]: numericFields.includes(name) ? Number(value) : value,
    }));
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setError("");

    if (!file) {
      setSelectedImage(null);
      return;
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setSelectedImage(null);
      event.target.value = "";
      setError("Formato no permitido. Selecciona una imagen JPG, PNG, WebP o AVIF.");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setSelectedImage(null);
      event.target.value = "";
      setError("La imagen no puede superar los 10 MB.");
      return;
    }

    setSelectedImage(file);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.image && !selectedImage) {
      setError("Debes seleccionar una imagen para la propiedad.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      // Si se seleccionó una imagen nueva, primero la subimos a PHP.
      const imagePath = selectedImage
        ? await uploadImage(selectedImage, "property")
        : form.image;

      // Después guardamos los datos y la ruta devuelta por PHP en MySQL.
      const propertyData: PropertyInput = { ...form, image: imagePath };

      if (isEditing && id) {
        await updateProperty(Number(id), propertyData);
      } else {
        await createProperty(propertyData);
      }

      navigate("/admin/properties");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No fue posible guardar la propiedad."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-sm text-zinc-500">
        Cargando propiedad...
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-4xl space-y-6">
      <div>
        <Link
          to="/admin/properties"
          className="text-sm text-zinc-500 hover:text-zinc-900"
        >
          ← Volver a propiedades
        </Link>

        <p className="mt-5 text-sm font-medium text-zinc-500">
          Administración
        </p>

        <h1 className="mt-1 text-3xl font-semibold text-zinc-900">
          {isEditing ? "Editar propiedad" : "Nueva propiedad"}
        </h1>

        <p className="mt-2 text-sm text-zinc-500">
          {isEditing
            ? "Actualiza la información de esta propiedad."
            : "Completa los datos para registrar una nueva propiedad."}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8"
      >
        <div className="space-y-5">
          <div>
            <label htmlFor="title" className="mb-2 block text-sm font-medium text-zinc-700">
              Título de la propiedad
            </label>
            <input
              id="title" name="title" type="text" value={form.title}
              onChange={handleChange} required maxLength={150}
              placeholder="Ej. Casa moderna en Escazú"
              className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-zinc-500"
            />
          </div>

          <div>
            <label htmlFor="description" className="mb-2 block text-sm font-medium text-zinc-700">
              Descripción
            </label>
            <textarea
              id="description" name="description" value={form.description}
              onChange={handleChange} required rows={5}
              placeholder="Describe las características de la propiedad..."
              className="w-full resize-y rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-zinc-500"
            />
          </div>

          <div>
            <label htmlFor="image" className="mb-2 block text-sm font-medium text-zinc-700">
              Imagen de la propiedad
            </label>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif,.avif"
              onChange={handleImageChange}
              className="block w-full cursor-pointer rounded-xl border border-zinc-200 p-3 text-sm text-zinc-600 file:mr-4 file:rounded-lg file:border-0 file:bg-zinc-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-zinc-700 hover:file:bg-zinc-200"
            />
            <p className="mt-2 text-xs text-zinc-400">
              Formatos permitidos: JPG, PNG, WebP y AVIF. Tamaño máximo: 10 MB.
              {isEditing && " Si no seleccionas otra imagen, se conservará la actual."}
            </p>
          </div>

          {previewUrl && (
            <div>
              <p className="mb-2 text-sm font-medium text-zinc-700">Vista previa</p>
              <img
                src={previewUrl}
                alt="Vista previa de la propiedad"
                className="h-52 w-full rounded-xl border border-zinc-200 object-cover"
                onError={() => setPreviewUrl("")}
              />
            </div>
          )}

          <div>
            <label htmlFor="price" className="mb-2 block text-sm font-medium text-zinc-700">
              Precio en dólares
            </label>
            <input
              id="price" name="price" type="number" min="0" step="0.01"
              value={form.price} onChange={handleChange} required
              className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-zinc-500"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <label htmlFor="bedrooms" className="mb-2 block text-sm font-medium text-zinc-700">Habitaciones</label>
              <input
                id="bedrooms" name="bedrooms" type="number" min="0"
                value={form.bedrooms} onChange={handleChange} required
                className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-zinc-500"
              />
            </div>
            <div>
              <label htmlFor="bathrooms" className="mb-2 block text-sm font-medium text-zinc-700">Baños</label>
              <input
                id="bathrooms" name="bathrooms" type="number" min="0"
                value={form.bathrooms} onChange={handleChange} required
                className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-zinc-500"
              />
            </div>
            <div>
              <label htmlFor="garage" className="mb-2 block text-sm font-medium text-zinc-700">Garajes</label>
              <input
                id="garage" name="garage" type="number" min="0"
                value={form.garage} onChange={handleChange} required
                className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-zinc-500"
              />
            </div>
          </div>
        </div>

        {error && (
          <p className="rounded-xl bg-red-50 p-4 text-sm text-red-600">{error}</p>
        )}

        <div className="flex flex-col-reverse justify-end gap-3 border-t border-zinc-100 pt-6 sm:flex-row">
          <Link
            to="/admin/properties"
            className="rounded-xl border border-zinc-200 px-5 py-3 text-center text-sm font-medium text-zinc-700 hover:bg-zinc-100"
          >
            Cancelar
          </Link>
          <button
            type="submit" disabled={saving}
            className="rounded-xl bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? selectedImage ? "Subiendo imagen y guardando..." : "Guardando..."
              : isEditing ? "Guardar cambios" : "Registrar propiedad"}
          </button>
        </div>
      </form>
    </section>
  );
}
