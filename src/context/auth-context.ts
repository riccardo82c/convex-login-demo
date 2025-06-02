import { createContext } from "react"

export type AuthContextType = {
  isAuthenticated: boolean
  setIsAuthenticated: (value: boolean) => void
  refreshAuth: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
