import { useEffect, useState } from "react";
import { getBlogs } from "../../../../lib/api";
import type { BlogPropiedad } from "../../../../types";
import BlogCard from "./BlogCard";

export default function IndexBlog() {
  const [blogs, setBlogs] = useState<BlogPropiedad[]>([]);

  useEffect(() => {
    let active = true;

    getBlogs()
      .then((data) => {
        if (active) setBlogs(data.slice(0, 2));
      })
      .catch((error) => {
        console.error("No fue posible cargar los artículos destacados:", error);
      });

    return () => {
      active = false;
    };
  }, []);

  if (blogs.length === 0) return null;

  return (
    <div className="space-y-6">
      {blogs.map((blog) => (
        <BlogCard key={blog.id} blog={blog} />
      ))}
    </div>
  );
}
