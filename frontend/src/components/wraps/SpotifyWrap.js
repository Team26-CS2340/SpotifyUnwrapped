// src/components/wraps/SpotifyWrap.js
import React, { useState, useContext } from 'react';
import Layout, { ThemeContext } from '../Layout';

function SpotifyWrap() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [wrapData, setWrapData] = useState(null);
    const themeContext = useContext(ThemeContext);
    const isDarkMode = themeContext ? themeContext.isDarkMode : false;

    // Function to get CSRF token from cookies
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    const createWrap = async () => {
        setLoading(true);
        try {
            const csrfToken = getCookie('csrftoken');
            const response = await fetch('http://localhost:8000/api/wraps/create/', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken,
                }
            });
            
            const responseText = await response.text();
            try {
                const data = JSON.parse(responseText);
                setWrapData(data);
            } catch (parseError) {
                console.error('Parse error:', parseError);
                setError('Failed to parse server response');
            }
        } catch (err) {
            console.error('Network error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const content = (
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
                <h1 style={{ color: '#1DB954', marginTop: 0 }}>Spotify Wrap</h1>
                <button
                    onClick={createWrap}
                    disabled={loading}
                    style={{
                        backgroundColor: '#1DB954',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '20px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.7 : 1
                    }}
                >
                    {loading ? 'Creating...' : 'Create Wrap'}
                </button>

                {error && (
                    <div style={{
                        color: '#ff4444',
                        marginTop: '10px',
                        padding: '10px',
                        backgroundColor: isDarkMode ? 'rgba(255,0,0,0.1)' : 'rgba(255,0,0,0.05)',
                        borderRadius: '4px'
                    }}>
                        Error: {error}
                    </div>
                )}

                {wrapData && (
                    <div style={{
                        marginTop: '20px',
                        backgroundColor: isDarkMode ? '#1e1e1e' : '#f5f5f5',
                        padding: '15px',
                        borderRadius: '4px',
                        overflowX: 'auto'
                    }}>
                        <h2 style={{ color: '#1DB954', marginTop: 0 }}>Wrap Data:</h2>
                        <pre style={{
                            color: isDarkMode ? '#e0e0e0' : '#333',
                            fontSize: '14px',
                            lineHeight: '1.5'
                        }}>
                            {JSON.stringify(wrapData, null, 2)}
                        </pre>
                    </div>
                )}
            </section>
        </div>
    );

    return <Layout>{content}</Layout>;
}

export default SpotifyWrap;