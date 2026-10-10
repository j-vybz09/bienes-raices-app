import { Outlet } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"

export default function Layout() {
  return (
    <>
        <Header/>

        <main className="max-w-7xl mx-auto py-5">
            <Outlet/>
        </main>

        <Footer/>
    </>
  )
}
