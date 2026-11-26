import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <div className="hero-section">
        <div className="hero-content">
          <h1>Your Health, Our Priority</h1>
          <p>Book appointments with the best doctors in Hyderabad</p>
          <Link to="/Specialists" className="book-appointment-btn">
            Book an Appointment
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;