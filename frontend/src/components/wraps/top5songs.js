import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../Layout';

const Top5Songs = () => {
    const navigate = useNavigate();
    const [playing, setPlaying] = useState(null);
    const audioRef = useRef(new Audio());
    const wrapData = JSON.parse(localStorage.getItem('wrapData'));
    const topTracks = wrapData?.data?.top_tracks?.items?.slice(0, 5) || [];

    useEffect(() => {
        audioRef.current.addEventListener('ended', () => setPlaying(null));
        return () => {
            audioRef.current.pause();
            audioRef.current.removeEventListener('ended', () => setPlaying(null));
        };
    }, []);

    const handlePlayPause = (previewUrl, index) => {
        if (playing === index) {
            audioRef.current.pause();
            setPlaying(null);
        } else {
            if (playing !== null) {
                audioRef.current.pause();
            }
            if (previewUrl) {
                audioRef.current.src = previewUrl;
                audioRef.current.play();
                setPlaying(index);
            }
        }
    };

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
                backgroundImage: 'url(/Top5Songs.png)',
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
                        padding: '30px',
                        borderRadius: '15px',
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
                            Your Top 5 Songs
                        </h1>
                        
                        {topTracks.map((track, index) => (
                            <div key={index} style={{
                                backgroundColor: 'rgba(29, 185, 84, 0.1)',
                                padding: '15px',
                                borderRadius: '10px',
                                marginBottom: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                textAlign: 'left'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                                    <div style={{
                                        backgroundColor: '#1DB954',
                                        color: 'white',
                                        width: '30px',
                                        height: '30px',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginRight: '20px',
                                        flexShrink: 0,
                                        fontSize: '1.2em',
                                        fontWeight: 'bold'
                                    }}>
                                        {index + 1}
                                    </div>
                                    <div>
                                        <div style={{
                                            color: 'white',
                                            fontSize: '1.3em',
                                            fontWeight: 'bold',
                                            marginBottom: '5px'
                                        }}>
                                            {track.name}
                                        </div>
                                        <div style={{
                                            color: '#b3b3b3',
                                            fontSize: '1em'
                                        }}>
                                            by {track.artists?.join(', ')}
                                        </div>
                                    </div>
                                </div>
                                {track.preview_url && (
                                    <button
                                        onClick={() => handlePlayPause(track.preview_url, index)}
                                        style={{
                                            backgroundColor: '#1DB954',
                                            border: 'none',
                                            borderRadius: '50%',
                                            width: '40px',
                                            height: '40px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            marginLeft: '15px',
                                            transition: 'all 0.2s ease',
                                            fontSize: '16px',
                                            color: 'white'
                                        }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.backgroundColor = '#1ed760';
                                            e.currentTarget.style.transform = 'scale(1.05)';
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.backgroundColor = '#1DB954';
                                            e.currentTarget.style.transform = 'scale(1)';
                                        }}
                                    >
                                        {playing === index ? '⏸' : '▶'}
                                    </button>
                                )}
                            </div>
                        ))}

                        {topTracks.length === 0 && (
                            <div style={{
                                color: '#b3b3b3',
                                fontSize: '1.2em',
                                marginTop: '20px'
                            }}>
                                No tracks data available
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => navigate('/topartist')}
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

export default Top5Songs;