import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "./layouts/Layout"
import IndexPage from "./views/Home/IndexPage"
<<<<<<< HEAD
import NosotrosPage from "./views/Nosotros/NosotrosPage"
import AnunciosPage from "./views/Anuncios/AnunciosPage"
import BlogPage from "./views/Blog/BlogPage"
import ContactoPage from "./views/Contacto/ContactoPage"
=======
import NosotrosPage from "./views/NosotrosPage"
import AnunciosPage from "./views/AnunciosPage"
import BlogPage from "./views/BlogPage"
import ContactoPage from "./views/ContactoPage"
>>>>>>> feature/frontend-home

function AppRouter() {

  return (
    <>
<<<<<<< HEAD
      <BrowserRouter basename={import.meta.env.BASE_URL}>
=======
      <BrowserRouter>
>>>>>>> feature/frontend-home
        <Routes>
          <Route element={<Layout/>}>
              <Route path="/" element={<IndexPage/>}/>
              <Route path="/nosotros" element={<NosotrosPage/>}/>
              <Route path="/anuncios" element={<AnunciosPage/>}/>
              <Route path="/blog" element={<BlogPage/>}/>
              <Route path="/contacto" element={<ContactoPage/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default AppRouter

