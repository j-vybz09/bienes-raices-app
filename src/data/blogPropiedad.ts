import type { BlogPropiedad } from "../types";

export const blogPropiedad: BlogPropiedad[] = [
  {
    id: 1,
    image: `${import.meta.env.BASE_URL}/img/1.webp`,
    title: "Terraza en el techo de tu casa",
    date: "11/10/2026",
    author: "Admin",
    description:
      "Consejos para construir una terraza en el techo de tu casa con los mejores materiales y ahorrando dinero.",
  },
  {
    id: 2,
    image: `${import.meta.env.BASE_URL}/img/2.webp`,
    title: "Guía para la decoración de tu hogar",
    date: "11/10/2026",
    author: "Admin",
    description:
      "Descubre diferentes consejos para decorar tu hogar, aprovechar mejor los espacios y crear ambientes modernos y cómodos para toda la familia.",
  },
];
