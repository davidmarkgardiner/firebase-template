import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Loader2, Lock, Mail, Shield, CheckCircle } from 'lucide-react'

const requestResetSchema = z.object({
  email: z.string().email('Please enter a valid email address')
})

type RequestResetValues = z.infer<typeof requestResetSchema>

const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>

interface PasswordResetProps {
  onRequestReset: (email: string) => Promise<void>
  onResetPassword: (token: string, password: string) => Promise<void>
  isLoading?: boolean
  error?: string
  success?: string
  resetToken?: string
}

export default function PasswordReset({
  onRequestReset,
  onResetPassword,
  isLoading = false,
  error,
  success,
  resetToken
}: PasswordResetProps) {
  const [step, setStep] = useState<'request' | 'reset' | 'success'>('request')
  const [email, setEmail] = useState('')

  const requestForm = useForm<RequestResetValues>({
    resolver: zodResolver(requestResetSchema),
    defaultValues: {
      email: ''
    }
  })

  const resetForm = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  })

  const handleRequestSubmit = async (values: RequestResetValues) => {
    try {
      await onRequestReset(values.email)
      setEmail(values.email)
      setStep('success')
    } catch (err) {
      // Error is handled via props
    }
  }

  const handleResetSubmit = async (values: ResetPasswordValues) => {
    if (resetToken) {
      try {
        await onResetPassword(resetToken, values.password)
        setStep('success')
      } catch (err) {
        // Error is handled via props
      }
    }
  }

  const calculatePasswordStrength = (password: string): number => {
    let strength = 0
    if (password.length >= 8) strength += 25
    if (/[A-Z]/.test(password)) strength += 25
    if (/[a-z]/.test(password)) strength += 25
    if (/[0-9]/.test(password)) strength += 12.5
    if (/[^A-Za-z0-9]/.test(password)) strength += 12.5
    return strength
  }

  const getStrengthColor = (strength: number): string => {
    if (strength <= 25) return 'bg-red-500'
    if (strength <= 50) return 'bg-orange-500'
    if (strength <= 75) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getStrengthLabel = (strength: number): string => {
    if (strength <= 25) return 'Weak'
    if (strength <= 50) return 'Fair'
    if (strength <= 75) return 'Good'
    return 'Strong'
  }

  if (resetToken && step === 'request') {
    setStep('reset')
  }

  return (
    <Card className="w-full max-w-md mx-auto claymorphism-card">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
          <Lock className="h-6 w-6" />
          {step === 'request' ? 'Reset Password' : step === 'reset' ? 'Create New Password' : 'Success!'}
        </CardTitle>
        <CardDescription className="text-center">
          {step === 'request' && 'Enter your email to receive a password reset link'}
          {step === 'reset' && 'Create a new secure password for your account'}
          {step === 'success' && 'Your password has been successfully reset'}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-4 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        {step === 'request' && (
          <Form {...requestForm}>
            <form onSubmit={requestForm.handleSubmit(handleRequestSubmit)} className="space-y-4">
              <FormField
                control={requestForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email"
                        type="email"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Reset Link...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </Button>
            </form>
          </Form>
        )}

        {step === 'reset' && (
          <Form {...resetForm}>
            <form onSubmit={resetForm.handleSubmit(handleResetSubmit)} className="space-y-4">
              <FormField
                control={resetForm.control}
                name="password"
                render={({ field }) => {
                  const strength = calculatePasswordStrength(field.value)
                  return (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Create a new password"
                          type="password"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      {field.value && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Password Strength</span>
                            <Badge variant="outline" className={getStrengthColor(strength).replace('bg-', 'text-')}>
                              {getStrengthLabel(strength)}
                            </Badge>
                          </div>
                          <Progress value={strength} className="h-2" />
                          <div className="text-xs text-muted-foreground">
                            Must contain: 8+ characters, uppercase, lowercase, number, and special character
                          </div>
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />

              <FormField
                control={resetForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Confirm your new password"
                        type="password"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resetting Password...
                  </>
                ) : (
                  'Reset Password'
                )}
              </Button>
            </form>
          </Form>
        )}

        {step === 'success' && (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
              <p className="text-sm text-muted-foreground">
                {resetToken
                  ? 'Your password has been successfully updated. You can now sign in with your new password.'
                  : `A password reset link has been sent to ${email}. Please check your email and follow the instructions.`}
              </p>
            </div>

            {!resetToken && (
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  The reset link will expire in 15 minutes for security reasons.
                </AlertDescription>
              </Alert>
            )}

            <Button onClick={() => window.location.href = '/auth/login'} className="w-full">
              Return to Login
            </Button>
          </div>
        )}

        <Separator className="my-4" />

        <div className="text-center text-sm">
          Remember your password?{' '}
          <Button variant="link" className="p-0 h-auto" onClick={() => window.location.href = '/auth/login'}>
            Sign In
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}