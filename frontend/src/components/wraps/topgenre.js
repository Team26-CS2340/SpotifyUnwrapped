// src/wraps/TopGenre.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../Layout';

const TopGenre = () => {
    const navigate = useNavigate();
    const wrapData = JSON.parse(localStorage.getItem('wrapData'));
    const topGenre = wrapData?.data?.top_genres?.[0];

    if (!wrapData) {
        navigate('/wrap');
        return null;
    }

    return (
        <Layout>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: 'calc(100vh - 90px)',
                padding: '10px',
                marginTop: '20px',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                backgroundImage: 'url(/TopGenre.png)',
            }}>
                <div style={{
                    maxWidth: '1200px',
                    width: '100%',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '40px'
                }}>
                    <div style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        padding: '40px',
                        borderRadius: '20px',
                        color: 'white',
                        width: '80%',
                        maxWidth: '700px',
                        marginBottom: '40px'
                    }}>
                        <h1 style={{
                            color: '#1DB954',
                            marginBottom: '20px',
                            fontSize: '2.5em'
                        }}>
                            Your Top Genre
                        </h1>

                        <h2 style={{
                            color: 'white',
                            fontSize: '4em',
                            marginBottom: '20px',
                            fontWeight: 'bold',
                            textTransform: 'uppercase'
                        }}>
                            {topGenre || 'Loading...'}
                        </h2>
                    </div>

                    <button
                        onClick={() => navigate('/top5genres')}
                        style={{
                            backgroundColor: '#1DB954',
                            color: 'white',
                            border: 'none',
                            padding: '15px 40px',
                            borderRadius: '25px',
                            fontSize: '18px',
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
                        Next →
                    </button>
                </div>
            </div>
        </Layout>
    );
};

export default TopGenre;