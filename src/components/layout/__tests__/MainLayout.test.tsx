import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import MainLayout from '../MainLayout'

// Mock child components
vi.mock('../Header', () => ({
  default: ({ cartItemCount }: { cartItemCount?: number }) => (
    <header data-testid="header">
      {cartItemCount && <span>Cart: {cartItemCount}</span>}
    </header>
  )
}))

vi.mock('../Footer', () => ({
  default: ({ onNewsletterSubmit }: { onNewsletterSubmit?: () => void }) => (
    <footer data-testid="footer">
      {onNewsletterSubmit && <button onClick={onNewsletterSubmit}>Subscribe</button>}
    </footer>
  )
}))

describe('MainLayout', () => {
  it('renders children content', () => {
    render(
      <MainLayout>
        <div>Test Content</div>
      </MainLayout>
    )

    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('renders header and footer by default', () => {
    render(
      <MainLayout>
        <div>Content</div>
      </MainLayout>
    )

    expect(screen.getByTestId('header')).toBeInTheDocument()
    expect(screen.getByTestId('footer')).toBeInTheDocument()
  })

  it('hides header when showHeader is false', () => {
    render(
      <MainLayout showHeader={false}>
        <div>Content</div>
      </MainLayout>
    )

    expect(screen.queryByTestId('header')).not.toBeInTheDocument()
    expect(screen.getByTestId('footer')).toBeInTheDocument()
  })

  it('hides footer when showFooter is false', () => {
    render(
      <MainLayout showFooter={false}>
        <div>Content</div>
      </MainLayout>
    )

    expect(screen.getByTestId('header')).toBeInTheDocument()
    expect(screen.queryByTestId('footer')).not.toBeInTheDocument()
  })

  it('passes header props correctly', () => {
    render(
      <MainLayout
        headerProps={{
          cartItemCount: 5
        }}
      >
        <div>Content</div>
      </MainLayout>
    )

    expect(screen.getByText('Cart: 5')).toBeInTheDocument()
  })

  it('passes footer props correctly', () => {
    const mockNewsletterSubmit = vi.fn()
    render(
      <MainLayout
        footerProps={{
          onNewsletterSubmit: mockNewsletterSubmit
        }}
      >
        <div>Content</div>
      </MainLayout>
    )

    expect(screen.getByText('Subscribe')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(
      <MainLayout className="custom-layout">
        <div>Content</div>
      </MainLayout>
    )

    expect(container.firstChild).toHaveClass('custom-layout')
  })

  it('has proper semantic structure', () => {
    render(
      <MainLayout>
        <div>Content</div>
      </MainLayout>
    )

    expect(screen.getByRole('main')).toBeInTheDocument()
  })
})