// src/components/wraps/Finish.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../Layout';

function Finish() {
    const navigate = useNavigate();
    const [isSharing, setIsSharing] = useState(false);
    const wrapData = JSON.parse(localStorage.getItem('wrapData'));

    const handleShare = (platform) => {
        setIsSharing(true);
        setTimeout(() => setIsSharing(false), 1000);
        switch (platform) {
            case 'Twitter':
                window.open(`https://twitter.com/intent/tweet?text=Check out my Spotify Wrapped! 🎵 Top Artist: ${wrapData.data.top_artist.name}, 🎧 Top Track: ${wrapData.data.top_track.name}, 🎸 Top Genre: ${wrapData.data.top_genres[0]}! Get your wrap today at ${`${window.location.protocol}//${window.location.host}`}`);
                break;
            case 'Facebook':
                const text2Copy = `Check out my Spotify Wrapped! 🎵 Top Artist: ${wrapData.data.top_artist.name}, 🎧 Top Track: ${wrapData.data.top_track.name}, 🎸 Top Genre: ${wrapData.data.top_genres[0]}! Get your wrap today at ${`${window.location.protocol}//${window.location.host}`}`;
                alert('Copying text to clipboard. Please paste it in your Facebook post!');
                navigator.clipboard.writeText(text2Copy)
                    .catch(err => {
                        console.error('Failed to copy text: ', err);
                        alert('Failed to copy to clipboard. Please try again.');
                    });
                window.open(`http://www.facebook.com/sharer.php?`);
                break;
            case 'WhatsApp':
                window.open(`https://wa.me/?text=Check out my Spotify Wrapped! \n Top Artist: ${wrapData.data.top_artist.name}, \n Top Track: ${wrapData.data.top_track.name}, \n Top Genre: ${wrapData.data.top_genres[0]}! \n Get your wrap today at ${`${window.location.protocol}//${window.location.host}`}`);
                break;
            case 'Instagram':
                const textToCopy = `Check out my Spotify Wrapped! 🎵 Top Artist: ${wrapData.data.top_artist.name}, 🎧 Top Track: ${wrapData.data.top_track.name}, 🎸 Top Genre: ${wrapData.data.top_genres[0]}! Get your wrap today at ${`${window.location.protocol}//${window.location.host}`}`;
                alert('Copying text to clipboard. Please paste it in your Instagram story!');
                navigator.clipboard.writeText(textToCopy)
                    .catch(err => {
                        console.error('Failed to copy text: ', err);
                        alert('Failed to copy to clipboard. Please try again.');
                    });
                window.open(`https://www.instagram.com/`);
                break;
            case 'LinkedIn':
                const linkedInText = `Check out my Spotify Wrapped! 🎵 Top Artist: ${wrapData.data.top_artist.name}, 🎧 Top Track: ${wrapData.data.top_track.name}, 🎸 Top Genre: ${wrapData.data.top_genres[0]}! Get your wrap today at ${`${window.location.protocol}//${window.location.host}`}`;
                alert('Copying text to clipboard. Please paste it in your LinkedIn post!');
                navigator.clipboard.writeText(linkedInText)
                .catch(err => {
                    console.error('Failed to copy text: ', err);
                    alert('Failed to copy to clipboard. Please try again.');
                });
                window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${window.location.protocol}//${window.location.host}`)}`);
                break;
        }
    };

    if (!wrapData) {
        navigate('/wrap');
        return null;
    }

    return (
        <Layout>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: 'calc(100vh - 90px)',
                padding: '10px',
                marginTop: '20px'
            }}>
                <div style={{
                    maxWidth: '1200px',
                    width: '100%',
                    textAlign: 'center',
                    position: 'relative'
                }}>
                    
            
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: '40px',
                        borderRadius: '20px',
                        color: 'white',
                        width: '80%',
                        maxWidth: '700px'
                    }}>
                        <h1 style={{
                            color: '#1DB954',
                            marginBottom: '20px',
                            fontSize: '3em',
                            fontWeight: 'bold'
                        }}>
                            That's a Wrap!
                        </h1>

                        <div style={{
                            fontSize: '1.4em',
                            marginBottom: '30px',
                            color: '#ffffff'
                        }}>
                            Thanks for checking out your Spotify Wrapped 2024
                        </div>

                        <div style={{
                            backgroundColor: 'rgba(29, 185, 84, 0.1)',
                            padding: '20px',
                            borderRadius: '15px',
                            marginBottom: '30px'
                        }}>
                            <h2 style={{
                                color: '#1DB954',
                                marginBottom: '15px',
                                fontSize: '1.8em'
                            }}>
                                Your Music Story
                            </h2>
                            <div style={{
                                textAlign: 'left',
                                marginBottom: '20px'
                            }}>
                                <p style={{ marginBottom: '10px' }}>
                                    🎵 Top Artist: <span style={{ color: '#1DB954' }}>{wrapData?.data?.top_artist?.name}</span>
                                </p>
                                <p style={{ marginBottom: '10px' }}>
                                    🎧 Top Track: <span style={{ color: '#1DB954' }}>{wrapData?.data?.top_track?.name}</span>
                                </p>
                                <p style={{ marginBottom: '10px' }}>
                                    🎸 Top Genre: <span style={{ color: '#1DB954' }}>{wrapData?.data?.top_genres?.[0]}</span>
                                </p>
                            </div>
                        </div>

                        <div style={{
                            marginBottom: '30px'
                        }}>
                            <h3 style={{
                                color: '#1DB954',
                                marginBottom: '15px',
                                fontSize: '1.4em'
                            }}>
                                Share Your Wrapped
                            </h3>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                gap: '15px',
                                flexWrap: 'wrap'
                            }}>
                                {['Instagram', 'Twitter', 'Facebook', 'WhatsApp', 'LinkedIn'].map((platform) => (
                                    <button
                                        key={platform}
                                        onClick={() => handleShare(platform)}
                                        disabled={isSharing}
                                        style={{
                                            backgroundColor: '#1DB954',
                                            color: 'white',
                                            border: 'none',
                                            padding: '10px 20px',
                                            borderRadius: '20px',
                                            fontSize: '1em',
                                            fontWeight: 'bold',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            opacity: isSharing ? 0.7 : 1
                                        }}
                                    >
                                        Share on {platform}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={{
                            marginTop: '30px',
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '20px'
                        }}>
                            <button
                                onClick={() => navigate('/dashboard')}
                                style={{
                                    backgroundColor: '#1DB954',
                                    color: 'white',
                                    border: 'none',
                                    padding: '15px 30px',
                                    borderRadius: '25px',
                                    fontSize: '1.1em',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                }}
                            >
                                Back to Dashboard
                            </button>
                            <button
                                onClick={() => navigate('/wrap')}
                                style={{
                                    backgroundColor: 'transparent',
                                    color: '#1DB954',
                                    border: '2px solid #1DB954',
                                    padding: '15px 30px',
                                    borderRadius: '25px',
                                    fontSize: '1.1em',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                }}
                            >
                                View Again
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Finish;