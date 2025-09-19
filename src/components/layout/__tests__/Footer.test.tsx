import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Footer from '../Footer'

// Mock Lucide React icons
vi.mock('lucide-react', () => ({
  FacebookIcon: () => <div data-testid="facebook-icon" />,
  InstagramIcon: () => <div data-testid="instagram-icon" />,
  TwitterIcon: () => <div data-testid="twitter-icon" />,
  MailIcon: () => <div data-testid="mail-icon" />,
  PhoneIcon: () => <div data-testid="phone-icon" />,
  MapPinIcon: () => <div data-testid="map-pin-icon" />,
  CoffeeIcon: () => <div data-testid="coffee-icon" />
}))

describe('Footer', () => {
  it('renders company information', () => {
    render(<Footer />)

    expect(screen.getByText('Honduras Coffee')).toBeInTheDocument()
    expect(screen.getByText(/Premium specialty coffee sourced directly/)).toBeInTheDocument()
    expect(screen.getByText('Amsterdam, Netherlands')).toBeInTheDocument()
  })

  it('renders newsletter signup section', () => {
    render(<Footer />)

    expect(screen.getByText('Stay Connected')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /subscribe/i })).toBeInTheDocument()
  })

  it('calls onNewsletterSubmit when form is submitted', () => {
    const mockSubmit = vi.fn()
    render(<Footer onNewsletterSubmit={mockSubmit} />)

    const emailInput = screen.getByPlaceholderText('Enter your email')
    const submitButton = screen.getByRole('button', { name: /subscribe/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(submitButton)

    expect(mockSubmit).toHaveBeenCalledWith('test@example.com')
  })

  it('renders all footer section links', () => {
    render(<Footer />)

    // Check for main sections
    expect(screen.getByText('Coffee')).toBeInTheDocument()
    expect(screen.getByText('Learn')).toBeInTheDocument()
    expect(screen.getByText('Support')).toBeInTheDocument()
    expect(screen.getByText('Account')).toBeInTheDocument()

    // Check for some key links
    expect(screen.getByText('All Coffee')).toBeInTheDocument()
    expect(screen.getByText('Our Story')).toBeInTheDocument()
    expect(screen.getByText('Contact Us')).toBeInTheDocument()
    expect(screen.getByText('Sign In')).toBeInTheDocument()
  })

  it('renders social media links', () => {
    render(<Footer />)

    expect(screen.getByLabelText('Follow us on Facebook')).toBeInTheDocument()
    expect(screen.getByLabelText('Follow us on Instagram')).toBeInTheDocument()
    expect(screen.getByLabelText('Follow us on Twitter')).toBeInTheDocument()
  })

  it('renders legal links in bottom section', () => {
    render(<Footer />)

    expect(screen.getByText('Privacy Policy')).toBeInTheDocument()
    expect(screen.getByText('Terms of Service')).toBeInTheDocument()
    expect(screen.getByText('Cookie Policy')).toBeInTheDocument()
    expect(screen.getByText('GDPR')).toBeInTheDocument()
  })

  it('renders copyright information', () => {
    render(<Footer />)

    expect(screen.getByText('© 2024 Honduras Coffee. All rights reserved.')).toBeInTheDocument()
  })

  it('applies custom className when provided', () => {
    const { container } = render(<Footer className="custom-footer" />)

    expect(container.firstChild).toHaveClass('custom-footer')
  })
})