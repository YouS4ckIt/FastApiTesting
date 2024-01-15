import React from "react";
import { Button, CardActions, TextField } from "@mui/material";

function Edit({ post, editName, editDescription, setEditName, updatePostRequest, setUpdateState, setEditDescription }: any) {
  return (
    <>
      <div key={post.id} className="post-card">
        <div>PostID:{post.id}</div>
        <div>CategoryID: {post.category?.id}</div>
        <div>CategoryName:{post.category?.name}</div>
        <img src="pictures/pic_quaker.png" alt="Quaker" height={"100px"} style={{ backgroundColor: "white" }} />
        <div className="post-card-text">
          <h1>
            <TextField
              id="outlined-basic"
              label="Post Title"
              variant="outlined"
              placeholder={post.title}
              onChange={(event) => {
                const { value } = event.target;
                setEditName(value);
              }}
              style={{ marginBottom: "10px" }}
            />
          </h1>
          <h1>
            <TextField
              id="outlined-basic"
              label="Post Content"
              variant="outlined"
              placeholder={post.content}
              onChange={(event) => {
                const { value } = event.target;
                setEditDescription(value);
              }}
            />
          </h1>
        </div>
        {/* <div>UserID:{post.user?.id}</div> */}
        <div className="post-card-text">Username:{post.user?.username}</div>
        <div className="post-card-text">Email:{post.user?.email}</div>
        <div className="post-card-text">
          CreatedAt:{post.created_at}
          <CardActions>
            <Button
              variant="contained"
              type="submit"
              color="error"
              onClick={() => {
                setUpdateState(-1);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              type="submit"
              onClick={() => {
                updatePostRequest(post);
              }}
            >
              Submit
            </Button>
          </CardActions>
        </div>
      </div>
    </>
  );
}

export default Edit;
