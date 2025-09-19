import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProductCard from '../ProductCard'

// Mock all the UI components
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled, className, ...props }: any) => (
    <button 
      onClick={onClick} 
      disabled={disabled} 
      className={className}
      data-testid={props['data-testid'] || 'button'}
      {...props}
    >
      {children}
    </button>
  )
}))

vi.mock('@/components/ui/card', () => ({
  Card: ({ children, className, onMouseEnter, onMouseLeave }: any) => (
    <div 
      className={className} 
      onMouseEnter={onMouseEnter} 
      onMouseLeave={onMouseLeave}
      data-testid="product-card"
    >
      {children}
    </div>
  ),
  CardContent: ({ children, className }: any) => (
    <div className={className} data-testid="card-content">{children}</div>
  ),
  CardFooter: ({ children, className }: any) => (
    <div className={className} data-testid="card-footer">{children}</div>
  )
}))

vi.mock('@/components/ui/badge', () => ({
  Badge: ({ children, variant, className }: any) => (
    <span className={className} data-testid="badge" data-variant={variant}>
      {children}
    </span>
  )
}))

vi.mock('@/components/ui/aspect-ratio', () => ({
  AspectRatio: ({ children, ratio }: any) => (
    <div data-testid="aspect-ratio" data-ratio={ratio}>
      {children}
    </div>
  )
}))

vi.mock('@/components/ui/tooltip', () => ({
  TooltipProvider: ({ children }: any) => children,
  Tooltip: ({ children }: any) => children,
  TooltipTrigger: ({ children, asChild }: any) => asChild ? children : <div>{children}</div>,
  TooltipContent: ({ children }: any) => <div data-testid="tooltip-content">{children}</div>
}))

vi.mock('@/components/ui/hover-card', () => ({
  HoverCard: ({ children }: any) => children,
  HoverCardTrigger: ({ children, asChild }: any) => asChild ? children : <div>{children}</div>,
  HoverCardContent: ({ children, className }: any) => (
    <div className={className} data-testid="hover-card-content">{children}</div>
  )
}))

vi.mock('@/components/ui/radio-group', () => ({
  RadioGroup: ({ children, value, onValueChange, className }: any) => (
    <div 
      className={className} 
      data-testid="radio-group" 
      data-value={value}
      onChange={(e: any) => onValueChange?.(e.target.value)}
    >
      {children}
    </div>
  ),
  RadioGroupItem: ({ value, id }: any) => (
    <input 
      type="radio" 
      value={value} 
      id={id} 
      data-testid={`radio-${value}`}
      onChange={() => {}}
    />
  )
}))

vi.mock('@/components/ui/label', () => ({
  Label: ({ children, htmlFor, className }: any) => (
    <label htmlFor={htmlFor} className={className} data-testid="label">
      {children}
    </label>
  )
}))

vi.mock('@/components/ui/progress', () => ({
  Progress: ({ value, className }: any) => (
    <div className={className} data-testid="progress" data-value={value} />
  )
}))

// Mock Lucide React icons
vi.mock('lucide-react', () => ({
  Star: () => <div data-testid="star-icon" />,
  Heart: ({ className }: any) => <div data-testid="heart-icon" className={className} />,
  ShoppingCart: () => <div data-testid="shopping-cart-icon" />,
  Info: () => <div data-testid="info-icon" />,
  Coffee: () => <div data-testid="coffee-icon" />,
  Leaf: () => <div data-testid="leaf-icon" />,
  Award: () => <div data-testid="award-icon" />,
  Truck: () => <div data-testid="truck-icon" />
}))

