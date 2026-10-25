import PropertyCard from "../../components/PropertyCard/PropertyCard";
import { useEffect, useState } from "react";
import type { Propiedad } from "@/types";
import { getProperties } from "@/lib/api";

export default function AnunciosPage() {
  const [properties, setProperties] = useState<Propiedad[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadProperties() {
      try {
        const data = await getProperties();
        setProperties(data)
      } catch (error) {
        setError("No se pudieron cargar las propiedades")
        console.log(error)
      }finally{
        setLoading(false)
      }
    }

    loadProperties()
  }, [])

  return (
    <section className="min-h-screen bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-zinc-500">
            Propiedades
          </p>

          <h1 className="mt-3 text-4xl font-semibold text-zinc-900 md:text-6xl">
            Nuestros anuncios
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-zinc-500">
            Encuentra propiedades que se adapten a tus necesidades,
            preferencias y estilo de vida.
          </p>
        </div>

        {loading && (
          <p className="mt-12 text-center text-zinc-500">
            Cargando propiedades...
          </p>
        )}

        {error && (
          <p className="mt-12 text-center text-red-500">
            {error}
          </p>
        )}

        {!loading && !error && (
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {properties.map((propiedad) => (
              <PropertyCard
                key={propiedad.id}
                propiedad={propiedad}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}