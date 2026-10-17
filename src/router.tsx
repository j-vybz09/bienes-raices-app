import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "./layouts/Layout"
import IndexPage from "./views/Home/IndexPage"
import NosotrosPage from "./views/Nosotros/NosotrosPage"
import AnunciosPage from "./views/Anuncios/AnunciosPage"
import BlogPage from "./views/Blog/BlogPage"
import ContactoPage from "./views/Contacto/ContactoPage"
import BlogDetailPage from "./views/Blog/BlogDetailPage";
import DetailLayout from "./layouts/DetailLayout";

function AppRouter() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>

        {/* Páginas normales con Navbar */}
        <Route element={<Layout />}>
          <Route path="/" element={<IndexPage />} />
          <Route path="/nosotros" element={<NosotrosPage />} />
          <Route path="/anuncios" element={<AnunciosPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/contacto" element={<ContactoPage />} />
        </Route>

        {/* Detalle del Blog sin Navbar */}
        <Route element={<DetailLayout />}>
          <Route
            path="/blog/:id"
            element={<BlogDetailPage />}
          />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;

