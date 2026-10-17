import { Propiedades } from "../../data/properties"
import IndexDepas from "./components/IndexDepas/IndexDepas"
import IndexIcons from "./components/IndexIcons/IndexIcons"
import SimpleParallax from "simple-parallax-js";
import { Icons } from "./data/DbIcons"
import IndexBlog from "./components/IndexBlog/IndexBlog";
import IndexTestimonial from "./components/IndexBlog/IndexTestimonial";

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

      <section className="mt-10">
        <div className="relative h-170 overflow-hidden">

          <SimpleParallax
              scale={1.12}
              orientation="up"
              delay={0.4}
              transition="cubic-bezier(0,0,0,1)"
            >
              <img
                src={`${import.meta.env.BASE_URL}img/teamwork3.webp`}
                alt="Nuestro equipo"
                className="h-full w-full object-cover object-[50%_50%]"
              />
            </SimpleParallax>

            {/* Capa oscura */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Texto */}
            <div className="absolute inset-0 z-10 flex items-center justify-center px-6 text-center">
              <div className="max-w-3xl text-white">

                <p className="mb-3 text-sm font-medium uppercase tracking-[0.3em] text-white/80">
                  Conócenos
                </p>

                <h1 className="text-4xl font-semibold md:text-6xl">
                  Sobre Nosotros
                </h1>

                <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/80 md:text-lg">
                  Conoce nuestra historia, nuestro compromiso y la pasión que
                  tenemos por ayudarte a encontrar el lugar ideal para ti y tu familia.
                </p>

              </div>
            </div>

          </div>
      </section>

      <section className="mt-20">
          <div className="mx-auto max-w-7xl px-6 text-center">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-zinc-500">
              Noticias y consejos
            </p>

            <h2 className="mt-3 text-4xl font-semibold text-zinc-900 md:text-5xl">
              Nuestro Blog
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-zinc-500">
              Consejos, ideas y novedades para ayudarte a encontrar y disfrutar
              del hogar ideal.
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-7xl grid-cols-1 gap-12 px-6 lg:grid-cols-[1.5fr_0.8fr]">
            <IndexBlog/>
            
            <IndexTestimonial/>
          </div>
      </section>
    </>
  )
}
