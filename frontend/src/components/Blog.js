import React, { useState } from 'react'
import blogService from '../services/blogs'
import userUtils from '../utils/user'
import PropTypes from 'prop-types'

const Blog = (props) => {
  const [showDetails, setShowDetails] = useState(false)
  const [viewBlog, setViewBlog] = useState(props.blog)
  const isOwnerBlog =
    userUtils.getUserFromLocalStorage()?.username === viewBlog.user.username

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const handleLike = async (blog) => {
    const updatedBlog = await blogService.update(blog.id, {
      title: blog.title,
      url: blog.url,
      author: blog.author,
      likes: blog.likes + 1,
    })
    setViewBlog(updatedBlog)
  }

  return (
    <div style={blogStyle}>
      <div>
        {viewBlog.title}
        <button onClick={() => setShowDetails(!showDetails)}>
          {!showDetails ? 'view' : 'hide'}
        </button>
      </div>
      {showDetails && (
        <>
          <div>{viewBlog.url}</div>
          <div>
            likes: {viewBlog.likes}{' '}
            <button onClick={() => handleLike(viewBlog)}>like</button>
          </div>
          <div>{viewBlog.author}</div>
          {isOwnerBlog ? (
            <button onClick={() => props.handleDelete(viewBlog)}>remove</button>
          ) : (
            <></>
          )}
        </>
      )}
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  handleDelete: PropTypes.func.isRequired,
}

export default Blog
