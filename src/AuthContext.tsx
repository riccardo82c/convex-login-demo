import { useState, ReactNode } from "react"
import { getAuthToken } from "@/utils/auth"
import { AuthContext } from "./context/auth-context"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(!!getAuthToken())

  const refreshAuth = () => {
    setIsAuthenticated(!!getAuthToken())
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  )
}
