import { render, screen } from '@testing-library/react'
import Index from '../pages/index'
import '@testing-library/jest-dom'

jest.mock('next/router', () => require('next-router-mock'))

describe('Home', () => {
  it('renders a heading', () => {
    render(
      <Index
        config={{
          ui: {
            banner: {
              enabled: true,
              colour: 'red',
              text: 'example',
            },
          },
        }}
      />
    )

    const banner = screen.getByText('Hello from Example')
    expect(banner).toBeInTheDocument()
  })
})
