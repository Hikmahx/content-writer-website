import { render, screen } from '@testing-library/react'
import HomePage from '../page'

jest.mock('@/components/home/Hero', () => ({
  Hero: () => <div data-testid='hero'>Hero Component</div>,
}))

jest.mock('@/components/home/About', () => ({
  About: () => <div data-testid='about'>About Component</div>,
}))

jest.mock('@/components/home/Portfolio', () => ({
  Portfolio: () => <div data-testid='portfolio'>Portfolio Component</div>,
}))

jest.mock('@/components/home/Services', () => ({
  Services: () => <div data-testid='services'>Services Component</div>,
}))

jest.mock('@/components/home/CTA', () => ({
  CTA: () => <div data-testid='cta'>CTA Component</div>,
}))

describe('HomePage', () => {
  it('renders all child components', () => {
    render(<HomePage />)

    expect(screen.getByTestId('hero')).toBeInTheDocument()
    expect(screen.getByTestId('about')).toBeInTheDocument()
    expect(screen.getByTestId('portfolio')).toBeInTheDocument()
    expect(screen.getByTestId('services')).toBeInTheDocument()
    expect(screen.getByTestId('cta')).toBeInTheDocument()
  })
})
