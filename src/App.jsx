import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';

import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import JourneyFilter from './components/JourneyFilter';
import JourneyDetails from './pages/JourneyDetails';


const PrivateRoute = ({ children }) => {
  const { token } = useContext(AuthContext);
  return token ? children : <Navigate to="/" replace />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
         
          <Route path="/" element={<LoginPage />} />

          
          <Route path="/home" element={<PrivateRoute><HomePage /></PrivateRoute>} />
          <Route path="/journeys" element={<PrivateRoute><JourneyFilter /></PrivateRoute>} />
         <Route path="/journey/:id" element={<JourneyDetails />} />


          
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
