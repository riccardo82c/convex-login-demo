import { Outlet } from "react-router"

export default function AuthLayout() {

  // const location = useLocation()
  // const isLoginPage = location.pathname === "/login"

  return (
    <div className="h-full w-full flex justify-center items-center">
      <div className="w-full sm:w-[400px] px-4">
        <Outlet />
      </div>
    </div>
  )
}
