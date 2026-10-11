import { Propiedades } from "../../data/properties"
import IndexDepas from "./components/IndexDepas/IndexDepas"
import IndexIcons from "./components/IndexIcons/IndexIcons"
import { Icons } from "./data/DbIcons"

export default function IndexPage() {

  return (
    <>
      <section className="w-full bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
              <span className="tetx-sm uppercase tracking-[0.3em] text-zinc-400">Nuestra esencia</span>

              <h1 className="mt-3 text-3xl font-semibold text-zinc-900 md:text-4xl">Más Sobre nosotros</h1>

              <p className="mx-auto mt-4 max-w-2xl text-zinc-500">
                Trabajamos para ofrecerte una experiencia inmobiliaria
                segura, transparente y confiable.
              </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          
            {Icons.map( icon => (
              <IndexIcons
                key={icon.id}
                icon={icon}
              />
            ) )}
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
              <h1 className="mt-3 text-4xl font-semibold text-zinc-900 md:text-6xl">Casas y Departamento de lujo</h1>
              <p className="mx-auto mt-4 max-w-2xl text-zinc-500">Te ofrecemos los mejores lugares del mundo para tu comodidad y puedas disfrutar de la mejor manera</p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {Propiedades.map( propiedad => (
              <IndexDepas
                key={propiedad.id}
                propiedad={propiedad}
              />
            ) )}
          </div>
        </div>
      </section>

      <section className="mt-10">Hablara de nosotros tendra un efecto parallax</section>

      <section className="mt-10">Testimoniales</section>

    </>
  )
}
