import * as React from "react"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Grid, SortAsc, ArrowLeft } from "lucide-react"

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: 'estate' | 'mountain' | 'seasonal'
  image_url: string
  roast_level: 'light' | 'medium' | 'dark'
  origin: string
  in_stock: boolean
  featured: boolean
}

interface CategoryPageProps {
  category: 'estate' | 'mountain' | 'seasonal'
  categoryTitle: string
  categoryDescription: string
  categoryBadge: string
  initialProducts?: Product[]
  initialSort?: string
  initialPage?: number
}

const MOCK_PRODUCTS: Record<string, Product[]> = {
  estate: [
    {
      id: 'est-1',
      name: 'Montaña Estate Reserve',
      description: 'Rich, full-bodied coffee with notes of dark chocolate and caramel from our flagship estate',
      price: 24.99,
      category: 'estate',
      image_url: '/images/products/montana-estate.jpg',
      roast_level: 'medium',
      origin: 'Copán Valley Estate',
      in_stock: true,
      featured: true
    },
    {
      id: 'est-2',
      name: 'Finca La Aurora',
      description: 'Single-origin estate coffee with bright acidity and fruity undertones',
      price: 26.99,
      category: 'estate',
      image_url: '/images/products/finca-aurora.jpg',
      roast_level: 'light',
      origin: 'La Aurora Estate',
      in_stock: true,
      featured: false
    },
    {
      id: 'est-3',
      name: 'Hacienda San Carlos',
      description: 'Traditional estate blend with balanced sweetness and subtle spice notes',
      price: 23.99,
      category: 'estate',
      image_url: '/images/products/hacienda-san-carlos.jpg',
      roast_level: 'dark',
      origin: 'San Carlos Estate',
      in_stock: false,
      featured: true
    }
  ],
  mountain: [
    {
      id: 'mtn-1',
      name: 'Highland Sunrise',
      description: 'Bright, citrusy coffee with floral undertones from high-altitude farms',
      price: 22.99,
      category: 'mountain',
      image_url: '/images/products/highland-sunrise.jpg',
      roast_level: 'light',
      origin: 'Santa Bárbara Mountains',
      in_stock: true,
      featured: false
    },
    {
      id: 'mtn-2',
      name: 'Pico Bonito Reserve',
      description: 'Complex mountain coffee with notes of berry and stone fruit',
      price: 25.99,
      category: 'mountain',
      image_url: '/images/products/pico-bonito.jpg',
      roast_level: 'medium',
      origin: 'Pico Bonito National Park',
      in_stock: true,
      featured: true
    }
  ],
  seasonal: [
    {
      id: 'sea-1',
      name: 'Harvest Moon Blend',
      description: 'Limited seasonal blend with honey and spice notes celebrating the autumn harvest',
      price: 26.99,
      category: 'seasonal',
      image_url: '/images/products/harvest-moon.jpg',
      roast_level: 'dark',
      origin: 'Multiple Regions',
      in_stock: false,
      featured: true
    },
    {
      id: 'sea-2',
      name: 'Spring Awakening',
      description: 'Fresh spring blend with bright, clean flavors and floral notes',
      price: 24.99,
      category: 'seasonal',
      image_url: '/images/products/spring-awakening.jpg',
      roast_level: 'light',
      origin: 'Multiple Regions',
      in_stock: true,
      featured: false
    }
  ]
}

