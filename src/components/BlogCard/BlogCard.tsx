import type { BlogPropiedad } from "../../types";

type BlogCardProps = {
  blog: BlogPropiedad;
};

export default function BlogCard({ blog }: BlogCardProps) {
  const { image, title, date, author, description } = blog;

  return (
    <article className="group overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="overflow-hidden">
        <img
          className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
          src={image}
          alt={title}
        />
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between text-sm text-zinc-500">
          <span>{date}</span>
          <span>Por {author}</span>
        </div>

        <h2 className="mt-4 text-2xl font-semibold leading-tight text-zinc-900">
          {title}
        </h2>

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-500">
          {description}
        </p>

        <button className="mt-6 text-sm font-semibold text-zinc-900 transition-colors hover:text-zinc-500">
          Leer artículo →
        </button>
      </div>
    </article>
  );
}