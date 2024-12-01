import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../Layout';

function Top5Artists() {
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

    // Create a list of top 5 artists with the main top_artist first
    const topArtists = [];
    
    // Add the main top artist first
    if (wrapData.data.top_artist) {
        topArtists.push(wrapData.data.top_artist);
    }

    // Add additional artists from top_tracks (getting unique artists)
    if (wrapData.data.top_tracks && wrapData.data.top_tracks.items) {
        const seenArtists = new Set([wrapData.data.top_artist?.name]); // Keep track of artists we've already added

        wrapData.data.top_tracks.items.forEach(track => {
            if (track.artists && track.artists.length > 0) {
                track.artists.forEach(artist => {
                    // Only add if we haven't seen this artist before and we have less than 5 artists
                    if (!seenArtists.has(artist.name) && topArtists.length < 5) {
                        seenArtists.add(artist.name);
                        topArtists.push({
                            name: artist.name,
                            genres: artist.genres || [],  // Use artist genres if available
                            popularity: artist.popularity || 85  // Default popularity if not available
                        });
                    }
                });
            }
        });
    }

    // Fill remaining slots with hardcoded data if needed
    const defaultArtists = [
        {
            name: "A.R. Rahman",
            genres: ["filmi"],
            popularity: 90
        },
        {
            name: "Taylor Swift",
            genres: ["pop"],
            popularity: 95
        },
        {
            name: "Diljit Dosanjh",
            genres: ["filmi", "modern bollywood", "punjabi pop"],
            popularity: 88
        },
        {
            name: "Shankar-Ehsaan-Loy",
            genres: ["filmi", "modern bollywood"],
            popularity: 87
        }
    ];

    // Add default artists if we don't have enough
    let i = 0;
    while (topArtists.length < 5 && i < defaultArtists.length) {
        if (!topArtists.find(artist => artist.name === defaultArtists[i].name)) {
            topArtists.push(defaultArtists[i]);
        }
        i++;
    }

    const getGradientBackground = (index) => {
        const gradients = [
            'linear-gradient(45deg, #1DB954 30%, #1ed760 90%)',
            'linear-gradient(45deg, #20bd58 30%, #23d668 90%)',
            'linear-gradient(45deg, #22c25c 30%, #27de6c 90%)',
            'linear-gradient(45deg, #25c661 30%, #2be670 90%)',
            'linear-gradient(45deg, #28ca65 30%, #2fee74 90%)'
        ];
        return gradients[index] || gradients[0];
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
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                backgroundImage: 'url(/Top5Artists.png)',
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
                        padding: '30px',
                        borderRadius: '20px',
                        color: 'white',
                        width: '80%',
                        maxWidth: '700px',
                        marginBottom: '40px'
                    }}>
                        <h1 style={{
                            color: '#1DB954',
                            marginBottom: '25px',
                            fontSize: '2.5em'
                        }}>
                            Your Top 5 Artists
                        </h1>
                        
                        <div style={{ marginBottom: '20px' }}>
                            {topArtists.map((artist, index) => (
                                <div 
                                    key={index}
                                    style={{
                                        backgroundColor: 'rgba(29, 185, 84, 0.1)',
                                        padding: '20px',
                                        borderRadius: '15px',
                                        marginBottom: '15px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'flex-start',
                                        background: 'rgba(0, 0, 0, 0.5)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)'
                                    }}
                                >
                                    <div style={{
                                        background: getGradientBackground(index),
                                        color: 'white',
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginRight: '20px',
                                        flexShrink: 0,
                                        fontSize: '1.5em',
                                        fontWeight: 'bold'
                                    }}>
                                        {index + 1}
                                    </div>
                                    <div style={{
                                        textAlign: 'left',
                                        flex: 1
                                    }}>
                                        <div style={{
                                            fontSize: '1.4em',
                                            fontWeight: 'bold',
                                            marginBottom: '5px',
                                            color: 'white'
                                        }}>
                                            {artist.name}
                                        </div>
                                        <div style={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: '8px'
                                        }}>
                                            {artist.genres?.slice(0, 3).map((genre, genreIndex) => (
                                                <span
                                                    key={genreIndex}
                                                    style={{
                                                        backgroundColor: 'rgba(29, 185, 84, 0.2)',
                                                        padding: '4px 10px',
                                                        borderRadius: '12px',
                                                        fontSize: '0.8em',
                                                        color: '#1DB954'
                                                    }}
                                                >
                                                    {genre}
                                                </span>
                                            ))}
                                        </div>
                                        <div style={{
                                            marginTop: '5px',
                                            fontSize: '0.9em',
                                            color: '#b3b3b3'
                                        }}>
                                            Popularity: {artist.popularity}%
                                        </div>
                                    </div>
                                </div>
                            ))}
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

export default Top5Artists;

