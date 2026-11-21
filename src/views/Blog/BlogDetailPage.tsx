import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getBlog, getImageUrl } from "@/lib/api";
import type { BlogPropiedad } from "@/types";

export default function BlogDetailPage() {
  const { id } = useParams();

  const [blog, setBlog] = useState<BlogPropiedad | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isValidId =
    Boolean(id) &&
    Number.isInteger(Number(id)) &&
    Number(id) > 0;

  useEffect(() => {
    if (!isValidId || !id) return;

    let active = true;

    async function loadBlog() {
      try {
        setLoading(true);
        setError("");

        const data = await getBlog(Number(id));

        if (active) {
          setBlog(data);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "No fue posible cargar el artículo."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadBlog();

    return () => {
      active = false;
    };
  }, [id, isValidId]);

  if (!isValidId) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-6">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-zinc-500">
            Blog
          </p>

          <h1 className="mt-3 text-4xl font-semibold text-zinc-900">
            Artículo no encontrado
          </h1>

          <p className="mt-4 text-zinc-500">
            El identificador del artículo no es válido.
          </p>

          <Link
            to="/blog"
            className="mt-8 inline-block rounded-xl bg-zinc-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
          >
            Volver al blog
          </Link>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-6">
        <p className="text-sm text-zinc-500">
          Cargando artículo...
        </p>
      </main>
    );
  }

  if (error || !blog) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-6">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-zinc-500">
            Blog
          </p>

          <h1 className="mt-3 text-4xl font-semibold text-zinc-900">
            Artículo no encontrado
          </h1>

          <p className="mt-4 text-zinc-500">
            {error || "El artículo que buscas no existe."}
          </p>

          <Link
            to="/blog"
            className="mt-8 inline-block rounded-xl bg-zinc-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
          >
            Volver al blog
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <section className="relative">
        <div className="h-105 w-full md:h-140">
          <img
            src={getImageUrl(blog.image)}
            alt={blog.title}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent" />

        <div className="absolute bottom-0 left-0 w-full">
          <div className="mx-auto max-w-5xl px-6 pb-12">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-zinc-300">
              Blog
            </p>

            <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight text-white md:text-6xl">
              {blog.title}
            </h1>
          </div>
        </div>
      </section>

      <article className="py-16">
        <div className="mx-auto max-w-5xl px-6">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-zinc-200 pb-8 text-sm text-zinc-500">
            <span>{blog.date}</span>
            <span className="h-1 w-1 rounded-full bg-zinc-300" />
            <span>Por {blog.author}</span>
          </div>

          <div className="mx-auto mt-12 max-w-3xl">
            <p className="text-xl font-medium leading-9 text-zinc-700">
              {blog.description}
            </p>

            <div className="mt-10 whitespace-pre-line text-base leading-8 text-zinc-600">
              {blog.content}
            </div>
          </div>

          <div className="mt-16 border-t border-zinc-200 pt-8">
            <Link
              to="/blog"
              className="inline-flex items-center rounded-xl border border-zinc-200 px-5 py-3 text-sm font-medium text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-50"
            >
              ← Volver al blog
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}
