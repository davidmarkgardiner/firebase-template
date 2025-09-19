import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ChevronDownIcon, XIcon, FilterIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ProductFilters {
  origins?: string[]
  roastLevels?: string[]
  grindTypes?: string[]
  priceRange?: [number, number]
  inStock?: boolean
  category?: string
  sortBy?: string
}

interface ProductFiltersProps {
  filters: ProductFilters
  onFiltersChange: (filters: ProductFilters) => void
  className?: string
  resultsCount?: number
}

const ORIGINS = [
  'Copán Mountains',
  'Santa Bárbara',
  'Montecillos',
  'Opalaca',
  'Comayagua Valley',
  'El Paraíso'
]

const ROAST_LEVELS = [
  { value: 'light', label: 'Light Roast', description: 'Bright and acidic' },
  { value: 'medium', label: 'Medium Roast', description: 'Balanced flavor' },
  { value: 'medium-dark', label: 'Medium-Dark', description: 'Rich and full' },
  { value: 'dark', label: 'Dark Roast', description: 'Bold and smoky' }
]

const GRIND_TYPES = [
  { value: 'whole-bean', label: 'Whole Bean' },
  { value: 'espresso', label: 'Espresso (Fine)' },
  { value: 'drip', label: 'Drip/Pour Over (Medium)' },
  { value: 'french-press', label: 'French Press (Coarse)' },
  { value: 'moka-pot', label: 'Moka Pot (Medium-Fine)' }
]

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'name', label: 'Alphabetical' },
  { value: 'newest', label: 'Newest First' },
  { value: 'rating', label: 'Customer Rating' }
]

