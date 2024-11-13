// src/components/wraps/SpotifyWrap.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout, { ThemeContext } from '../Layout';

function SpotifyWrap() {
    const [loading, setLoading] = useState(false);
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
                localStorage.setItem('wrapData', JSON.stringify(data));
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

    if (loading) {
        return (
            <Layout>
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    minHeight: 'calc(100vh - 90px)',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
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
                    minHeight: 'calc(100vh - 90px)',
                    padding: '20px',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)'
                }}>
                    <div style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        padding: '30px',
                        borderRadius: '15px',
                        textAlign: 'center'
                    }}>
                        <div style={{ color: '#ff4444', marginBottom: '20px', fontSize: '1.2em' }}>
                            Error: {error}
                        </div>
                        <button
                            onClick={() => setError(null)}
                            style={{
                                backgroundColor: '#1DB954',
                                color: 'white',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '20px',
                                cursor: 'pointer',
                                fontSize: '1.1em',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'scale(1.05)';
                                e.currentTarget.style.backgroundColor = '#1ed760';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.backgroundColor = '#1DB954';
                            }}
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: 'calc(100vh - 90px)',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: '20px'
            }}>
                <div style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    padding: '40px',
                    borderRadius: '20px',
                    textAlign: 'center',
                    maxWidth: '600px',
                    width: '100%'
                }}>
                    <h1 style={{
                        color: '#1DB954',
                        fontSize: '3em',
                        marginBottom: '20px'
                    }}>
                        Spotify Wrapped 2024
                    </h1>
                    
                    <p style={{
                        color: 'white',
                        fontSize: '1.2em',
                        marginBottom: '30px',
                        lineHeight: '1.6'
                    }}>
                        Ready to see your year in music? Click below to create your personalized Spotify Wrapped!
                    </p>

                    <button
                        onClick={createWrap}
                        style={{
                            backgroundColor: '#1DB954',
                            color: 'white',
                            border: 'none',
                            padding: '15px 40px',
                            borderRadius: '25px',
                            fontSize: '1.2em',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05)';
                            e.currentTarget.style.backgroundColor = '#1ed760';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.backgroundColor = '#1DB954';
                        }}
                    >
                        Create Your Wrap
                    </button>
                </div>
            </div>
        </Layout>
    );
}

export default SpotifyWrap;