import { useState, FormEvent } from 'react'
import { useAction } from 'convex/react'
import { api } from '../../convex/_generated/api'
import type { FormData, FormErrors } from '@/types/global'
import { saveAuthToken } from '@/utils/auth'
import { useAuth } from '@/hooks/useAuth'
import { Link, useNavigate } from 'react-router'

import { Button } from './ui/button'
import { Card, CardHeader, CardContent, CardFooter } from './ui/card'
import TextInput from './ui/text-input'

export default function LoginForm() {
  const navigate = useNavigate()

  const { setIsAuthenticated } = useAuth()
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
        const response = await loginUser({
          email: formData.username,
          password: formData.password
        })

        if (response?.userId && response?.token) {
          saveAuthToken(response.token)
          setIsAuthenticated(true)
          void navigate('/chat')
          console.log('User logged in successfully with ID:', response.userId)
        } else {
          setErrors({
            username: 'Login failed. Please check your credentials.'
          })
        }
      } catch (error) {
        console.error('Login failed:', error)
        setErrors({
          username: 'Login failed. Please try again.'
        })
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <Card className="shadow-material">

      <CardHeader className="text-center">

        <h2 className="text-2xl font-semibold text-center">Login</h2>
      </CardHeader>

      <CardContent>

        <form onSubmit={(e) => void handleLogin(e)}>

          <div className="mb-6">
            <TextInput
              type='username'
              id='username'
              name='username'
              value={formData.username}
              onChange={handleChange}
              label='Username'

            />

            {errors.username && (
              <p className="mt-1 text-sm text-red-500">{errors.username}</p>
            )}
          </div>


          <div className="mb-6">
            <TextInput
              type='password'
              id='password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              label='Password'

            />

            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          <Button
            variant={'default'}
            size={'lg'}
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md"
          >
            {isSubmitting ? 'Check...' : 'Login'}
          </Button>


        </form>

      </CardContent>

      <CardFooter className='justify-center gap-2'>
        Non sei registrato? <Link to={'/signup'} className='underline hover:no-underline'>Registrati</Link>
      </CardFooter>
    </Card>
  )
}
