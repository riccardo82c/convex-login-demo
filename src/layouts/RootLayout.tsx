import { Outlet } from "react-router"
import Navbar from "../components/Navbar"

export default function RootLayout() {
  return (
    <div className="flex flex-col h-full">
      <Navbar />
      <main className="p-2 sm:p-8 flex flex-col gap-4 sm:gap-8 flex-grow overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
