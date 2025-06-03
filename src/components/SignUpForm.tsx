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

export default function SignUpForm() {

  const navigate = useNavigate()

  const { setIsAuthenticated } = useAuth()
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: ''
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const registerUser = useAction(api.auth_actions.registerUser)

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

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault()

    const validationErrors = validate()
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true)

      try {
        const response = await registerUser({
          email: formData.username,
          password: formData.password
        })

        if (response?.userId && response?.token) {
          saveAuthToken(response.token)
          setIsAuthenticated(true)
          void navigate('/chat')
          console.log('User registered successfully with ID:', response.userId)
        }
      } catch (error) {
        console.error('Registration failed:', error)
        setErrors({
          username: 'Registration failed. Please try again.'
        })
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <Card className="shadow-material">

      <CardHeader className="text-center">
        <h2 className="text-2xl font-semibold text-center">Register</h2>
      </CardHeader>

      <CardContent>
        <form onSubmit={(e) => void handleSignUp(e)}>
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
            {isSubmitting ? 'Registering...' : 'Register'}
          </Button>
        </form>
      </CardContent>

      <CardFooter className='justify-center gap-2'>
        Sei già registrato? <Link to={'/login'} className='underline hover:no-underline'>Effettua la login</Link>
      </CardFooter>
    </Card>
  )
}
