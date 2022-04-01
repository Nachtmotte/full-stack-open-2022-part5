import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render } from "@testing-library/react";
import Blog from "../components/Blog";

describe("<Blog />", () => {
  test("render blog with hidden details", () => {
    const blog = {
      id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      user: {
        id: "5a422aa71b54a676234d17f9",
        username: "Edsger",
        name: "Dijkstra",
      },
    };

    console.log(blog.user.username);

    const mockHandler = jest.fn();

    const component = render(<Blog blog={blog} handleDelete={mockHandler} />);

    expect(component.container).toHaveTextContent(blog.title);
    expect(component.container).not.toHaveTextContent(blog.author);
    expect(component.container).not.toHaveTextContent(blog.url);
    expect(component.container).not.toHaveTextContent(blog.likes);
  });
});
