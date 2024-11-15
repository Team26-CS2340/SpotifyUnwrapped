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

    // Your existing fetchUserData function remains the same
    const fetchUserData = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/user/data/', {
                credentials: 'include'
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
                credentials: 'include'
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
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 'calc(100vh - 120px)'
                }}>
                    <div style={{ 
                        width: '50px', 
                        height: '50px', 
                        border: '3px solid #1DB954', 
                        borderTopColor: 'transparent', 
                        borderRadius: '50%', 
                        animation: 'spin 1s linear infinite' 
                    }} />
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 'calc(100vh - 120px)'
                }}>
                    <div style={{ 
                        backgroundColor: 'rgba(0,0,0,0.7)', 
                        padding: '20px', 
                        borderRadius: '10px',
                        color: 'white',
                        textAlign: 'center'
                    }}>
                        <p style={{ color: '#ff4444', marginBottom: '20px' }}>{error}</p>
                        <button
                            onClick={() => window.location.href = '/'}
                            style={{
                                backgroundColor: '#1DB954',
                                color: 'white',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '20px',
                                cursor: 'pointer'
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
                borderRadius: '8px',
                marginBottom: '20px',
                color: 'var(--text-primary)'
            }}>
                <h2 style={{ color: '#1DB954', marginTop: 0 }}>{userData?.spotify_profile?.display_name}'s Stats</h2>
                <button
                    onClick={handleRefreshData}
                    disabled={refreshing}
                    style={{
                        backgroundColor: '#1DB954',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '20px',
                        cursor: refreshing ? 'not-allowed' : 'pointer',
                        opacity: refreshing ? 0.7 : 1
                    }}
                >
                    {refreshing ? 'Refreshing...' : 'Refresh Data'}
                </button>
                <div style={{ 
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '20px',
                    marginTop: '20px'
                }}>
                    <div>
                        <h3 style={{ color: '#1DB954', marginTop: 0 }}>Saved Tracks</h3>
                        <p style={{ 
                            fontSize: '24px',
                            fontWeight: 'bold',
                            margin: '10px 0'
                        }}>
                            {userData?.spotify_data?.saved_tracks_count}
                        </p>
                    </div>
                    <div>
                        <h3 style={{ color: '#1DB954', marginTop: 0 }}>Saved Albums</h3>
                        <p style={{ 
                            fontSize: '24px',
                            fontWeight: 'bold',
                            margin: '10px 0'
                        }}>
                            {userData?.spotify_data?.saved_albums_count}
                        </p>
                    </div>
                    <div>
                        <h3 style={{ color: '#1DB954', marginTop: 0 }}>Playlists</h3>
                        <p style={{ 
                            fontSize: '24px',
                            fontWeight: 'bold',
                            margin: '10px 0'
                        }}>
                            {userData?.spotify_data?.playlist_count}
                        </p>
                    </div>
                    <div>
                        <h3 style={{ color: '#1DB954', marginTop: 0 }}>Following</h3>
                        <p style={{ 
                            fontSize: '24px',
                            fontWeight: 'bold',
                            margin: '10px 0'
                        }}>
                            {userData?.spotify_data?.favorite_artists_count}
                        </p>
                    </div>
                </div>
            </section>

            {/* Your existing Top Artists section remains the same */}
            <section style={{ 
                backgroundColor: 'var(--bg-secondary)',
                padding: '20px',
                borderRadius: '8px',
                marginBottom: '20px'
            }}>
                <h2 style={{ color: '#1DB954', marginTop: 0 }}>Top Artists</h2>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {userData?.spotify_data?.top_artists?.items?.slice(0, 5).map((artist, index) => (
                        <li key={artist.id} style={{ 
                            marginBottom: '15px',
                            borderBottom: '1px solid var(--border-color)',
                            paddingBottom: '15px',
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            <strong style={{ 
                                color: '#1DB954', 
                                marginRight: '15px',
                                fontSize: '20px'
                            }}>#{index + 1}</strong>
                            <div>
                                <div style={{ 
                                    fontWeight: 'bold', 
                                    fontSize: '16px',
                                    color: 'var(--text-primary)'
                                }}>{artist.name}</div>
                                {artist.genres?.length > 0 && (
                                    <div style={{ 
                                        color: 'var(--text-secondary)',
                                        fontSize: '14px'
                                    }}>
                                        {artist.genres.slice(0, 2).join(', ')}
                                    </div>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </section>

            {/* Updated Recently Played section with playback controls */}
            <section style={{ 
                backgroundColor: 'var(--bg-secondary)',
                padding: '20px',
                borderRadius: '8px'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px'
                }}>
                    <h2 style={{ color: '#1DB954', margin: 0 }}>Recently Played</h2>
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