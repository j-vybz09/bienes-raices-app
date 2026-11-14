
import { useEffect, useState } from "react";
import { getBlogs, getContacts, getProperties, type ContactMessage } from "../../lib/api";

type DashboardData = {
  properties: number;
  blogs: number;
  contacts: number;
  recentContacts: ContactMessage[];
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData>({
    properties: 0,
    blogs: 0,
    contacts: 0,
    recentContacts: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDashboard() {
    setLoading(true);
    setError("");

    try {
      const [properties, blogs, contacts] = await Promise.all([
        getProperties(),
        getBlogs(),
        getContacts(),
      ]);

      setData({
        properties: properties.length,
        blogs: blogs.length,
        contacts: contacts.length,
        recentContacts: contacts.slice(0, 5),
      });
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudieron cargar los datos del Dashboard."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const statistics = [
    {
      title: "Propiedades",
      value: data.properties,
      description: "Propiedades registradas",
      symbol: "⌂",
    },
    {
      title: "Publicaciones",
      value: data.blogs,
      description: "Artículos publicados",
      symbol: "▤",
    },
    {
      title: "Mensajes",
      value: data.contacts,
      description: "Consultas recibidas",
      symbol: "✉",
    },
  ];

  function formatDate(date: string) {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return new Intl.DateTimeFormat("es-CR", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(parsedDate);
  }

  return (
    <section>
      {/* Encabezado */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-zinc-500">
            Resumen general
          </p>

          <h2 className="mt-1 text-3xl font-semibold tracking-tight text-zinc-950">
            Dashboard
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
            Administra y supervisa la información de tu inmobiliaria
            desde un solo lugar.
          </p>
        </div>

        <button
          type="button"
          onClick={loadDashboard}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className={loading ? "animate-spin" : ""}>↻</span>
          Actualizar datos
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium text-red-800">
              No se pudo cargar el Dashboard
            </p>
            <p className="mt-1 text-sm text-red-600">{error}</p>
          </div>

          <button
            onClick={loadDashboard}
            className="rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-800"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Indicadores */}
      <div className="mt-9 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {statistics.map((item) => (
          <article
            key={item.title}
            className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-500">
                  {item.title}
                </p>

                <p className="mt-4 text-4xl font-semibold tracking-tight text-zinc-950">
                  {loading ? "—" : item.value}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 text-2xl text-zinc-700">
                {item.symbol}
              </div>
            </div>

            <p className="mt-5 border-t border-zinc-100 pt-4 text-xs text-zinc-400">
              {item.description}
            </p>
          </article>
        ))}
      </div>

      {/* Actividad reciente */}
      <div className="mt-10 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="flex flex-col gap-2 border-b border-zinc-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-zinc-900">
              Mensajes recientes
            </h3>

            <p className="mt-1 text-sm text-zinc-500">
              Últimas consultas enviadas por tus clientes.
            </p>
          </div>

          <span className="w-fit rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
            {loading ? "Cargando..." : `${data.contacts} mensajes`}
          </span>
        </div>

        {loading ? (
          <div className="p-10 text-center text-sm text-zinc-400">
            Cargando mensajes...
          </div>
        ) : error ? (
          <div className="p-10 text-center text-sm text-zinc-400">
            No fue posible cargar los mensajes.
          </div>
        ) : data.recentContacts.length === 0 ? (
          <div className="p-10 text-center">
            <div className="text-3xl text-zinc-300">✉</div>
            <p className="mt-3 font-medium text-zinc-700">
              Todavía no hay mensajes
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              Cuando tus clientes envíen consultas, aparecerán aquí.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {data.recentContacts.map((contact) => (
              <article
                key={contact.id}
                className="flex flex-col gap-3 px-6 py-5 transition hover:bg-zinc-50 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-100 font-semibold text-zinc-600">
                    {contact.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <p className="font-medium text-zinc-900">
                      {contact.name}
                    </p>

                    <p className="mt-0.5 text-sm text-zinc-500">
                      {contact.email}
                    </p>

                    <p className="mt-2 line-clamp-2 text-sm text-zinc-600">
                      {contact.message}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 sm:text-right">
                  <span className="inline-flex rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
                    {contact.status || "Recibido"}
                  </span>

                  <p className="mt-2 text-xs text-zinc-400">
                    {formatDate(contact.created_at)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
