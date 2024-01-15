import React, { useEffect, useState } from "react";
import "./LoginPage.css";
import { userData } from "../../types";
import { Form } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { loginRequest } from "../../RequestHandler";

function LoginPage() {
  const navigate = useNavigate();
  const navToRegister = () => {
    navigate("/register");
  };

  //React Hook to set a state and change based on the current status
  let [user, setUser] = useState<userData | null>(null);
  let [status, setStatus] = useState("idle");
  let [error, setError] = useState("");
  let [username, setUsername] = useState("");
  let [password, setPassword] = useState("");

  //useEffect to check if the user is logged in or not
  useEffect(() => {
    let user = localStorage.getItem("user");
    let userObj;
    if (user) {
      userObj = JSON.parse(user!);
    }
    if (userObj && userObj.token && userObj.username && userObj.token !== "") {
      setUser(userObj);
      navigate("/home");
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log("submitting");
    e.preventDefault();
    setStatus("pending");
    try {
      let user = await loginRequest(username, password);
      setUser(user);
      setStatus("success");
    } catch (e: any) {
      console.log("error", e);
      if (e.response?.status === 404) {
        setError("Incorrect username or password");
      } else if (e.response?.status === 403) {
        setError("Incorrect username or password");
      } else {
        setError(e.message);
      }
      setStatus("error");
    }
  };

  if (status === "pending") {
    return <div className="text-center">Loading...</div>;
  }

  if (status === "success") {
    console.log("-------success data---------");
    console.log(user);
    localStorage.setItem("user", JSON.stringify(user));
    navigate("/home");
  }

  const submitButton = () => {
    return (
      <div className="d-grid gap-2 mt-3">
        <button type="submit" className="btn btn-primary" onClick={() => handleSubmit}>
          Submit
        </button>
      </div>
    );
  };

  //input for username
  const usernameInput = () => {
    return (
      <div className="form-group mt-3">
        <label>Username</label>
        <input type="text" className="form-control mt-1" placeholder="Enter Username(EMAIL)" onChange={(e) => setUsername(e.target.value)} />
      </div>
    );
  };

  //input for password
  const passwordInput = () => {
    return (
      <div className="form-group mt-3">
        <label>Password</label>
        <input type="password" className="form-control mt-1" placeholder="Enter Password" onChange={(e) => setPassword(e.target.value)} />
      </div>
    );
  };

  //button to call handleSubmit function in my form

  return (
    <div className="Auth-form-container" style={{ display: "flex", flexDirection: "column" }}>
      {status === "error" && (
        <div
          style={{
            backgroundColor: "#e57373",
            textAlign: "center",
            fontWeight: "bold",
          }}
          className="Auth-form"
        >
          {error}
        </div>
      )}
      <Form className="Auth-form" onSubmit={handleSubmit}>
        <div className="Auth-form-content">
          <h3 className="Auth-form-title">Sign In</h3>
          <div className="text-center">
            Not registered yet?{" "}
            <span className="link-primary" onClick={navToRegister}>
              Sign Up
            </span>
          </div>
          {usernameInput()}
          {passwordInput()}
          {submitButton()}
        </div>
      </Form>
    </div>
  );
}

export default LoginPage;
