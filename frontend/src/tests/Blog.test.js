import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from '../components/Blog'

describe('<Blog />', () => {
  const blog = {
    id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    user: {
      id: '5a422aa71b54a676234d17f9',
      username: 'Edsger',
      name: 'Dijkstra',
    },
  }

  const mockHandlerDelete = jest.fn()
  const mockHandlerUpdate = jest.fn()

  let component

  beforeEach(() => {
    component = render(
      <Blog
        blog={blog}
        handleDelete={mockHandlerDelete}
        handleUpdate={mockHandlerUpdate}
      />
    )
  })

  test('render blog with hidden details', () => {
    expect(component.container).toHaveTextContent(blog.title)
    expect(component.container).not.toHaveTextContent(blog.author)
    expect(component.container).not.toHaveTextContent(blog.url)
    expect(component.container).not.toHaveTextContent(blog.likes)
  })

  test('render blog with details', () => {
    const button = component.getByText('view')
    fireEvent.click(button)

    expect(component.container).toHaveTextContent(blog.title)
    expect(component.container).toHaveTextContent(blog.author)
    expect(component.container).toHaveTextContent(blog.url)
    expect(component.container).toHaveTextContent(blog.likes)
  })

  test('after clicking the like button the blog is updated', () => {
    const buttonViewDetails = component.getByText('view')
    fireEvent.click(buttonViewDetails)

    const likeButton = component.getByText('like')
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)

    expect(mockHandlerUpdate.mock.calls).toHaveLength(2)
  })
})
