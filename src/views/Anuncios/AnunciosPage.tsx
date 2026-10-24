import { Propiedades } from "../../data/properties";
import PropertyCard from "../../components/PropertyCard/PropertyCard";

export default function AnunciosPage() {
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

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {Propiedades.map((propiedad) => (
            <PropertyCard
              key={propiedad.id}
              propiedad={propiedad}
            />
          ))}
        </div>

      </div>
    </section>
  );
}