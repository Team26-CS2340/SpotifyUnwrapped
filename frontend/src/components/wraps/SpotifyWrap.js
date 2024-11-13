import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout, { ThemeContext } from '../Layout';

function SpotifyWrap() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const themeContext = useContext(ThemeContext);
    const isDarkMode = themeContext ? themeContext.isDarkMode : false;

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

    useEffect(() => {
        const createWrap = async () => {
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
                    // Store wrap data in localStorage for access across components
                    localStorage.setItem('wrapData', JSON.stringify(data));
                    // Redirect to welcome page
                    navigate('/welcome');
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

        createWrap();
    }, [navigate]);

    if (loading) {
        return (
            <Layout>
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: 'calc(100vh - 90px)',
                    flexDirection: 'column',
                    gap: '20px'
                }}>
                    <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        border: '3px solid #1DB954', 
                        borderTopColor: 'transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }} />
                    <div style={{ color: '#1DB954', fontSize: '20px' }}>
                        Creating your Wrap...
                    </div>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 'calc(100vh - 90px)',
                    padding: '20px'
                }}>
                    <div style={{
                        backgroundColor: isDarkMode ? '#282828' : 'white',
                        padding: '20px',
                        borderRadius: '8px',
                        textAlign: 'center'
                    }}>
                        <div style={{ color: '#ff4444', marginBottom: '20px' }}>
                            Error: {error}
                        </div>
                        <button
                            onClick={() => window.location.reload()}
                            style={{
                                backgroundColor: '#1DB954',
                                color: 'white',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '20px',
                                cursor: 'pointer'
                            }}
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </Layout>
        );
    }

    return null; // Won't render this as we'll redirect
}

export default SpotifyWrap;