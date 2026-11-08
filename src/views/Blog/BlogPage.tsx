import { useState, useEffect } from "react";
import { getBlogs } from "@/lib/api";
import BlogCard from "../../components/BlogCard/BlogCard";
import type { BlogPropiedad } from "@/types";

export default function BlogPage() {

  const [blogs, setBlogs] = useState<BlogPropiedad[]>([]);

  useEffect( () => {
    getBlogs()
      .then( data => {
        setBlogs(data)
      } )
      .catch( error => {
        console.log(error)
      } )
  }, [] )

  return (
    <section className="min-h-screen bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-zinc-500">
            Nuestro blog
          </p>

          <h1 className="mt-3 text-4xl font-semibold text-zinc-900 md:text-6xl">
            Noticias y consejos
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-zinc-500">
            Descubre consejos, ideas y recomendaciones para encontrar,
            comprar y disfrutar de tu próxima propiedad.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <BlogCard
              key={blog.id}
              blog={blog}
            />
          ))}
        </div>
      </div>
    </section>
  );
}