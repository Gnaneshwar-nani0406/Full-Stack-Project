import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from './images/logo.png';

const Nav = ({ setIsLoggedIn }) => {
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLoggedIn();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="logo" />
        <span>MediCare Hospital</span>
      </div>
      <div className="navbar-links">
        <Link className="nav-link" to="/">Home</Link>
        <div
          className="dropdown"
          onMouseEnter={() => setIsExploreOpen(true)}
          onMouseLeave={() => setIsExploreOpen(false)}
        >
          <Link className="nav-link" to="/Explore">Explore</Link>
          {isExploreOpen && (
            <div className="dropdown-menu show">
              <Link className="dropdown-item" to="/Specialists">Specialists</Link>
              <Link className="dropdown-item" to="/doctor-details">Doctor Details</Link>
              <Link className="dropdown-item" to="/book-appointment">Book Appointment</Link>
            </div>
          )}
        </div>
        <Link className="nav-link" to="/Services">Services</Link>
        <Link className="nav-link" to="/my-bookings">My Bookings</Link>
        <Link className="nav-link" to="/payment">Payment</Link>
        <Link className="nav-link" to="/confirmation">Confirmation</Link>
      </div>
      <button className="nav-logout-btn" onClick={handleLogout}>Logout</button>
    </nav>
  );
};

export default Nav;