export default function ProductFilters({
  filters,
  onFiltersChange,
  className,
  resultsCount = 0
}: ProductFiltersProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleOriginChange = (origin: string, checked: boolean) => {
    const currentOrigins = filters.origins || []
    const newOrigins = checked
      ? [...currentOrigins, origin]
      : currentOrigins.filter(o => o !== origin)
    
    onFiltersChange({ ...filters, origins: newOrigins })
  }

  const handleRoastLevelChange = (roastLevel: string, checked: boolean) => {
    const currentLevels = filters.roastLevels || []
    const newLevels = checked
      ? [...currentLevels, roastLevel]
      : currentLevels.filter(r => r !== roastLevel)
    
    onFiltersChange({ ...filters, roastLevels: newLevels })
  }

  const handleGrindTypeChange = (grindType: string, checked: boolean) => {
    const currentTypes = filters.grindTypes || []
    const newTypes = checked
      ? [...currentTypes, grindType]
      : currentTypes.filter(g => g !== grindType)
    
    onFiltersChange({ ...filters, grindTypes: newTypes })
  }

  const handlePriceRangeChange = (value: number[]) => {
    onFiltersChange({ ...filters, priceRange: [value[0], value[1]] })
  }

  const handleSortChange = (sortBy: string) => {
    onFiltersChange({ ...filters, sortBy })
  }

  const clearAllFilters = () => {
    onFiltersChange({})
  }

  const getActiveFilterCount = () => {
    let count = 0
    if (filters.origins?.length) count += filters.origins.length
    if (filters.roastLevels?.length) count += filters.roastLevels.length
    if (filters.grindTypes?.length) count += filters.grindTypes.length
    if (filters.priceRange) count += 1
    if (filters.inStock) count += 1
    return count
  }

  const activeFilterCount = getActiveFilterCount()

  return (
    <Card className={cn("clay-card", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FilterIcon className="h-5 w-5" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="h-5 text-xs">
                {activeFilterCount}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {activeFilterCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearAllFilters}
                className="text-xs"
              >
                Clear all
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="lg:hidden"
            >
              <ChevronDownIcon 
                className={cn("h-4 w-4 transition-transform", isCollapsed && "rotate-180")} 
              />
            </Button>
          </div>
        </div>
        {resultsCount > 0 && (
          <p className="text-sm text-muted-foreground">
            {resultsCount} product{resultsCount !== 1 ? 's' : ''} found
          </p>
        )}
      </CardHeader>

      <Collapsible open={!isCollapsed} onOpenChange={(open) => setIsCollapsed(!open)}>
        <CollapsibleContent>
          <CardContent className="space-y-6">
            {/* Sort By */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Sort By</Label>
              <RadioGroup
                value={filters.sortBy || 'featured'}
                onValueChange={handleSortChange}
                className="space-y-2"
              >
                {SORT_OPTIONS.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={`sort-${option.value}`} />
                    <Label 
                      htmlFor={`sort-${option.value}`} 
                      className="text-sm font-normal cursor-pointer"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <Separator />

            {/* In Stock Only */}
            <div className="flex items-center justify-between">
              <Label htmlFor="in-stock" className="text-sm font-medium">
                In Stock Only
              </Label>
              <Checkbox
                id="in-stock"
                checked={filters.inStock || false}
                onCheckedChange={(checked) => 
                  onFiltersChange({ ...filters, inStock: checked as boolean })
                }
              />
            </div>

            <Separator />

            {/* Price Range */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                Price Range: €{filters.priceRange?.[0] || 12} - €{filters.priceRange?.[1] || 45}
              </Label>
              <Slider
                value={filters.priceRange || [12, 45]}
                onValueChange={handlePriceRangeChange}
                max={60}
                min={10}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>€10</span>
                <span>€60</span>
              </div>
            </div>

            <Separator />

            {/* Origin Farms */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Origin Farms</Label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {ORIGINS.map((origin) => (
                  <div key={origin} className="flex items-center space-x-2">
                    <Checkbox
                      id={`origin-${origin}`}
                      checked={filters.origins?.includes(origin) || false}
                      onCheckedChange={(checked) => 
                        handleOriginChange(origin, checked as boolean)
                      }
                    />
                    <Label 
                      htmlFor={`origin-${origin}`} 
                      className="text-sm font-normal cursor-pointer"
                    >
                      {origin}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Roast Level */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Roast Level</Label>
              <div className="space-y-2">
                {ROAST_LEVELS.map((roast) => (
                  <div key={roast.value} className="flex items-start space-x-2">
                    <Checkbox
                      id={`roast-${roast.value}`}
                      checked={filters.roastLevels?.includes(roast.value) || false}
                      onCheckedChange={(checked) => 
                        handleRoastLevelChange(roast.value, checked as boolean)
                      }
                      className="mt-0.5"
                    />
                    <div className="space-y-1">
                      <Label 
                        htmlFor={`roast-${roast.value}`} 
                        className="text-sm font-normal cursor-pointer"
                      >
                        {roast.label}
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {roast.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Grind Type */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Grind Type</Label>
              <div className="space-y-2">
                {GRIND_TYPES.map((grind) => (
                  <div key={grind.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`grind-${grind.value}`}
                      checked={filters.grindTypes?.includes(grind.value) || false}
                      onCheckedChange={(checked) => 
                        handleGrindTypeChange(grind.value, checked as boolean)
                      }
                    />
                    <Label 
                      htmlFor={`grind-${grind.value}`} 
                      className="text-sm font-normal cursor-pointer"
                    >
                      {grind.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Filters Summary */}
            {activeFilterCount > 0 && (
              <>
                <Separator />
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Active Filters</Label>
                  <div className="flex flex-wrap gap-2">
                    {filters.origins?.map((origin) => (
                      <Badge 
                        key={origin} 
                        variant="outline" 
                        className="text-xs"
                      >
                        {origin}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-1 h-3 w-3 p-0 hover:bg-transparent"
                          onClick={() => handleOriginChange(origin, false)}
                        >
                          <XIcon className="h-2 w-2" />
                        </Button>
                      </Badge>
                    ))}
                    {filters.roastLevels?.map((roast) => (
                      <Badge 
                        key={roast} 
                        variant="outline" 
                        className="text-xs"
                      >
                        {ROAST_LEVELS.find(r => r.value === roast)?.label}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-1 h-3 w-3 p-0 hover:bg-transparent"
                          onClick={() => handleRoastLevelChange(roast, false)}
                        >
                          <XIcon className="h-2 w-2" />
                        </Button>
                      </Badge>
                    ))}
                    {filters.grindTypes?.map((grind) => (
                      <Badge 
                        key={grind} 
                        variant="outline" 
                        className="text-xs"
                      >
                        {GRIND_TYPES.find(g => g.value === grind)?.label}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-1 h-3 w-3 p-0 hover:bg-transparent"
                          onClick={() => handleGrindTypeChange(grind, false)}
                        >
                          <XIcon className="h-2 w-2" />
                        </Button>
                      </Badge>
                    ))}
                    {filters.priceRange && (
                      <Badge variant="outline" className="text-xs">
                        €{filters.priceRange[0]} - €{filters.priceRange[1]}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-1 h-3 w-3 p-0 hover:bg-transparent"
                          onClick={() => onFiltersChange({ ...filters, priceRange: undefined })}
                        >
                          <XIcon className="h-2 w-2" />
                        </Button>
                      </Badge>
                    )}
                    {filters.inStock && (
                      <Badge variant="outline" className="text-xs">
                        In Stock
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-1 h-3 w-3 p-0 hover:bg-transparent"
                          onClick={() => onFiltersChange({ ...filters, inStock: false })}
                        >
                          <XIcon className="h-2 w-2" />
                        </Button>
                      </Badge>
                    )}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}