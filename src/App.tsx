"use client"

import { useState } from "react"
import LoginForm from "./components/LoginForm"
import SignUpForm from "./components/SignUpForm"

export default function App() {
  const [showLogin, setShowLogin] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-10 bg-light dark:bg-dark p-4 border-b-2 border-slate-200 dark:border-slate-800">
        Convex + React
      </header>
      <main className="p-8 flex flex-col gap-8">
        <h1 className="text-4xl font-bold text-center">Convex + React</h1>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => setShowLogin(false)}
            className={`px-4 py-2 rounded-md ${!showLogin ? 'bg-blue-600 text-white' : 'bg-gray-200 text-slate-700 cursor-pointer'}`}
          >
            Sign Up
          </button>
          <button
            onClick={() => setShowLogin(true)}
            className={`px-4 py-2 rounded-md ${showLogin ? 'bg-blue-600 text-white' : 'bg-gray-200 text-slate-700 cursor-pointer'}`}
          >
            Login
          </button>
        </div>

        {showLogin ? <LoginForm /> : <SignUpForm />}
      </main>
    </>
  )
}
