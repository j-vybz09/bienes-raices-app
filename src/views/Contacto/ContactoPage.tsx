export default function ContactoPage() {
  return (
    <section className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-zinc-950 py-24 mt-5 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-zinc-400">
              Contáctanos
            </p>

            <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">
              Estamos aquí para ayudarte
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
              ¿Tienes alguna pregunta sobre una propiedad, deseas vender tu
              inmueble o necesitas asesoría? Ponte en contacto con nosotros.
            </p>
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section className="py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2">
          
          {/* Información */}
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-zinc-500">
              Información
            </p>

            <h2 className="mt-3 text-3xl font-semibold text-zinc-900 md:text-4xl">
              Hablemos sobre tu próxima propiedad
            </h2>

            <p className="mt-5 max-w-xl leading-7 text-zinc-500">
              Nuestro equipo está disponible para brindarte información,
              resolver tus dudas y ayudarte a encontrar la propiedad que
              mejor se adapte a tus necesidades.
            </p>

            <div className="mt-10 space-y-6">
              <div>
                <h3 className="font-semibold text-zinc-900">
                  Teléfono
                </h3>

                <p className="mt-1 text-zinc-500">
                  +506 0000-0000
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-zinc-900">
                  Correo electrónico
                </h3>

                <p className="mt-1 text-zinc-500">
                  contacto@bienesraices.com
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-zinc-900">
                  Ubicación
                </h3>

                <p className="mt-1 text-zinc-500">
                  San José, Costa Rica
                </p>
              </div>
            </div>
          </div>

          {/* Formulario */}
          <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm md:p-10">
            <h2 className="text-2xl font-semibold text-zinc-900">
              Envíanos un mensaje
            </h2>

            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Completa el formulario y nos pondremos en contacto contigo.
            </p>

            <form className="mt-8 space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-zinc-700"
                >
                  Nombre completo
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Tu nombre completo"
                  className="w-full rounded-xl border border-zinc-200 px-4 py-3 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-zinc-700"
                >
                  Correo electrónico
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="tu@email.com"
                  className="w-full rounded-xl border border-zinc-200 px-4 py-3 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-medium text-zinc-700"
                >
                  Teléfono
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+506 0000-0000"
                  className="w-full rounded-xl border border-zinc-200 px-4 py-3 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-medium text-zinc-700"
                >
                  Mensaje
                </label>

                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  placeholder="Cuéntanos cómo podemos ayudarte..."
                  className="w-full resize-none rounded-xl border border-zinc-200 px-4 py-3 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-zinc-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-zinc-800 active:scale-[0.99]"
              >
                Enviar mensaje
              </button>
            </form>
          </div>
        </div>
      </section>
    </section>
  );
}