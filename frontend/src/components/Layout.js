import React, { createContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Create theme context
export const ThemeContext = createContext();

const Layout = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isHarrisonFordMode, setIsHarrisonFordMode] = useState(false);

    // Theme colors
    const themeColors = {
        accent: isDarkMode ? '#E6E6FA' : '#006400' // Light purple in dark mode, dark green in light mode
    };

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
            root.style.setProperty('--accent-color', '#E6E6FA'); // Light purple for dark mode
        } else {
            document.body.classList.remove('dark-mode');
            root.style.setProperty('--bg-primary', '#ffffff');
            root.style.setProperty('--bg-secondary', '#f5f5f5');
            root.style.setProperty('--bg-tertiary', '#e8e8e8');
            root.style.setProperty('--text-primary', '#333333');
            root.style.setProperty('--text-secondary', '#666666');
            root.style.setProperty('--text-tertiary', '#999999');
            root.style.setProperty('--border-color', '#dddddd');
            root.style.setProperty('--accent-color', '#006400'); // Dark green for light mode
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
            root.style.setProperty('--accent-color', '#E6E6FA'); // Light purple for dark mode
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
            root.style.setProperty('--accent-color', '#006400'); // Dark green for light mode
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

    // Get the appropriate background image based on theme states
    const getBackgroundImage = () => {
        if (isHarrisonFordMode) {
            return 'url("/backgroundStarry.jpeg")';
        } else if (isDarkMode) {
            return 'url("/backgroundDark.jpeg")';
        }
        return 'url("/background.jpeg")';
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
        <ThemeContext.Provider value={{ isDarkMode, themeColors }}>
            <div style={{
                minHeight: '100vh',
                backgroundImage: getBackgroundImage(),
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
                transition: 'background-image 0.3s ease'
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
                            <Link to="/Dashboard" style={{ 
                                ...navLinkStyle, 
                                fontSize: '24px', 
                                fontWeight: 'bold', 
                                color: themeColors.accent,
                                transition: 'color 0.3s ease'
                            }}>
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
                    paddingTop: '120px',
                    backgroundColor: isDarkMode ? 'rgba(0,0,0,0.9)' : 'rgba(255,255,255,0.7)',
                    minHeight: '100vh',
                    position: 'relative',
                    overflow: 'hidden'
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