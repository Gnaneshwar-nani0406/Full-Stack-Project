import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Nav from './Pages/Nav';
import Footer from './Pages/Footer';
import Home from './Pages/Home';
import Explore from './Pages/Explore';
import Specialists from './Pages/Specialists';
import DoctorDetails from './Pages/DoctorDetails';
import Services from './Pages/Services';
import BookAppointment from './Pages/BookAppointment';
import AppointmentConfirmation from './Pages/AppointmentConfirmation';
import MyBookings from './Pages/MyBookings';
import Payment from './Pages/Payment';
import Auth from './Pages/Auth';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
  }, []);

  // Listen for storage changes (logout from other tabs)
  useEffect(() => {
    const handleStorageChange = () => {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true";
      setIsLoggedIn(loggedIn);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("currentUser");
    setIsLoggedIn(false);
  };

  return (
    <div>
      {isLoggedIn && <Nav setIsLoggedIn={handleLogout} />}
      <Routes>
        {!isLoggedIn && (
          <Route path="/*" element={<Auth setIsLoggedIn={setIsLoggedIn} />} />
        )}
        {isLoggedIn && (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/Explore" element={<Explore />} />
            <Route path="/Specialists" element={<Specialists />} />
            <Route path="/doctor-details/:category?" element={<DoctorDetails />} />
            <Route path="/Services" element={<Services />} />
            <Route path="/book-appointment" element={<BookAppointment />} />
            <Route path="/confirmation/:appointmentId" element={<AppointmentConfirmation />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/payment/:appointmentId" element={<Payment />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/confirmation" element={<AppointmentConfirmation />} />
            
          </>
        )}
      </Routes>
      {isLoggedIn && <Footer />}
    </div>
  );
}

export default App;