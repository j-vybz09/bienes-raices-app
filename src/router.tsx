import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "./layouts/Layout"
import IndexPage from "./views/IndexPage"
import NosotrosPage from "./views/NosotrosPage"
import AnunciosPage from "./views/AnunciosPage"
import BlogPage from "./views/BlogPage"
import ContactoPage from "./views/ContactoPage"

function AppRouter() {

  return (
    <>
      <BrowserRouter>
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
