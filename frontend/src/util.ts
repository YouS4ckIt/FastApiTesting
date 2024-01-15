import { userLocalStorage } from "./types";

export const getUserData = (): userLocalStorage | null => {
  const user = window.localStorage.getItem("user");
  if (user != null) {
    return JSON.parse(user) as userLocalStorage;
  }
  return null;
};

export const isLoggedIn = () => {
  const user = window.localStorage.getItem("user");
  return user != null;
};
export const isAdmin = () => {
  const user = window.localStorage.getItem("user");
  if (user !== null) {
    const userObj = JSON.parse(user);
    if (userObj.userData && userObj.userData.role === "admin") {
      return true;
    }
  }
  return false;
};

export const logout = () => {
  window.localStorage.removeItem("user");
};
