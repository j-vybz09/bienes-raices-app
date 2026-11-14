import { useState, useEffect } from "react";
import { getProperties } from "@/lib/api";
import PropertyCard from "../../components/PropertyCard/PropertyCard";
import IndexIcons from "./components/IndexIcons/IndexIcons"
import SimpleParallax from "simple-parallax-js";
import { Icons } from "./data/DbIcons"
import IndexBlog from "./components/IndexBlog/IndexBlog";
import IndexTestimonial from "./components/IndexBlog/IndexTestimonial";
import type { Propiedad } from "@/types";

export default function IndexPage() {

  //Creamos un estado donde se van alamcenar las propiedades, dentro de un arreglo
  const [properties, setProperties] = useState<Propiedad[]>([])

  //Una vez cargue la página, llamamos la funcion de getProperties la cual se almacenan dentro data
  useEffect( () => {
    async function loadProperties() {
      try {
        const data = await getProperties()

        setProperties(data)
      } catch (error) {
        console.log(error)
      }
    }

    loadProperties()
  }, [] )//[] quiere decir, ejecuta este useEffect una vez se cargue IndexPage

  //Limitamos la cantidad de propiedades que queremos ver
  const featuredProperties = properties.slice(0, 6)

  return (
    <>
      <section className="w-full bg-white py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
              <span className="tetx-sm uppercase tracking-[0.3em] text-zinc-400">Nuestra esencia</span>

              <h1 className="mt-3 text-3xl font-semibold text-zinc-900 md:text-4xl">Más Sobre nosotros</h1>

              <p className="mx-auto mt-4 max-w-2xl text-zinc-500">
                Trabajamos para ofrecerte una experiencia inmobiliaria
                segura, transparente y confiable.
              </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          
            {Icons.map( icon => (
              <IndexIcons
                key={icon.id}
                icon={icon}
              />
            ) )}
          </div>
        </div>
      </section>

      <section className="mt-8 sm:mt-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center">
              <h1 className="mt-3 text-3xl font-semibold leading-tight text-zinc-900 sm:text-4xl md:text-5xl lg:text-6xl">Casas y Departamento de lujo</h1>
              <p className="mx-auto mt-4 max-w-2xl text-zinc-500">Te ofrecemos los mejores lugares del mundo para tu comodidad y puedas disfrutar de la mejor manera</p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-7 lg:mt-12 lg:grid-cols-3 lg:gap-8">
            {featuredProperties.slice(0,6).map( propiedad => (
              <PropertyCard
                key={propiedad.id}
                propiedad={propiedad}
              />
            ) )}
          </div>
        </div>
      </section>

      
      <section className="mt-8 sm:mt-10">
        <div className="relative h-95 overflow-hidden sm:h-110 md:h-125 lg:h-162.5">

          {/* Imagen con efecto Parallax */}
          <div className="absolute inset-0">
            <SimpleParallax
              scale={1.2}
              orientation="up"
              delay={0.3}
              transition="cubic-bezier(0,0,0,1)"
            >
              <img
                src={`${import.meta.env.BASE_URL}img/teamwork3.webp`}
                alt="Nuestro equipo"
                className="block h-115 w-full object-cover object-center sm:h-130 md:h-150 lg:h-195"
              />
            </SimpleParallax>
          </div>

          {/* Capa oscura */}
          <div className="absolute inset-0 z-1 bg-black/45" />

          {/* Contenido */}
          <div className="absolute inset-0 z-10 flex items-center justify-center px-5 text-center sm:px-8">
            <div className="mx-auto max-w-3xl text-white">

              <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-white/80 sm:text-sm">
                Conócenos
              </p>

              <h2 className="text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
                Sobre Nosotros
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-white/85 sm:mt-5 sm:text-base sm:leading-7 md:text-lg">
                Conoce nuestra historia, nuestro compromiso y la pasión que
                tenemos por ayudarte a encontrar el lugar ideal para ti y tu familia.
              </p>

            </div>
          </div>

        </div>
      </section>
      
      <section className="mt-14 pb-8 sm:mt-16 lg:mt-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-zinc-500">
            Noticias y consejos
          </p>

          <h2 className="mt-3 text-3xl font-semibold text-zinc-900 sm:text-4xl md:text-5xl">
            Nuestro Blog
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-zinc-500">
            Consejos, ideas y novedades para ayudarte a encontrar y disfrutar
            del hogar ideal.
          </p>
        </div>

        <div className="mx-auto mt-8 grid max-w-7xl grid-cols-1 gap-7 px-4 sm:mt-10 sm:gap-8 sm:px-6 lg:grid-cols-[1.5fr_0.8fr] lg:gap-12">
          {/* Publicaciones del blog */}
          <IndexBlog />

          {/* Testimoniales */}
          <IndexTestimonial />
        </div>
      </section>

    </>
  )
}
