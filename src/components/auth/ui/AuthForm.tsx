import React from 'react'
import { useForm, UseFormReturn } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AuthFormProps<T extends Record<string, any>> {
  form: UseFormReturn<T>
  onSubmit: (data: T) => Promise<void>
  children: React.ReactNode
  submitText?: string
  isLoading?: boolean
  error?: string
  className?: string
}

export function AuthForm<T extends Record<string, any>>({
  form,
  onSubmit,
  children,
  submitText = 'Submit',
  isLoading = false,
  error,
  className
}: AuthFormProps<T>) {
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className={cn('space-y-4', className)}>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {children}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {submitText}...
          </>
        ) : (
          submitText
        )}
      </Button>
    </form>
  )
}