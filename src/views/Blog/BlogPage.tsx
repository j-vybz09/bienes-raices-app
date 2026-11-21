
import { useEffect, useState } from "react";
import { getBlogs } from "@/lib/api";
import BlogCard from "../../components/BlogCard/BlogCard";
import type { BlogPropiedad } from "@/types";

const ITEMS_PER_PAGE = 10;

export default function BlogPage() {
  const [blogs, setBlogs] = useState<BlogPropiedad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let active = true;

    async function loadBlogs() {
      try {
        setLoading(true);
        setError("");

        const data = await getBlogs();

        if (active) {
          setBlogs(data);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "No fue posible cargar las publicaciones."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadBlogs();

    return () => {
      active = false;
    };
  }, []);

  // Calculamos el total de páginas.
  const totalPages = Math.ceil(blogs.length / ITEMS_PER_PAGE);

  // Calculamos los índices de la página actual.
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  // Filtramos las publicaciones que se mostrarán.
  const currentBlogs = blogs.slice(startIndex, endIndex);

  // Cambiar de página.
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <section className="min-h-screen bg-white py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">

        {/* ENCABEZADO */}
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-zinc-500">
            Nuestro blog
          </p>

          <h1 className="mt-3 text-3xl font-semibold text-zinc-900 sm:text-4xl md:text-6xl">
            Noticias y consejos
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm text-zinc-500 sm:text-base">
            Descubre consejos, ideas y recomendaciones para encontrar,
            comprar y disfrutar de tu próxima propiedad.
          </p>
        </div>

        {/* CARGANDO */}
        {loading ? (
          <p className="mt-12 text-center text-sm text-zinc-500">
            Cargando publicaciones...
          </p>
        ) : error ? (
          <p className="mt-12 text-center text-sm text-red-600">
            {error}
          </p>
        ) : blogs.length === 0 ? (
          <p className="mt-12 text-center text-sm text-zinc-500">
            Todavía no hay publicaciones disponibles.
          </p>
        ) : (
          <>
            {/* GRID DEL BLOG */}
            <div className="mt-10 grid grid-cols-1 gap-6 sm:mt-12 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
              {currentBlogs.map((blog) => (
                <BlogCard
                  key={blog.id}
                  blog={blog}
                />
              ))}
            </div>

            {/* PAGINACIÓN */}
            {totalPages > 1 && (
              <div className="mt-12 flex flex-col items-center gap-5">

                <p className="text-sm text-zinc-500">
                  Mostrando{" "}
                  <span className="font-medium text-zinc-900">
                    {startIndex + 1}
                  </span>
                  {" - "}
                  <span className="font-medium text-zinc-900">
                    {Math.min(endIndex, blogs.length)}
                  </span>
                  {" de "}
                  <span className="font-medium text-zinc-900">
                    {blogs.length}
                  </span>
                  {" publicaciones"}
                </p>

                <div className="flex flex-wrap items-center justify-center gap-2">

                  {/* ANTERIOR */}
                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Anterior
                  </button>

                  {/* NÚMEROS */}
                  {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1
                  ).map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => handlePageChange(page)}
                      aria-current={currentPage === page ? "page" : undefined}
                      className={`h-10 min-w-10 rounded-xl px-3 text-sm font-medium transition ${
                        currentPage === page
                          ? "bg-zinc-950 text-white"
                          : "border border-zinc-200 text-zinc-700 hover:bg-zinc-100"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  {/* SIGUIENTE */}
                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Siguiente
                  </button>

                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
