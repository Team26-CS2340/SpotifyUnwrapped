import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles.css';

export default function Dashboard() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isHarrisonFordMode, setIsHarrisonFordMode] = useState(false);

    // Initialize theme states from localStorage
    useEffect(() => {
        const darkModeEnabled = localStorage.getItem('dark-mode') === 'enabled';
        const harrisonFordEnabled = localStorage.getItem('harrison-ford-theme') === 'enabled';
        
        setIsDarkMode(darkModeEnabled);
        setIsHarrisonFordMode(harrisonFordEnabled);
        
        if (darkModeEnabled) {
            document.body.classList.add('dark-mode');
        }
        
        if (harrisonFordEnabled) {
            document.body.classList.add('harrison-ford-theme');
        }
    }, []);

    // Handle dark mode toggle
    const handleDarkModeToggle = (event) => {
        const enabled = event.target.checked;
        setIsDarkMode(enabled);
        
        if (enabled) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('dark-mode', 'enabled');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('dark-mode', 'disabled');
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

    // Fetch user data from the backend
    const fetchUserData = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/user/data/', {
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }
            const data = await response.json();
            setUserData(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching user data:', err);
            setError(err.message || 'Failed to load user data');
            if (err.status === 401) {
                window.location.href = '/';
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    // Refresh data handler
    const handleRefreshData = async () => {
        try {
            setRefreshing(true);
            const response = await fetch('http://localhost:8000/api/user/refresh-spotify/', {
                method: 'POST',
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error('Failed to refresh data');
            }
            await fetchUserData();
        } catch (err) {
            console.error('Error refreshing data:', err);
            setError(err.message || 'Failed to refresh data');
        } finally {
            setRefreshing(false);
        }
    };

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundImage: 'url("/background.jpeg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}>
                <div style={{ width: '50px', height: '50px', border: '3px solid #1DB954', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundImage: 'url("/background.jpeg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}>
                <div style={{ 
                    backgroundColor: 'rgba(0,0,0,0.7)', 
                    padding: '20px', 
                    borderRadius: '10px',
                    color: 'white',
                    textAlign: 'center'
                }}>
                    <p style={{ color: '#ff4444', marginBottom: '20px' }}>{error}</p>
                    <button
                        onClick={() => window.location.href = '/'}
                        style={{
                            backgroundColor: '#1DB954',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '20px',
                            cursor: 'pointer'
                        }}
                    >
                        Reconnect to Spotify
                    </button>
                </div>
            </div>
        );
    }

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
                <div style={{ 
                    width: '100%',
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '20px 40px',
                    boxSizing: 'border-box'
                }}>
                    <section style={{ 
                        backgroundColor: isDarkMode ? '#282828' : 'white',
                        padding: '20px',
                        borderRadius: '8px',
                        marginBottom: '20px',
                        color: isDarkMode ? 'white' : '#333'
                    }}>
                        <h2 style={{ color: '#1DB954', marginTop: 0 }}>{userData?.spotify_profile?.display_name}'s Stats</h2>
                        <button
                            onClick={handleRefreshData}
                            disabled={refreshing}
                            style={{
                                backgroundColor: '#1DB954',
                                color: 'white',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '20px',
                                cursor: refreshing ? 'not-allowed' : 'pointer',
                                opacity: refreshing ? 0.7 : 1
                            }}
                        >
                            {refreshing ? 'Refreshing...' : 'Refresh Data'}
                        </button>
                        <div style={{ 
                            display: 'grid',
                            gridTemplateColumns: 'repeat(4, 1fr)',
                            gap: '20px',
                            marginTop: '20px'
                        }}>
                            <div>
                                <h3 style={{ color: '#1DB954', marginTop: 0 }}>Saved Tracks</h3>
                                <p style={{ 
                                    color: isDarkMode ? 'white' : '#333',
                                    fontSize: '24px',
                                    fontWeight: 'bold',
                                    margin: '10px 0'
                                }}>
                                    {userData?.spotify_data?.saved_tracks_count}
                                </p>
                            </div>
                            <div>
                                <h3 style={{ color: '#1DB954', marginTop: 0 }}>Saved Albums</h3>
                                <p style={{ 
                                    color: isDarkMode ? 'white' : '#333',
                                    fontSize: '24px',
                                    fontWeight: 'bold',
                                    margin: '10px 0'
                                }}>
                                    {userData?.spotify_data?.saved_albums_count}
                                </p>
                            </div>
                            <div>
                                <h3 style={{ color: '#1DB954', marginTop: 0 }}>Playlists</h3>
                                <p style={{ 
                                    color: isDarkMode ? 'white' : '#333',
                                    fontSize: '24px',
                                    fontWeight: 'bold',
                                    margin: '10px 0'
                                }}>
                                    {userData?.spotify_data?.playlist_count}
                                </p>
                            </div>
                            <div>
                                <h3 style={{ color: '#1DB954', marginTop: 0 }}>Following</h3>
                                <p style={{ 
                                    color: isDarkMode ? 'white' : '#333',
                                    fontSize: '24px',
                                    fontWeight: 'bold',
                                    margin: '10px 0'
                                }}>
                                    {userData?.spotify_data?.favorite_artists_count}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Top Artists Section */}
                    <section style={{ 
                        backgroundColor: isDarkMode ? '#282828' : 'white',
                        padding: '20px',
                        borderRadius: '8px',
                        marginBottom: '20px',
                        color: isDarkMode ? 'white' : '#333'
                    }}>
                        <h2 style={{ color: '#1DB954', marginTop: 0 }}>Top Artists</h2>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {userData?.spotify_data?.top_artists?.items?.slice(0, 5).map((artist, index) => (
                                <li key={artist.id} style={{ 
                                    marginBottom: '15px',
                                    borderBottom: `1px solid ${isDarkMode ? '#444' : '#ddd'}`,
                                    paddingBottom: '15px',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}>
                                    <strong style={{ 
                                        color: '#1DB954', 
                                        marginRight: '15px',
                                        fontSize: '20px'
                                    }}>#{index + 1}</strong>
                                    <div>
                                        <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{artist.name}</div>
                                        {artist.genres?.length > 0 && (
                                            <div style={{ color: isDarkMode ? '#999' : '#666', fontSize: '14px' }}>
                                                {artist.genres.slice(0, 2).join(', ')}
                                            </div>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* Recently Played Section */}
                    <section style={{ 
                        backgroundColor: isDarkMode ? '#282828' : 'white',
                        padding: '20px',
                        borderRadius: '8px',
                        color: isDarkMode ? 'white' : '#333'
                    }}>
                        <h2 style={{ color: '#1DB954', marginTop: 0 }}>Recently Played</h2>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {userData?.spotify_data?.recently_played?.items?.slice(0, 5).map((item) => (
                                <li key={`${item.track.id}-${item.played_at}`} style={{
                                    marginBottom: '15px',
                                    borderBottom: `1px solid ${isDarkMode ? '#444' : '#ddd'}`,
                                    paddingBottom: '15px',
                                    lastChild: { marginBottom: 0, borderBottom: 'none' }
                                }}>
                                    <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{item.track.name}</div>
                                    <div style={{ color: isDarkMode ? '#999' : '#666', fontSize: '14px' }}>
                                        by {item.track.artists.map(a => a.name).join(', ')}
                                    </div>
                                    <div style={{ color: isDarkMode ? '#888' : '#888', fontSize: '12px', marginTop: '5px' }}>
                                        {new Date(item.played_at).toLocaleString()}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>
            </main>

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
    );
}