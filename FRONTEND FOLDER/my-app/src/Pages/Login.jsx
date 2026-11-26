import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Alert, Spinner } from 'react-bootstrap';
import { Eye, EyeOff } from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';
import { buildLoginPayload, extractAuthData } from '../utils/auth';


const LoginForm = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    }

    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));

    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: ''
      }));
    }

    setGeneralError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');
    setSuccessMessage('');

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload = buildLoginPayload({
      email: formData.email,
      password: formData.password
    });

    try {
      setIsLoading(true);
      const response = await axios.post(API_ENDPOINTS.LOGIN, payload);
      const authData = extractAuthData(response?.data);

      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', authData.email || formData.email.trim());
      if (authData.token) {
        localStorage.setItem('authToken', authData.token);
      }

      setSuccessMessage('Login successful. Redirecting to dashboard...');

      setTimeout(() => {
        setIsLoggedIn(true);
        navigate('/');
      }, 800);
    } catch (error) {
      const backendMessage =
        error.response?.data?.detail ||
        error.response?.data?.error ||
        error.response?.data?.non_field_errors?.[0] ||
        error.response?.data?.message ||
        'Invalid credentials. Please try again.';

      setGeneralError(backendMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container className="login-container">
      <div className="login-wrapper">
        <form className="form" onSubmit={handleSubmit}>
          <label>Email Address</label>
          <div className="inputBox">
            <span></span>
            <input
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleInputChange}
              name="email"
              required
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          <label>Password</label>
          <div className="inputBox">
            <span></span>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="******"
              value={formData.password}
              onChange={handleInputChange}
              name="password"
              required
            />
            <span className="eye" onClick={togglePasswordVisibility}>
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
            {errors.password && <p className="error">{errors.password}</p>}
          </div>

          {generalError && <Alert variant="danger">{generalError}</Alert>}
          {successMessage && <Alert variant="success">{successMessage}</Alert>}

          <button className="submit" type="submit" disabled={isLoading}>
            {isLoading ? <Spinner animation="border" size="sm" /> : 'Login →'}
          </button>
        </form>

       
      </div>
    </Container>
  );
};

export default LoginForm;
