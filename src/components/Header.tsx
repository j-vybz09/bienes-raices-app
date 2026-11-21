
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import LightRays from "./LightRays";

const links = [
  { to: "/", label: "Inicio" },
  { to: "/nosotros", label: "Nosotros" },
  { to: "/anuncios", label: "Anuncios" },
  { to: "/blog", label: "Blog" },
  { to: "/contacto", label: "Contacto" },
];

export default function Header() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const [menuOpen, setMenuOpen] = useState(false);

  // Enlaces del navbar de inicio.
  // Todos mantienen el mismo peso de fuente.
  const homeLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block rounded-lg px-3 py-2 text-sm transition-colors ${
      isActive
        ? "text-white"
        : "text-white/65 hover:text-white"
    }`;

  return (
    <header className="w-full">
      {isHome ? (
        <section className="relative isolate min-h-120 overflow-hidden bg-[#0d0b12] text-white sm:min-h-180 lg:min-h-210">

          {/* Fondo de iluminación */}
          <div className="pointer-events-none absolute inset-0 z-0">
            <LightRays
              raysOrigin="top-center"
              raysColor="#ffffff"
              raysSpeed={1}
              lightSpread={0.5}
              rayLength={3}
              followMouse
              mouseInfluence={0.1}
              noiseAmount={0}
              distortion={0}
              pulsating={false}
              fadeDistance={1}
              saturation={1}
            />
          </div>

          {/* NAVBAR */}
          <div className="relative z-20 mx-auto w-full max-w-6xl px-4 pt-5 sm:px-6 sm:pt-8 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 shadow-lg backdrop-blur-md sm:px-5">

              {/* LOGO */}
              <NavLink
                className="shrink-0 text-sm font-semibold leading-tight text-white sm:text-base"
                to="/"
                onClick={() => setMenuOpen(false)}
              >
                Bienes Raíces App
              </NavLink>

              {/* BOTÓN MÓVIL */}
              <button
                type="button"
                aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen(!menuOpen)}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/20 text-white transition hover:bg-white/10 md:hidden"
              >
                <span className="text-2xl leading-none">
                  {menuOpen ? "×" : "☰"}
                </span>
              </button>

              {/* NAVEGACIÓN ESCRITORIO */}
              <nav className="hidden shrink-0 items-center gap-1 md:flex">
                {links.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.to === "/"}
                    className={homeLinkClass}
                  >
                    {link.label}
                  </NavLink>
                ))}
              </nav>

              {/* NAVEGACIÓN MÓVIL */}
              {menuOpen && (
                <nav className="basis-full border-t border-white/10 pt-2 md:hidden">
                  {links.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      end={link.to === "/"}
                      onClick={() => setMenuOpen(false)}
                      className={homeLinkClass}
                    >
                      {link.label}
                    </NavLink>
                  ))}
                </nav>
              )}
            </div>
          </div>

          {/* HERO */}
          <div className="relative z-10 flex min-h-142.5 items-center justify-center px-4 py-20 sm:min-h-152.5 sm:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-white/60 sm:text-sm sm:tracking-widest">
                Encuentra tu próximo hogar
              </p>

              <h1 className="text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
                Encuentra el lugar <br className="hidden sm:block" /> donde
                quieres vivir
              </h1>

              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/65 sm:mt-6 sm:text-lg">
                Explora propiedades, encuentra tu próximo hogar y descubre
                oportunidades inmobiliarias.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-3 min-[420px]:flex-row min-[420px]:gap-4">
                <NavLink
                  to="/anuncios"
                  className="rounded-xl bg-white px-6 py-3 text-center text-sm font-medium text-black transition hover:bg-white/90 sm:text-base"
                >
                  Ver propiedades
                </NavLink>

                <NavLink
                  to="/nosotros"
                  className="rounded-xl border border-white/20 px-6 py-3 text-center text-sm font-medium text-white transition hover:bg-white/10 sm:text-base"
                >
                  Conocer más
                </NavLink>
              </div>
            </div>
          </div>
        </section>
      ) : (
        /* NAVBAR DE LAS DEMÁS PÁGINAS */
        <div className="mx-auto w-full max-w-6xl px-4 pt-4 sm:px-6 sm:pt-7 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-white px-4 py-3 shadow-md sm:px-5">

            <NavLink
              className="shrink-0 text-sm font-semibold text-zinc-900 sm:text-base"
              to="/"
              onClick={() => setMenuOpen(false)}
            >
              Bienes Raíces App
            </NavLink>

            <button
              type="button"
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(!menuOpen)}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-zinc-200 text-zinc-800 transition hover:bg-zinc-50 md:hidden"
            >
              <span className="text-2xl leading-none">
                {menuOpen ? "×" : "☰"}
              </span>
            </button>

            <nav className="hidden shrink-0 items-center gap-1 md:flex">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === "/"}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2 text-sm transition ${
                      isActive
                        ? "text-zinc-900"
                        : "text-zinc-500 hover:text-zinc-900"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {menuOpen && (
              <nav className="basis-full border-t border-zinc-100 pt-2 md:hidden">
                {links.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.to === "/"}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `block rounded-lg px-3 py-2 text-sm transition ${
                        isActive
                          ? "text-zinc-900"
                          : "text-zinc-500 hover:text-zinc-900"
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </nav>
            )}
          </div>

          <div className="mt-5 h-px w-full bg-zinc-200" />
        </div>
      )}
    </header>
  );
}
