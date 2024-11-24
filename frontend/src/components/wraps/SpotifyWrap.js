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

    const themeColors = {
        buttonBg: '#6C63FF',                
        buttonText: '#FFFFFF',              
        background: 'var(--bg-primary)',    
        textPrimary: 'var(--text-primary)', 
        accent: 'var(--accent-color)'       
    };

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

    const content = (
        <div style={{
            width: '100%',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            boxSizing: 'border-box',
            marginTop: '-10vh',
            fontFamily: 'Quicksand, sans-serif'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '900px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '40px',
                padding: '60px 40px',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: '24px',
                boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)'
            }}>
                {/* Header */}
                <div style={{
                    textAlign: 'center',
                    marginBottom: '20px'
                }}>
                    <h1 style={{ 
                        color: themeColors.accent,
                        fontSize: '42px',
                        fontWeight: 'bold',
                        fontFamily: 'Quicksand, sans-serif',
                        margin: '0 0 16px 0',
                        letterSpacing: '-0.02em'
                    }}>
                        Spotify Wrapped 2024
                    </h1>
                    <div style={{
                        width: '60px',
                        height: '4px',
                        backgroundColor: themeColors.accent,
                        margin: '0 auto',
                        borderRadius: '2px'
                    }}/>
                </div>

                {/* Content */}
                {loading ? (
                    <div style={{ 
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '20px'
                    }}>
                        <div style={{ 
                            width: '40px', 
                            height: '40px', 
                            border: `3px solid ${themeColors.accent}`, 
                            borderTopColor: 'transparent',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                        }} />
                        <div style={{ color: themeColors.accent, fontSize: '20px' }}>
                            Creating your Wrap...
                        </div>
                    </div>
                ) : error ? (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ color: '#ff4444', marginBottom: '20px', fontSize: '1.2em' }}>
                            Error: {error}
                        </div>
                        <button
                            onClick={() => setError(null)}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0px 6px 12px rgba(0, 0, 0, 0.2)';
                                e.currentTarget.style.backgroundColor = '#5B54D9'; // Slightly darker purple
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.2)';
                                e.currentTarget.style.backgroundColor = themeColors.buttonBg;
                            }}
                            style={{
                                backgroundColor: themeColors.buttonBg,
                                color: themeColors.buttonText,
                                border: 'none',
                                padding: '14px 28px',
                                borderRadius: '30px',
                                cursor: 'pointer',
                                fontFamily: 'Quicksand, sans-serif',
                                fontSize: '16px',
                                fontWeight: '600',
                                letterSpacing: '0.5px',
                                transition: 'all 0.3s ease',
                                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)'
                            }}
                        >
                            Try Again
                        </button>
                    </div>
                ) : (
                    <>
                        <p style={{
                            color: 'var(--text-primary)',
                            fontSize: '18px',
                            marginBottom: '30px',
                            lineHeight: '1.6',
                            textAlign: 'center'
                        }}>
                            Ready to see your year in music? Click below to create your personalized Spotify Wrapped!
                        </p>

                        <button
                            onClick={createWrap}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0px 6px 12px rgba(0, 0, 0, 0.2)';
                                e.currentTarget.style.backgroundColor = '#5B54D9'; // Slightly darker purple
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.2)';
                                e.currentTarget.style.backgroundColor = themeColors.buttonBg;
                            }}
                            style={{
                                backgroundColor: themeColors.buttonBg,
                                color: themeColors.buttonText,
                                border: 'none',
                                padding: '14px 28px',
                                borderRadius: '30px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
                                minWidth: '200px',
                                fontFamily: 'Quicksand, sans-serif',
                                letterSpacing: '0.5px'
                            }}
                        >
                            Create Your Wrap
                        </button>
                    </>
                )}
            </div>
        </div>
    );

    return <Layout>{content}</Layout>;
}

export default SpotifyWrap;