export default function CategoryPage({
  category,
  categoryTitle,
  categoryDescription,
  categoryBadge,
  initialProducts = [],
  initialSort = 'name',
  initialPage = 1
}: CategoryPageProps) {
  const [products, setProducts] = React.useState<Product[]>(initialProducts)
  const [sortBy, setSortBy] = React.useState(initialSort)
  const [currentPage, setCurrentPage] = React.useState(initialPage)
  const [isLoading, setIsLoading] = React.useState(initialProducts.length === 0)

  React.useEffect(() => {
    // Simulate loading products from API
    if (initialProducts.length === 0) {
      setTimeout(() => {
        setProducts(MOCK_PRODUCTS[category] || [])
        setIsLoading(false)
      }, 800)
    }
  }, [category, initialProducts.length])

  const sortedProducts = React.useMemo(() => {
    let sorted = [...products]

    // Sort products
    sorted.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'name':
        default:
          return a.name.localeCompare(b.name)
      }
    })

    return sorted
  }, [products, sortBy])

  const totalPages = Math.ceil(sortedProducts.length / 6)
  const startIndex = (currentPage - 1) * 6
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + 6)

  const categoryInfo = {
    estate: {
      breadcrumb: 'Estate',
      bgColor: 'from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20'
    },
    mountain: {
      breadcrumb: 'Mountain',
      bgColor: 'from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20'
    },
    seasonal: {
      breadcrumb: 'Seasonal',
      bgColor: 'from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb Navigation */}
      <div className="container mx-auto px-4 py-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/products">Products</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{categoryInfo[category].breadcrumb}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Back to Products */}
      <div className="container mx-auto px-4 pb-6">
        <Button variant="ghost" size="sm" asChild>
          <a href="/products" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to All Products
          </a>
        </Button>
      </div>

      {/* Category Hero */}
      <div className={`py-16 bg-gradient-to-br ${categoryInfo[category].bgColor}`}>
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="secondary" className="mb-4">
              {categoryBadge}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              {categoryTitle}
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {categoryDescription}
            </p>
          </div>
        </div>
      </div>

      {/* Sort Controls */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {isLoading ? 'Loading...' : `${sortedProducts.length} product${sortedProducts.length === 1 ? '' : 's'} found`}
          </div>

          <div className="flex items-center gap-2">
            <SortAsc className="h-4 w-4 text-muted-foreground" />
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="container mx-auto px-4 pb-16">
        {isLoading ? (
          <ProductGridSkeleton />
        ) : sortedProducts.length === 0 ? (
          <EmptyState category={category} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && sortedProducts.length > 6 && (
          <div className="mt-12">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (currentPage > 1) setCurrentPage(currentPage - 1)
                    }}
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      isActive={page === currentPage}
                      onClick={(e) => {
                        e.preventDefault()
                        setCurrentPage(page)
                      }}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (currentPage < totalPages) setCurrentPage(currentPage + 1)
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  )
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="clay-card group hover:scale-[1.02] transition-all duration-300">
      <CardHeader className="p-0">
        <div className="aspect-square bg-muted rounded-t-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <span className="text-muted-foreground text-sm font-medium text-center px-4">
              {product.name}
            </span>
          </div>
          {product.featured && (
            <Badge className="absolute top-3 left-3" variant="secondary">
              Featured
            </Badge>
          )}
          {!product.in_stock && (
            <Badge className="absolute top-3 right-3" variant="destructive">
              Out of Stock
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-2">
          <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
            {product.name}
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {product.roast_level}
          </Badge>
        </div>
        <CardDescription className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {product.description}
        </CardDescription>
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <span>Origin: {product.origin}</span>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0 flex items-center justify-between">
        <span className="text-2xl font-bold text-primary">
          ${product.price}
        </span>
        <Button
          disabled={!product.in_stock}
          className="clay-button"
        >
          {product.in_stock ? 'Add to Cart' : 'Notify Me'}
        </Button>
      </CardFooter>
    </Card>
  )
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }, (_, i) => (
        <Card key={i} className="clay-card">
          <CardHeader className="p-0">
            <Skeleton className="aspect-square rounded-t-xl" />
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-5 w-16" />
            </div>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-3" />
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-4 w-24" />
            </div>
          </CardContent>
          <CardFooter className="p-6 pt-0 flex items-center justify-between">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-10 w-24" />
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

function EmptyState({ category }: { category: string }) {
  return (
    <div className="text-center py-16">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <Grid className="h-16 w-16 mx-auto text-muted-foreground/50" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          No products found
        </h3>
        <p className="text-muted-foreground mb-6">
          No products available in the {category} category at the moment. Please check back soon for new arrivals.
        </p>
        <Button
          variant="outline"
          onClick={() => window.location.href = '/products'}
        >
          Browse All Products
        </Button>
      </div>
    </div>
  )
}