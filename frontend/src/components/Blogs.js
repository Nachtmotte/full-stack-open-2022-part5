import React, { useState, useEffect } from 'react'
import Blog from './Blog'
import blogService from '../services/blogs'

const Blogs = (props) => {
  const [blogs, setBlogs] = useState(props.blogs)

  useEffect(() => {
    setBlogs(props.blogs)
  }, [props.blogs])

  const removeBlog = async (blog) => {
    const result = window.confirm(
      `Remove blog ${blog.title} by ${blog.author}`
    )
    if (result) {
      await blogService.deleteBlog(blog.id)
      setBlogs(blogs.filter((b) => b.id !== blog.id))
    }
  }

  const updateBlog = async (blog) => {
    const updatedBlog = await blogService.update(blog.id, {
      title: blog.title,
      url: blog.url,
      author: blog.author,
      likes: blog.likes,
    })

    const result = blogs.filter((b) => b.id !== blog.id)

    setBlogs(result.concat(updatedBlog))
  }

  return (
    <div>
      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            handleDelete={removeBlog}
            handleUpdate={updateBlog}
          />
        ))}
    </div>
  )
}

export default Blogs
