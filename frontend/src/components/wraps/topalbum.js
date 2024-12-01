import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../Layout';

function TopAlbum() {
    const navigate = useNavigate();
    const wrapData = JSON.parse(localStorage.getItem('wrapData'));

    // scroll to top of site on load
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    
    if (!wrapData || !wrapData.data) {
        navigate('/wrap');
        return null;
    }

    const album = wrapData.data.top_album || {
        name: "Midnights",
        artists: ["Taylor Swift"],
        release_year: "2022",
        popularity_score: 95,
        total_tracks: 13
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
                backgroundColor: 'rgba(0, 0, 0, 0.8)'
            }}>
                <div style={{
                    maxWidth: '800px',
                    width: '90%',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    borderRadius: '20px',
                    padding: '40px',
                    color: 'white',
                    textAlign: 'center'
                }}>
                    <h1 style={{
                        color: '#1DB954',
                        marginBottom: '30px',
                        fontSize: '2.5em'
                    }}>
                        Your Top Album
                    </h1>
                    
                    <div style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        padding: '30px',
                        borderRadius: '15px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        marginBottom: '30px'
                    }}>
                        <div style={{
                            fontSize: '2em',
                            fontWeight: 'bold',
                            marginBottom: '15px',
                            background: 'linear-gradient(45deg, #1DB954, #1ed760)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            {album.name}
                        </div>
                        
                        <div style={{
                            fontSize: '1.2em',
                            color: '#b3b3b3',
                            marginBottom: '25px'
                        }}>
                            by {album.artists.join(', ')}
                        </div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                            gap: '20px',
                            margin: '30px 0'
                        }}>
                            <div>
                                <div style={{ color: '#1DB954', fontSize: '1.2em', marginBottom: '5px' }}>
                                    Release Year
                                </div>
                                <div>{album.release_year || '2022'}</div>
                            </div>
                            <div>
                                <div style={{ color: '#1DB954', fontSize: '1.2em', marginBottom: '5px' }}>
                                    Popularity
                                </div>
                                <div>{album.popularity_score || '95'}/100</div>
                            </div>
                            <div>
                                <div style={{ color: '#1DB954', fontSize: '1.2em', marginBottom: '5px' }}>
                                    Total Tracks
                                </div>
                                <div>{album.total_tracks || '13'}</div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/topgenre')}
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
}

export default TopAlbum;