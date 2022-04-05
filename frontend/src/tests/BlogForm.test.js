import React from 'react'
import { render, fireEvent, act } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from '../components/BlogForm'

describe('<BlogForm />', () => {
  const newBlog = {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
  }

  const mockHandlerCreate = jest.fn()
  const mockHandlerNotification = jest.fn()

  let component

  beforeEach(() => {
    component = render(
      <BlogForm
        handleNewBlog={mockHandlerCreate}
        handleNotification={mockHandlerNotification}
      />
    )
  })

  test('creating new blog', async () => {
    const inputTitle = component.container.querySelector('#title')
    const inputAuthor = component.container.querySelector('#author')
    const inputUrl = component.container.querySelector('#url')
    const form = component.container.querySelector('form')

    await act(async () => {
      fireEvent.change(inputTitle, { target: { value: newBlog.title } })
      fireEvent.change(inputAuthor, { target: { value: newBlog.author } })
      fireEvent.change(inputUrl, { target: { value: newBlog.url } })
      fireEvent.submit(form)
    })

    expect(mockHandlerCreate.mock.calls).toHaveLength(1)
  })
})
