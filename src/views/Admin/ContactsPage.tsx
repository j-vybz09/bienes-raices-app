
import { useEffect, useState } from "react";
import { getContacts, updateContactStatus, deleteContact, type ContactMessage} from "../../lib/api";

export default function ContactsPage() {
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const loadContacts = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getContacts();
      setContacts(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No fue posible cargar los mensajes."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const handleStatus = async (contact: ContactMessage) => {
    const newStatus = contact.status === "read" ? "pending" : "read";

    try {
      setUpdatingId(contact.id);

      await updateContactStatus(contact.id, newStatus);

      setContacts((previous) =>
        previous.map((item) =>
          item.id === contact.id
            ? { ...item, status: newStatus }
            : item
        )
      );
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "No fue posible actualizar el mensaje."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "¿Estás seguro de que deseas eliminar este mensaje?"
    );

    if (!confirmed) return;

    try {
      setUpdatingId(id);

      await deleteContact(id);

      setContacts((previous) =>
        previous.filter((contact) => contact.id !== id)
      );
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "No fue posible eliminar el mensaje."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (date: string) => {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleString("es-CR", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-zinc-500">
            Administración
          </p>

          <h1 className="mt-1 text-3xl font-semibold text-zinc-900">
            Mensajes de contacto
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            Consulta y administra las solicitudes de tus clientes.
          </p>
        </div>

        <button
          onClick={loadContacts}
          disabled={loading}
          className="rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:opacity-50"
        >
          Actualizar mensajes
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
          <p className="text-sm text-zinc-500">Total de mensajes</p>
          <p className="mt-2 text-3xl font-semibold text-zinc-900">
            {contacts.length}
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
          <p className="text-sm text-zinc-500">Pendientes</p>
          <p className="mt-2 text-3xl font-semibold text-amber-600">
            {contacts.filter((item) => item.status !== "read").length}
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
          <p className="text-sm text-zinc-500">Leídos</p>
          <p className="mt-2 text-3xl font-semibold text-blue-600">
            {contacts.filter((item) => item.status === "read").length}
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
        <div className="border-b border-zinc-100 px-6 py-5">
          <h2 className="font-semibold text-zinc-900">
            Mensajes recibidos
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Últimas consultas enviadas por tus clientes.
          </p>
        </div>

        {loading ? (
          <p className="p-10 text-center text-sm text-zinc-500">
            Cargando mensajes...
          </p>
        ) : error ? (
          <div className="p-10 text-center">
            <p className="text-sm text-red-600">{error}</p>
            <button
              onClick={loadContacts}
              className="mt-4 text-sm font-medium underline"
            >
              Intentar nuevamente
            </button>
          </div>
        ) : contacts.length === 0 ? (
          <p className="p-10 text-center text-sm text-zinc-500">
            Todavía no hay mensajes registrados.
          </p>
        ) : (
          <div className="divide-y divide-zinc-100">
            {contacts.map((contact) => (
              <article
                key={contact.id}
                className="flex flex-col gap-5 p-6 lg:flex-row lg:items-start lg:justify-between"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-zinc-100 font-semibold text-zinc-600">
                      {contact.name.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <h3 className="font-semibold text-zinc-900">
                        {contact.name}
                      </h3>
                      <p className="text-sm text-zinc-500">
                        {contact.email}
                      </p>
                    </div>
                  </div>

                  {contact.phone && (
                    <p className="mt-3 text-sm text-zinc-500">
                      Teléfono: {contact.phone}
                    </p>
                  )}

                  <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-zinc-700">
                    {contact.message}
                  </p>

                  <p className="mt-3 text-xs text-zinc-400">
                    Recibido: {formatDate(contact.created_at)}
                  </p>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      contact.status === "read"
                        ? "bg-blue-50 text-blue-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {contact.status === "read" ? "Leído" : "Pendiente"}
                  </span>

                  <button
                    onClick={() => handleStatus(contact)}
                    disabled={updatingId === contact.id}
                    className="rounded-lg border border-zinc-200 px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-100 disabled:opacity-50"
                  >
                    {contact.status === "read"
                      ? "Marcar pendiente"
                      : "Marcar leído"}
                  </button>

                  <button
                    onClick={() => handleDelete(contact.id)}
                    disabled={updatingId === contact.id}
                    className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    Eliminar
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
