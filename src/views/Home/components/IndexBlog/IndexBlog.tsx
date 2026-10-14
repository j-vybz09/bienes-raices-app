import { blogPropiedad } from "../../../../data/blogPropiedad";
import BlogCard from "./BlogCard";

export default function IndexBlog() {
  return (
    <div className="space-y-6">
      {blogPropiedad.map( blog => (
        <BlogCard 
          key={blog.id}
          blog={blog}
        />
      ) )}
    </div>
  )
}