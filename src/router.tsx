import { BrowserRouter, Route, Routes } from "react-router-dom";

import Layout from "./layouts/Layout";
import DetailLayout from "./layouts/DetailLayout";

import IndexPage from "./views/Home/IndexPage";
import NosotrosPage from "./views/Nosotros/NosotrosPage";
import AnunciosPage from "./views/Anuncios/AnunciosPage";
import BlogPage from "./views/Blog/BlogPage";
import ContactoPage from "./views/Contacto/ContactoPage";

import PropertyDetailPage from "./views/Anuncios/PropertyDetailPage";
import BlogDetailPage from "./views/Blog/BlogDetailPage";

function AppRouter() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        {/* Páginas normales */}
        <Route element={<Layout />}>
          <Route path="/" element={<IndexPage />} />
          <Route path="/nosotros" element={<NosotrosPage />} />
          <Route path="/anuncios" element={<AnunciosPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/contacto" element={<ContactoPage />} />
        </Route>

        {/* Detalle de propiedades */}
        <Route element={<DetailLayout />}>
          <Route
            path="/anuncios/:id"
            element={<PropertyDetailPage />}
          />

          {/* Detalle de artículos del blog */}
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