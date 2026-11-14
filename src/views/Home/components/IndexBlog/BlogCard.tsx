
import type { BlogPropiedad } from "../../../../types";
import { getImageUrl } from "@/lib/api";

type IndexBlogProp = {
  blog: BlogPropiedad;
};

export default function BlogCard({ blog }: IndexBlogProp) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

      <div className="grid h-full grid-cols-1 sm:min-h-70 sm:grid-cols-[180px_minmax(0,1fr)] lg:grid-cols-[220px_minmax(0,1fr)]">

        {/* Imagen */}
        <div className="h-48 overflow-hidden sm:h-full">
          <img
            src={getImageUrl(blog.image)}
            alt={blog.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Información */}
        <div className="flex min-w-0 flex-col p-5 sm:p-6">

          <h3 className="line-clamp-2 text-xl font-semibold leading-tight text-zinc-900 sm:text-2xl">
            {blog.title}
          </h3>

          {/* Línea decorativa */}
          <div className="mt-4 h-1 w-16 shrink-0 rounded-full bg-zinc-950" />

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

          {/* Descripción limitada */}
          <p className="mt-4 line-clamp-3 text-sm leading-6 text-zinc-500 sm:mt-5 sm:leading-7">
            {blog.description}
          </p>

          {/* Botón */}
          <button
            type="button"
            className="mt-auto self-start rounded-xl bg-zinc-950 px-5 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:bg-zinc-800 hover:shadow-lg active:scale-95"
          >
            Leer más
          </button>

        </div>
      </div>
    </article>
  );
}
