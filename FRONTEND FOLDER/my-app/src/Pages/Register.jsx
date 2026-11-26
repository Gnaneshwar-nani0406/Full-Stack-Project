import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';
import { buildRegistrationAttempts } from '../utils/auth';

const Register = ({ setIsLoggedIn }) => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

 const handleRegister = async (e) => {
  e.preventDefault();

  if (data.password !== data.confirm) {
    alert("Passwords do not match ❌");
    return;
  }

  const attempts = buildRegistrationAttempts({
    name: data.name,
    email: data.email,
    password: data.password,
    confirm: data.confirm,
    registerEndpoint: API_ENDPOINTS.REGISTER,
  });

  let lastError = null;

  for (const attempt of attempts) {
    try {
      await axios.post(attempt.endpoint, attempt.payload);
      alert("Registered Successfully ✅");
      setTimeout(() => navigate("/login"), 500);
      return;
    } catch (err) {
      lastError = err;
    }
  }

  const backendMessage =
    lastError?.response?.data?.detail ||
    lastError?.response?.data?.error ||
    lastError?.response?.data?.message ||
    lastError?.response?.data?.non_field_errors?.[0] ||
    "Registration failed. Please try again.";

  alert(backendMessage);
};

  return (
    <form className="form" onSubmit={handleRegister}>
      <label>Full Name</label>
      <div className="inputBox">
        <span></span>
        <input
          type="text"
          placeholder="Your name"
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
          required
        />
      </div>

      <label>Email</label>
      <div className="inputBox">
        <span></span>
        <input
          type="email"
          placeholder="name@example.com"
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
          required
        />
      </div>

      <label>Password</label>
      <div className="inputBox">
        <span></span>
        <input
          type={show ? "text" : "password"}
          placeholder="******"
          value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })}
          required
        />
      </div>

      <label>Confirm Password</label>
      <div className="inputBox">
        <span></span>
        <input
          type={show ? "text" : "password"}
          placeholder="Confirm password"
          value={data.confirm}
          onChange={(e) => setData({ ...data, confirm: e.target.value })}
          required
        />
        <span className="eye" onClick={() => setShow(!show)}>👁️</span>
      </div>

      <button className="submit">Create Account →</button>
    </form>
  );
};

export default Register;