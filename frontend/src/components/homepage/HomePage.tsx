import axios from "axios";
import { postData } from "../../types";
import { useEffect, useState } from "react";
import * as React from "react";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import AddPost from "./AddPost";
import "./HomePage.css";
import { useNavigate } from "react-router-dom";
import { getUserData, isAdmin, isLoggedIn } from "../../util";
import Edit from "./Edit";

function HomePage() {
  const navigate = useNavigate();
  const [isLoggedInState, setIsLoggedInState] = useState(false);
  useEffect(() => {
    isLoggedIn() ? setIsLoggedInState(true) : setIsLoggedInState(false);
  }, [navigate]);
  useEffect(() => {
    getPostsRequest();
  }, []);

  const userObj = getUserData();
  const [listOfPosts, setListOfPosts] = useState([]);
  const [updateState, setUpdateState] = useState(-1);
  const [setAddTask, setAddTaskState] = useState(-1);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const getPostsRequest = async () => {
    try {
      const { data: response } = await axios.get("http://127.0.0.1:8000/api/v1/posts/");
      console.log("--------response at HomePage--------");
      console.log(response);
      if (response === undefined || response === null || response === "") {
        return;
      }
      setListOfPosts(response);
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const updatePostRequest = async (post: postData) => {
    const { id, user } = post;
    try {
      if (userObj === null || userObj === undefined) {
        return;
      }
      const { data: response } = await axios.patch(
        "http://localhost:8000/api/v1/posts/",
        {
          id: id,
          title: editName,
          content: editDescription,
          user_id: user.id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            //accept header only application/json
            Accept: "application/json",
            Authorization: "Bearer " + userObj.access_token,
          },
        }
      );
      setUpdateState(-1);
      setEditName("");
      setEditDescription("");
      getPostsRequest();
    } catch (error) {
      console.log(error);
    }
  };

  const createPostRequest = async (post: any) => {
    try {
      if (userObj === null || userObj === undefined) {
        return;
      }
      const { data: response } = await axios.post(
        "http://localhost:8000/api/v1/posts/",
        {
          title: editName,
          content: editDescription,
        },
        {
          headers: {
            "Content-Type": "application/json",
            //accept header only application/json
            Accept: "application/json",
            Authorization: "Bearer " + userObj.access_token,
          },
        }
      );
      setAddTaskState(-1);
      setEditName("");
      setEditDescription("");
      getPostsRequest();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (id: number) => {
    setUpdateState(id);
    setAddTaskState(-1);
  };

  const handleDelete = async (id: number) => {
    try {
      if (userObj === null || userObj === undefined) {
        return;
      }
      const { data: response } = await axios.delete("http://127.0.0.1:8000/api/v1/posts/?post_id=" + id.toString(), { headers: { Authorization: "Bearer " + userObj.access_token } });
      console.log("--------response at HomePage--------");
      console.log(response);
      if (response === undefined || response === null || response === "") {
        return;
      }
      setListOfPosts(listOfPosts.filter((post: postData) => post.id !== id));
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {listOfPosts.map((post: postData) => {
        return (
          <>
            {updateState === post.id ? (
              <Edit post={post} editName={editName} editDescription={editDescription} setEditName={setEditName} updatePostRequest={updatePostRequest} setUpdateState={setUpdateState} setEditDescription={setEditDescription} />
            ) : (
              <div key={post.id} className="post-card">
                <div>PostID:{post.id}</div>
                <div>CategoryID: {post.category?.id}</div>
                <div>CategoryName:{post.category?.name}</div>
                <img src="pictures/pic_quaker.png" alt="Quaker" height={"100px"} width={"100px"} style={{ backgroundColor: "white" }} />
                <div className="post-card-text">
                  <h1>
                    <b>{post.title}</b>
                  </h1>
                  <p>{post.content}</p>
                </div>
                {/* <div>UserID:{post.user?.id}</div> */}
                <div className="post-card-text">Username:{post.user?.username}</div>
                <div className="post-card-text">Email:{post.user?.email}</div>
                <div className="post-card-text">CreatedAt:{post.created_at}</div>
                {isAdmin() && (
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => {
                      handleDelete(post.id);
                    }}
                  >
                    Delete
                    <DeleteIcon></DeleteIcon>
                  </Button>
                )}
                {isLoggedInState && (getUserData()?.userData.id === post.user.id || isAdmin()) && (
                  <Button
                    variant="contained"
                    onClick={() => {
                      handleEdit(post.id);
                    }}
                  >
                    Edit
                  </Button>
                )}
              </div>
            )}
          </>
        );
      })}

      {setAddTask === 1 && <AddPost editName={editName} editDescription={editDescription} setEditName={setEditName} createPostRequest={createPostRequest} setAddTaskState={setAddTaskState} setEditDescription={setEditDescription} />}

      {isLoggedInState && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            marginRight: "1%",
            marginBottom: "1%",
          }}
        >
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              setAddTaskState(1);
              setUpdateState(-1);
            }}
            style={{
              height: "100px",
              width: "100px",
              borderRadius: "50%",
            }}
          >
            <AddIcon
              sx={{
                height: "70%",
                width: "70%",
              }}
            />
          </Button>
        </div>
      )}
    </>
  );
}

export default HomePage;
