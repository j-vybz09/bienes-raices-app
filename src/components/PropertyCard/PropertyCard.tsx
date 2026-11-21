
import { Link } from "react-router-dom";
import type { Propiedad } from "../../types";
import { getImageUrl } from "@/lib/api";

type PropiedadesProps = {
  propiedad: Propiedad;
};

export default function PropertyCard({ propiedad }: PropiedadesProps) {
  const { image, title, description, price, bathrooms, garage, bedrooms } =
    propiedad;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">

      {/* Imagen */}
      <div className="h-80 shrink-0 overflow-hidden">
        <img
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          src={getImageUrl(image)}
          alt={title}
        />
      </div>

      {/* Contenido */}
      <div className="flex flex-1 flex-col p-7">

        {/* Título */}
        <h2 className="h-15 overflow-hidden text-2xl font-semibold leading-7 text-zinc-900 line-clamp-2">
          {title}
        </h2>

        {/* Descripción */}
        <p className="mt-2 h-24 shrink-0 overflow-y-auto pr-2 text-sm leading-6 text-zinc-500">
          {description}
        </p>

        {/* Precio */}
        <p className="mt-5 text-3xl font-semibold tracking-tight text-zinc-950">
          ${price}
        </p>

        {/* Características y botón */}
        <div className="mt-6 flex items-center justify-between gap-3 border-t border-zinc-100 pt-5">

          {/* Iconos */}
          <div className="flex min-w-0 flex-1 items-center justify-between gap-2">

            <div className="flex shrink-0 items-center gap-1.5">
              <img
                className="h-6 w-6 object-contain"
                src={`${import.meta.env.BASE_URL}car.svg`}
                alt="Garaje"
              />
              <span className="text-sm font-medium text-zinc-700">
                {garage}
              </span>
            </div>

            <div className="flex shrink-0 items-center gap-1.5">
              <img
                className="h-6 w-6 object-contain"
                src={`${import.meta.env.BASE_URL}toilet.svg`}
                alt="Baños"
              />
              <span className="text-sm font-medium text-zinc-700">
                {bathrooms}
              </span>
            </div>

            <div className="flex shrink-0 items-center gap-1.5">
              <img
                className="h-6 w-6 object-contain"
                src={`${import.meta.env.BASE_URL}bed.svg`}
                alt="Habitaciones"
              />
              <span className="text-sm font-medium text-zinc-700">
                {bedrooms}
              </span>
            </div>

          </div>

          {/* Botón */}
          <Link
            to={`/anuncios/${propiedad.id}`}
            className="shrink-0 rounded-xl bg-zinc-950 px-4 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:bg-zinc-800 hover:shadow-lg active:scale-95"
          >
            Ver propiedad
          </Link>

        </div>
      </div>
    </article>
  );
}
