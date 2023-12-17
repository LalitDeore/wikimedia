import React from "react";
import "../componentCSS/LoginButton.css"; // Import your CSS file
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
const LoginButton = ({ isLogin, setIsLogin }) => {
  const location = useLocation();

  if (location.pathname === "/Login" || location.pathname === "/adminPage") {
    setIsLogin(false);
  }

  return (
    <div className="login-btn">
      {isLogin && (
        <Link to="/Login" className="login-button">
          Login
        </Link>
      )}
    </div>
  );
};

export default LoginButton;
