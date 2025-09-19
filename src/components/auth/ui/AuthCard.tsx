import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface AuthCardProps {
  children: React.ReactNode
  className?: string
  title?: string
  description?: string
}

export default function AuthCard({ children, className, title, description }: AuthCardProps) {
  return (
    <Card className={cn('w-full max-w-md mx-auto claymorphism-card', className)}>
      {(title || description) && (
        <CardHeader className="space-y-1">
          {title && <CardTitle className="text-2xl font-bold text-center">{title}</CardTitle>}
          {description && <CardDescription className="text-center">{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>{children}</CardContent>
    </Card>
  )
}