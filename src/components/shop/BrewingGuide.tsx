import React, { useState } from 'react'
import { Coffee, Thermometer, Timer, Scale, Info, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import type { BrewingGuide as BrewingGuideType } from '@/types/coffee'

interface BrewingGuideProps {
  guides: BrewingGuideType[]
  className?: string
}

export default function BrewingGuide({ guides, className = '' }: BrewingGuideProps) {
  const [selectedMethod, setSelectedMethod] = useState(guides[0]?.method || 'pour_over')
  
  const methodIcons: Record<string, React.ReactNode> = {
    'espresso': '☕',
    'pour_over': '🫖',
    'french_press': '🍵',
    'aeropress': '⚗️',
    'moka_pot': '⚙️',
    'cold_brew': '🧊'
  }

  const methodNames: Record<string, string> = {
    'espresso': 'Espresso',
    'pour_over': 'Pour Over',
    'french_press': 'French Press',
    'aeropress': 'AeroPress',
    'moka_pot': 'Moka Pot',
    'cold_brew': 'Cold Brew'
  }

  const grindSizeVisual: Record<string, string> = {
    'extra_fine': '••••••',
    'fine': '•••••',
    'medium_fine': '••••',
    'medium': '•••',
    'medium_coarse': '••',
    'coarse': '•'
  }

  const currentGuide = guides.find(g => g.method === selectedMethod)

  const formatTemperature = (temp: number) => {
    const fahrenheit = Math.round(temp * 9/5 + 32)
    return `${temp}°C / ${fahrenheit}°F`
  }

  const parseBrewTime = (time: string) => {
    // Convert time string like "2:30" or "12 hours" to readable format
    if (time.includes(':')) {
      const [minutes, seconds] = time.split(':')
      return `${minutes} min ${seconds ? seconds + ' sec' : ''}`
    }
    return time
  }

  if (guides.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Brewing Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            No brewing guides available for this coffee yet.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Brewing Guide</CardTitle>
        <CardDescription>
          Recommended brewing methods for the best experience
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedMethod} onValueChange={setSelectedMethod}>
          <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-6">
            {guides.map((guide) => (
              <TabsTrigger 
                key={guide.method} 
                value={guide.method}
                className="flex flex-col gap-1 h-auto py-2"
              >
                <span className="text-lg">{methodIcons[guide.method]}</span>
                <span className="text-xs">{methodNames[guide.method]}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {currentGuide && (
            <TabsContent value={currentGuide.method} className="space-y-6">
              {/* Brewing Parameters */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Coffee className="h-4 w-4" />
                    <span className="text-xs">Grind Size</span>
                  </div>
                  <p className="text-sm font-medium capitalize">
                    {currentGuide.grindSize.replace('_', ' ')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {grindSizeVisual[currentGuide.grindSize]}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Scale className="h-4 w-4" />
                    <span className="text-xs">Coffee:Water</span>
                  </div>
                  <p className="text-sm font-medium">{currentGuide.ratio}</p>
                  <p className="text-xs text-muted-foreground">
                    {currentGuide.ratio === '1:15' ? '16g : 240ml' : 
                     currentGuide.ratio === '1:2' ? '18g : 36ml' :
                     currentGuide.ratio === '1:12' ? '20g : 240ml' : 
                     'See notes'}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Thermometer className="h-4 w-4" />
                    <span className="text-xs">Water Temp</span>
                  </div>
                  <p className="text-sm font-medium">
                    {formatTemperature(currentGuide.waterTemp)}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Timer className="h-4 w-4" />
                    <span className="text-xs">Brew Time</span>
                  </div>
                  <p className="text-sm font-medium">
                    {parseBrewTime(currentGuide.brewTime)}
                  </p>
                </div>
              </div>

              {/* Brewing Steps */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Brewing Steps</h4>
                <div className="space-y-2">
                  {getBrewingSteps(currentGuide.method).map((step, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </div>
                      <p className="text-sm text-muted-foreground">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Special Notes */}
              {currentGuide.notes && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    {currentGuide.notes}
                  </AlertDescription>
                </Alert>
              )}

              {/* Equipment Recommendations */}
              {currentGuide.equipmentRecommendations.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Recommended Equipment</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {currentGuide.equipmentRecommendations.map((equipment) => (
                      <div key={equipment} className="flex items-center justify-between p-3 rounded-lg border">
                        <span className="text-sm">{equipment}</span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full">
                    Shop Brewing Equipment
                  </Button>
                </div>
              )}

              {/* Pro Tips */}
              <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <span className="text-lg">💡</span> Pro Tips
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {getProTips(currentGuide.method).map((tip, index) => (
                    <li key={index} className="flex gap-2">
                      <span>•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  )

  function getBrewingSteps(method: string): string[] {
    const steps: Record<string, string[]> = {
      'espresso': [
        'Grind 18-20g of coffee to a fine consistency',
        'Distribute grounds evenly in the portafilter',
        'Tamp with consistent pressure (about 30 lbs)',
        'Lock portafilter and start extraction immediately',
        'Extract 36-40g in 25-30 seconds',
        'Serve immediately and enjoy'
      ],
      'pour_over': [
        'Heat water to specified temperature',
        'Rinse filter paper with hot water',
        'Add ground coffee and create a well in the center',
        'Start with 30-50g bloom pour, wait 30 seconds',
        'Continue pouring in circular motions',
        'Finish brewing within specified time'
      ],
      'french_press': [
        'Add coarse ground coffee to French press',
        'Pour hot water over grounds, filling to top',
        'Stir gently to ensure all grounds are wet',
        'Place lid and wait for 4 minutes',
        'Press plunger down slowly and steadily',
        'Serve immediately to prevent over-extraction'
      ],
      'aeropress': [
        'Insert paper filter and rinse with hot water',
        'Add coffee grounds to chamber',
        'Pour water and stir for 10 seconds',
        'Insert plunger and wait for specified time',
        'Press down slowly for 20-30 seconds',
        'Dilute with hot water if desired'
      ],
      'moka_pot': [
        'Fill bottom chamber with hot water up to valve',
        'Fill basket with coffee, level but don\'t tamp',
        'Assemble and place on medium heat',
        'Listen for gurgling sound indicating brewing',
        'Remove from heat when coffee stops flowing',
        'Serve immediately'
      ],
      'cold_brew': [
        'Combine coarse ground coffee with cold water',
        'Stir well to saturate all grounds',
        'Cover and refrigerate for 12-24 hours',
        'Filter through fine mesh or paper filter',
        'Dilute concentrate with water or milk (1:1)',
        'Serve over ice'
      ]
    }
    return steps[method] || []
  }

  function getProTips(method: string): string[] {
    const tips: Record<string, string[]> = {
      'espresso': [
        'Use freshly roasted beans (1-4 weeks old)',
        'Maintain consistent dose and tamp pressure',
        'Clean equipment regularly for best results'
      ],
      'pour_over': [
        'Use a gooseneck kettle for better pour control',
        'Keep water temperature consistent throughout',
        'Aim for even saturation during bloom phase'
      ],
      'french_press': [
        'Don\'t leave coffee in press after brewing',
        'Use slightly cooler water than other methods',
        'A coarser grind prevents over-extraction'
      ],
      'aeropress': [
        'Experiment with inverted method for full immersion',
        'Paper filters can be rinsed and reused',
        'Try different recipes for varied results'
      ],
      'moka_pot': [
        'Pre-heat water to reduce bitter flavors',
        'Keep heat medium-low to prevent burning',
        'Clean thoroughly between uses'
      ],
      'cold_brew': [
        'Use a 1:8 ratio for concentrate',
        'Filtered water improves final taste',
        'Concentrate keeps for up to 2 weeks refrigerated'
      ]
    }
    return tips[method] || []
  }
}