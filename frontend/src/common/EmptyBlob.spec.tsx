/**
 * @jest-environment jsdom
 */

import { render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import EmptyBlob from './EmptyBlob'

describe('EmptyBlob', () => {
  it('renders an EmptyBlob component with the text of string', async () => {
    render(<EmptyBlob text='string' />)

    await waitFor(async () => {
      expect(await screen.findByText('string')).not.toBeUndefined()
    })
  })
})
