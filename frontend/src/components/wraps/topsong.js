import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../Layout';

const TopSong = () => {
    const navigate = useNavigate();
    const wrapData = JSON.parse(localStorage.getItem('wrapData'))?.data;
    const [audio, setAudio] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

    useEffect(() => {
        // Log initial wrapData
        console.log('Initial wrapData:', wrapData);
        console.log('Preview URL:', wrapData?.top_track?.preview_url);
        
        return () => {
            if (audio) {
                audio.pause();
                audio.src = '';
            }
        };
    }, [audio]);

    const handlePlayPreview = (previewUrl) => {
        console.log('Attempting to play preview URL:', previewUrl);
        
        if (!previewUrl) {
            console.log('No preview URL available for this track');
            return;
        }

        if (audio && !audio.paused) {
            console.log('Pausing current audio');
            audio.pause();
            setIsPlaying(false);
        } else {
            console.log('Creating new audio instance');
            const newAudio = new Audio(previewUrl);
            
            newAudio.addEventListener('error', (e) => {
                console.error('Audio error:', e);
            });

            newAudio.addEventListener('loadstart', () => {
                console.log('Audio loading started');
            });

            newAudio.addEventListener('canplay', () => {
                console.log('Audio can play');
            });

            newAudio.volume = isMuted ? 0 : 1;
            setAudio(newAudio);
            
            newAudio.play().then(() => {
                console.log('Audio playing successfully');
                setIsPlaying(true);
            }).catch(err => {
                console.error('Error playing audio:', err);
            });
            
            newAudio.onended = () => {
                console.log('Audio playback ended');
                setIsPlaying(false);
            };
        }
    };

    const toggleMute = () => {
        console.log('Toggling mute:', !isMuted);
        if (audio) {
            audio.volume = isMuted ? 1 : 0;
        }
        setIsMuted(!isMuted);
    };

    if (!wrapData) {
        console.log('No wrap data found, navigating to /wrap');
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
                        width: '80%',
                        maxWidth: '600px',
                        marginBottom: '40px'
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '20px'
                        }}>
                            <h1 style={{
                                color: '#1DB954',
                                margin: 0,
                                fontSize: '2.5em'
                            }}>
                                Your Top Track
                            </h1>
                            <button
                                onClick={toggleMute}
                                style={{
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#1DB954',
                                    fontSize: '24px',
                                    padding: '8px'
                                }}
                            >
                                {isMuted ? '🔇' : '🔊'}
                            </button>
                        </div>

                        <h2 style={{
                            color: 'white',
                            marginBottom: '15px',
                            fontSize: '2em'
                        }}>
                            {wrapData?.top_track?.name}
                        </h2>
                        <p style={{
                            color: '#b3b3b3',
                            fontSize: '1.5em',
                            marginBottom: '20px'
                        }}>
                            by {wrapData?.top_track?.artists?.join(', ')}
                        </p>

                        {wrapData?.top_track?.preview_url && (
                            <button
                                onClick={() => handlePlayPreview(wrapData.top_track.preview_url)}
                                style={{
                                    backgroundColor: isPlaying ? '#1DB954' : 'transparent',
                                    border: `2px solid ${isPlaying ? '#1DB954' : '#666'}`,
                                    borderRadius: '50%',
                                    width: '60px',
                                    height: '60px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    color: isPlaying ? 'white' : '#666',
                                    fontSize: '24px',
                                    transition: 'all 0.2s ease',
                                    margin: '0 auto'
                                }}
                            >
                                {isPlaying ? '⏸️' : '▶️'}
                            </button>
                        )}
                    </div>

                    <button
                        onClick={() => navigate('/top5songs')}
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

export default TopSong;