// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import Layout from './Layout';

export default function Dashboard() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    // Fetch user data from the backend
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
    }, []);

    // Refresh data handler
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
    if (loading) {
        return (
            <Layout>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 'calc(100vh - 120px)' // Adjust for new top padding
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
                    minHeight: 'calc(100vh - 120px)' // Adjust for new top padding
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
            padding: '20px', // Removed extra padding on sides
            boxSizing: 'border-box'
        }}>
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

            <section style={{ 
                backgroundColor: 'var(--bg-secondary)',
                padding: '20px',
                borderRadius: '8px'
            }}>
                <h2 style={{ color: '#1DB954', marginTop: 0 }}>Recently Played</h2>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {userData?.spotify_data?.recently_played?.items?.slice(0, 5).map((item) => (
                        <li key={`${item.track.id}-${item.played_at}`} style={{
                            marginBottom: '15px',
                            borderBottom: '1px solid var(--border-color)',
                            paddingBottom: '15px'
                        }}>
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
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );

    return <Layout>{content}</Layout>;
}