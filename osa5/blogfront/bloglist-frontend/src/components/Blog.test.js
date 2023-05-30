import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders content', () => {
  const usr = {
    username: 'testername',
    name: 'test',
    id: '0'
  }
  const blog = {
    author: 'Test Author',
    title: 'Test Title',
    url: 'testurl.com',
    user: usr
  }

  const { container } = render(<Blog blog={blog} usr={usr} />)

  const div = container.querySelector('.compact')
  expect(div).toHaveTextContent('Test Title')
  expect(div).not.toHaveTextContent('testurl.com')
})

test('renders extra content after button view press', async () => {

  const usr = {
    username: 'testername',
    name: 'NameForTesting',
    id: '0'
  }
  const blog = {
    author: 'Test Author',
    title: 'Test Title',
    url: 'testurl.com',
    likes: 21,
    user: usr
  }

  const { container } = render(<Blog blog={blog} usr={usr} />)
  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const div = container.querySelector('.expanded')
  expect(div).not.toHaveStyle('display: none')
  expect(div).toHaveTextContent('Test Title')
  expect(div).toHaveTextContent('testurl.com')
  expect(div).toHaveTextContent('likes 21')
  expect(div).toHaveTextContent('NameForTesting')
})

test('clicking like twice calls event handler twice', async () => {

  const usr = {
    username: 'testername',
    name: 'NameForTesting',
    id: '0'
  }
  const blog = {
    author: 'Test Author',
    title: 'Test Title',
    url: 'testurl.com',
    likes: 21,
    user: usr
  }

  const user = userEvent.setup()
  const mockHandler = jest.fn()
  render(<Blog blog={blog} usr={usr} likeBlog={mockHandler} />)

  const button = screen.getByText('view')
  await user.click(button)
  const likeB = screen.getByText('like')
  await user.click(likeB)
  await user.click(likeB)

  expect(mockHandler.mock.calls).toHaveLength(2)
})
