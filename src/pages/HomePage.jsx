import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import JourneyFilter from '../components/JourneyFilter';

const HomePage = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); 
  };

  return (
    <>
     <nav className="navbar-fullwidth">
        <div className="navbar-container">
        <h1 className="navbar-title">Journey Dashboard</h1>
    <button className="navbar-logout-btn" onClick={handleLogout}>
         Logout
      </button>
  </div>
</nav>


      <div>
        <JourneyFilter />
      </div>
    </>
  );
};

export default HomePage;
