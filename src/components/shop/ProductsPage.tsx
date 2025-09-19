import * as React from "react"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Grid, Filter, SortAsc } from "lucide-react"

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

interface ProductsPageProps {
  initialProducts?: Product[]
  initialCategory?: string
  initialSort?: string
  initialPage?: number
}

export default function ProductsPage({
  initialProducts = [],
  initialCategory = 'all',
  initialSort = 'name',
  initialPage = 1
}: ProductsPageProps) {
  const [products, setProducts] = React.useState<Product[]>(initialProducts)
  const [category, setCategory] = React.useState(initialCategory)
  const [sortBy, setSortBy] = React.useState(initialSort)
  const [currentPage, setCurrentPage] = React.useState(initialPage)
  const [isLoading, setIsLoading] = React.useState(initialProducts.length === 0)

  React.useEffect(() => {
    // Simulate loading products from API
    if (initialProducts.length === 0) {
      setTimeout(() => {
        setProducts([
          {
            id: '1',
            name: 'Montaña Estate Reserve',
            description: 'Rich, full-bodied coffee with notes of dark chocolate and caramel',
            price: 24.99,
            category: 'estate',
            image_url: '/images/products/montana-estate.jpg',
            roast_level: 'medium',
            origin: 'Copán Valley',
            in_stock: true,
            featured: true
          },
          {
            id: '2',
            name: 'Highland Sunrise',
            description: 'Bright, citrusy coffee with floral undertones',
            price: 22.99,
            category: 'mountain',
            image_url: '/images/products/highland-sunrise.jpg',
            roast_level: 'light',
            origin: 'Santa Bárbara Mountains',
            in_stock: true,
            featured: false
          },
          {
            id: '3',
            name: 'Harvest Moon Blend',
            description: 'Limited seasonal blend with honey and spice notes',
            price: 26.99,
            category: 'seasonal',
            image_url: '/images/products/harvest-moon.jpg',
            roast_level: 'dark',
            origin: 'Multiple Regions',
            in_stock: false,
            featured: true
          }
        ])
        setIsLoading(false)
      }, 1000)
    }
  }, [initialProducts.length])

  const filteredProducts = React.useMemo(() => {
    let filtered = products

    if (category !== 'all') {
      filtered = filtered.filter(product => product.category === category)
    }

    // Sort products
    filtered.sort((a, b) => {
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

    return filtered
  }, [products, category, sortBy])

  const totalPages = Math.ceil(filteredProducts.length / 9)
  const startIndex = (currentPage - 1) * 9
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + 9)

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
              <BreadcrumbPage>Products</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Category Hero */}
      <div className="container mx-auto px-4 pb-8">
        <div className="text-center max-w-3xl mx-auto">
          <Badge variant="secondary" className="mb-4">
            Premium Coffee Collection
          </Badge>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Our Coffee Products
          </h1>
          <p className="text-muted-foreground text-lg">
            Discover our carefully curated selection of premium Honduran coffees,
            sourced directly from local farms and roasted to perfection.
          </p>
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="container mx-auto px-4 pb-8">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={category === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCategory('all')}
            >
              All Products
            </Button>
            <Button
              variant={category === 'estate' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCategory('estate')}
            >
              Estate
            </Button>
            <Button
              variant={category === 'mountain' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCategory('mountain')}
            >
              Mountain
            </Button>
            <Button
              variant={category === 'seasonal' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCategory('seasonal')}
            >
              Seasonal
            </Button>
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
        ) : filteredProducts.length === 0 ? (
          <EmptyState category={category} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && filteredProducts.length > 9 && (
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
            <span className="text-muted-foreground text-sm font-medium">
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
        <CardDescription className="text-sm text-muted-foreground mb-3">
          {product.description}
        </CardDescription>
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <span>Origin: {product.origin}</span>
          <span className="capitalize">{product.category}</span>
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
              <Skeleton className="h-4 w-16" />
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
          {category === 'all'
            ? "We're currently updating our product catalog. Please check back soon."
            : `No products available in the ${category} category at the moment.`
          }
        </p>
        <Button
          variant="outline"
          onClick={() => window.location.href = '/'}
        >
          Browse All Categories
        </Button>
      </div>
    </div>
  )
}