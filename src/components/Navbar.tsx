import { Link, NavLink, useNavigate } from "react-router"
import { removeAuthToken } from "@/utils/auth"
import { useAuth } from "@/hooks/useAuth"

export default function Navbar() {
  const { isAuthenticated, setIsAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    removeAuthToken()
    setIsAuthenticated(false)
    void navigate("/")
  }

  // Funzione per determinare la classe del link attivo
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? "text-blue-600" : "hover:text-blue-600"

  return (
    <header className="sticky top-0 z-10 bg-light dark:bg-dark p-4 border-b-2 border-slate-200 dark:border-slate-800">
      <div className="flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          Convex + React
        </Link>
        <nav>
          <ul className="flex gap-4">
            {!isAuthenticated && (
              <>
                <li>
                  <NavLink to="/login" className={navLinkClass}>Login</NavLink>
                </li>
                <li>
                  <NavLink to="/signup" className={navLinkClass}>Signup</NavLink>
                </li>
              </>
            )}

            {isAuthenticated && (
              <>
                <li>
                  <NavLink to="/chat" className={navLinkClass}>Chat</NavLink>
                </li>
                <li>
                  <button onClick={handleLogout} className="hover:text-red-600">Logout</button>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  )
}
