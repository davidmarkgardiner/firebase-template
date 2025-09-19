import React, { useState, useEffect } from 'react'
import { Coffee, Package, Minus, Plus } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { ProductVariant, VariantSelection } from '@/types/coffee'

interface VariantSelectorProps {
  variants: ProductVariant[]
  onSelectionChange: (selection: VariantSelection, variant: ProductVariant | undefined) => void
  maxQuantity?: number
}

export default function VariantSelector({ 
  variants, 
  onSelectionChange,
  maxQuantity = 10 
}: VariantSelectorProps) {
  const [selection, setSelection] = useState<VariantSelection>({
    format: 'whole_bean',
    weight: 250,
    quantity: 1
  })

  // Get unique values for each option
  const formats = Array.from(new Set(variants.map(v => v.format)))
  const weights = Array.from(new Set(variants.map(v => v.weight))).sort((a, b) => a - b)
  const grindTypes = Array.from(new Set(
    variants.filter(v => v.format === 'ground' && v.grindType).map(v => v.grindType!)
  ))

  // Find current variant based on selection
  const currentVariant = variants.find(v => 
    v.format === selection.format &&
    v.weight === selection.weight &&
    (selection.format === 'whole_bean' || v.grindType === selection.grindType)
  )

  // Check availability for each weight option
  const getWeightAvailability = (weight: number) => {
    return variants.some(v => 
      v.format === selection.format && 
      v.weight === weight && 
      v.inventory > 0
    )
  }

  // Update parent component when selection changes
  useEffect(() => {
    onSelectionChange(selection, currentVariant)
  }, [selection, currentVariant])

  const handleFormatChange = (format: 'whole_bean' | 'ground') => {
    setSelection(prev => ({
      ...prev,
      format,
      grindType: format === 'ground' ? 'filter' : undefined
    }))
  }

  const handleWeightChange = (weight: string) => {
    setSelection(prev => ({
      ...prev,
      weight: parseInt(weight) as 250 | 500 | 1000
    }))
  }

  const handleGrindChange = (grindType: string) => {
    setSelection(prev => ({
      ...prev,
      grindType: grindType as VariantSelection['grindType']
    }))
  }

  const handleQuantityChange = (delta: number) => {
    setSelection(prev => ({
      ...prev,
      quantity: Math.max(1, Math.min(maxQuantity, prev.quantity + delta))
    }))
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price / 100)
  }

  const getGrindLabel = (grind: string) => {
    const labels: Record<string, string> = {
      'espresso': 'Espresso (Fine)',
      'filter': 'Filter/Pour Over (Medium)',
      'french_press': 'French Press (Coarse)',
      'moka_pot': 'Moka Pot (Medium-Fine)',
      'cold_brew': 'Cold Brew (Extra Coarse)'
    }
    return labels[grind] || grind
  }

  return (
    <div className="space-y-6">
      {/* Format Selection */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Format</Label>
        <RadioGroup 
          value={selection.format} 
          onValueChange={handleFormatChange}
          className="grid grid-cols-2 gap-3"
        >
          <div>
            <RadioGroupItem 
              value="whole_bean" 
              id="whole_bean" 
              className="peer sr-only" 
            />
            <Label
              htmlFor="whole_bean"
              className={cn(
                "flex items-center justify-center gap-2 rounded-lg border-2 p-4 cursor-pointer transition-all",
                "hover:bg-muted/50",
                "peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
              )}
            >
              <Coffee className="h-5 w-5" />
              <span>Whole Bean</span>
            </Label>
          </div>
          <div>
            <RadioGroupItem 
              value="ground" 
              id="ground" 
              className="peer sr-only" 
            />
            <Label
              htmlFor="ground"
              className={cn(
                "flex items-center justify-center gap-2 rounded-lg border-2 p-4 cursor-pointer transition-all",
                "hover:bg-muted/50",
                "peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
              )}
            >
              <Package className="h-5 w-5" />
              <span>Ground</span>
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Grind Type Selection (only for ground coffee) */}
      {selection.format === 'ground' && grindTypes.length > 0 && (
        <div className="space-y-3">
          <Label htmlFor="grind-type" className="text-base font-medium">
            Grind Type
          </Label>
          <Select value={selection.grindType} onValueChange={handleGrindChange}>
            <SelectTrigger id="grind-type">
              <SelectValue placeholder="Select grind type" />
            </SelectTrigger>
            <SelectContent>
              {grindTypes.map((grind) => (
                <SelectItem key={grind} value={grind}>
                  {getGrindLabel(grind)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Size Selection */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Size</Label>
        <RadioGroup 
          value={selection.weight.toString()} 
          onValueChange={handleWeightChange}
          className="grid grid-cols-3 gap-3"
        >
          {weights.map((weight) => {
            const variant = variants.find(v => 
              v.format === selection.format && 
              v.weight === weight &&
              (selection.format === 'whole_bean' || v.grindType === selection.grindType)
            )
            const isAvailable = getWeightAvailability(weight)
            
            return (
              <div key={weight}>
                <RadioGroupItem 
                  value={weight.toString()} 
                  id={`weight-${weight}`}
                  className="peer sr-only"
                  disabled={!isAvailable}
                />
                <Label
                  htmlFor={`weight-${weight}`}
                  className={cn(
                    "relative flex flex-col items-center justify-center rounded-lg border-2 p-4 cursor-pointer transition-all",
                    isAvailable 
                      ? "hover:bg-muted/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                      : "opacity-50 cursor-not-allowed"
                  )}
                >
                  <span className="font-semibold">{weight}g</span>
                  {variant && (
                    <span className="text-sm text-muted-foreground">
                      {formatPrice(variant.price)}
                    </span>
                  )}
                  {!isAvailable && (
                    <span className="absolute top-1 right-1 text-xs text-destructive">
                      Out of stock
                    </span>
                  )}
                </Label>
              </div>
            )
          })}
        </RadioGroup>
      </div>

      {/* Quantity Selector */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Quantity</Label>
        <div className="flex items-center gap-4">
          <div className="flex items-center rounded-lg border">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleQuantityChange(-1)}
              disabled={selection.quantity <= 1}
              className="h-10 w-10 rounded-r-none"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <div className="flex h-10 w-16 items-center justify-center border-x">
              <span className="font-medium">{selection.quantity}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleQuantityChange(1)}
              disabled={selection.quantity >= maxQuantity || !currentVariant || selection.quantity >= currentVariant.inventory}
              className="h-10 w-10 rounded-l-none"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {currentVariant && currentVariant.inventory < 10 && currentVariant.inventory > 0 && (
            <span className="text-sm text-amber-600">
              Only {currentVariant.inventory} left in stock
            </span>
          )}
        </div>
      </div>

      {/* Price Display */}
      {currentVariant && (
        <div className="rounded-lg bg-muted/50 p-4">
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-muted-foreground">Total Price:</span>
            <span className="text-2xl font-bold">
              {formatPrice(currentVariant.price * selection.quantity)}
            </span>
          </div>
          {selection.quantity > 1 && (
            <div className="mt-1 text-right text-sm text-muted-foreground">
              {formatPrice(currentVariant.price)} each
            </div>
          )}
        </div>
      )}
    </div>
  )
}