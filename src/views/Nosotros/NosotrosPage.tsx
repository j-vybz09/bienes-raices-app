import ScrollStack, { ScrollStackItem } from "../../components/ScrollStack";

export default function NosotrosPage() {
  return (
    <>
      <section className="bg-zinc-50 py-18">
        {/* TÍTULO */}
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-14 text-center">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
              Conócenos mejor
            </p>

            <h2 className="mt-4 text-4xl font-medium tracking-tight text-zinc-900 md:text-5xl">
              Más sobre nosotros
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-7 text-zinc-500">
              Conoce al equipo que hace posible nuestra forma de trabajar y el
              compromiso que ponemos en cada proyecto.
            </p>
          </div>

          {/* CONTENIDO */}
          <div className="grid items-center gap-14 md:grid-cols-[1.15fr_0.85fr]">
            {/* IMAGEN */}
            <div className="group relative overflow-hidden rounded-3xl">
              <img
                src="/img/nosotros/nosotros.webp"
                alt="Nuestro equipo"
                className="h-130 w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />

              {/* Texto sobre imagen */}
              <div className="absolute bottom-0 left-0 p-8">
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/70">
                  Bienes Raíces App
                </p>

                <h3 className="mt-2 text-2xl font-medium text-white">
                  Personas detrás de cada propiedad
                </h3>
              </div>
            </div>

            {/* INFORMACIÓN */}
            <div className="max-w-xl">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
                Nuestro equipo
              </p>

              <h3 className="mt-4 text-3xl font-medium tracking-tight text-zinc-900 md:text-4xl">
                Experiencia, compromiso y confianza
              </h3>

              <p className="mt-6 leading-8 text-zinc-600">
                Nuestro equipo está formado por profesionales comprometidos con
                ofrecer una experiencia cercana, transparente y profesional a
                cada uno de nuestros clientes.
              </p>

              <p className="mt-5 leading-8 text-zinc-600">
                Trabajamos juntos para comprender las necesidades de cada
                persona y encontrar oportunidades que realmente se adapten a sus
                objetivos.
              </p>

              {/* Separador */}
              <div className="my-8 h-px w-full bg-zinc-200" />

              {/* Pequeños puntos destacados */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="text-2xl font-medium text-zinc-900">25+</p>
                  <p className="mt-1 text-sm text-zinc-500">
                    Años de experiencia
                  </p>
                </div>

                <div>
                  <p className="text-2xl font-medium text-zinc-900">100%</p>
                  <p className="mt-1 text-sm text-zinc-500">
                    Compromiso con nuestros clientes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="mx-auto max-w-8xl px-6">
          {/* ENCABEZADO */}
          <div className="mb-10 text-center">
            <h2 className="text-4xl font-medium tracking-tight text-zinc-900 md:text-5xl">
              Sobre Nosotros
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-zinc-500">
              Conoce nuestra trayectoria, experiencia y compromiso con nuestros
              clientes.
            </p>
          </div>

          {/* CONTENIDO PRINCIPAL */}
          <div className="grid items-center gap-14 md:grid-cols-[1.2fr_0.8fr]">
            {/* IMÁGENES */}
            <div className="h-165 w-full">
              <ScrollStack>
                <ScrollStackItem itemClassName="h-[500px] w-full overflow-hidden p-0">
                  <div className="relative h-full w-full">
                    <img
                      src="/img/nosotros/1.webp"
                      alt="Casa residencial"
                      className="h-full w-full object-cover"
                    />

                    <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 to-transparent p-6 pt-20">
                      <h3 className="text-xl font-medium text-white">
                        Hogares que se convierten en historias
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-white/80">
                        Más que propiedades, buscamos crear espacios donde
                        nuestros clientes puedan construir su futuro.
                      </p>
                    </div>
                  </div>
                </ScrollStackItem>

                <ScrollStackItem itemClassName="h-[500px] w-full overflow-hidden p-0">
                  <div className="relative h-full w-full">
                    <img
                      src="/img/nosotros/2.webp"
                      alt="Interior de una propiedad"
                      className="h-full w-full object-cover"
                    />

                    <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 to-transparent p-6 pt-20">
                      <h3 className="text-xl font-medium text-white">
                        Espacios pensados para vivir
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-white/80">
                        Cada propiedad representa una oportunidad para encontrar
                        el lugar que realmente se siente como hogar.
                      </p>
                    </div>
                  </div>
                </ScrollStackItem>

                <ScrollStackItem itemClassName="h-[500px] w-full overflow-hidden p-0">
                  <div className="relative h-full w-full">
                    <img
                      src="/img/nosotros/3.webp"
                      alt="Propiedad residencial"
                      className="h-full w-full object-cover"
                    />

                    <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 to-transparent p-6 pt-20">
                      <h3 className="text-xl font-medium text-white">
                        Experiencia que genera confianza
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-white/80">
                        Durante más de 25 años hemos acompañado a nuestros
                        clientes en decisiones importantes.
                      </p>
                    </div>
                  </div>
                </ScrollStackItem>
              </ScrollStack>
            </div>

            {/* INFORMACIÓN */}
            <div className="max-w-xl">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
                Nuestra experiencia
              </p>

              <h3 className="mt-4 text-3xl font-medium tracking-tight text-zinc-900 md:text-4xl">
                Más de 25 años de experiencia
              </h3>

              <p className="mt-6 leading-8 text-zinc-600">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Veritatis amet corporis tempora odit eum? Ad cum sapiente modi
                rem fuga delectus labore, hic, in enim vitae cumque nobis magnam
                quos totam.
              </p>

              <p className="mt-4 leading-8 text-zinc-600">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga
                expedita molestias nostrum officia reprehenderit maxime
                perspiciatis eius eveniet tempore totam excepturi cumque
                repellat laboriosam facere doloremque ducimus, neque
                consequatur? Quos.
              </p>
            </div>
          </div>
        </div>
      </section>

      
    </>
  );
}
