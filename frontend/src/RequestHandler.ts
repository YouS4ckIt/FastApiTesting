import axios from "axios";
import qs from "qs";
import { getUserData } from "./util";

//make request to localhost with sending username and password to it to login
export const registerRequest = async (email: string, username: string, password: string) => {
  console.log("logging in");
  let res = await axios.post("http://localhost:8000/api/v1/users/", {
    username,
    email,
    password,
  });
  console.log("--------response--------");
  console.log(res.data);
  return res.data;
};

//make request to localhost with sending username and password to it to login
export const loginRequest = async (username: string, password: string) => {
  console.log("logging in Request");
  const logindata = qs.stringify({
    username: username,
    password: password,
  });
  let res = await axios.post("http://localhost:8000/api/v1/users/login/", logindata, { headers: { "Content-Type": "application/x-www-form-urlencoded" } });
  console.log("--------response at LoginPage--------");
  console.log(res.data);
  return res.data;
};

// REQUESTS FOR POSTS

//REQUESTS FOR CATEGORIES
export const getAllCategoriesRequest = async () => {
  try {
    const userObj = getUserData();
    if (userObj === null || userObj === undefined) {
      return;
    }
    console.log("-- request to get all categories -- ");
    const { data: response } = await axios.get("http://localhost:8000/api/v1/posts/categories?skip=0&limit=10", {
      headers: {
        "Content-Type": "application/json",
        //accept header only application/json
        Accept: "application/json",
        Authorization: "Bearer " + userObj.access_token,
      },
    });
    console.log("-- response from get all categories -- ");
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
  }
};
