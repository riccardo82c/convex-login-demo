import { Outlet } from "react-router"
import Navbar from "../components/Navbar"

export default function RootLayout() {
  return (
    <>
      <Navbar />
      <main className="p-8 flex flex-col gap-8">
        <Outlet />
      </main>
    </>
  )
}