import React, { useState } from "react";
import userUtils from "../utils/user";
import PropTypes from "prop-types";

const Blog = ({ blog, handleDelete, handleUpdate }) => {
  const [showDetails, setShowDetails] = useState(false);
  const isOwnerBlog = userUtils.getUserFromLocalStorage()?.username === blog?.user?.username;

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const handleLike = async (b) => {
    b.likes += 1;
    handleUpdate(b);
  };

  return (
    <div style={blogStyle} className='blog'>
      <div>
        {blog.title}
        <button onClick={() => setShowDetails(!showDetails)}>
          {!showDetails ? "view" : "hide"}
        </button>
      </div>
      {showDetails && (
        <>
          <div>{blog.url}</div>
          <div>
            likes: {blog.likes}{" "}
            <button onClick={() => handleLike(blog)}>like</button>
          </div>
          <div>{blog.author}</div>
          {isOwnerBlog ? (
            <button onClick={() => handleDelete(blog)}>remove</button>
          ) : (
            <></>
          )}
        </>
      )}
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleUpdate: PropTypes.func.isRequired,
};

export default Blog;
