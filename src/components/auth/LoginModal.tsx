import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import LoginForm from './LoginForm'
import { User, LogIn } from 'lucide-react'

interface LoginModalProps {
  trigger?: React.ReactNode
  onLoginSuccess?: () => void
  onSwitchToSignup?: () => void
}

export default function LoginModal({
  trigger,
  onLoginSuccess,
  onSwitchToSignup
}: LoginModalProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (values: { email: string; password: string; rememberMe: boolean }) => {
    setIsLoading(true)
    setError(null)

    try {
      // TODO: Implement actual login logic with Supabase
      console.log('Login attempt:', values)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Close modal on success
      setOpen(false)
      onLoginSuccess?.()
    } catch (err) {
      setError('Invalid email or password. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSwitchToSignup = () => {
    setOpen(false)
    onSwitchToSignup?.()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm">
            <LogIn className="mr-2 h-4 w-4" />
            Sign In
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Sign In to Your Account
          </DialogTitle>
        </DialogHeader>
        <LoginForm
          onSubmit={handleLogin}
          isLoading={isLoading}
          error={error || undefined}
        />
      </DialogContent>
    </Dialog>
  )
}