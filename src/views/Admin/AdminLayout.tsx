
import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  checkAdminSession,
  logoutAdmin,
  type AdminUser,
} from "../../lib/api";

export default function AdminLayout() {
  const navigate = useNavigate();

  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verifySession() {
      try {
        const user = await checkAdminSession();

        if (!user) {
          navigate("/admin/login", { replace: true });
          return;
        }

        setAdmin(user);
      } catch {
        navigate("/admin/login", { replace: true });
      } finally {
        setLoading(false);
      }
    }

    verifySession();
  }, [navigate]);

  async function handleLogout() {
    try {
      await logoutAdmin();
      navigate("/admin/login", { replace: true });
    } catch {
      alert("No se pudo cerrar la sesión.");
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-900" />
          <p className="mt-4 text-sm text-zinc-500">
            Verificando sesión...
          </p>
        </div>
      </div>
    );
  }

  if (!admin) return null;

  const navigation = [
    {
      label: "Dashboard",
      symbol: "▦",
      path: "/admin",
      end: true,
    },
    {
      label: "Propiedades",
      symbol: "⌂",
      path: "/admin/properties",
      end: false,
    },
    {
      label: "Publicaciones",
      symbol: "▤",
      path: "/admin/blog",
      end: false,
    },
    {
      label: "Mensajes",
      symbol: "✉",
      path: "/admin/contacts",
      end: false,
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 md:flex">
      {/* Sidebar */}
      <aside className="flex w-full flex-col bg-zinc-950 text-white md:fixed md:inset-y-0 md:w-64">
        <div className="border-b border-white/10 px-6 py-6">
          <p className="text-lg font-semibold tracking-tight">
            Bienes Raíces
          </p>
          <p className="mt-1 text-xs text-zinc-400">
            Panel de administración
          </p>
        </div>

        <div className="px-4 py-6">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Menú principal
          </p>

          <nav className="space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-white text-zinc-950"
                      : "text-zinc-400 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <span className="w-5 text-center text-lg">
                  {item.symbol}
                </span>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="mt-auto border-t border-white/10 p-4">
          <div className="mb-4 flex items-center gap-3 px-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-semibold">
              {admin.name.charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-medium">
                {admin.name}
              </p>
              <p className="truncate text-xs text-zinc-500">
                {admin.email}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full rounded-xl border border-white/10 px-4 py-2.5 text-left text-sm text-zinc-300 transition hover:border-red-400/30 hover:bg-red-500/10 hover:text-red-300"
          >
            <span className="mr-3">↗</span>
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Contenido */}
      <div className="min-w-0 flex-1 md:ml-64">
        <header className="flex min-h-20 items-center justify-between border-b border-zinc-200 bg-white px-5 sm:px-8">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
              Administración
            </p>
            <h1 className="mt-1 text-lg font-semibold text-zinc-900">
              Bienvenido, {admin.name}
            </h1>
          </div>

          <div className="hidden text-right sm:block">
            <p className="text-xs text-zinc-400">Sesión activa</p>
            <p className="mt-1 text-sm font-medium text-emerald-600">
              ● Conectado
            </p>
          </div>
        </header>

        <main className="p-5 sm:p-8 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
