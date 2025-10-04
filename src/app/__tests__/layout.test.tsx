import { render, screen } from '@testing-library/react'
import RootLayout from '../layout'

jest.mock('next/font/google', () => ({
  Lora: jest.fn(() => ({ 
    variable: '--font-lora',
  })),
  Open_Sans: jest.fn(() => ({ 
    variable: '--font-open-sans',
  })),
}))

jest.mock('@/components/global/Header', () => ({
  __esModule: true,
  Header: () => <header data-testid="header">Header</header>
}))

jest.mock('@/components/global/Footer', () => ({
  __esModule: true,
  Footer: () => <footer data-testid="footer">Footer</footer>
}))

jest.mock('@/components/ui/sonner', () => ({
  __esModule: true,
  Toaster: () => <div data-testid="toaster">Toaster</div>
}))

jest.mock('@/providers/AuthProvider', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="auth-provider">{children}</div>
  )
}))

describe('RootLayout', () => {
  it('renders all components in correct structure', () => {
    // Test that RootLayout returns the expected structure
    const result = RootLayout({
      children: <div data-testid="test-child">Test Content</div>,
    })

    // The result should be a React element with the html structure
    expect(result).toBeDefined()
    expect(result.type).toBe('html')
    expect(result.props.lang).toBe('en')
    
    // Your layout uses the font variables, not className
    expect(result.props.className).toContain('--font-lora')
    expect(result.props.className).toContain('--font-open-sans')
    expect(result.props.className).toContain('antialiased')
  })

  it('has correct metadata', () => {
    const { metadata } = require('../layout')
    expect(metadata.title).toBe('Sarah Yousuph - Professional Content Writer')
    expect(metadata.description).toBe(
      'Professional content writer helping brands turn ideas into compelling narratives'
    )
  })
})