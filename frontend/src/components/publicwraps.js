import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from './Layout';

export default function PublicWraps() {
    const [wraps, setWraps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPublicWraps();
    }, []);

    const fetchPublicWraps = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/wraps/public/', {
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });
            
            if (!response.ok) {
                throw new Error(`Failed to fetch public wraps: ${response.status}`);
            }
            
            const data = await response.json();
            setWraps(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching public wraps:', err);
            setError(err.message || 'Failed to load public wraps');
        } finally {
            setLoading(false);
        }
    };

    const handleWrapClick = async (wrapId) => {
        try {
            const response = await fetch(`http://localhost:8000/api/wrap/${wrapId}/public/`, {
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });
            
            if (!response.ok) {
                throw new Error(`Failed to fetch wrap details: ${response.status}`);
            }
            
            const wrapData = await response.json();
            
            const extractArtistNames = (artists) => {
                return (artists || []).map(artist => {
                    if (typeof artist === 'object' && artist.name) return artist.name;
                    if (typeof artist === 'string') return artist;
                    return '';
                });
            };
    
            const formattedData = {
                message: 'Spotify wrap loaded successfully',
                wrap_id: wrapId,
                data: {
                    top_artist: {
                        name: wrapData.top_artist?.name || '',
                        genres: wrapData.top_artist?.genres || [],
                        popularity: wrapData.top_artist?.popularity || 0
                    },
                    top_track: {
                        name: wrapData.top_track?.name || '',
                        artists: extractArtistNames(wrapData.top_track?.artists)
                    },
                    top_album: {
                        name: wrapData.top_album?.name || '',
                        artists: extractArtistNames(wrapData.top_album?.artists)
                    },
                    top_genres: wrapData.top_genres?.map(genre => 
                        typeof genre === 'object' ? genre.name : genre
                    ) || [],
                    top_tracks: {
                        items: wrapData.top_tracks?.items?.map(track => ({
                            name: track.name || '',
                            artists: extractArtistNames(track.artists)
                        })) || []
                    },
                    top_artists: wrapData.top_artists || { items: [] }
                }
            };
    
            localStorage.setItem('wrapData', JSON.stringify(formattedData));
            navigate('/welcome');
        } catch (err) {
            console.error('Error loading wrap:', err);
            setError(err.message || 'Failed to load wrap');
        }
    };

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
                            onClick={fetchPublicWraps}
                            style={{
                                backgroundColor: '#1DB954',
                                color: 'white',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '20px',
                                cursor: 'pointer'
                            }}
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </Layout>
        );
    }

    const extractArtistNames = (artists) => {
        if (!artists) return [];
        return artists.map(artist => {
            if (typeof artist === 'object' && artist.name) return artist.name;
            if (typeof artist === 'string') return artist;
            return '';
        }).filter(name => name);
    };

    return (
        <Layout>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '20px'
            }}>
                <h1 style={{
                    color: '#1DB954',
                    marginBottom: '30px',
                    textAlign: 'center'
                }}>
                    Public Wraps
                </h1>
                
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '20px',
                    padding: '20px'
                }}>
                    {wraps.length === 0 ? (
                        <div style={{
                            gridColumn: '1 / -1',
                            textAlign: 'center',
                            color: 'white',
                            padding: '40px'
                        }}>
                            No public wraps available.
                        </div>
                    ) : (
                        wraps.map((wrap) => (
                            <div
                                key={wrap.id}
                                onClick={() => handleWrapClick(wrap.id)}
                                style={{
                                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                    borderRadius: '10px',
                                    padding: '20px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    border: '1px solid rgba(29, 185, 84, 0.3)',
                                    color: 'white',
                                    transform: 'translateY(0)',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.boxShadow = '0 5px 15px rgba(29, 185, 84, 0.3)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
                                }}
                            >
                                <div style={{
                                    fontSize: '1.5em',
                                    color: '#1DB954',
                                    marginBottom: '15px'
                                }}>
                                    Wrap {wrap.year}
                                </div>
                                
                                <div style={{
                                    marginBottom: '10px',
                                    fontSize: '0.9em',
                                    color: '#b3b3b3'
                                }}>
                                    By: {wrap.user_profile?.spotify_display_name || 'Unknown User'}
                                </div>
                                
                                <div style={{
                                    marginBottom: '10px',
                                    fontSize: '0.9em',
                                    color: '#b3b3b3'
                                }}>
                                    Created: {new Date(wrap.created_at).toLocaleDateString()}
                                </div>
                                
                                <div style={{ marginBottom: '15px' }}>
                                    <div style={{ fontWeight: 'bold' }}>Top Artist</div>
                                    <div>{wrap.top_artist.name}</div>
                                </div>
                                
                                <div style={{ marginBottom: '15px' }}>
                                    <div style={{ fontWeight: 'bold' }}>Top Track</div>
                                    <div>{wrap.top_track.name}</div>
                                    <div style={{ fontSize: '0.9em', color: '#b3b3b3' }}>
                                        by {extractArtistNames(wrap.top_track.artists).join(', ')}
                                    </div>
                                </div>
                                
                                <div>
                                    <div style={{ fontWeight: 'bold' }}>Genres</div>
                                    <div>{wrap.genre_count} unique genres</div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </Layout>
    );
}