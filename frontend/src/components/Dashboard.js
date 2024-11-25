import React, { useState, useEffect, useCallback } from 'react';
import Layout from './Layout';

export default function Dashboard() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
    const [audio, setAudio] = useState(null);
    const [isMuted, setIsMuted] = useState(false);

    // Define theme-aware colors outside component to prevent recreation
    const themeColors = {
        accent: '#A29BFE',
        accentSecondary: '#8B84FE',
        buttonBg: '#6C63FF',
        buttonText: '#FFFFFF',
        background: '#1E2A47',
        containerBg: '#2A3655',
        textPrimary: '#FFFFFF',
        textSecondary: 'rgba(255, 255, 255, 0.7)',
        textTertiary: 'rgba(255, 255, 255, 0.5)',
        borderColor: 'rgba(255, 255, 255, 0.2)'
    };

    // Memoize fetchUserData to prevent unnecessary recreations
    const fetchUserData = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:8000/api/user/data/', {
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }
            const data = await response.json();
            setUserData(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching user data:', err);
            setError(err.message || 'Failed to load user data');
            if (err.response?.status === 401) {  // Fixed error status check
                window.location.href = '/';
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUserData();
        
        // Cleanup function
        return () => {
            if (audio) {
                audio.pause();
                audio.src = '';
                setAudio(null);  // Clean up audio state
            }
        };
    }, [fetchUserData]);  // Added fetchUserData to dependencies

    const handlePlayPreview = useCallback(async (previewUrl, trackId) => {
        if (!previewUrl) {
            console.log('No preview URL available for this track');
            return;
        }

        try {
            if (currentlyPlaying === trackId && audio) {
                if (audio.paused) {
                    await audio.play();
                } else {
                    audio.pause();
                }
            } else {
                if (audio) {
                    audio.pause();
                    audio.src = '';
                }
                
                const newAudio = new Audio(previewUrl);
                newAudio.volume = isMuted ? 0 : 1;
                setAudio(newAudio);
                setCurrentlyPlaying(trackId);
                
                await newAudio.play();
                
                newAudio.onended = () => {
                    setCurrentlyPlaying(null);
                };
            }
        } catch (error) {
            console.error('Error playing audio:', error);
            // Reset states on error
            setCurrentlyPlaying(null);
            setAudio(null);
        }
    }, [audio, currentlyPlaying, isMuted]);

    const toggleMute = useCallback(() => {
        if (audio) {
            audio.volume = isMuted ? 1 : 0;
        }
        setIsMuted(prev => !prev);
    }, [audio, isMuted]);

    const handleRefreshData = useCallback(async () => {
        try {
            setRefreshing(true);
            const response = await fetch('http://localhost:8000/api/user/refresh-spotify/', {
                method: 'POST',
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to refresh data');
            }
            await fetchUserData();
        } catch (err) {
            console.error('Error refreshing data:', err);
            setError(err.message || 'Failed to refresh data');
        } finally {
            setRefreshing(false);
        }
    }, [fetchUserData]);

    // Create keyframe animation for spinner
    const spinKeyframes = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;

    // Add style tag for keyframes
    useEffect(() => {
        const styleSheet = document.createElement("style");
        styleSheet.textContent = spinKeyframes;
        document.head.appendChild(styleSheet);
        return () => styleSheet.remove();
    }, []);

    if (loading) {
        return (
            <Layout>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: 'calc(100vh - 120px)',
                    }}
                >
                    <div
                        style={{
                            width: '50px',
                            height: '50px',
                            border: `3px solid ${themeColors.accent}`,
                            borderTopColor: 'transparent',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                        }}
                    />
                </div>
            </Layout>
        );
    }


    if (error) {
        return (
            <Layout>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: 'calc(100vh - 120px)',
                    }}
                >
                    <div
                        style={{
                            backgroundColor: themeColors.background,
                            padding: '20px',
                            borderRadius: '12px',
                            color: themeColors.textPrimary,
                            textAlign: 'center',
                            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)',
                        }}
                    >
                        <p style={{ color: '#FF4444', marginBottom: '20px' }}>{error}</p>
                        <button
                            onClick={() => window.location.href = '/'}
                            style={{
                                fontFamily: "'Quicksand', sans-serif",
                                fontSize: '16px',
                                backgroundColor: themeColors.buttonBg,
                                color: themeColors.buttonText,
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '20px',
                                cursor: 'pointer',
                                transition: 'transform 0.2s, opacity 0.2s',
                                fontWeight: '600',
                                letterSpacing: '0.5px',
                                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
                            }}
                        >
                            Reconnect to Spotify
                        </button>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div style={{ 
                width: '100%',
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '20px',
                boxSizing: 'border-box'
            }}>
                <section
                    style={{
                        backgroundColor: themeColors.containerBg,
                        padding: '20px',
                        borderRadius: '12px',
                        marginBottom: '20px',
                        color: themeColors.textPrimary,
                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)',
                    }}
                >
                    <h2
                        style={{
                            fontFamily: "'Quicksand', sans-serif",
                            fontSize: '2rem',
                            fontWeight: '600',
                            letterSpacing: '-0.02em',
                            color: themeColors.accent,
                            marginTop: 0,
                        }}
                    >
                        {userData?.spotify_profile?.display_name}'s Stats
                    </h2>
                    <button
                        onClick={handleRefreshData}
                        disabled={refreshing}
                        style={{
                            backgroundColor: themeColors.buttonBg,
                            color: themeColors.buttonText,
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '20px',
                            cursor: refreshing ? 'not-allowed' : 'pointer',
                            opacity: refreshing ? 0.7 : 1,
                            transition: 'all 0.3s ease',
                            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
                            fontFamily: "'Quicksand', sans-serif",
                            fontSize: '16px',
                            fontWeight: '600',
                            letterSpacing: '0.5px',
                        }}
                    >
                        {refreshing ? 'Refreshing...' : 'Refresh Data'}
                    </button>

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(4, 1fr)',
                            gap: '20px',
                            marginTop: '20px',
                        }}
                    >
                        {[
                            { label: 'Saved Tracks', value: userData?.spotify_data?.saved_tracks_count },
                            { label: 'Saved Albums', value: userData?.spotify_data?.saved_albums_count },
                            { label: 'Playlists', value: userData?.spotify_data?.playlist_count },
                            { label: 'Following', value: userData?.spotify_data?.favorite_artists_count },
                        ].map((item, index) => (
                            <div key={index} style={{ textAlign: 'center' }}>
                                <h3
                                    style={{
                                        fontFamily: "'Quicksand', sans-serif",
                                        fontWeight: '600',
                                        fontSize: '18px',
                                        color: themeColors.accentSecondary,
                                        marginTop: 0,
                                    }}
                                >
                                    {item.label}
                                </h3>
                                <p
                                    style={{
                                        fontFamily: "'Quicksand', sans-serif",
                                        fontWeight: 'bold',
                                        fontSize: '24px',
                                        margin: '10px 0',
                                        color: themeColors.textPrimary,
                                    }}
                                >
                                    {item.value || 0}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                <section
                    style={{
                        backgroundColor: themeColors.containerBg,
                        padding: '20px',
                        borderRadius: '12px',
                        marginBottom: '20px',
                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)',
                    }}
                >
                    <h2
                        style={{
                            fontFamily: "'Quicksand', sans-serif",
                            fontSize: '2rem',
                            fontWeight: '600',
                            letterSpacing: '-0.02em',
                            color: themeColors.accent,
                            marginTop: 0,
                        }}
                    >
                        Top Artists
                    </h2>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {userData?.spotify_data?.top_artists?.items?.slice(0, 5).map((artist, index) => (
                            <li
                                key={artist.id}
                                style={{
                                    marginBottom: '15px',
                                    borderBottom: `1px solid ${themeColors.borderColor}`,
                                    paddingBottom: '15px',
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                <strong
                                    style={{
                                        color: themeColors.accentSecondary,
                                        marginRight: '15px',
                                        fontSize: '20px',
                                    }}
                                >
                                    #{index + 1}
                                </strong>
                                <div>
                                    <div
                                        style={{
                                            fontWeight: 'bold',
                                            fontSize: '16px',
                                            color: themeColors.textPrimary,
                                        }}
                                    >
                                        {artist.name}
                                    </div>
                                    {artist.genres?.length > 0 && (
                                        <div style={{ fontSize: '14px', color: themeColors.textSecondary }}>
                                            {artist.genres.slice(0, 2).join(', ')}
                                        </div>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>

                <section
                    style={{
                        backgroundColor: themeColors.containerBg,
                        padding: '20px',
                        borderRadius: '12px',
                        marginBottom: '20px',
                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)',
                    }}
                >
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '20px'
                    }}>
                        <h2
                            style={{
                                fontFamily: "'Quicksand', sans-serif",
                                fontSize: '2rem',
                                fontWeight: '600',
                                letterSpacing: '-0.02em',
                                color: themeColors.accent,
                                margin: 0,
                            }}
                        >
                            Recently Played
                        </h2>
                        <button
                            onClick={toggleMute}
                            style={{
                                backgroundColor: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#1DB954',
                                display: 'flex',
                                alignItems: 'center',
                                padding: '8px',
                                fontSize: '20px'
                            }}
                        >
                            {isMuted ? '🔇' : '🔊'}
                        </button>
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {userData?.spotify_data?.recently_played?.items?.slice(0, 5).map((item) => (
                            <li 
                                key={`${item.track.id}-${item.played_at}`} 
                                style={{
                                    marginBottom: '15px',
                                    borderBottom: `1px solid ${themeColors.borderColor}`,
                                    paddingBottom: '15px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}
                            >
                                <div style={{ flex: 1 }}>
                                    <div style={{ 
                                        fontWeight: 'bold', 
                                        fontSize: '16px',
                                        color: themeColors.textPrimary
                                    }}>
                                        {item.track.name}
                                    </div>
                                    <div style={{ 
                                        color: themeColors.textSecondary,
                                        fontSize: '14px'
                                    }}>
                                        by {item.track.artists.map(a => a.name).join(', ')}
                                    </div>
                                    <div style={{ 
                                        color: themeColors.textTertiary,
                                        fontSize: '12px',
                                        marginTop: '5px'
                                    }}>
                                        {new Date(item.played_at).toLocaleString()}
                                    </div>
                                </div>
                                {item.track.preview_url && (
                                    <button
                                        onClick={() => handlePlayPreview(item.track.preview_url, item.track.id)}
                                        style={{
                                            backgroundColor: currentlyPlaying === item.track.id ? '#1DB954' : 'transparent',
                                            border: `1px solid ${currentlyPlaying === item.track.id ? '#1DB954' : '#666'}`,
                                            borderRadius: '50%',
                                            width: '40px',
                                            height: '40px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            marginLeft: '15px',
                                            color: currentlyPlaying === item.track.id ? 'white' : '#666',
                                            transition: 'all 0.2s ease',
                                            fontSize: '16px'
                                        }}
                                    >
                                        {currentlyPlaying === item.track.id && !audio?.paused ? '⏸️' : '▶️'}
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
        </Layout>
    );
}