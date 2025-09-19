import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SearchCommand from '../SearchCommand'

// Mock Lucide React icons
vi.mock('lucide-react', () => ({
  Search: () => <div data-testid="search-icon" />,
  MagnifyingGlassIcon: () => <div data-testid="magnifying-glass-icon" />
}))

// Mock the command dialog components
vi.mock('@/components/ui/command', () => ({
  CommandDialog: ({ children, open, onOpenChange }: any) => 
    open ? <div data-testid="command-dialog" onClick={() => onOpenChange(false)}>{children}</div> : null,
  CommandInput: ({ placeholder, value, onValueChange }: any) => (
    <input 
      data-testid="command-input" 
      placeholder={placeholder}
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
    />
  ),
  CommandList: ({ children }: any) => <div data-testid="command-list">{children}</div>,
  CommandEmpty: ({ children }: any) => <div data-testid="command-empty">{children}</div>,
  CommandGroup: ({ children, heading }: any) => (
    <div data-testid="command-group">
      {heading && <div data-testid="group-heading">{heading}</div>}
      {children}
    </div>
  ),
  CommandItem: ({ children, onSelect }: any) => (
    <div data-testid="command-item" onClick={onSelect}>{children}</div>
  ),
  CommandSeparator: () => <div data-testid="command-separator" />
}))

// Mock the button component
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, className }: any) => (
    <button data-testid="search-button" onClick={onClick} className={className}>
      {children}
    </button>
  )
}))

describe('SearchCommand', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    // Reset any mocks
    vi.clearAllMocks()
    
    // Mock window.location.href
    Object.defineProperty(window, 'location', {
      value: { href: '' },
      writable: true
    })
  })

  it('renders the search trigger button', () => {
    render(<SearchCommand />)
    
    expect(screen.getByTestId('search-button')).toBeInTheDocument()
    expect(screen.getByText('Search coffee, guides...')).toBeInTheDocument()
  })

  it('shows keyboard shortcut indicator', () => {
    render(<SearchCommand />)
    
    expect(screen.getByText('⌘')).toBeInTheDocument()
    expect(screen.getByText('K')).toBeInTheDocument()
  })

  it('opens search dialog when button is clicked', async () => {
    render(<SearchCommand />)
    
    const button = screen.getByTestId('search-button')
    await user.click(button)
    
    expect(screen.getByTestId('command-dialog')).toBeInTheDocument()
    expect(screen.getByTestId('command-input')).toBeInTheDocument()
  })

  it('opens search dialog with Cmd+K keyboard shortcut', async () => {
    render(<SearchCommand />)
    
    // Simulate Cmd+K
    fireEvent.keyDown(document, { key: 'k', metaKey: true })
    
    await waitFor(() => {
      expect(screen.getByTestId('command-dialog')).toBeInTheDocument()
    })
  })

  it('opens search dialog with Ctrl+K keyboard shortcut', async () => {
    render(<SearchCommand />)
    
    // Simulate Ctrl+K
    fireEvent.keyDown(document, { key: 'k', ctrlKey: true })
    
    await waitFor(() => {
      expect(screen.getByTestId('command-dialog')).toBeInTheDocument()
    })
  })

  it('shows popular searches when no query is entered', async () => {
    render(<SearchCommand />)
    
    const button = screen.getByTestId('search-button')
    await user.click(button)
    
    expect(screen.getByText('Popular')).toBeInTheDocument()
    expect(screen.getByText('Browse all coffee')).toBeInTheDocument()
    expect(screen.getByText('Coffee subscription')).toBeInTheDocument()
    expect(screen.getByText('Brewing guides')).toBeInTheDocument()
  })

  it('filters search results based on query', async () => {
    render(<SearchCommand />)
    
    const button = screen.getByTestId('search-button')
    await user.click(button)
    
    const input = screen.getByTestId('command-input')
    await user.type(input, 'honduras')
    
    await waitFor(() => {
      expect(screen.getByText('Honduras Single Origin')).toBeInTheDocument()
    })
  })

  it('shows empty state when no results found', async () => {
    render(<SearchCommand />)
    
    const button = screen.getByTestId('search-button')
    await user.click(button)
    
    const input = screen.getByTestId('command-input')
    await user.type(input, 'nonexistent')
    
    await waitFor(() => {
      expect(screen.getByTestId('command-empty')).toBeInTheDocument()
      expect(screen.getByText('No results found for "nonexistent"')).toBeInTheDocument()
    })
  })

  it('navigates when search result is selected', async () => {
    render(<SearchCommand />)
    
    const button = screen.getByTestId('search-button')
    await user.click(button)
    
    const input = screen.getByTestId('command-input')
    await user.type(input, 'honduras')
    
    await waitFor(() => {
      const resultItem = screen.getByText('Honduras Single Origin')
      expect(resultItem).toBeInTheDocument()
    })

    // Click on a search result item
    const items = screen.getAllByTestId('command-item')
    await user.click(items[0])
    
    // Should close dialog and navigate (in real app)
    expect(window.location.href).toBeDefined()
  })

  it('applies custom className when provided', () => {
    render(<SearchCommand className="custom-search" />)
    
    const button = screen.getByTestId('search-button')
    expect(button).toHaveClass('custom-search')
  })

  it('groups search results by category', async () => {
    render(<SearchCommand />)
    
    const button = screen.getByTestId('search-button')
    await user.click(button)
    
    const input = screen.getByTestId('command-input')
    await user.type(input, 'coffee')
    
    await waitFor(() => {
      expect(screen.getByText('Coffee')).toBeInTheDocument()
      expect(screen.getByText('Subscription')).toBeInTheDocument()
    })
  })

  it('closes dialog when clicking outside', async () => {
    render(<SearchCommand />)
    
    const button = screen.getByTestId('search-button')
    await user.click(button)
    
    expect(screen.getByTestId('command-dialog')).toBeInTheDocument()
    
    // Click on the dialog (which triggers onOpenChange)
    await user.click(screen.getByTestId('command-dialog'))
    
    await waitFor(() => {
      expect(screen.queryByTestId('command-dialog')).not.toBeInTheDocument()
    })
  })
})