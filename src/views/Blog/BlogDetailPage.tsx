import { Link, useParams } from "react-router-dom";
import { blogPropiedad } from "../../data/blogPropiedad";

export default function BlogDetailPage() {
  const { id } = useParams();

  const blog = blogPropiedad.find(
    (articulo) => articulo.id === Number(id),
  );

  if (!blog) {
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
            El artículo que estás buscando no existe.
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
      {/* Imagen principal */}
      <section className="relative">
        <div className="h-105 w-full md:h-140">
          <img
            src={blog.image}
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

      {/* Artículo */}
      <article className="py-16">
        <div className="mx-auto max-w-5xl px-6">
          {/* Información del artículo */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-zinc-200 pb-8 text-sm text-zinc-500">
            <span>{blog.date}</span>

            <span className="h-1 w-1 rounded-full bg-zinc-300" />

            <span>Por {blog.author}</span>
          </div>

          {/* Contenido */}
          <div className="mx-auto mt-12 max-w-3xl">
            <p className="text-xl font-medium leading-9 text-zinc-700">
              {blog.description}
            </p>

            <div className="mt-10 text-base leading-8 text-zinc-600">
              <p>{blog.content}</p>
            </div>
          </div>

          {/* Navegación */}
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