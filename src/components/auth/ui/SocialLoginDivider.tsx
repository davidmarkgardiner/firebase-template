import React from 'react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Chrome, Github } from 'lucide-react'

interface SocialLoginDividerProps {
  onGoogleLogin?: () => void
  onFacebookLogin?: () => void
  onGithubLogin?: () => void
  className?: string
}

export function SocialLoginDivider({
  onGoogleLogin,
  onFacebookLogin,
  onGithubLogin,
  className
}: SocialLoginDividerProps) {
  return (
    <div className={className}>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {onGoogleLogin && (
          <Button
            variant="outline"
            className="w-full"
            onClick={onGoogleLogin}
          >
            <Chrome className="h-4 w-4" />
            <span className="sr-only">Google</span>
          </Button>
        )}

        {onFacebookLogin && (
          <Button
            variant="outline"
            className="w-full"
            onClick={onFacebookLogin}
          >
            <div className="h-4 w-4 bg-blue-600 rounded" />
            <span className="sr-only">Facebook</span>
          </Button>
        )}

        {onGithubLogin && (
          <Button
            variant="outline"
            className="w-full"
            onClick={onGithubLogin}
          >
            <Github className="h-4 w-4" />
            <span className="sr-only">GitHub</span>
          </Button>
        )}
      </div>

      <div className="mt-4 text-center text-xs text-muted-foreground">
        By continuing, you agree to our{' '}
        <a href="/terms" className="underline hover:text-foreground">
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="/privacy" className="underline hover:text-foreground">
          Privacy Policy
        </a>
      </div>
    </div>
  )
}