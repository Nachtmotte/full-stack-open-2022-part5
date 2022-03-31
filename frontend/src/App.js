import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import LoginForm from "./components/LoginForm";
import blogService from "./services/blogs";
import userUtils from "./utils/user";
import Notification from "./components/Notification";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState({
    show: false,
    message: "",
    warning: false,
  });
  const blogFormRef = useRef();

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));

    setUser(userUtils.getUserFromLocalStorage());
  }, []);

  const handleLogout = () => {
    window.localStorage.removeItem("loggedUser");
    setUser(null);
  };

  const addNewBlog = (newBlog) => {
    setBlogs(blogs.concat(newBlog));
    blogFormRef.current.toggleVisibility();
  };

  const removeBlog = async (blog) => {
    const result = window.confirm(
      `Remove blog ${blog.title} by ${blog.author}`
    );
    if (result) {
      await blogService.deleteBlog(blog.id);
      setBlogs(blogs.filter((b) => b.id !== blog.id));
    }
  };

  const showNotificationMessage = (message, warning) => {
    setNotificationMessage({
      show: true,
      message,
      warning,
    });
    setTimeout(
      () =>
        setNotificationMessage({
          show: false,
          message: "",
          warning: false,
        }),
      5000
    );
  };

  return (
    <div>
      {!user ? (
        <>
          <LoginForm
            handleUser={setUser}
            handleNotification={showNotificationMessage}
          />
          {notificationMessage.show && (
            <Notification
              message={notificationMessage.message}
              warning={notificationMessage.warning}
            />
          )}
        </>
      ) : (
        <>
          <h2>blogs</h2>
          <div>
            <span>{user?.name} logged in</span>
            <button onClick={handleLogout}>logout</button>
          </div>
          <br />
          <Togglable
            openButtonLabel="new blog"
            closeButtonLabel="cancel"
            ref={blogFormRef}
          >
            <BlogForm
              handleNewBlog={addNewBlog}
              handleNotification={showNotificationMessage}
            />
          </Togglable>
          {notificationMessage.show && (
            <Notification
              message={notificationMessage.message}
              warning={notificationMessage.warning}
            />
          )}
          <br />
          {blogs
            .sort((a, b) => b.likes - a.likes)
            .map((blog) => (
              <Blog key={blog.id} blog={blog} handleDelete={removeBlog} />
            ))}
        </>
      )}
    </div>
  );
};

export default App;
