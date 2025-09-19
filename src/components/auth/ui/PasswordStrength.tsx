import React from 'react'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Eye, EyeOff, Shield, ShieldCheck, ShieldAlert, ShieldX, CheckCircle, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PasswordStrengthProps {
  password: string
  className?: string
  showRequirements?: boolean
}

export function PasswordStrength({ password, className, showRequirements = true }: PasswordStrengthProps) {
  const calculateStrength = (password: string): { strength: number; label: string; color: string } => {
    if (!password) {
      return { strength: 0, label: 'Very Weak', color: 'bg-red-500' }
    }

    let strength = 0
    const requirements = []

    if (password.length >= 8) {
      strength += 25
      requirements.push({ met: true, text: 'At least 8 characters' })
    } else {
      requirements.push({ met: false, text: 'At least 8 characters' })
    }

    if (/[A-Z]/.test(password)) {
      strength += 25
      requirements.push({ met: true, text: 'One uppercase letter' })
    } else {
      requirements.push({ met: false, text: 'One uppercase letter' })
    }

    if (/[a-z]/.test(password)) {
      strength += 25
      requirements.push({ met: true, text: 'One lowercase letter' })
    } else {
      requirements.push({ met: false, text: 'One lowercase letter' })
    }

    if (/[0-9]/.test(password)) {
      strength += 12.5
      requirements.push({ met: true, text: 'One number' })
    } else {
      requirements.push({ met: false, text: 'One number' })
    }

    if (/[^A-Za-z0-9]/.test(password)) {
      strength += 12.5
      requirements.push({ met: true, text: 'One special character' })
    } else {
      requirements.push({ met: false, text: 'One special character' })
    }

    let label = 'Very Weak'
    let color = 'bg-red-500'

    if (strength >= 100) {
      label = 'Very Strong'
      color = 'bg-green-500'
    } else if (strength >= 75) {
      label = 'Strong'
      color = 'bg-green-400'
    } else if (strength >= 50) {
      label = 'Medium'
      color = 'bg-yellow-500'
    } else if (strength >= 25) {
      label = 'Weak'
      color = 'bg-orange-500'
    }

    return { strength, label, color }
  }

  const { strength, label, color } = calculateStrength(password)

  const getStrengthIcon = () => {
    if (strength >= 100) return <ShieldCheck className="h-4 w-4 text-green-600" />
    if (strength >= 50) return <Shield className="h-4 w-4 text-yellow-600" />
    if (strength > 0) return <ShieldAlert className="h-4 w-4 text-orange-600" />
    return <ShieldX className="h-4 w-4 text-red-600" />
  }

  const getStrengthBadgeColor = () => {
    if (strength >= 100) return 'bg-green-100 text-green-800'
    if (strength >= 75) return 'bg-green-50 text-green-700'
    if (strength >= 50) return 'bg-yellow-100 text-yellow-800'
    if (strength >= 25) return 'bg-orange-100 text-orange-800'
    return 'bg-red-100 text-red-800'
  }

  const requirements = password ? [
    { met: password.length >= 8, text: 'At least 8 characters' },
    { met: /[A-Z]/.test(password), text: 'One uppercase letter' },
    { met: /[a-z]/.test(password), text: 'One lowercase letter' },
    { met: /[0-9]/.test(password), text: 'One number' },
    { met: /[^A-Za-z0-9]/.test(password), text: 'One special character' }
  ] : []

  return (
    <div className={cn('space-y-2', className)}>
      {password && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStrengthIcon()}
              <span className="text-sm font-medium">Password Strength</span>
            </div>
            <Badge variant="outline" className={getStrengthBadgeColor()}>
              {label}
            </Badge>
          </div>
          <Progress value={strength} className="h-2" />
        </div>
      )}

      {showRequirements && password && (
        <div className="space-y-1">
          <span className="text-xs text-muted-foreground">Password requirements:</span>
          <ul className="space-y-1">
            {requirements.map((req, index) => (
              <li key={index} className="flex items-center gap-2 text-xs">
                {req.met ? (
                  <CheckCircle className="h-3 w-3 text-green-600" />
                ) : (
                  <XCircle className="h-3 w-3 text-muted-foreground" />
                )}
                <span className={req.met ? 'text-green-600' : 'text-muted-foreground'}>
                  {req.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}