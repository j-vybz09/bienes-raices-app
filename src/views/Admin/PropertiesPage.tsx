import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProperties, deleteProperty, getImageUrl} from "../../lib/api";
import type { Propiedad } from "../../types";

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Propiedad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadProperties = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getProperties();
      setProperties(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No fue posible cargar las propiedades."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, []);

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "¿Estás seguro de que deseas eliminar esta propiedad?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      await deleteProperty(id);

      setProperties((previous) =>
        previous.filter((property) => property.id !== id)
      );
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "No fue posible eliminar la propiedad."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const formatPrice = (price: string) => {
  const numericPrice = Number(price);

  if (!Number.isFinite(numericPrice)) {
    return "Precio no disponible";
  }

  return new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(numericPrice);
};

  return (
    <section className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-zinc-500">
            Administración
          </p>

          <h1 className="mt-1 text-3xl font-semibold text-zinc-900">
            Propiedades
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            Administra las propiedades disponibles en tu inmobiliaria.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={loadProperties}
            disabled={loading}
            className="rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100 disabled:opacity-50"
          >
            Actualizar
          </button>

          <Link
            to="/admin/properties/new"
            className="rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700"
          >
            + Nueva propiedad
          </Link>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-5">
        <p className="text-sm text-zinc-500">
          Propiedades registradas
        </p>
        <p className="mt-2 text-3xl font-semibold text-zinc-900">
          {properties.length}
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
        <div className="border-b border-zinc-100 px-6 py-5">
          <h2 className="font-semibold text-zinc-900">
            Listado de propiedades
          </h2>
        </div>

        {loading ? (
          <p className="p-10 text-center text-sm text-zinc-500">
            Cargando propiedades...
          </p>
        ) : error ? (
          <div className="p-10 text-center">
            <p className="text-sm text-red-600">{error}</p>
            <button
              onClick={loadProperties}
              className="mt-4 text-sm font-medium underline"
            >
              Intentar nuevamente
            </button>
          </div>
        ) : properties.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-sm text-zinc-500">
              No hay propiedades registradas.
            </p>
            <Link
              to="/admin/properties/new"
              className="mt-4 inline-block text-sm font-medium text-zinc-900 underline"
            >
              Registrar la primera propiedad
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-187.5 text-left text-sm">
              <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
                <tr>
                  <th className="px-6 py-4">Propiedad</th>
                  <th className="px-6 py-4">Precio</th>
                  <th className="px-6 py-4">Habitaciones</th>
                  <th className="px-6 py-4">Baños</th>
                  <th className="px-6 py-4">Garajes</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-100">
                {properties.map((property) => (
                  <tr key={property.id} className="hover:bg-zinc-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={getImageUrl(property.image)}
                          alt={property.title}
                          className="size-14 rounded-lg object-cover"
                        />

                        <div className="max-w-xs">
                          <p className="font-medium text-zinc-900">
                            {property.title}
                          </p>
                          <p className="mt-1 truncate text-xs text-zinc-500">
                            {property.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 font-medium text-zinc-900">
                      {formatPrice(property.price)}
                    </td>

                    <td className="px-6 py-4 text-zinc-600">
                      {property.bedrooms}
                    </td>

                    <td className="px-6 py-4 text-zinc-600">
                      {property.bathrooms}
                    </td>

                    <td className="px-6 py-4 text-zinc-600">
                      {property.garage}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/admin/properties/${property.id}/edit`}
                          className="rounded-lg border border-zinc-200 px-3 py-2 text-xs font-medium hover:bg-zinc-100"
                        >
                          Editar
                        </Link>

                        <button
                          onClick={() => handleDelete(property.id)}
                          disabled={deletingId === property.id}
                          className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                        >
                          {deletingId === property.id
                            ? "Eliminando..."
                            : "Eliminar"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
