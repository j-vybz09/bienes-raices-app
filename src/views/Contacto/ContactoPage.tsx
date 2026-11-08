import { useState } from "react";

type ContactForm = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

export default function ContactoPage() {
  // 1. Estado del formulario
  const [formData, setFormData] = useState<ContactForm>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  // 2. Estado para controlar el envío
  const [loading, setLoading] = useState(false);

  // 3. Estado para mostrar el resultado
  const [feedback, setFeedback] = useState({
    type: "",
    message: "",
  });

  // 4. Actualizar los campos cuando el usuario escribe
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // 5. Enviar el formulario al backend
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setFeedback({ type: "", message: "" });

    try {
      const response = await fetch("http://localhost:8000/api/contact/create.php",{
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "No se pudo enviar el mensaje");
      }

      setFeedback({
        type: "success",
        message: result.message,
      });

      // Limpiar el formulario después de guardar
      setFormData({ name: "", email: "", phone: "", message: "",});
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Ocurrió un error al enviar el mensaje",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-white">
      {/* Hero */}
      <section className="mt-5 bg-zinc-950 py-24 text-white">
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
                <h3 className="font-semibold text-zinc-900">Teléfono</h3>
                <p className="mt-1 text-zinc-500">+506 0000-0000</p>
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
                <h3 className="font-semibold text-zinc-900">Ubicación</h3>
                <p className="mt-1 text-zinc-500">San José, Costa Rica</p>
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

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
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
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Tu nombre completo"
                  required
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
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="tu@email.com"
                  required
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
                  value={formData.phone}
                  onChange={handleChange}
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
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Cuéntanos cómo podemos ayudarte..."
                  required
                  className="w-full resize-none rounded-xl border border-zinc-200 px-4 py-3 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
                />
              </div>

              {/* Mensaje de respuesta */}
              {feedback.message && (
                <p
                  role="status"
                  className={`rounded-xl p-4 text-sm ${
                    feedback.type === "success"
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {feedback.message}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-zinc-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-zinc-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Enviando..." : "Enviar mensaje"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </section>
  );
}