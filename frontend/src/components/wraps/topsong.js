import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../Layout';

const TopSong = () => {
    const navigate = useNavigate();
    const wrapData = JSON.parse(localStorage.getItem('wrapData'))?.data;
    const [audio, setAudio] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const progressBarRef = useRef(null);
    const progressBarContainerRef = useRef(null);

    useEffect(() => {
        // scroll to top of site on load
        window.scrollTo(0, 0);
        const newAudio = new Audio('/previewurl.mp3');
        newAudio.volume = volume;
        
        newAudio.addEventListener('loadedmetadata', () => {
            setDuration(newAudio.duration);
        });

        newAudio.addEventListener('timeupdate', () => {
            setCurrentTime(newAudio.currentTime);
        });

        newAudio.addEventListener('ended', () => {
            setIsPlaying(false);
            setCurrentTime(0);
            newAudio.currentTime = 0;
        });

        setAudio(newAudio);

        return () => {
            newAudio.pause();
            newAudio.src = '';
        };
    }, []);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const handlePlayPause = () => {
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (audio) {
            audio.volume = newVolume;
        }
        if (newVolume === 0) {
            setIsMuted(true);
        } else if (isMuted) {
            setIsMuted(false);
        }
    };

    const handleMuteToggle = () => {
        if (audio) {
            if (isMuted) {
                audio.volume = volume;
            } else {
                audio.volume = 0;
            }
            setIsMuted(!isMuted);
        }
    };

    const handleProgressBarClick = (e) => {
        if (!audio || !progressBarContainerRef.current) return;

        const rect = progressBarContainerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = x / rect.width;
        const newTime = percentage * duration;
        
        audio.currentTime = newTime;
        setCurrentTime(newTime);
    };

    if (!wrapData) {
        navigate('/wrap');
        return null;
    }

    const themeColors = {
        buttonBg: 'var(--accent-color)',
        buttonTextColor: '#FFFFFF',
        buttonHoverBg: '#5b54d9',
        background: 'var(--bg-primary)',
        textPrimary: 'var(--text-primary)',
        accent: 'var(--accent-color)'
    };

    return (
        <Layout>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: 'calc(100vh - 90px)',
                padding: '10px',
                marginTop: '20px',
                backgroundColor: themeColors.background,
                backgroundImage: 'url(/TopSong.png)',
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
                        <h1 style={{
                            color: themeColors.accent,
                            marginBottom: '20px',
                            fontSize: '2.5em'
                        }}>
                            Your Top Track
                        </h1>

                        <h2 style={{
                            color: themeColors.textPrimary,
                            marginBottom: '15px',
                            fontSize: '2em'
                        }}>
                            {wrapData?.top_track?.name}
                        </h2>
                        <p style={{
                            color: '#b3b3b3',
                            fontSize: '1.5em',
                            marginBottom: '30px'
                        }}>
                            by {wrapData?.top_track?.artists?.join(', ')}
                        </p>

                        <div style={{ marginTop: '20px' }}>
                            <div 
                                ref={progressBarContainerRef}
                                onClick={handleProgressBarClick}
                                style={{
                                    width: '100%',
                                    height: '6px',
                                    backgroundColor: '#4f4f4f',
                                    borderRadius: '3px',
                                    cursor: 'pointer',
                                    marginBottom: '10px',
                                    position: 'relative'
                                }}
                            >
                                <div
                                    ref={progressBarRef}
                                    style={{
                                        width: `${(currentTime / duration) * 100}%`,
                                        height: '100%',
                                        backgroundColor: '#1DB954',
                                        borderRadius: '3px',
                                        transition: 'width 0.1s'
                                    }}
                                />
                            </div>

                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                color: '#b3b3b3',
                                fontSize: '14px',
                                marginBottom: '20px'
                            }}>
                                <span>{formatTime(currentTime)}</span>
                                <span>{formatTime(duration)}</span>
                            </div>

                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '20px',
                                marginBottom: '20px'
                            }}>
                                <button
                                    onClick={handleMuteToggle}
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

                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={isMuted ? 0 : volume}
                                    onChange={handleVolumeChange}
                                    style={{
                                        width: '100px',
                                        accentColor: '#1DB954'
                                    }}
                                />

                                <button
                                    onClick={handlePlayPause}
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
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    {isPlaying ? '⏸️' : '▶️'}
                                </button>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/top5songs')}
                        style={{
                            backgroundColor: themeColors.buttonBg,
                            color: themeColors.buttonTextColor,
                            border: 'none',
                            padding: '15px 40px',
                            borderRadius: '25px',
                            fontSize: '18px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0px 6px 12px rgba(0, 0, 0, 0.2)';
                            e.currentTarget.style.backgroundColor = themeColors.buttonHoverBg;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.2)';
                            e.currentTarget.style.backgroundColor = themeColors.buttonBg;
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