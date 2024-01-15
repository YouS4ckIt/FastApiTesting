import React, { useEffect, useState } from "react";
import { userData } from "../../types";
import { Form } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { registerRequest } from "../../RequestHandler";

function RegisterPage() {
  const navigate = useNavigate();
  const navToLogin = () => {
    navigate("/login");
  };

  //React Hook to set a state and change based on the current status
  let [user, setUser] = useState<userData | null>(null);
  let [status, setStatus] = useState("idle");
  let [error, setError] = useState("");
  let [username, setUsername] = useState("");
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");

  useEffect(() => {
    let user = localStorage.getItem("user");
    let userObj;
    if (user) {
      userObj = JSON.parse(user!);
    }
    if (userObj && userObj.username && userObj.password && userObj.username !== "" && userObj.password !== "") {
      setUser(userObj);
      navigate("/home");
    }
  }, [navigate]);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log("submitting");
    e.preventDefault();
    setStatus("pending");
    try {
      let user = await registerRequest(email, username, password);
      setUser(user);
      setStatus("success");
    } catch (e: any) {
      console.log("error", e);
      if (e.response?.status === 409) {
        setError("Username already exists");
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
    navigate("/tasks");
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
        <input type="text" className="form-control mt-1" placeholder="Enter Username" onChange={(e) => setUsername(e.target.value)} />
      </div>
    );
  };

  const emailInput = () => {
    return (
      <div className="form-group mt-3">
        <label>Email</label>
        <input type="email" className="form-control mt-1" placeholder="Enter Email" onChange={(e) => setEmail(e.target.value)} />
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
          <h3 className="Auth-form-title">Sign Up</h3>
          <div className="text-center">
            Already have an Account ?{" "}
            <span className="link-primary" onClick={navToLogin}>
              Sign in
            </span>
          </div>
          {emailInput()}
          {usernameInput()}
          {passwordInput()}
          {submitButton()}
        </div>
      </Form>
    </div>
  );
}

export default RegisterPage;
