import React, { useState } from 'react'
import { MapPin, Mountain, Calendar, Award, ChevronLeft, ChevronRight, Users, Droplets } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { CoffeeProduct, FarmInfo } from '@/types/coffee'

interface OriginStoryProps {
  product: CoffeeProduct
  farmInfo: FarmInfo
  className?: string
}

export default function OriginStory({ product, farmInfo, className = '' }: OriginStoryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const handlePreviousImage = () => {
    setSelectedImageIndex((prev) => 
      prev === 0 ? farmInfo.images.length - 1 : prev - 1
    )
  }

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => 
      prev === farmInfo.images.length - 1 ? 0 : prev + 1
    )
  }

  const getHarvestMonths = () => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ]
    return farmInfo.harvestMonths.map(month => monthNames[month - 1]).join(', ')
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Origin Story</CardTitle>
        <CardDescription>
          From {farmInfo.name} in {product.origin.region}, {product.origin.country}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="story" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="story">Story</TabsTrigger>
            <TabsTrigger value="details">Farm Details</TabsTrigger>
            <TabsTrigger value="location">Location</TabsTrigger>
          </TabsList>

          <TabsContent value="story" className="space-y-4">
            {/* Farm Image Gallery */}
            {farmInfo.images.length > 0 && (
              <div className="relative aspect-video overflow-hidden rounded-lg">
                <img
                  src={farmInfo.images[selectedImageIndex]}
                  alt={`${farmInfo.name} - Image ${selectedImageIndex + 1}`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                
                {farmInfo.images.length > 1 && (
                  <>
                    <button
                      onClick={handlePreviousImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
                      aria-label="Next image"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                    
                    {/* Image indicators */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
                      {farmInfo.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImageIndex(index)}
                          className={`h-2 w-2 rounded-full transition-all ${
                            index === selectedImageIndex 
                              ? 'bg-white w-8' 
                              : 'bg-white/50 hover:bg-white/75'
                          }`}
                          aria-label={`Go to image ${index + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Farm Story */}
            <div className="prose prose-sm max-w-none">
              <p className="text-muted-foreground whitespace-pre-wrap">
                {farmInfo.story}
              </p>
            </div>

            {/* Farmer Info */}
            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Farmer</p>
                <p className="text-sm text-muted-foreground">{farmInfo.farmer}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            {/* Farm Statistics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mountain className="h-4 w-4" />
                  <span className="text-sm">Elevation</span>
                </div>
                <p className="font-medium">{farmInfo.elevation}m above sea level</p>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">Size</span>
                </div>
                <p className="font-medium">{farmInfo.size} hectares</p>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">Established</span>
                </div>
                <p className="font-medium">{farmInfo.established}</p>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Droplets className="h-4 w-4" />
                  <span className="text-sm">Process</span>
                </div>
                <p className="font-medium capitalize">{product.origin.process}</p>
              </div>
            </div>

            {/* Processing Methods */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <Droplets className="h-4 w-4" />
                Processing Methods
              </h4>
              <div className="flex flex-wrap gap-2">
                {farmInfo.processingMethods.map((method) => (
                  <Badge key={method} variant="outline">
                    {method}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Varietals */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Coffee Varietals</h4>
              <div className="flex flex-wrap gap-2">
                {product.origin.varietal.map((varietal) => (
                  <Badge key={varietal} variant="secondary">
                    {varietal}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Certifications */}
            {farmInfo.certifications.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Certifications
                </h4>
                <div className="flex flex-wrap gap-2">
                  {farmInfo.certifications.map((cert) => (
                    <Badge key={cert} variant="default">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Harvest Information */}
            <div className="p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <h4 className="text-sm font-medium">Harvest Season</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                {getHarvestMonths()}
              </p>
            </div>
          </TabsContent>

          <TabsContent value="location" className="space-y-4">
            {/* Map Container */}
            <div className="aspect-video rounded-lg bg-muted/50 overflow-hidden">
              {/* In a real implementation, this would be an interactive map */}
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center space-y-2">
                  <MapPin className="h-12 w-12 mx-auto text-muted-foreground" />
                  <div>
                    <p className="font-medium">{farmInfo.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {product.origin.region}, {product.origin.country}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {farmInfo.location.latitude}°N, {Math.abs(farmInfo.location.longitude)}°W
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Location Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Country</p>
                <p className="font-medium">{product.origin.country}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Region</p>
                <p className="font-medium">{product.origin.region}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Farm</p>
                <p className="font-medium">{product.origin.farm}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Altitude</p>
                <p className="font-medium">{product.origin.altitude}m</p>
              </div>
            </div>

            {farmInfo.location.address && (
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground mb-1">Address</p>
                <p className="text-sm">{farmInfo.location.address}</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}