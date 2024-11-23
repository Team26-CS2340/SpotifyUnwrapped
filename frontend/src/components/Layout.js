import React, { createContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Create theme context with expanded color palette
export const ThemeContext = createContext();

const Layout = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isHarrisonFordMode, setIsHarrisonFordMode] = useState(false);

    // Expanded theme colors object with both dark and light mode values
    const getThemeColors = (darkMode) => ({
        // Container backgrounds
        containerBg: darkMode ? '#1E2A47' : '#E6F3FF', // Changed light mode to light blue
        
        // Text colors
        textPrimary: darkMode ? '#FFFFFF' : '#1B4332', // Changed light mode to dark green
        textSecondary: darkMode ? '#A0AEC0' : '#2D6A4F', // Changed light mode to slightly lighter green
        
        // Accent colors
        accent: darkMode ? '#A29BFE' : '#1B4332', // Changed light mode to dark green
        accentSecondary: darkMode ? '#6C63FF' : '#2D6A4F',
        
        // UI element colors
        buttonBg: darkMode ? '#6C63FF' : '#2D6A4F',
        buttonText: '#FFFFFF',
        headerBg: darkMode ? '#282828' : '#FFFFFF',
        borderColor: darkMode ? '#404040' : '#D1E9FF',
        
        // Overlay backgrounds
        overlayBg: darkMode ? 'rgba(0,0,0,0.9)' : 'rgba(230, 243, 255, 0.9)',
    });

    // Initialize theme states from localStorage
    useEffect(() => {
        const darkModeEnabled = localStorage.getItem('dark-mode') === 'enabled';
        const harrisonFordEnabled = localStorage.getItem('harrison-ford-theme') === 'enabled';
        
        setIsDarkMode(darkModeEnabled);
        setIsHarrisonFordMode(harrisonFordEnabled);
        
        // Set CSS variables for theme
        const root = document.documentElement;
        const colors = getThemeColors(darkModeEnabled);
        
        if (darkModeEnabled) {
            document.body.classList.add('dark-mode');
            root.style.setProperty('--bg-primary', '#1E2A47');
            root.style.setProperty('--bg-secondary', colors.headerBg);
            root.style.setProperty('--bg-tertiary', '#3e3e3e');
            root.style.setProperty('--text-primary', colors.textPrimary);
            root.style.setProperty('--text-secondary', colors.textSecondary);
            root.style.setProperty('--border-color', colors.borderColor);
            root.style.setProperty('--accent-color', colors.accent);
        } else {
            document.body.classList.remove('dark-mode');
            root.style.setProperty('--bg-primary', '#E6F3FF');
            root.style.setProperty('--bg-secondary', colors.headerBg);
            root.style.setProperty('--bg-tertiary', '#e8e8e8');
            root.style.setProperty('--text-primary', colors.textPrimary);
            root.style.setProperty('--text-secondary', colors.textSecondary);
            root.style.setProperty('--border-color', colors.borderColor);
            root.style.setProperty('--accent-color', colors.accent);
        }
    }, []);

    // Handle dark mode toggle with updated colors
    const handleDarkModeToggle = (event) => {
        const enabled = event.target.checked;
        setIsDarkMode(enabled);
        
        const root = document.documentElement;
        const colors = getThemeColors(enabled);
        
        if (enabled) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('dark-mode', 'enabled');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('dark-mode', 'disabled');
        }
        
        // Update CSS variables with new theme colors
        root.style.setProperty('--bg-primary', colors.containerBg);
        root.style.setProperty('--bg-secondary', colors.headerBg);
        root.style.setProperty('--text-primary', colors.textPrimary);
        root.style.setProperty('--text-secondary', colors.textSecondary);
        root.style.setProperty('--border-color', colors.borderColor);
        root.style.setProperty('--accent-color', colors.accent);
        root.style.setProperty('--accent-color-secondary', colors.accentSecondary);
        
    };

    // Rest of the component remains the same
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

    const getBackgroundImage = () => {
        if (isHarrisonFordMode) {
            return 'url("/backgroundStarry.jpeg")';
        } else if (isDarkMode) {
            return 'url("/backgroundDark.jpeg")';
        }
        return 'url("/background.jpeg")';
    };


    const colors = getThemeColors(isDarkMode);

    const headerStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.headerBg,
        padding: '15px 0',
        zIndex: 1000,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    };

    const navLinkStyle = {
        color: colors.textPrimary,
        textDecoration: 'none',
        marginRight: '20px',
        fontWeight: '500',
        transition: 'color 0.3s ease'
    };

    return (
        <ThemeContext.Provider value={{ isDarkMode, colors }}>
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
                                color: colors.accent,
                                transition: 'color 0.3s ease'
                            }}>
                                Spotify Wrapped
                            </Link>
                            <nav style={{ marginLeft: '40px' }}>
                                <Link to="/personality" style={navLinkStyle}>Personality</Link>
                                <Link to="/wrap" style={navLinkStyle}>Your Wrap</Link>
                            </nav>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', color: colors.textPrimary }}>
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
                    backgroundColor: colors.overlayBg,
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