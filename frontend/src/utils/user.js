const getUserFromLocalStorage = () => {
  const loggedUserJSON = window.localStorage.getItem("loggedUser");
  return loggedUserJSON ? JSON.parse(loggedUserJSON) : null;
};

const getTokenFromLocalStorage = () => {
  const loggedUser = getUserFromLocalStorage();
  return loggedUser ? loggedUser.token : null;
};

const userUtils = {
  getUserFromLocalStorage,
  getTokenFromLocalStorage,
};

export default userUtils;
