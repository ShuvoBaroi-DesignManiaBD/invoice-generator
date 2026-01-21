import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'

test('renders Hello World', () => {
  render(<div>Hello World</div>)
  const linkElement = screen.getByText(/Hello World/i)
  expect(linkElement).toBeInTheDocument()
})
