import React, { useState, useEffect } from 'react';
import Layout from './Layout';

export default function Dashboard() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
    const [audio, setAudio] = useState(null);
    const [isMuted, setIsMuted] = useState(false);

    // Define theme-aware colors
    const themeColors = {
        accent: '#A29BFE', // Light purple accent
        buttonBg: '#6C63FF', // Purple button
        buttonText: '#FFFFFF', // White button text
        background: '#1E2A47', // Purple container background
    };

    // Your existing fetchUserData function remains the same
    const fetchUserData = async () => {
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
            if (err.status === 401) {
                window.location.href = '/';
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
        return () => {
            if (audio) {
                audio.pause();
                audio.src = '';
            }
        };
    }, []);

    const handlePlayPreview = (previewUrl, trackId) => {
        if (!previewUrl) {
            console.log('No preview URL available for this track');
            return;
        }

        if (currentlyPlaying === trackId) {
            if (audio.paused) {
                audio.play();
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
            
            newAudio.play();
            
            newAudio.onended = () => {
                setCurrentlyPlaying(null);
            };
        }
    };

    const toggleMute = () => {
        if (audio) {
            audio.volume = isMuted ? 1 : 0;
        }
        setIsMuted(!isMuted);
    };

    // Your existing handleRefreshData function remains the same
    const handleRefreshData = async () => {
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
    };

    // Your existing loading and error states remain the same
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
                        fontFamily: "'Quicksand', sans-serif", // Quicksand font applied
                        fontSize: '16px', // Adjusted font size for better readability
                        backgroundColor: themeColors.buttonBg,
                        color: themeColors.buttonText,
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '20px',
                        cursor: 'pointer',
                        transition: 'transform 0.2s, opacity 0.2s',
                        fontWeight: '600', // Added for a bold, clean look
                        letterSpacing: '0.5px', // Subtle spacing for better aesthetics
                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)', // Added shadow for depth
                    }}
                >
                    Reconnect to Spotify
                    </button>
                    </div>
                </div>
            </Layout>
        );
    }

    const content = (
        <div style={{ 
            width: '100%',
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '20px',
            boxSizing: 'border-box'
        }}>
            {/* Your existing Stats section remains the same */}
            
            <section style={{ 
                backgroundColor: 'var(--bg-secondary)',
                padding: '20px',
                boxSizing: 'border-box',
            }}
        >
            {/* Stats Section */}
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
            fontFamily: "'Quicksand', sans-serif", // Apply Quicksand font
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
    onMouseEnter={e => {
        if (!refreshing) {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0px 6px 12px rgba(0, 0, 0, 0.2)';
            e.currentTarget.style.backgroundColor = '#5B54D9'; // Slightly darker purple
        }
    }}
    onMouseLeave={e => {
        if (!refreshing) {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.2)';
            e.currentTarget.style.backgroundColor = themeColors.buttonBg;
        }
    }}
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
                fontFamily: "'Quicksand', sans-serif", // Apply Quicksand font to label
                fontWeight: '600', // Bold text
                fontSize: '18px', // Slightly larger for visibility
                color: themeColors.accentSecondary,
                marginTop: 0,
            }}
        >
            {item.label}
        </h3>
        <p
            style={{
                fontFamily: "'Quicksand', sans-serif", // Apply Quicksand font to value
                fontWeight: 'bold', // Bold for emphasis
                fontSize: '24px', // Larger font size for numbers
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

            {/* Top Artists Section */}
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
            fontFamily: "'Quicksand', sans-serif", // Apply Quicksand font
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
                                borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
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
                                    <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
                                        {artist.genres.slice(0, 2).join(', ')}
                                    </div>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </section>

            {/* Recently Played Section */}
            {/* Updated Recently Played section with playback controls */}
            <section
    style={{
        backgroundColor: themeColors.containerBg,
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '20px',
                   <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px'
                }}>
         boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)',
    }}
>
    <h2
        style={{
            fontFamily: "'Quicksand', sans-serif", // Apply Quicksand font
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
                        <li key={`${item.track.id}-${item.played_at}`} style={{
                            marginBottom: '15px',
                            borderBottom: '1px solid var(--border-color)',
                            paddingBottom: '15px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ 
                                    fontWeight: 'bold', 
                                    fontSize: '16px',
                                    color: 'var(--text-primary)'
                                }}>{item.track.name}</div>
                                <div style={{ 
                                    color: 'var(--text-secondary)',
                                    fontSize: '14px'
                                }}>
                                    by {item.track.artists.map(a => a.name).join(', ')}
                                </div>
                                <div style={{ 
                                    color: 'var(--text-tertiary)',
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
    );

    return <Layout>{content}</Layout>;
}
