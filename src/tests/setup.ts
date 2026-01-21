import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Mock PointerEvent
class MockPointerEvent extends Event {
  button: number
  ctrlKey: boolean
  metaKey: boolean
  shiftKey: boolean
  altKey: boolean
  
  constructor(type: string, props: PointerEventInit) {
    super(type, props)
    this.button = props.button || 0
    this.ctrlKey = props.ctrlKey || false
    this.metaKey = props.metaKey || false
    this.shiftKey = props.shiftKey || false
    this.altKey = props.altKey || false
  }
}
global.PointerEvent = MockPointerEvent as any
global.HTMLElement.prototype.scrollIntoView = vi.fn()
global.HTMLElement.prototype.releasePointerCapture = vi.fn()
global.HTMLElement.prototype.hasPointerCapture = vi.fn()
