import { BrowserRouter, Routes, Route, Navigate } from "react-router"
import RootLayout from "./layouts/RootLayout"
import AuthLayout from "./layouts/AuthLayout"
import Login from "./routes/Login"
import Signup from "./routes/Signup"
import Chat from "./routes/Chat"
import Admin from "./routes/Admin"
import { AuthProvider } from "./AuthContext"

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route index element={<Navigate to="/login" replace />} />

            <Route element={<AuthLayout />}>
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
            </Route>

            <Route path="chat" element={<Chat />} />
            <Route path="admin" element={<Admin />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
