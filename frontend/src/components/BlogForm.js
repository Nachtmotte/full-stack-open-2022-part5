import { useState } from "react";
import blogService from "../services/blogs";

const BlogForm = ({ handleNewBlog, handleNotification }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const handleAdd = async (event) => {
    event.preventDefault();
    try {
      const blog = await blogService.create({
        title,
        author,
        url,
      });
      handleNewBlog(blog);
      handleNotification(`a new blog ${blog.title} by ${blog.author}`, false);
      setTitle("");
      setAuthor("");
      setUrl("");
    } catch (exception) {
      console.log(exception);
      handleNotification("problems creating a new blog", true);
    }
  };

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleAdd}>
        <div>
          title:
          <input
            type="text"
            value={title}
            name="Title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author:
          <input
            type="text"
            value={author}
            name="Author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url:
          <input
            type="text"
            value={url}
            name="Url"
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default BlogForm;
