// src/wraps/TopArtist.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../Layout';

const TopArtist = () => {
    const navigate = useNavigate();
    const wrapData = JSON.parse(localStorage.getItem('wrapData'));
    const topArtist = wrapData?.data?.top_artist;

    if (!wrapData) {
        navigate('/wrap');
        return null;
    }

    // Calculate popularity score visual representation
    const popularityBars = [];
    const totalBars = 20;
    const filledBars = Math.floor((topArtist?.popularity || 0) * totalBars / 100);
    
    for (let i = 0; i < totalBars; i++) {
        popularityBars.push(
            <div
                key={i}
                style={{
                    width: '12px',
                    height: '20px',
                    backgroundColor: i < filledBars ? '#1DB954' : 'rgba(255, 255, 255, 0.2)',
                    margin: '0 2px',
                    borderRadius: '2px',
                    transition: 'all 0.3s ease'
                }}
            />
        );
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
                backgroundColor: 'rgba(0, 0, 0, 0.8)'
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
                            marginBottom: '10px',
                            fontSize: '2.5em'
                        }}>
                            Your Top Artist
                        </h1>

                        <h2 style={{
                            color: 'white',
                            fontSize: '3.5em',
                            marginBottom: '20px',
                            fontWeight: 'bold'
                        }}>
                            {topArtist?.name || 'Loading...'}
                        </h2>

                        {/* Genres */}
                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            gap: '10px',
                            marginBottom: '30px'
                        }}>
                            {topArtist?.genres?.map((genre, index) => (
                                <span
                                    key={index}
                                    style={{
                                        backgroundColor: 'rgba(29, 185, 84, 0.3)',
                                        padding: '8px 15px',
                                        borderRadius: '20px',
                                        fontSize: '1em',
                                        color: '#ffffff'
                                    }}
                                >
                                    {genre}
                                </span>
                            ))}
                        </div>

                        {/* Popularity Score */}
                        <div style={{
                            marginTop: '20px'
                        }}>
                            <h3 style={{
                                color: '#1DB954',
                                marginBottom: '10px',
                                fontSize: '1.2em'
                            }}>
                                Artist Popularity
                            </h3>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '2px',
                                marginBottom: '10px'
                            }}>
                                {popularityBars}
                            </div>
                            <p style={{
                                color: '#b3b3b3',
                                fontSize: '1.1em'
                            }}>
                                {topArtist?.popularity || 0}% Popular on Spotify
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/top5artists')}
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

export default TopArtist;