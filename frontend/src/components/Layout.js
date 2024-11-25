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
        
        root.style.setProperty('--bg-primary', colors.containerBg);
        root.style.setProperty('--bg-secondary', colors.headerBg);
        root.style.setProperty('--text-primary', colors.textPrimary);
        root.style.setProperty('--text-secondary', colors.textSecondary);
        root.style.setProperty('--border-color', colors.borderColor);
        root.style.setProperty('--accent-color', colors.accent);
        root.style.setProperty('--accent-color-secondary', colors.accentSecondary);
    };

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

    const shareButtonStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '48px',
        height: '48px',
        margin: '0 10px',
        borderRadius: '50%',
        background: 'linear-gradient(to right, #40916c, #1B4332)',
        color: '#FFFFFF',
        textDecoration: 'none',
        transition: 'transform 0.2s ease, background 0.3s ease',
        cursor: 'pointer'
    };

    
    
    const iconStyle = {
        width: '40px',
        height: '40px',
        fill: isDarkMode ? '#FFFFFF' : '#1B4332', // Changes color based on dark mode
        margin: '0 15px',
        cursor: 'pointer',
        transition: 'transform 0.2s ease, fill 0.3s ease', // Added transition for color change
        ':hover': {
            transform: 'scale(1.1)'
        }
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
                                <Link to="/savedwraps" style={navLinkStyle}>Saved Wraps</Link>
                                <Link to="/publicwraps" style={navLinkStyle}>View Other Wraps</Link>
                                <Link to="/contact" style={navLinkStyle}>Contact</Link>
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

                {/* Footer with theme-matching background */}
                <footer style={{
                    backgroundColor: 'linear-gradient(to right, #40916c, #1B4332)',
                    color: colors.textPrimary,
                    padding: '20px',
                    textAlign: 'center',
                    transition: 'background-color 0.3s ease'
                }}>
                    <section id="share">
                    <h2 style={{ fontFamily: "'Quicksand', sans-serif", fontSize: '2.5rem', fontWeight: '600', letterSpacing: '-0.02em' }}>Share Your Wrapped</h2>

                        <div style={{ marginTop: '20px', marginBottom: '20px' }}>
                            {/* Twitter */}
                            <svg viewBox="0 0 24 24" style={iconStyle} onClick={() => window.open('#', '_blank')}>
                                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
                            </svg>

                            {/* LinkedIn */}
                            <svg viewBox="0 0 24 24" style={iconStyle} onClick={() => window.open('#', '_blank')}>
                                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                                <rect x="2" y="9" width="4" height="12"/>
                                <circle cx="4" cy="4" r="2"/>
                            </svg>

                            {/* Facebook */}
                            <svg viewBox="0 0 24 24" style={iconStyle} onClick={() => window.open('#', '_blank')}>
                                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                            </svg>

                            {/* Instagram */}
                            <svg viewBox="0 0 24 24" style={iconStyle} onClick={() => window.open('#', '_blank')}>
                                <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/>
                                <path d="M12 6a6 6 0 1 0 6 6 6 6 0 0 0-6-6zm0 10a4 4 0 1 1 4-4 4 4 0 0 1-4 4z"/>
                                <circle cx="18.5" cy="5.5" r="1.5"/>
                            </svg>
                        </div>
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