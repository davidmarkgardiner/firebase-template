import React from 'react'
import { Coffee, Droplets, Sparkles, Wind, Zap, Heart } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import type { TastingProfile } from '@/types/coffee'

interface TastingNotesProps {
  tastingProfile: TastingProfile
  className?: string
}

interface TasteMetric {
  name: string
  value: number
  icon: React.ReactNode
  description: string
}

export default function TastingNotes({ tastingProfile, className = '' }: TastingNotesProps) {
  // Define taste metrics with icons
  const metrics: TasteMetric[] = [
    {
      name: 'Aroma',
      value: tastingProfile.aroma,
      icon: <Wind className="h-4 w-4" />,
      description: tastingProfile.aromaDescription || 'Complex and inviting'
    },
    {
      name: 'Acidity',
      value: tastingProfile.acidity,
      icon: <Zap className="h-4 w-4" />,
      description: getAcidityDescription(tastingProfile.acidity)
    },
    {
      name: 'Body',
      value: tastingProfile.body,
      icon: <Coffee className="h-4 w-4" />,
      description: getBodyDescription(tastingProfile.body)
    },
    {
      name: 'Sweetness',
      value: tastingProfile.sweetness,
      icon: <Sparkles className="h-4 w-4" />,
      description: getSweetnessDescription(tastingProfile.sweetness)
    },
    {
      name: 'Aftertaste',
      value: tastingProfile.aftertaste,
      icon: <Droplets className="h-4 w-4" />,
      description: getAftertasteDescription(tastingProfile.aftertaste)
    },
    {
      name: 'Balance',
      value: tastingProfile.balance,
      icon: <Heart className="h-4 w-4" />,
      description: getBalanceDescription(tastingProfile.balance)
    }
  ]

  // Helper functions to get descriptions based on values
  function getAcidityDescription(value: number): string {
    if (value <= 3) return 'Mild and gentle'
    if (value <= 6) return 'Bright and lively'
    return 'Vibrant and crisp'
  }

  function getBodyDescription(value: number): string {
    if (value <= 3) return 'Light and delicate'
    if (value <= 6) return 'Medium and smooth'
    return 'Full and rich'
  }

  function getSweetnessDescription(value: number): string {
    if (value <= 3) return 'Subtle sweetness'
    if (value <= 6) return 'Balanced sweetness'
    return 'Rich and sweet'
  }

  function getAftertasteDescription(value: number): string {
    if (value <= 3) return 'Clean and short'
    if (value <= 6) return 'Pleasant and lingering'
    return 'Complex and lasting'
  }

  function getBalanceDescription(value: number): string {
    if (value <= 3) return 'Bold character'
    if (value <= 6) return 'Well balanced'
    return 'Perfectly harmonized'
  }

  // Create SVG radar chart
  const createRadarChart = () => {
    const size = 240
    const center = size / 2
    const radius = 80
    const angleStep = (Math.PI * 2) / metrics.length

    // Create polygon points for the chart
    const points = metrics.map((metric, i) => {
      const angle = angleStep * i - Math.PI / 2
      const value = (metric.value / 10) * radius
      const x = center + Math.cos(angle) * value
      const y = center + Math.sin(angle) * value
      return `${x},${y}`
    }).join(' ')

    // Create axis lines and labels
    const axes = metrics.map((metric, i) => {
      const angle = angleStep * i - Math.PI / 2
      const x2 = center + Math.cos(angle) * radius
      const y2 = center + Math.sin(angle) * radius
      const labelX = center + Math.cos(angle) * (radius + 25)
      const labelY = center + Math.sin(angle) * (radius + 25)

      return (
        <g key={metric.name}>
          {/* Axis line */}
          <line
            x1={center}
            y1={center}
            x2={x2}
            y2={y2}
            stroke="currentColor"
            strokeOpacity="0.1"
            strokeWidth="1"
          />
          {/* Axis label */}
          <text
            x={labelX}
            y={labelY}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xs fill-muted-foreground"
          >
            {metric.name}
          </text>
        </g>
      )
    })

    // Create background grid circles
    const gridCircles = [2, 4, 6, 8, 10].map((value) => (
      <circle
        key={value}
        cx={center}
        cy={center}
        r={(value / 10) * radius}
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.1"
        strokeWidth="1"
      />
    ))

    return (
      <svg width={size} height={size} className="w-full h-full">
        {/* Grid circles */}
        {gridCircles}
        {/* Axes */}
        {axes}
        {/* Data polygon */}
        <polygon
          points={points}
          fill="hsl(var(--primary))"
          fillOpacity="0.3"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
        />
        {/* Data points */}
        {metrics.map((metric, i) => {
          const angle = angleStep * i - Math.PI / 2
          const value = (metric.value / 10) * radius
          const x = center + Math.cos(angle) * value
          const y = center + Math.sin(angle) * value
          return (
            <circle
              key={metric.name}
              cx={x}
              cy={y}
              r="4"
              fill="hsl(var(--primary))"
              className="hover:r-6 transition-all"
            />
          )
        })}
      </svg>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Tasting Profile</CardTitle>
        <CardDescription>{tastingProfile.cupNotes}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Radar Chart for Desktop */}
        <div className="hidden md:flex justify-center">
          {createRadarChart()}
        </div>

        {/* Metrics List for All Screens */}
        <div className="space-y-4">
          {metrics.map((metric) => (
            <div key={metric.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {metric.icon}
                  <span className="text-sm font-medium">{metric.name}</span>
                </div>
                <span className="text-sm text-muted-foreground">{metric.value}/10</span>
              </div>
              <Progress value={metric.value * 10} className="h-2" />
              <p className="text-xs text-muted-foreground">{metric.description}</p>
            </div>
          ))}
        </div>

        {/* Flavor Notes */}
        <div className="space-y-3 pt-4 border-t">
          <h4 className="text-sm font-medium">Primary Notes</h4>
          <div className="flex flex-wrap gap-2">
            {tastingProfile.primaryNotes.map((note) => (
              <Badge key={note} variant="default">
                {note}
              </Badge>
            ))}
          </div>
          
          {tastingProfile.secondaryNotes.length > 0 && (
            <>
              <h4 className="text-sm font-medium mt-3">Secondary Notes</h4>
              <div className="flex flex-wrap gap-2">
                {tastingProfile.secondaryNotes.map((note) => (
                  <Badge key={note} variant="outline">
                    {note}
                  </Badge>
                ))}
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}