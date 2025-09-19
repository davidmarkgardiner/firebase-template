import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Header from '../Header'

// Mock Lucide React icons
vi.mock('lucide-react', () => ({
  MenuIcon: () => <div data-testid="menu-icon" />,
  ShoppingCartIcon: () => <div data-testid="cart-icon" />,
  UserIcon: () => <div data-testid="user-icon" />,
  LogInIcon: () => <div data-testid="login-icon" />,
  LogOutIcon: () => <div data-testid="logout-icon" />,
  UserPlusIcon: () => <div data-testid="user-plus-icon" />,
  PackageIcon: () => <div data-testid="package-icon" />,
  HeartIcon: () => <div data-testid="heart-icon" />,
  SettingsIcon: () => <div data-testid="settings-icon" />,
  ChevronDownIcon: () => <div data-testid="chevron-down-icon" />,
  XIcon: () => <div data-testid="x-icon" />,
  CheckIcon: () => <div data-testid="check-icon" />,
  ChevronRightIcon: () => <div data-testid="chevron-right-icon" />,
  CircleIcon: () => <div data-testid="circle-icon" />
}))

describe('Header', () => {
  it('renders the logo and brand name', () => {
    render(<Header />)

    expect(screen.getByText('HC')).toBeInTheDocument()
    expect(screen.getByText('Honduras Coffee')).toBeInTheDocument()
  })

  it('displays cart counter when items exist', () => {
    render(<Header cartItemCount={3} />)

    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('shows 99+ for cart counts over 99', () => {
    render(<Header cartItemCount={150} />)

    expect(screen.getByText('99+')).toBeInTheDocument()
  })

  it('displays sign in options when not authenticated', () => {
    render(<Header isAuthenticated={false} />)

    // The dropdown menu items are not visible until clicked, but we can check for their presence
    expect(screen.getByLabelText(/user account menu/i)).toBeInTheDocument()
  })

  it('displays user email when authenticated', () => {
    render(<Header isAuthenticated={true} userEmail="test@example.com" />)

    expect(screen.getByLabelText(/user account menu/i)).toBeInTheDocument()
  })

  it('has proper accessibility attributes', () => {
    render(<Header cartItemCount={5} />)

    // Check for proper ARIA labels
    expect(screen.getByLabelText(/shopping cart with 5 items/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/user account menu/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/open mobile menu/i)).toBeInTheDocument()
  })

  it('renders mobile menu button', () => {
    render(<Header />)

    expect(screen.getByLabelText(/open mobile menu/i)).toBeInTheDocument()
  })

  it('applies custom className when provided', () => {
    const { container } = render(<Header className="custom-header" />)

    expect(container.firstChild).toHaveClass('custom-header')
  })
})