import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'

interface SearchResult {
  id: string
  title: string
  description?: string
  category: string
  href: string
  price?: string
}

interface SearchCommandProps {
  className?: string
}

// Mock search data - in a real app, this would come from an API
const mockSearchData: SearchResult[] = [
  {
    id: '1',
    title: 'Honduras Single Origin',
    description: 'Premium Arabica beans from the mountains of Honduras',
    category: 'Coffee',
    href: '/products/honduras-single-origin',
    price: '$24.99'
  },
  {
    id: '2',
    title: 'Medium Roast Blend',
    description: 'Smooth and balanced coffee blend',
    category: 'Coffee',
    href: '/products/medium-roast-blend',
    price: '$19.99'
  },
  {
    id: '3',
    title: 'Coffee Subscription',
    description: 'Monthly delivery of fresh Honduras coffee',
    category: 'Subscription',
    href: '/subscription',
    price: 'From $18/month'
  },
  {
    id: '4',
    title: 'French Press Brewing Guide',
    description: 'Learn the perfect French press technique',
    category: 'Guides',
    href: '/brewing-guides/french-press'
  },
  {
    id: '5',
    title: 'Pour Over Coffee Guide',
    description: 'Master the art of pour over brewing',
    category: 'Guides',
    href: '/brewing-guides/pour-over'
  },
  {
    id: '6',
    title: 'About Our Coffee Farm',
    description: 'Learn about our sustainable farming practices',
    category: 'About',
    href: '/about'
  }
]

export default function SearchCommand({ className }: SearchCommandProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])

  // Handle keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Filter search results based on query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    const filtered = mockSearchData.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
    )

    setSearchResults(filtered)
  }, [searchQuery])

  const handleSelect = (href: string) => {
    setIsOpen(false)
    setSearchQuery('')
    // In a real app, you'd use router.push(href) or similar
    window.location.href = href
  }

  const groupedResults = searchResults.reduce((acc, result) => {
    if (!acc[result.category]) {
      acc[result.category] = []
    }
    acc[result.category].push(result)
    return acc
  }, {} as Record<string, SearchResult[]>)

  return (
    <>
      {/* Search Trigger Button */}
      <Button
        variant="outline"
        className={`w-full max-w-sm justify-start text-sm text-muted-foreground clay-input ${className}`}
        onClick={() => setIsOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        <span className="hidden sm:inline-flex">Search coffee, guides...</span>
        <span className="sm:hidden">Search...</span>
        <kbd className="pointer-events-none ml-auto hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      {/* Search Command Dialog */}
      <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
        <CommandInput
          placeholder="Search coffee, brewing guides, subscription..."
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
        <CommandList>
          {searchQuery && searchResults.length === 0 && (
            <CommandEmpty>
              <div className="text-center py-6">
                <Search className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  No results found for &quot;{searchQuery}&quot;
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Try searching for coffee, brewing guides, or subscription
                </p>
              </div>
            </CommandEmpty>
          )}

          {!searchQuery && (
            <CommandGroup heading="Popular">
              <CommandItem onSelect={() => handleSelect('/products')}>
                <Search className="mr-2 h-4 w-4" />
                <span>Browse all coffee</span>
              </CommandItem>
              <CommandItem onSelect={() => handleSelect('/subscription')}>
                <Search className="mr-2 h-4 w-4" />
                <span>Coffee subscription</span>
              </CommandItem>
              <CommandItem onSelect={() => handleSelect('/brewing-guides')}>
                <Search className="mr-2 h-4 w-4" />
                <span>Brewing guides</span>
              </CommandItem>
            </CommandGroup>
          )}

          {Object.entries(groupedResults).map(([category, results], index) => (
            <div key={category}>
              {index > 0 && <CommandSeparator />}
              <CommandGroup heading={category}>
                {results.map((result) => (
                  <CommandItem
                    key={result.id}
                    onSelect={() => handleSelect(result.href)}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div>
                        <div className="font-medium">{result.title}</div>
                        {result.description && (
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {result.description}
                          </div>
                        )}
                      </div>
                      {result.price && (
                        <div className="text-sm font-medium text-primary">
                          {result.price}
                        </div>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </div>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  )
}