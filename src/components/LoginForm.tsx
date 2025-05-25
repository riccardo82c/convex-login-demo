import { useState, FormEvent } from 'react'
import { useAction } from 'convex/react'
import { api } from '../../convex/_generated/api'
import type { FormData, FormErrors } from '@/types/global'

export default function LoginForm() {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: ''
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const loginUser = useAction(api.auth_actions.loginUser)

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {}

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    return newErrors
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()

    const validationErrors = validate()
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true)

      try {
        // Call the registerUser action with the form data
        const response = await loginUser({
          email: formData.username, // Using username as email
          password: formData.password
        })

        if (response?.userId) {
          console.log('User logged in successfully with ID:', response?.userId)
          // Handle successful login (e.g., redirect to dashboard)
        } else {
          console.error('Login failed: User not found')
          // Handle login error
          setErrors({
            username: 'Login failed. Please check your credentials.'
          })
        }

      } catch (error) {
        console.error('Registration failed:', error)
        // Handle registration error
        setErrors({
          username: 'Registration failed. Please try again.'
        })
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6  rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

      <form onSubmit={(e) => void handleLogin(e)}>
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter your email"
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-500">{errors.username}</p>
          )}
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter your password"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">{errors.password}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
        >
          {isSubmitting ? 'Check...' : 'Login'}
        </button>
      </form>
    </div>
  )
}
