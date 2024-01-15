import axios from "axios";
import { useEffect, useState } from "react";
import { getUserData, logout } from "../../util";
import { useNavigate } from "react-router-dom";
import { Avatar } from "@mui/material";
import { ProfileDataType } from "../../types";
import "./ProfilePage.css";
function ProfilePage() {
  const navigate = useNavigate();
  let [userData, setUserData] = useState<ProfileDataType>({ username: "", email: "", id: -1, role: "" });
  const getProfileData = async () => {
    try {
      const userObj = getUserData();
      if (userObj === null || userObj === undefined) {
        return;
      }
      const { data: response } = await axios.get("http://127.0.0.1:8000/api/v1/users/me", { headers: { Authorization: "Bearer " + userObj.access_token } });
      if (response === undefined || response === null || response === "") {
        return;
      }
      setUserData(response);
    } catch (e: any) {
      if (e.response.status === 401) {
        logout();
        navigate("/home");
      }
      console.log(e);
    }
  };
  useEffect(() => {
    getProfileData();
  }, []);
  return (
    <div className="card-container">
      <header>
        <Avatar>{userData.username.substring(0, 3).toUpperCase()}</Avatar>
      </header>
      <h1 className="bold-text">
        {userData.username} <span className="normal-text">{userData.email}</span>
      </h1>
      <h2 className="normal-text">
        Role:<span className="bold-text">{userData.role}</span>
      </h2>
      <div className="social-container"></div>
    </div>
  );
}

export default ProfilePage;
