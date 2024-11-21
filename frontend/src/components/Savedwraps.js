import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from './Layout';

export default function SavedWraps() {
    const [wraps, setWraps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchWraps();
    }, []);

    const fetchWraps = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/user/wraps/', {
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to fetch wraps: ${response.status} ${errorText}`);
            }
            
            const data = await response.json();
            setWraps(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching wraps:', err);
            setError(err.message || 'Failed to load wraps');
        } finally {
            setLoading(false);
        }
    };

    const handleWrapClick = async (wrapId) => {
        try {
            const response = await fetch(`http://localhost:8000/api/user/wrap/${wrapId}/`, {
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
                    if (typeof artist === 'object' && artist.name) {
                        return artist.name;
                    } else if (typeof artist === 'string') {
                        return artist;
                    } else {
                        return '';
                    }
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

    const handleDeleteWrap = async (wrapId, e) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this wrap?')) {
            try {
                const csrfToken = document.cookie.split('; ')
                    .find(row => row.startsWith('csrftoken='))
                    ?.split('=')[1];
    
                const response = await fetch(`http://localhost:8000/api/user/wrap/${wrapId}/`, {
                    method: 'DELETE',
                    credentials: 'include',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrfToken,
                    }
                });
                
                if (!response.ok) {
                    throw new Error(`Failed to delete wrap: ${response.status}`);
                }
                
                setWraps(wraps.filter(wrap => wrap.id !== wrapId));
            } catch (err) {
                console.error('Error deleting wrap:', err);
                setError(err.message || 'Failed to delete wrap');
            }
        }
    };

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    
    const handleToggleVisibility = async (wrapId, currentVisibility, e) => {
        e.stopPropagation();
        try {
            const csrfToken = getCookie('csrftoken');
            const response = await fetch(`http://localhost:8000/api/user/wrap/${wrapId}/toggle-visibility/`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken
                },
                body: JSON.stringify({ is_public: !currentVisibility })
            });
            
            if (!response.ok) {
                throw new Error(`Failed to update visibility: ${response.status}`);
            }
            
            setWraps(wraps.map(wrap => 
                wrap.id === wrapId 
                    ? { ...wrap, is_public: !wrap.is_public }
                    : wrap
            ));
        } catch (err) {
            console.error('Error updating visibility:', err);
            setError(err.message || 'Failed to update visibility');
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
                            onClick={fetchWraps}
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
                    Your Saved Wraps
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
                            No wraps found. Create your first wrap!
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
                                        by {wrap.top_track.artists.join(', ')}
                                    </div>
                                </div>
                                
                                <div style={{ marginBottom: '15px' }}>
                                    <div style={{ fontWeight: 'bold' }}>Genres</div>
                                    <div>{wrap.genre_count} unique genres</div>
                                </div>

                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginTop: '15px',
                                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                                    paddingTop: '15px'
                                }}>
                                    <button
                                        onClick={(e) => handleToggleVisibility(wrap.id, wrap.is_public, e)}
                                        style={{
                                            backgroundColor: wrap.is_public ? 'rgba(29, 185, 84, 0.2)' : 'transparent',
                                            border: '1px solid #1DB954',
                                            color: '#1DB954',
                                            padding: '5px 10px',
                                            borderRadius: '15px',
                                            cursor: 'pointer',
                                            fontSize: '0.8em'
                                        }}
                                    >
                                        {wrap.is_public ? 'Public' : 'Private'}
                                    </button>
                                    <button
                                        onClick={(e) => handleDeleteWrap(wrap.id, e)}
                                        style={{
                                            backgroundColor: 'rgba(255, 0, 0, 0.1)',
                                            border: '1px solid #ff4444',
                                            color: '#ff4444',
                                            padding: '5px 10px',
                                            borderRadius: '15px',
                                            cursor: 'pointer',
                                            fontSize: '0.8em'
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </Layout>
    );
}