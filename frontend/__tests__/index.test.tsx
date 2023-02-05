import { render, screen } from '@testing-library/react'
import Home from '../pages/index'
import '@testing-library/jest-dom'

jest.mock('next/router', () => require('next-router-mock'))

describe('Home', () => {
  it('renders a heading', () => {
    render(<Home />)

    const banner = screen.getByText('Hello from Example')
    expect(banner).toBeInTheDocument()
  })
})
