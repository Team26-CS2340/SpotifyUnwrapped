// src/wraps/Top5Genres.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../Layout';

const Top5Genres = () => {
    const navigate = useNavigate();
    const wrapData = JSON.parse(localStorage.getItem('wrapData'));
    const topGenres = wrapData?.data?.top_genres?.slice(0, 5) || [];

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
                            marginBottom: '30px',
                            fontSize: '2.5em'
                        }}>
                            Your Top 5 Genres
                        </h1>

                        {topGenres.map((genre, index) => (
                            <div
                                key={index}
                                style={{
                                    backgroundColor: 'rgba(29, 185, 84, 0.1)',
                                    padding: '20px',
                                    borderRadius: '15px',
                                    marginBottom: '15px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                    transition: 'transform 0.2s ease'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.transform = 'scale(1.02)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.transform = 'scale(1)';
                                }}
                            >
                                <div style={{
                                    backgroundColor: '#1DB954',
                                    color: 'white',
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: '20px',
                                    fontSize: '1.5em',
                                    fontWeight: 'bold'
                                }}>
                                    {index + 1}
                                </div>
                                <div style={{
                                    fontSize: index === 0 ? '2em' : 
                                            index === 1 ? '1.8em' : 
                                            index === 2 ? '1.6em' : 
                                            index === 3 ? '1.4em' : '1.2em',
                                    fontWeight: 'bold',
                                    textTransform: 'uppercase',
                                    color: 'white'
                                }}>
                                    {genre}
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => navigate('/finish')}
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
                        Finish →
                    </button>
                </div>
            </div>
        </Layout>
    );
};

export default Top5Genres;