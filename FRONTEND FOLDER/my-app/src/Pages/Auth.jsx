import React, { useState } from "react";
import "./Auth.css";
import Login from "./Login";
import Register from "./Register";
import logo from './images/logo.png';

const Auth = ({ setIsLoggedIn }) => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="auth-container">
      <div className="auth-left" style={{ backgroundImage: `url(${logo})` }}>
        <div className="auth-overlay">
          <div className="auth-brand">
            <div className="brand-icon-wrapper">
              <div className="brand-icon-badge">
                <img src={logo} alt="MediCare Logo" className="brand-logo-img" />
              </div>
            </div>
            <h2>MediCare Hospital</h2>
          </div>
          <h1>Your Health, Our Priority</h1>
          <p className="auth-tagline">
            Book appointments with the best doctors and take control of your health journey with ease.
          </p>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Welcome Back</h2>
            <p className="auth-subtitle">
              {isLogin ? "Sign in to your account" : "Create a new account"}
            </p>
          </div>

          <div className="auth-tabs">
            <button
              className={`auth-tab ${isLogin ? "active" : ""}`}
              onClick={() => setIsLogin(true)}
            >
              <span className="tab-icon">&#128272;</span> Login
            </button>
            <button
              className={`auth-tab ${!isLogin ? "active" : ""}`}
              onClick={() => setIsLogin(false)}
            >
              <span className="tab-icon">&#128100;</span> Register
            </button>
          </div>

          <div className="auth-divider"></div>

          <div className="auth-form-container">
            {isLogin ? (
              <Login setIsLoggedIn={setIsLoggedIn} />
            ) : (
              <Register setIsLoggedIn={setIsLoggedIn} />
            )}
          </div>

          <div className="auth-footer">
            <p className="auth-footer-text">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                className="auth-link"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? "Register now" : "Login now"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;