import { Link, useParams } from "react-router-dom";
import { Propiedades } from "../../data/properties";

export default function PropertyDetailPage() {
  const { id } = useParams();

  const propiedad = Propiedades.find(
    (propiedad) => propiedad.id === Number(id),
  );

  if (!propiedad) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-6">
        <div className="text-center">
          <h1 className="text-4xl font-semibold text-zinc-900">
            Propiedad no encontrada
          </h1>

          <p className="mt-4 text-zinc-500">
            La propiedad que estás buscando no existe.
          </p>

          <Link
            to="/anuncios"
            className="mt-8 inline-block rounded-xl bg-zinc-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
          >
            Volver a anuncios
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
            src={propiedad.image}
            alt={propiedad.title}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />

        <div className="absolute bottom-0 left-0 w-full">
          <div className="mx-auto max-w-7xl px-6 pb-10">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-zinc-300">
              Propiedad
            </p>

            <h1 className="mt-3 max-w-4xl text-4xl font-semibold text-white md:text-6xl">
              {propiedad.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Información */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-[1fr_350px]">
            {/* Contenido */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-6 border-b border-zinc-200 pb-8">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">
                    Precio
                  </p>

                  <p className="mt-2 text-4xl font-semibold text-zinc-950">
                    ${propiedad.price}
                  </p>
                </div>

                <Link
                  to="/anuncios"
                  className="rounded-xl border border-zinc-200 px-5 py-3 text-sm font-medium text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-50"
                >
                  ← Volver a anuncios
                </Link>
              </div>

              <div className="mt-10">
                <h2 className="text-3xl font-semibold text-zinc-900">
                  Sobre esta propiedad
                </h2>

                <p className="mt-5 max-w-3xl text-base leading-8 text-zinc-500">
                  {propiedad.description}
                </p>
              </div>
            </div>

            {/* Características */}
            <aside className="h-fit rounded-3xl border border-zinc-200 bg-zinc-50 p-7">
              <h2 className="text-xl font-semibold text-zinc-900">
                Características
              </h2>

              <div className="mt-6 divide-y divide-zinc-200">
                <div className="flex items-center justify-between py-4">
                  <span className="text-sm text-zinc-500">
                    Habitaciones
                  </span>

                  <span className="font-semibold text-zinc-900">
                    {propiedad.bedrooms}
                  </span>
                </div>

                <div className="flex items-center justify-between py-4">
                  <span className="text-sm text-zinc-500">
                    Baños
                  </span>

                  <span className="font-semibold text-zinc-900">
                    {propiedad.bathrooms}
                  </span>
                </div>

                <div className="flex items-center justify-between py-4">
                  <span className="text-sm text-zinc-500">
                    Garaje
                  </span>

                  <span className="font-semibold text-zinc-900">
                    {propiedad.garage}
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="mt-6 w-full rounded-xl bg-zinc-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-zinc-800 active:scale-[0.98]"
              >
                Solicitar información
              </button>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}