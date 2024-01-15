import React, { useState } from "react";
import { NavLink, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./components/loginpage/LoginPage";
import RegisterPage from "./components/registerpage/RegisterPage";
import PrivateRoute from "./components/privateroute/PrivateRoute";
import NavigationBar from "./components/NavigationBar";
import ProfilePage from "./components/profilepage/ProfilePage";
import HomePage from "./components/homepage/HomePage";

function App() {
  return (
    <>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />

        <Route path="/home" element={<HomePage />} />
        <Route path="*" element={<Navigate to={"/login"} />} />
      </Routes>
    </>
  );
}

export default App;
