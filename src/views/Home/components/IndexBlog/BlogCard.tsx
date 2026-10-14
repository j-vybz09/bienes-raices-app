import type { BlogPropiedad } from "../../../../types";

type IndexBlogProp = {
  blog: BlogPropiedad
}

export default function BlogCard({blog} : IndexBlogProp) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        
        <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr]">

          {/* Imagen */}
          <div className="h-64 overflow-hidden sm:h-full">
            <img
              src={blog.image}
              alt={blog.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          {/* Información */}
          <div className="p-6">

            <h3 className="text-2xl font-semibold leading-tight text-zinc-900">
              {blog.title}
            </h3>

            {/* Línea decorativa */}
            <div className="mt-4 h-1 w-16 rounded-full bg-zinc-950" />

            <p className="mt-4 text-sm text-zinc-500">
              Publicado:{" "}
              <span className="font-medium text-zinc-700">
                {blog.date}
              </span>{" "}
              por{" "}
              <span className="font-medium text-zinc-700">
                {blog.author}
              </span>
            </p>

            <p className="mt-5 text-sm leading-7 text-zinc-500">
              {blog.description}
            </p>

            <button
              type="button"
              className="mt-5 rounded-xl bg-zinc-950 px-5 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:bg-zinc-800 hover:shadow-lg active:scale-95"
            >
              Leer más
            </button>

          </div>

        </div>

    </article>
  )
}
