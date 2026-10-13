import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "./layouts/Layout"
import IndexPage from "./views/Home/IndexPage"
import NosotrosPage from "./views/Nosotros/NosotrosPage"
import AnunciosPage from "./views/Anuncios/AnunciosPage"
import BlogPage from "./views/Blog/BlogPage"
import ContactoPage from "./views/Contacto/ContactoPage"

function AppRouter() {

  return (
    <>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
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

