import type { Propiedad } from "../../../../types";
import { NavLink } from "react-router-dom";

type PropiedadesProps = {
  propiedad: Propiedad;
};

export default function IndexDepas({ propiedad }: PropiedadesProps) {
  const { image, title, description, price, bathrooms, garage, bedrooms } =
    propiedad;

  return (
    <article className="group overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <img
        className="h-80 w-full object-cover transition-transform duration-500 group-hover:scale-105"
        src={image}
        alt="Casa de lujo"
      />

      <div className="p-7">
        <h2 className="min-h-15 text-2xl font-semibold leading-7 text-zinc-900">{title}</h2>

        <p className="mt-2 h-24 overflow-y-auto pr-2">
          <span className="text-sm leading-6 text-zinc-500">{description}</span>
        </p>

        <p className="mt-5 text-3xl font-semibold tracking-tight text-zinc-950">
          ${price}
        </p>

        <div className="mt-6 flex items-center justify-between border-t border-zinc-100 pt-5">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <img
                className="h-6 w-6 object-contain"
                src="/car.svg"
                alt="Garaje"
              />
              <span className="text-sm font-medium text-zinc-700">{garage}</span>
            </div>

            <div className="flex items-center gap-2">
              <img
                className="h-6 w-6 object-contain"
                src="/toilet.svg"
                alt="Baños"
              />
              <span className="text-sm font-medium text-zinc-700">{bathrooms}</span>
            </div>

            <div className="flex items-center gap-2">
              <img
                className="h-6 w-6 object-contain"
                src="/bed.svg"
                alt="Habitaciones"
              />
              <span className="text-sm font-medium text-zinc-700">{bedrooms}</span>
            </div>
          </div>

          <NavLink
            to="anuncios" 
            className=" rounded-xl bg-zinc-950 px-5 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:bg-zinc-800 hover:shadow-lg active:scale-95">
            Ver propiedad
          </NavLink>
        </div>
      </div>
    </article>
  );
}
