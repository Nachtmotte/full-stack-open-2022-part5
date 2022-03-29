import axios from "axios";
import userUtils from "../utils/user";
const baseUrl = "/api/blogs";

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const create = async (newBlog) => {
  const token = userUtils.getTokenFromLocalStorage();
  if (!token) return null;

  const config = {
    headers: { Authorization: `bearer ${token}` },
  };

  const response = await axios.post(baseUrl, newBlog, config);
  return response.data;
};

const blogService = {
  getAll,
  create,
};

export default blogService;
