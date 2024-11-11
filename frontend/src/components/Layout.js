// src/components/Layout.js
import React, { createContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Create theme context
export const ThemeContext = createContext();

const Layout = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isHarrisonFordMode, setIsHarrisonFordMode] = useState(false);

    // Initialize theme states from localStorage
    useEffect(() => {
        const darkModeEnabled = localStorage.getItem('dark-mode') === 'enabled';
        const harrisonFordEnabled = localStorage.getItem('harrison-ford-theme') === 'enabled';
        
        setIsDarkMode(darkModeEnabled);
        setIsHarrisonFordMode(harrisonFordEnabled);
        
        // Set CSS variables for theme
        const root = document.documentElement;
        if (darkModeEnabled) {
            document.body.classList.add('dark-mode');
            root.style.setProperty('--bg-primary', '#121212');
            root.style.setProperty('--bg-secondary', '#282828');
            root.style.setProperty('--bg-tertiary', '#3e3e3e');
            root.style.setProperty('--text-primary', '#ffffff');
            root.style.setProperty('--text-secondary', '#b3b3b3');
            root.style.setProperty('--text-tertiary', '#888888');
            root.style.setProperty('--border-color', '#404040');
        } else {
            document.body.classList.remove('dark-mode');
            root.style.setProperty('--bg-primary', '#ffffff');
            root.style.setProperty('--bg-secondary', '#f5f5f5');
            root.style.setProperty('--bg-tertiary', '#e8e8e8');
            root.style.setProperty('--text-primary', '#333333');
            root.style.setProperty('--text-secondary', '#666666');
            root.style.setProperty('--text-tertiary', '#999999');
            root.style.setProperty('--border-color', '#dddddd');
        }
        
        if (harrisonFordEnabled) {
            document.body.classList.add('harrison-ford-theme');
        }
    }, []);

    // Handle dark mode toggle
    const handleDarkModeToggle = (event) => {
        const enabled = event.target.checked;
        setIsDarkMode(enabled);
        
        const root = document.documentElement;
        if (enabled) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('dark-mode', 'enabled');
            root.style.setProperty('--bg-primary', '#121212');
            root.style.setProperty('--bg-secondary', '#282828');
            root.style.setProperty('--bg-tertiary', '#3e3e3e');
            root.style.setProperty('--text-primary', '#ffffff');
            root.style.setProperty('--text-secondary', '#b3b3b3');
            root.style.setProperty('--text-tertiary', '#888888');
            root.style.setProperty('--border-color', '#404040');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('dark-mode', 'disabled');
            root.style.setProperty('--bg-primary', '#ffffff');
            root.style.setProperty('--bg-secondary', '#f5f5f5');
            root.style.setProperty('--bg-tertiary', '#e8e8e8');
            root.style.setProperty('--text-primary', '#333333');
            root.style.setProperty('--text-secondary', '#666666');
            root.style.setProperty('--text-tertiary', '#999999');
            root.style.setProperty('--border-color', '#dddddd');
        }
    };

    // Handle Harrison Ford theme toggle
    const handleHarrisonFordToggle = (event) => {
        const enabled = event.target.checked;
        setIsHarrisonFordMode(enabled);
        
        if (enabled) {
            document.body.classList.add('harrison-ford-theme');
            localStorage.setItem('harrison-ford-theme', 'enabled');
        } else {
            document.body.classList.remove('harrison-ford-theme');
            localStorage.setItem('harrison-ford-theme', 'disabled');
        }
    };

    const headerStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: isDarkMode ? '#282828' : 'white',
        padding: '15px 0',
        zIndex: 1000,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    };

    const navLinkStyle = {
        color: isDarkMode ? 'white' : '#333',
        textDecoration: 'none',
        marginRight: '20px',
        fontWeight: '500',
        transition: 'color 0.3s ease'
    };

    return (
        <ThemeContext.Provider value={{ isDarkMode }}>
            <div style={{
                minHeight: '100vh',
                backgroundImage: 'url("/background.jpeg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed'
            }}>
                {/* Header */}
                <header style={headerStyle}>
                    <div style={{ 
                        maxWidth: '1200px', 
                        margin: '0 auto', 
                        padding: '0 20px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Link to="/" style={{ ...navLinkStyle, fontSize: '24px', fontWeight: 'bold', color: '#1DB954' }}>
                                Spotify Wrapped
                            </Link>
                            <nav style={{ marginLeft: '40px' }}>
                                <Link to="/personality" style={navLinkStyle}>Personality</Link>
                                <Link to="/wrap" style={navLinkStyle}>Your Wrap</Link>
                            </nav>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', color: isDarkMode ? 'white' : '#333' }}>
                            <label>
                                <input 
                                    type="checkbox"
                                    checked={isDarkMode}
                                    onChange={handleDarkModeToggle}
                                />
                                <span></span>
                                Dark Mode
                            </label>
                            <label>
                                <input 
                                    type="checkbox"
                                    checked={isHarrisonFordMode}
                                    onChange={handleHarrisonFordToggle}
                                />
                                <span></span>
                                Harrison Ford Theme
                            </label>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main style={{ 
                    paddingTop: '80px',
                    backgroundColor: isDarkMode ? 'rgba(0,0,0,0.9)' : 'rgba(255,255,255,0.7)',
                    minHeight: '100vh',
                    width: '100vw',
                    padding: 0,
                    boxSizing: 'border-box',
                    overflowX: 'hidden'
                }}>
                    {children}
                </main>

                {/* Footer */}
                <footer style={{
                    backgroundColor: 'rgba(0,0,0,0.9)',
                    color: 'white',
                    padding: '20px',
                    textAlign: 'center'
                }}>
                    <section id="share">
                        <h2>Share Your Wrapped!</h2>
                        <a id="twitter-share" href="#" target="_blank" rel="noopener noreferrer">Share on Twitter</a>
                        <a id="linkedin-share" href="#" target="_blank" rel="noopener noreferrer">Share on LinkedIn</a>
                        <a id="facebook-share" href="#" target="_blank" rel="noopener noreferrer">Share on Facebook</a>
                        <a id="instagram-share" href="#" target="_blank" rel="noopener noreferrer">Share on Instagram</a>
                    </section>
                    <p>&copy; 2024 Spotify Wrapped</p>
                </footer>

                {isHarrisonFordMode && (
                    <div id="harrisonFordImage">
                        <img src="/images/harrison_ford.jpg" alt="Harrison Ford" />
                    </div>
                )}
            </div>
        </ThemeContext.Provider>
    );
};

export default Layout;