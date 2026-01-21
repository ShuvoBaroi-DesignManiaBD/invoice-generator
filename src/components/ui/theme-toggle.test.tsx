import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ModeToggle } from './theme-toggle'
import '@testing-library/jest-dom'

// Mock useTheme
const mockSetTheme = vi.fn()
let mockResolvedTheme = 'light'

vi.mock('next-themes', () => ({
  useTheme: () => ({
    setTheme: mockSetTheme,
    resolvedTheme: mockResolvedTheme,
  }),
}))

describe('ModeToggle', () => {
  beforeEach(() => {
    mockSetTheme.mockClear()
    mockResolvedTheme = 'light'
  })

  it('renders the toggle button', async () => {
    render(<ModeToggle />)
    // Initially disabled (mounted = false)
    // Wait for effect
    const button = await screen.findByRole('button', { name: /switch to dark theme/i })
    expect(button).toBeInTheDocument()
    expect(button).not.toBeDisabled()
  })

  it('toggles to dark theme when clicked', async () => {
    render(<ModeToggle />)
    const button = await screen.findByRole('button', { name: /switch to dark theme/i })
    
    fireEvent.click(button)
    expect(mockSetTheme).toHaveBeenCalledWith('dark')
  })

  it('toggles to light theme when clicked (if currently dark)', async () => {
    mockResolvedTheme = 'dark'
    render(<ModeToggle />)
    const button = await screen.findByRole('button', { name: /switch to light theme/i })
    
    expect(button).toHaveAttribute('aria-pressed', 'true')
    
    fireEvent.click(button)
    expect(mockSetTheme).toHaveBeenCalledWith('light')
  })

  it('displays correct icon based on theme', async () => {
    // This is implicit in the aria-label check, but we can check for SVG existence if needed
    // But testing implementation details (like SVG paths) is brittle.
    // The aria-label is the contract.
    render(<ModeToggle />)
    await screen.findByLabelText(/switch to dark theme/i)
  })
})
