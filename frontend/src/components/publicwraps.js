import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from './Layout';

const HeartIcon = ({ filled }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill={filled ? "#1DB954" : "none"}
        stroke={filled ? "#1DB954" : "currentColor"} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
    >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
);

const UsersIcon = ({ filled }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill={filled ? "#1DB954" : "none"}
        stroke={filled ? "#1DB954" : "currentColor"} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
    >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);

export function getCookie(name) {
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

export default function PublicWraps() {
    const [wraps, setWraps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all');
    const navigate = useNavigate();

    useEffect(() => {
        fetchPublicWraps();
    }, [filter]);

    

    const fetchPublicWraps = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/wraps/public/?filter=${filter}`, {
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

    const handleLike = async (e, wrapId) => {
        e.stopPropagation();
        
        const wrap = wraps.find(w => w.id === wrapId);
        if (!wrap) return;

        try {
            const method = wrap.is_liked ? 'DELETE' : 'POST';
            const response = await fetch(`http://localhost:8000/api/wraps/${wrapId}/like/`, {
                method,
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                }
            });
            
            if (!response.ok) throw new Error(`Failed to ${method === 'POST' ? 'like' : 'unlike'} wrap`);
            
            setWraps(prevWraps => prevWraps.map(w => 
                w.id === wrapId 
                    ? { 
                        ...w, 
                        is_liked: !w.is_liked,
                        likes_count: w.likes_count + (w.is_liked ? -1 : 1)
                    } 
                    : w
            ));
        } catch (err) {
            console.error('Error updating like:', err);
        }
    };

    const handleFollow = async (e, profileId) => {
        e.stopPropagation();
        
        try {
            const wrap = wraps.find(w => w.user_profile.id === profileId);
            if (!wrap) return;
    
            const method = wrap.is_following ? 'DELETE' : 'POST';
            const response = await fetch(`http://localhost:8000/api/profile/${profileId}/follow/`, {
                method,
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                }
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Failed to ${method === 'POST' ? 'follow' : 'unfollow'} user`);
            }
            
            // Update all wraps from this user
            setWraps(prevWraps => prevWraps.map(w => 
                w.user_profile.id === profileId 
                    ? { ...w, is_following: !w.is_following } 
                    : w
            ));
            
            // Optionally refresh the wraps list to get updated data
            fetchPublicWraps();
            
        } catch (err) {
            console.error('Error updating follow status:', err);
            alert(err.message);  // Show error to user
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
            
            const data = await response.json();
            
            // Format data to match SavedWraps format
            const formattedData = {
                message: 'Spotify wrap loaded successfully',
                wrap_id: wrapId,
                data: {
                    top_artist: {
                        name: data.top_artist?.name || '',
                        genres: data.top_artist?.genres || [],
                        popularity: data.top_artist?.popularity || 0
                    },
                    top_track: {
                        name: data.top_track?.name || '',
                        artists: (data.top_track?.artists || []).map(artist => 
                            typeof artist === 'object' ? artist.name : artist
                        ),
                        preview_url: data.top_track?.preview_url || ''
                    },
                    top_album: {
                        name: data.top_album?.name || '',
                        artists: (data.top_album?.artists || []).map(artist => 
                            typeof artist === 'object' ? artist.name : artist
                        )
                    },
                    top_genres: data.top_genres?.map(genre => 
                        typeof genre === 'object' ? genre.name : genre
                    ) || [],
                    top_tracks: {
                        items: (data.top_tracks?.items || []).map(track => ({
                            name: track.name || '',
                            artists: (track.artists || []).map(artist => 
                                typeof artist === 'object' ? artist.name : artist
                            ),
                            preview_url: track.preview_url || ''
                        }))
                    },
                    top_artists: {
                        items: (data.top_artists?.items || []).map(artist => ({
                            name: artist.name || '',
                            genres: artist.genres || [],
                            popularity: artist.popularity || 0
                        }))
                    }
                }
            };
    
            localStorage.setItem('wrapData', JSON.stringify(formattedData));
            navigate('/welcome');
        } catch (err) {
            console.error('Error loading wrap:', err);
            setError(err.message || 'Failed to load wrap');
        }
    };

    const extractArtistNames = (artists) => {
        if (!artists) return [];
        return artists.map(artist => {
            if (typeof artist === 'object' && artist.name) return artist.name;
            if (typeof artist === 'string') return artist;
            return '';
        }).filter(name => name);
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

    return (
        <Layout>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '20px'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '30px'
                }}>
                    <h1 style={{
                        color: '#1DB954',
                        margin: 0
                    }}>
                        Public Wraps
                    </h1>
                    <div style={{
                        display: 'flex',
                        gap: '10px'
                    }}>
                        <button
                            onClick={() => setFilter('all')}
                            style={{
                                backgroundColor: filter === 'all' ? '#1DB954' : 'rgba(255, 255, 255, 0.1)',
                                color: 'white',
                                border: 'none',
                                padding: '8px 16px',
                                borderRadius: '20px',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s'
                            }}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilter('liked')}
                            style={{
                                backgroundColor: filter === 'liked' ? '#1DB954' : 'rgba(255, 255, 255, 0.1)',
                                color: 'white',
                                border: 'none',
                                padding: '8px 16px',
                                borderRadius: '20px',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px'
                            }}
                        >
                            <HeartIcon filled={filter === 'liked'} /> Liked
                        </button>
                        <button
                            onClick={() => setFilter('following')}
                            style={{
                                backgroundColor: filter === 'following' ? '#1DB954' : 'rgba(255, 255, 255, 0.1)',
                                color: 'white',
                                border: 'none',
                                padding: '8px 16px',
                                borderRadius: '20px',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px'
                            }}
                        >
                            <UsersIcon filled={filter === 'following'} /> Following
                        </button>
                    </div>
                </div>
                
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
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    marginBottom: '15px'
                                }}>
                                    <div style={{
                                        fontSize: '1.5em',
                                        color: '#1DB954'
                                    }}>
                                        Wrap {wrap.year}
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        gap: '8px'
                                    }}>
                                        <button
                                            onClick={(e) => handleLike(e, wrap.id)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                padding: '5px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                color: 'white'
                                            }}
                                        >
                                            <HeartIcon filled={wrap.is_liked} />
                                            <span style={{ fontSize: '0.9em' }}>{wrap.likes_count}</span>
                                        </button>
                                        {wrap.user_profile.id !== localStorage.getItem('user_profile_id') && (
                                            <button
                                                onClick={(e) => handleFollow(e, wrap.user_profile.id)}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    padding: '5px',
                                                    cursor: 'pointer',
                                                    color: wrap.is_following ? '#1DB954' : 'white'
                                                }}
                                            >
                                                <UsersIcon filled={wrap.is_following} />
                                            </button>
                                        )}
                                    </div>
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