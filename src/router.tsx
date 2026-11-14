
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

import LoginPage from "./views/Admin/LoginPage";
import AdminLayout from "./views/Admin/AdminLayout";
import DashboardPage from "./views/Admin/DashboardPage";

import PropertiesPage from "./views/Admin/PropertiesPage";
import PropertyFormPage from "./views/Admin/PropertyFormPage";
import BlogAdminPage from "./views/Admin/BlogAdminPage";
import ContactsPage from "./views/Admin/ContactsPage";

function AppRouter() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        {/* Páginas públicas */}
        <Route element={<Layout />}>
          <Route path="/" element={<IndexPage />} />
          <Route path="/nosotros" element={<NosotrosPage />} />
          <Route path="/anuncios" element={<AnunciosPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/contacto" element={<ContactoPage />} />
        </Route>

        {/* Inicio de sesión del administrador */}
        <Route path="/admin/login" element={<LoginPage />} />

        {/* Panel de administración */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />

          {/* Propiedades */}
          <Route
            path="properties"
            element={<PropertiesPage />}
          />

          <Route
            path="properties/new"
            element={<PropertyFormPage />}
          />

          <Route
            path="properties/:id/edit"
            element={<PropertyFormPage />}
          />

          {/* Publicaciones */}
          <Route
            path="blog"
            element={<BlogAdminPage />}
          />

          {/* Mensajes */}
          <Route
            path="contacts"
            element={<ContactsPage />}
          />
        </Route>

        {/* Detalles públicos */}
        <Route element={<DetailLayout />}>
          <Route
            path="/anuncios/:id"
            element={<PropertyDetailPage />}
          />

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
