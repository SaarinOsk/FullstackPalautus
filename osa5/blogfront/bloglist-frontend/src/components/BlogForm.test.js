import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('renders content', async () => {

  const user = userEvent.setup()
  const mockHandler = jest.fn()

  render(<BlogForm createBlog={mockHandler} />)

  const inputs = screen.getAllByRole('textbox')
  await user.type(inputs[0], 'test title')
  await user.type(inputs[1], 'test author')
  await user.type(inputs[2], 'test url')

  const button = screen.getByText('create')
  await user.click(button)

  expect(mockHandler.mock.calls[0][0].title).toBe('test title')
  expect(mockHandler.mock.calls[0][0].author).toBe('test author')
  expect(mockHandler.mock.calls[0][0].url).toBe('test url')
})
