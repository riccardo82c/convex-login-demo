import { Outlet } from "react-router"

export default function AuthLayout() {

  // const location = useLocation()
  // const isLoginPage = location.pathname === "/login"

  return (
    <div className="flex flex-col items-center">

      <h1 className="text-4xl font-bold text-center mb-6">Convex + React</h1>

      <Outlet />

      {/* <div className="flex justify-center gap-4 mb-6">
        <Link
          to="/signup"
          className={`px-4 py-2 rounded-md ${!isLoginPage ? 'bg-blue-600 text-white' : 'bg-gray-200 text-slate-700'}`}
        >
          Sign Up
        </Link>
        <Link
          to="/login"
          className={`px-4 py-2 rounded-md ${isLoginPage ? 'bg-blue-600 text-white' : 'bg-gray-200 text-slate-700'}`}
        >
          Login
        </Link>
      </div> */}
    </div>
  )
}