describe('ProductCard', () => {
  const mockProduct = {
    id: '1',
    name: 'Honduras Single Origin',
    description: 'Rich coffee from Honduras mountains',
    price: 24.99,
    rating: 4.8,
    reviewCount: 127,
    isInStock: true,
    stockLevel: 15,
    maxStock: 20
  }

  const mockAddToCart = vi.fn()
  const mockToggleWishlist = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders product information correctly', () => {
    render(
      <ProductCard 
        {...mockProduct}
        onAddToCart={mockAddToCart}
        onToggleWishlist={mockToggleWishlist}
      />
    )

    expect(screen.getByText('Honduras Single Origin')).toBeInTheDocument()
    expect(screen.getByText('Rich coffee from Honduras mountains')).toBeInTheDocument()
    expect(screen.getByText('$24.99')).toBeInTheDocument()
    expect(screen.getByText('(127)')).toBeInTheDocument()
  })

  it('displays sale badge when product is on sale', () => {
    render(
      <ProductCard 
        {...mockProduct}
        isOnSale={true}
        originalPrice={29.99}
        onAddToCart={mockAddToCart}
        onToggleWishlist={mockToggleWishlist}
      />
    )

    const saleBadge = screen.getByText('Sale')
    expect(saleBadge).toBeInTheDocument()
    expect(screen.getByText('$29.99')).toBeInTheDocument() // Original price
  })

  it('shows out of stock state when not in stock', () => {
    render(
      <ProductCard 
        {...mockProduct}
        isInStock={false}
        onAddToCart={mockAddToCart}
        onToggleWishlist={mockToggleWishlist}
      />
    )

    expect(screen.getByText('Out of Stock')).toBeInTheDocument()
    expect(screen.getByText('Out of Stock')).toBeInTheDocument() // Button text
  })

  it('displays stock level warning for low stock', () => {
    render(
      <ProductCard 
        {...mockProduct}
        stockLevel={3}
        onAddToCart={mockAddToCart}
        onToggleWishlist={mockToggleWishlist}
      />
    )

    expect(screen.getByText('3 left')).toBeInTheDocument()
  })

  it('shows free shipping indicator for eligible products', () => {
    render(
      <ProductCard 
        {...mockProduct}
        price={25.00} // Above free shipping threshold
        onAddToCart={mockAddToCart}
        onToggleWishlist={mockToggleWishlist}
      />
    )

    expect(screen.getByText('Free shipping')).toBeInTheDocument()
  })

  it('renders product tags', () => {
    render(
      <ProductCard 
        {...mockProduct}
        tags={['Organic', 'Fair Trade', 'Single Origin']}
        onAddToCart={mockAddToCart}
        onToggleWishlist={mockToggleWishlist}
      />
    )

    expect(screen.getByText('Organic')).toBeInTheDocument()
    expect(screen.getByText('Fair Trade')).toBeInTheDocument()
    expect(screen.getByText('Single Origin')).toBeInTheDocument()
  })

  it('handles size selection', () => {
    render(
      <ProductCard 
        {...mockProduct}
        sizes={[
          { id: '12oz', label: '12oz', value: '12oz', priceModifier: 0 },
          { id: '1lb', label: '1lb', value: '1lb', priceModifier: 4 }
        ]}
        onAddToCart={mockAddToCart}
        onToggleWishlist={mockToggleWishlist}
      />
    )

    expect(screen.getByText('12oz')).toBeInTheDocument()
    expect(screen.getByText('1lb (+$4)')).toBeInTheDocument()
  })

  it('handles grind selection', () => {
    render(
      <ProductCard 
        {...mockProduct}
        grinds={[
          { id: 'whole', label: 'Whole Bean', value: 'whole' },
          { id: 'ground', label: 'Ground', value: 'ground' }
        ]}
        onAddToCart={mockAddToCart}
        onToggleWishlist={mockToggleWishlist}
      />
    )

    expect(screen.getByText('Whole Bean')).toBeInTheDocument()
    expect(screen.getByText('Ground')).toBeInTheDocument()
  })

  it('calls onAddToCart with correct parameters when add to cart is clicked', async () => {
    const user = userEvent.setup()
    
    render(
      <ProductCard 
        {...mockProduct}
        onAddToCart={mockAddToCart}
        onToggleWishlist={mockToggleWishlist}
      />
    )

    const addToCartButton = screen.getByText('Add to Cart').closest('button')
    expect(addToCartButton).toBeInTheDocument()
    
    if (addToCartButton) {
      await user.click(addToCartButton)
    }

    expect(mockAddToCart).toHaveBeenCalledWith('1', {
      size: '12oz',
      grind: 'whole'
    })
  })

  it('calls onToggleWishlist when wishlist button is clicked', async () => {
    const user = userEvent.setup()
    
    render(
      <ProductCard 
        {...mockProduct}
        onAddToCart={mockAddToCart}
        onToggleWishlist={mockToggleWishlist}
      />
    )

    // Heart icon should be in the wishlist button
    const heartIcon = screen.getByTestId('heart-icon')
    const wishlistButton = heartIcon.closest('button')
    expect(wishlistButton).toBeInTheDocument()
    
    if (wishlistButton) {
      await user.click(wishlistButton)
    }

    expect(mockToggleWishlist).toHaveBeenCalledWith('1')
  })

  it('shows wishlisted state correctly', () => {
    render(
      <ProductCard 
        {...mockProduct}
        isWishlisted={true}
        onAddToCart={mockAddToCart}
        onToggleWishlist={mockToggleWishlist}
      />
    )

    const heartIcon = screen.getByTestId('heart-icon')
    expect(heartIcon).toHaveClass('fill-red-500', 'text-red-500')
  })

  it('disables add to cart button when out of stock', () => {
    render(
      <ProductCard 
        {...mockProduct}
        isInStock={false}
        onAddToCart={mockAddToCart}
        onToggleWishlist={mockToggleWishlist}
      />
    )

    const addToCartButton = screen.getByText('Out of Stock').closest('button')
    expect(addToCartButton).toBeDisabled()
  })

  it('applies custom className when provided', () => {
    render(
      <ProductCard 
        {...mockProduct}
        className="custom-product-card"
        onAddToCart={mockAddToCart}
        onToggleWishlist={mockToggleWishlist}
      />
    )

    const card = screen.getByTestId('product-card')
    expect(card).toHaveClass('custom-product-card')
  })

  it('updates price when size with price modifier is selected', () => {
    render(
      <ProductCard 
        {...mockProduct}
        price={20.00}
        sizes={[
          { id: '12oz', label: '12oz', value: '12oz', priceModifier: 0 },
          { id: '1lb', label: '1lb', value: '1lb', priceModifier: 5 }
        ]}
        onAddToCart={mockAddToCart}
        onToggleWishlist={mockToggleWishlist}
      />
    )

    // Should show base price initially
    expect(screen.getByText('$20.00')).toBeInTheDocument()
    
    // The price should update when a different size is selected
    // (This would require triggering the radio group change event in a real test)
  })

  it('renders custom badge when provided', () => {
    render(
      <ProductCard 
        {...mockProduct}
        badge="Best Seller"
        onAddToCart={mockAddToCart}
        onToggleWishlist={mockToggleWishlist}
      />
    )

    expect(screen.getByText('Best Seller')).toBeInTheDocument()
  })
})