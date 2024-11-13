// src/wraps/Welcome.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../Layout';

const Welcome = () => {
    const navigate = useNavigate();
    return (
        <Layout>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: 'calc(100vh - 90px)',
                padding: '10px',
                marginTop: '20px',
                backgroundColor: 'rgba(0, 0, 0, 0.8)' // Dark background
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
                    <h1 style={{
                        color: '#1DB954',
                        fontSize: '3.5em',
                        marginBottom: '30px',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                    }}>
                        Welcome to Your Wrapped
                    </h1>

                    <div style={{
                        color: 'white',
                        fontSize: '1.5em',
                        marginBottom: '40px',
                        maxWidth: '800px'
                    }}>
                        Let's explore your year in music!
                    </div>

                    <button
                        onClick={() => navigate('/topsong')}
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
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                            marginTop: '20px'
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

export default Welcome;