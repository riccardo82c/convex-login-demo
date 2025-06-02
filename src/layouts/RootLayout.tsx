import { Outlet } from "react-router"
import Navbar from "../components/Navbar"

export default function RootLayout() {
  return (
    <>
      <Navbar />
      <main className="p-2 sm:p-8 flex flex-col gap-4 sm:gap-8">
        <Outlet />
      </main>
    </>
  )
}