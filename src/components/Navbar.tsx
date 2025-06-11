import { NavLink, useNavigate } from "react-router"
import { getAuthToken, removeAuthToken } from "@/utils/auth"
import { useAuth } from "@/hooks/useAuth"
import { useEffect, useState } from "react"
import { Userdata } from "@/types/global"
import { useAction } from "convex/react"
import { api } from "../../convex/_generated/api"

export default function Navbar() {
  const { isAuthenticated, setIsAuthenticated } = useAuth()
  const [userData, setUserData] = useState<Userdata | null>(null)
  const verifyJwt = useAction(api.auth_actions.verifyJwt)

  const navigate = useNavigate()

  useEffect(() => {
    async function fetchUserData() {
      try {
        const token = getAuthToken()
        if (token) {
          const user = await verifyJwt({ token })
          setUserData(user)
        }
      } catch (error) {
        console.error("Failed to verify user:", error)
      }
    }

    void fetchUserData()
  }, [verifyJwt, isAuthenticated])

  const handleLogout = () => {
    removeAuthToken()
    setIsAuthenticated(false)
    void navigate("/")
  }

  // Funzione per determinare la classe del link attivo
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? "text-primary-600 underline dark:text-primary-300" : "hover:text-primary-600 dark:hover:text-primary-300"

  return (
    <header className="sticky top-0 z-10 bg-light dark:bg-dark p-4 border-b-2 border-primary-200 dark:border-primary-800">
      <div className="flex justify-between items-center">
        <span className="text-xl font-bold">
          Chat + Ric
        </span>
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
                  {userData?.role === "admin" ? (
                    <NavLink to="/admin" className={navLinkClass}>Admin</NavLink>
                  ) : null}

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
