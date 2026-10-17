import { NavLink, useLocation } from "react-router-dom";
// import LightRays from "./LightRays";
import { useMemo } from "react";

export default function Header() {
  const { pathname } = useLocation();

  const isHome = useMemo(() => pathname === "/", [pathname]);

  return (
    <header className="w-full">
      {isHome ? (
        <section className="relative min-h-210 overflow-hidden bg-[#0d0b12]">
          {/* Fondo */}
          {/* <div className="absolute inset-0 z-0">
            <LightRays
              raysOrigin="top-center"
              raysColor="#ffffff"
              raysSpeed={1}
              lightSpread={0.5}
              rayLength={3}
              followMouse={true}
              mouseInfluence={0.1}
              noiseAmount={0}
              distortion={0}
              pulsating={false}
              fadeDistance={1}
              saturation={1}
            />
          </div> */}

          {/* NAVEGACIÓN */}
          <div className="relative z-10 max-w-6xl mx-auto px-10 pt-10">
            <div className="flex justify-between items-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-lg py-3 px-5">
              <NavLink className="font-medium text-white" to="/">
                Bienes Raíces App
              </NavLink>

              <nav className="flex gap-3">
                <NavLink
                  className={({ isActive }) =>
                    isActive
                      ? "text-white"
                      : "text-white/60 transition hover:text-white"
                  }
                  to="/"
                >
                  Inicio
                </NavLink>

                <NavLink
                  className={({ isActive }) =>
                    isActive
                      ? "text-white"
                      : "text-white/60 transition hover:text-white"
                  }
                  to="/nosotros"
                >
                  Nosotros
                </NavLink>

                <NavLink
                  className={({ isActive }) =>
                    isActive
                      ? "text-white"
                      : "text-white/60 transition hover:text-white"
                  }
                  to="/anuncios"
                >
                  Anuncios
                </NavLink>

                <NavLink
                  className={({ isActive }) =>
                    isActive
                      ? "text-white"
                      : "text-white/60 transition hover:text-white"
                  }
                  to="/blog"
                >
                  Blog
                </NavLink>

                <NavLink
                  className={({ isActive }) =>
                    isActive
                      ? "text-white"
                      : "text-white/60 transition hover:text-white"
                  }
                  to="/contacto"
                >
                  Contacto
                </NavLink>
              </nav>
            </div>
          </div>

          {/* HERO */}
          <div className="relative z-10 flex min-h-150 items-center justify-center">
            <div className="max-w-3xl px-6 text-center">
              <p className="mb-4 text-sm font-medium uppercase tracking-widest text-white/60">
                Encuentra tu próximo hogar
              </p>

              <h1 className="text-5xl font-bold tracking-tight text-white md:text-7xl">
                Encuentra el lugar
                <br />
                donde quieres vivir
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-lg text-white/60">
                Explora propiedades, encuentra tu próximo hogar y descubre
                oportunidades inmobiliarias.
              </p>

              <div className="mt-8 flex justify-center gap-4">
                <NavLink
                  to="/anuncios"
                  className="rounded-xl bg-white px-6 py-3 font-medium text-black transition hover:bg-white/90"
                >
                  Ver propiedades
                </NavLink>

                <NavLink
                  to="/nosotros"
                  className="rounded-xl border border-white/20 px-6 py-3 font-medium text-white transition hover:bg-white/10"
                >
                  Conocer más
                </NavLink>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <div className="relative z-10 mx-auto max-w-6xl px-10 pt-10">
          <div className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white px-5 py-3 shadow-md">
            <NavLink className="font-medium text-zinc-900" to="/">
              Bienes Raíces App
            </NavLink>

            <nav className="flex gap-4">
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? "font-medium text-zinc-900"
                    : "text-zinc-500 transition hover:text-zinc-900"
                }
                to="/"
              >
                Inicio
              </NavLink>

              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? "font-medium text-zinc-900"
                    : "text-zinc-500 transition hover:text-zinc-900"
                }
                to="/nosotros"
              >
                Nosotros
              </NavLink>

              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? "font-medium text-zinc-900"
                    : "text-zinc-500 transition hover:text-zinc-900"
                }
                to="/anuncios"
              >
                Anuncios
              </NavLink>

              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? "font-medium text-zinc-900"
                    : "text-zinc-500 transition hover:text-zinc-900"
                }
                to="/blog"
              >
                Blog
              </NavLink>

              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? "font-medium text-zinc-900"
                    : "text-zinc-500 transition hover:text-zinc-900"
                }
                to="/contacto"
              >
                Contacto
              </NavLink>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
