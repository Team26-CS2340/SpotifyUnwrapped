import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './styles.css'; // Import animation styles

import SpotifyLogin from './components/SpotifyLogin';
import Dashboard from './components/Dashboard';
import PersonalityAnalysis from './components/PersonalityAnalysis';
import SpotifyWrap from './components/wraps/SpotifyWrap';
import Welcome from './components/wraps/Welcome';
import TopSong from './components/wraps/topsong';
import Top5Songs from './components/wraps/top5songs';
import TopArtist from './components/wraps/topartist';
import Top5Genres from './components/wraps/top5genres';
import TopGenre from './components/wraps/topgenre';
import TopAlbum from './components/wraps/topalbum';
import Finish from './components/wraps/finish';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/" />;
};

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    // Scroll to the top of the page when the location changes
    window.scrollTo(0, 0);
  }, [location]);

  return null; // This component does not render anything
};

const AnimatedRoutes = () => {
  const location = useLocation();

  // Check if the route corresponds to the wraps folder
  const isWrapsRoute =
    location.pathname.startsWith('/welcome') ||
    location.pathname.startsWith('/topsong') ||
    location.pathname.startsWith('/top5songs') ||
    location.pathname.startsWith('/topartist') ||
    location.pathname.startsWith('/top5genres') ||
    location.pathname.startsWith('/topgenre') ||
    location.pathname.startsWith('/topalbum') ||
    location.pathname.startsWith('/finish');

  return (
    <TransitionGroup component={null}>
      <CSSTransition
        key={location.key}
        timeout={500}
        classNames={isWrapsRoute ? 'page-blur' : ''}
        unmountOnExit
      >
        <div className="page-container">
          <Routes location={location}>
            <Route path="/" element={<SpotifyLogin />} />
            <Route path="/personality" element={<PersonalityAnalysis />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/personality-analysis" element={<PersonalityAnalysis />} />
            <Route path="/wrap" element={<SpotifyWrap />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/topsong" element={<TopSong />} />
            <Route path="/top5songs" element={<Top5Songs />} />
            <Route path="/topartist" element={<TopArtist />} />
            <Route path="/top5genres" element={<Top5Genres />} />
            <Route path="/topgenre" element={<TopGenre />} />
            <Route path="/topalbum" element={<TopAlbum />} />
            <Route path="/finish" element={<Finish />} />
          </Routes>
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* ScrollToTop ensures all route changes scroll to the top */}
        <ScrollToTop />
        <AnimatedRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
