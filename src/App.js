import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import CommunityMemberScreen from './screens/CommunityMemberScreen/CommunityMemberScreen';
import CommunityBuilder from './screens/CommunityBuilderScreen/CommunityBuilderScreen';
import TokenManagementScreen from './screens/TokenManagementScreen/TokenManagementScreen';
import CoreMemberScreen from './screens/CoreMemberScreen/CoreMemberScreen';
import LoginScreen from './screens/LoginScreen/LoginScreen';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import MemberScreen from './screens/MemberScreen/MemberScreen';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsLoggedIn(false);
  };

  // 👇 Role-based redirection
  const getDashboardRoute = () => {
    if (user?.role === 'admin') return '/coremembermanagement';
    if (user?.role === 'builder') return '/communitymembermanagement';
    if (user?.role === 'core') return '/communitybuildermanagement';
    if (user?.role === 'admin') return '/tokenmanagement';
    if (user?.role === 'community') return '/communitymember';
    


    return '/';
  };

  return (
    <Router>
      <div className="App">
      <Navbar isLoggedIn={isLoggedIn} username={user?.username} onLogout={handleLogout} user={user} />

        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn
                ? <Navigate to={getDashboardRoute()} replace />
                : <LoginScreen onLoginSuccess={handleLoginSuccess} />
            }
          />

          <Route
            path="/communitymembermanagement"
            element={
              isLoggedIn && (user?.role === 'builder' || user?.role === 'admin')
                ? <CommunityMemberScreen />
                : <Navigate to="/" replace />
            }
          />

          <Route
            path="/coremembermanagement"
            element={
              isLoggedIn && (user?.role === 'admin' || user?.role === 'admin')
                ? <CoreMemberScreen />
                : <Navigate to="/" replace />
            }
          />

          <Route
            path="/communitybuildermanagement"
            element={
              isLoggedIn && (user?.role === 'core' || user?.role === 'admin')
                ? <CommunityBuilder />
                : <Navigate to="/" replace />
            }
          />

          <Route
            path="/tokenmanagement"
            element={
              isLoggedIn && user?.role === 'admin'
                ? <TokenManagementScreen />
                : <Navigate to="/" replace />
            }
          />

<Route
            path="/communitymember"
            element={
              isLoggedIn && (user?.role === 'community' || user?.role === 'admin')
                ? <MemberScreen />
                : <Navigate to="/" replace />
            }
          />
        </Routes>

        

        <Footer />
      </div>
    </Router>
  );
};

export default App;
