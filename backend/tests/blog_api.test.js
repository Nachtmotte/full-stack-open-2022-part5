const supertest = require("supertest");
const mongoose = require("mongoose");
const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);
const bcrypt = require("bcrypt");

const Blog = require("../models/blog");
const User = require("../models/user");

const testUser = {
  username: "TestUser",
  name: "TestUser",
  password: "TestUser",
};

const persistUser = async ({ username, name, password }) => {
  const passwordHash = await bcrypt.hash(password, 10);
  const userWithPasswordHash = new User({ username, name, passwordHash });
  const persistedUser = await userWithPasswordHash.save();
  return JSON.parse(JSON.stringify(persistedUser));
};

const getTokenFromUser = async ({ username, name, password }) => {
  const response = await api.post("/api/login").send({ username, password });
  return response.body.token;
};

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  const persistedUser = await persistUser(testUser);

  const blogObjects = helper.initialBlogs.map(
    ({ title, author, url, likes }) =>
      new Blog({ title, author, url, likes, user: persistedUser.id })
  );

  const user = await User.findById(persistedUser.id);

  for (const blog of blogObjects) {
    const persistedBlog = await blog.save();
    user.blogs = user.blogs.concat(persistedBlog.id);
    await user.save();
  }
});

describe("get all blogs", () => {
  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", "application/json; charset=utf-8");
  });

  test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs");
    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });

  test("all blogs have a property called id", async () => {
    const response = await api.get("/api/blogs");
    response.body.forEach((blog) => expect(blog.id).toBeDefined());
  });
});

describe("get a specific blog", () => {
  test("succeeds with a valid id", async () => {
    const blogsAtStart = await helper.blogsInDb();

    const blogToView = blogsAtStart[0];

    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect("Content-Type", "application/json; charset=utf-8");

    const processedBlogToView = JSON.parse(JSON.stringify(blogToView));

    expect(resultBlog.body.title).toEqual(processedBlogToView.title);
  });

  test("fails with statuscode 404 if blog does not exist", async () => {
    const validNonexistingId = await helper.nonExistingId();
    await api.get(`/api/blogs/${validNonexistingId}`).expect(404);
  });
});

describe("post blog", () => {
  test("a valid blog can be added", async () => {
    const newBlog = {
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      likes: 10,
    };

    const token = await getTokenFromUser(testUser);

    await api
      .post("/api/blogs")
      .set("Authorization", `bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", "application/json; charset=utf-8");

    const response = await api.get("/api/blogs");

    const titles = response.body.map((b) => b.title);

    expect(titles).toContain("First class tests");
    expect(response.body).toHaveLength(helper.initialBlogs.length + 1);
  });

  test("a valid blog without likes will have zero likes", async () => {
    const newBlog = {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    };

    const token = await getTokenFromUser(testUser);

    const response = await api
      .post("/api/blogs")
      .set("Authorization", `bearer ${token}`)
      .send(newBlog);

    expect(response.body.likes).toBe(0);
  });

  test("an invalid blog generate response bad request", async () => {
    const newBlog = { author: "Edsger W. Dijkstra" };

    const token = await getTokenFromUser(testUser);

    await api
      .post("/api/blogs")
      .set("Authorization", `bearer ${token}`)
      .send(newBlog)
      .expect(400);
  });

  test("fails with statuscode 404 if not have token", async () => {
    const newBlog = {
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      likes: 10,
    };

    await api.post("/api/blogs").send(newBlog).expect(401);
  });
});

describe("delete blog", () => {
  test("succeeds with status code 200 if id is valid", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    const token = await getTokenFromUser(testUser);

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set("Authorization", `bearer ${token}`)
      .expect(200);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);

    const titles = blogsAtEnd.map((r) => r.title);

    expect(titles).not.toContain(blogToDelete.title);
  });

  test("fails with statuscode 404 if blog does not exist", async () => {
    const validNonexistingId = await helper.nonExistingId();
    const token = await getTokenFromUser(testUser);
    await api
      .delete(`/api/blogs/${validNonexistingId}`)
      .set("Authorization", `bearer ${token}`)
      .expect(404);
  });
  test("fails with statuscode 404 if not have token", async () => {
    const blogs = await helper.blogsInDb();
    const blogToDelete = blogs[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(401);
  });
});

describe("update blog", () => {
  test("succeeds with status code 200 if id is valid", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send({ likes: 10 })
      .expect(200);

    const response = await api.get(`/api/blogs/${blogToUpdate.id}`);

    expect(response.body.likes).toBe(10);
  });

  test("fails with statuscode 404 if blog does not exist", async () => {
    const validNonexistingId = await helper.nonExistingId();
    await api
      .put(`/api/blogs/${validNonexistingId}`)
      .send({ likes: 10 })
      .expect(404);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
