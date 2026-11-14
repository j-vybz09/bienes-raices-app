
import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import {
  getBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  getImageUrl,
  uploadImage,
  type BlogInput,
} from "../../lib/api";
import type { BlogPropiedad } from "../../types";

const initialForm: BlogInput = {
  image: "",
  title: "",
  date: new Date().toISOString().slice(0, 10),
  author: "Admin",
  description: "",
  content: ""
};

export default function BlogAdminPage() {
  const [blogs, setBlogs] = useState<BlogPropiedad[]>([]);
  const [form, setForm] = useState<BlogInput>(initialForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const loadBlogs = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getBlogs();
      setBlogs(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No fue posible cargar las publicaciones."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  // Genera una vista previa temporal y libera la URL al cambiar de archivo.
  useEffect(() => {
    if (selectedImage) {
      const objectUrl = URL.createObjectURL(selectedImage);
      setPreviewUrl(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    }

    setPreviewUrl(form.image ? getImageUrl(form.image) : "");
    return undefined;
  }, [selectedImage, form.image]);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setError("");

    if (!file) {
      setSelectedImage(null);
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSize = 10 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      setSelectedImage(null);
      event.target.value = "";
      setError("Formato no permitido. Selecciona una imagen JPG, PNG o WebP.");
      return;
    }

    if (file.size > maxSize) {
      setSelectedImage(null);
      event.target.value = "";
      setError("La imagen no puede superar los 10 MB.");
      return;
    }

    setSelectedImage(file);
  };

  const resetForm = () => {
    setForm(initialForm);
    setSelectedImage(null);
    setEditingId(null);
    setShowForm(false);
    setError("");
  };

  const handleEdit = (blog: BlogPropiedad) => {
    setForm({
      image: blog.image,
      title: blog.title,
      date: blog.date,
      author: blog.author,
      description: blog.description,
      content: blog.content
    });

    setSelectedImage(null);
    setEditingId(blog.id);
    setShowForm(true);
    setError("");
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!form.image && !selectedImage) {
      setError("Debes seleccionar una imagen para la publicación.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      // La imagen se almacena en la carpeta exclusiva del blog.
      const imagePath = selectedImage
        ? await uploadImage(selectedImage, "blog")
        : form.image;

      const blogData: BlogInput = {
        ...form,
        image: imagePath,
      };

      if (editingId !== null) {
        await updateBlog(editingId, blogData);
      } else {
        await createBlog(blogData);
      }

      resetForm();
      await loadBlogs();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No fue posible guardar la publicación."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "¿Estás seguro de que deseas eliminar esta publicación?"
    );

    if (!confirmed) return;

    try {
      await deleteBlog(id);

      setBlogs((previous) =>
        previous.filter((blog) => blog.id !== id)
      );
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "No fue posible eliminar la publicación."
      );
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-zinc-500">
            Administración
          </p>

          <h1 className="mt-1 text-3xl font-semibold text-zinc-900">
            Publicaciones del blog
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            Crea, edita y administra los artículos de tu inmobiliaria.
          </p>
        </div>

        <button
          onClick={() => {
            if (showForm) {
              resetForm();
            } else {
              setForm(initialForm);
              setEditingId(null);
              setError("");
              setShowForm(true);
            }
          }}
          className="rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-700"
        >
          {showForm ? "Cancelar" : "+ Nueva publicación"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8"
        >
          <div>
            <h2 className="text-xl font-semibold text-zinc-900">
              {editingId !== null
                ? "Editar publicación"
                : "Crear publicación"}
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Completa los datos del artículo.
            </p>
          </div>

          <div>
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-medium text-zinc-700"
            >
              Título
            </label>

            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              required
              maxLength={150}
              placeholder="Título del artículo"
              className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-zinc-500"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="author"
                className="mb-2 block text-sm font-medium text-zinc-700"
              >
                Autor
              </label>

              <input
                id="author"
                name="author"
                type="text"
                value={form.author}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-zinc-500"
              />
            </div>

            <div>
              <label
                htmlFor="date"
                className="mb-2 block text-sm font-medium text-zinc-700"
              >
                Fecha
              </label>

              <input
                id="date"
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-zinc-500"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="image"
              className="mb-2 block text-sm font-medium text-zinc-700"
            >
              Imagen de la publicación
            </label>

            <input
              id="image"
              name="image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              className="block w-full cursor-pointer rounded-xl border border-zinc-200 p-3 text-sm text-zinc-600 file:mr-4 file:rounded-lg file:border-0 file:bg-zinc-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-zinc-700 hover:file:bg-zinc-200"
            />

            <p className="mt-2 text-xs text-zinc-400">
              Formatos permitidos: JPG, PNG y WebP. Tamaño máximo: 10 MB.
              {editingId !== null && " Si no seleccionas otra imagen, se conservará la actual."}
            </p>

            {previewUrl && (
              <div className="mt-4">
                <p className="mb-2 text-sm font-medium text-zinc-700">
                  Vista previa
                </p>
                <img
                  src={previewUrl}
                  alt="Vista previa de la publicación"
                  className="h-52 w-full rounded-xl border border-zinc-200 object-cover"
                />
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium text-zinc-700"
            >
              Descripción
            </label>

            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={5}
              placeholder="Escribe el contenido o resumen del artículo..."
              className="w-full resize-y rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-zinc-500"
            />
          </div>

          <div>
            <label
              htmlFor="content"
              className="mb-2 block text-sm font-medium text-zinc-700"
            >
              Contenido del artículo
            </label>

            <textarea
              id="content"
              name="content"
              value={form.content}
              onChange={handleChange}
              required
              rows={10}
              placeholder="Escribe aquí el contenido completo de la publicación..."
              className="w-full resize-y rounded-xl border border-zinc-200 px-4 py-3 text-sm leading-7 outline-none focus:border-zinc-500"
            />
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 p-4 text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="flex flex-col-reverse justify-end gap-3 border-t border-zinc-100 pt-5 sm:flex-row">
            <button
              type="button"
              onClick={resetForm}
              className="rounded-xl border border-zinc-200 px-5 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-zinc-900 px-6 py-3 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
            >
              {saving
                ? selectedImage ? "Subiendo imagen y guardando..." : "Guardando..."
                : editingId !== null
                  ? "Guardar cambios"
                  : "Crear publicación"}
            </button>
          </div>
        </form>
      )}

      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
        <div className="border-b border-zinc-100 px-6 py-5">
          <h2 className="font-semibold text-zinc-900">
            Artículos registrados
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            {blogs.length} publicaciones en total
          </p>
        </div>

        {loading ? (
          <p className="p-10 text-center text-sm text-zinc-500">
            Cargando publicaciones...
          </p>
        ) : error && blogs.length === 0 ? (
          <div className="p-10 text-center text-sm text-red-600">
            {error}
          </div>
        ) : blogs.length === 0 ? (
          <p className="p-10 text-center text-sm text-zinc-500">
            Todavía no hay publicaciones registradas.
          </p>
        ) : (
          <div className="divide-y divide-zinc-100">
            {blogs.map((blog) => (
              <article
                key={blog.id}
                className="flex flex-col gap-5 p-6 sm:flex-row"
              >
                <img
                  src={getImageUrl(blog.image)}
                  alt={blog.title}
                  className="h-40 w-full rounded-xl object-cover sm:w-48"
                />

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-zinc-400">
                    {blog.date} · {blog.author}
                  </p>

                  <h3 className="mt-2 text-lg font-semibold text-zinc-900">
                    {blog.title}
                  </h3>

                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-zinc-500">
                    {blog.description}
                  </p>

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => handleEdit(blog)}
                      className="rounded-lg border border-zinc-200 px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-100"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => handleDelete(blog.id)}
                      className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
