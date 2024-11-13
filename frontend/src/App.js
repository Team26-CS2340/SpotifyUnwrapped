import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import SpotifyLogin from './components/SpotifyLogin';
import Dashboard from './components/Dashboard';
import Home from './components/Home';
import PersonalityAnalysis from './components/PersonalityAnalysis';
import SpotifyWrap from './components/wraps/SpotifyWrap';
import ContactForm from './components/ContactForm';  // Import the ContactForm component
import ThankYouPage from './components/ThankYouPage';  // Import the ThankYouPage component
import './App.css';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();  // Using the AuthContext

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<SpotifyLogin />} />
          <Route path="/testing" element={<Home />} />
          <Route path="/personality" element={<PersonalityAnalysis />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="/wrap" element={<SpotifyWrap />} />
          <Route path="/contact" element={<ContactForm />} />  {/* Contact form route */}
          <Route path="/thank-you" element={<ThankYouPage />} />  {/* Thank You page route */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
