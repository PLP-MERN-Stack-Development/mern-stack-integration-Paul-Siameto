import React from 'react'
import { render, screen } from '@testing-library/react'
import PostDetail from '../../pages/PostDetail'
import { BrowserRouter } from 'react-router-dom'

// Basic smoke test to ensure PostDetail renders without crashing
test('renders PostDetail container', () => {
  render(
    <BrowserRouter>
      <PostDetail />
    </BrowserRouter>
  )
  // expect the page to have Back to Posts link
  const backLink = screen.getByText(/Back to Posts/i)
  expect(backLink).toBeInTheDocument()
})
