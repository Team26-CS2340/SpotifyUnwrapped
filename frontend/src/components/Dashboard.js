import React, { useEffect, useState } from 'react';
import '../styles.css';

export default function Dashboard() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isHarrisonFordMode, setIsHarrisonFordMode] = useState(false);

    // Initialize theme states from localStorage
    useEffect(() => {
        const darkModeEnabled = localStorage.getItem('dark-mode') === 'enabled';
        const harrisonFordEnabled = localStorage.getItem('harrison-ford-theme') === 'enabled';
        
        setIsDarkMode(darkModeEnabled);
        setIsHarrisonFordMode(harrisonFordEnabled);
        
        if (darkModeEnabled) {
            document.body.classList.add('dark-mode');
        }
        
        if (harrisonFordEnabled) {
            document.body.classList.add('harrison-ford-theme');
        }
    }, []);

    // Handle dark mode toggle
    const handleDarkModeToggle = (event) => {
        const enabled = event.target.checked;
        setIsDarkMode(enabled);
        
        if (enabled) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('dark-mode', 'enabled');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('dark-mode', 'disabled');
        }
    };

    // Handle Harrison Ford theme toggle
    const handleHarrisonFordToggle = (event) => {
        const enabled = event.target.checked;
        setIsHarrisonFordMode(enabled);
        
        if (enabled) {
            document.body.classList.add('harrison-ford-theme');
            localStorage.setItem('harrison-ford-theme', 'enabled');
        } else {
            document.body.classList.remove('harrison-ford-theme');
            localStorage.setItem('harrison-ford-theme', 'disabled');
        }
    };

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

    // Sharing Links Logic
    useEffect(() => {
        const shareData = {
            title: 'Check out my Spotify Wrapped!',
            text: 'I just discovered my top tracks of the year!',
            url: 'https://yourwebsite.com/user-wrapped',
        };

        const twitterShare = document.getElementById('twitter-share');
        const linkedinShare = document.getElementById('linkedin-share');
        const facebookShare = document.getElementById('facebook-share');
        const instagramShare = document.getElementById('instagram-share');

        if (twitterShare) {
            twitterShare.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(shareData.url)}`;
        }
        if (linkedinShare) {
            linkedinShare.href = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareData.url)}&title=${encodeURIComponent(shareData.title)}&summary=${encodeURIComponent(shareData.text)}`;
        }
        if (facebookShare) {
            facebookShare.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}`;
        }
        if (instagramShare) {
            instagramShare.onclick = function () {
                alert('To share on Instagram, download your Wrapped and upload it to your profile.');
            };
        }
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
                <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                    >
                        Reconnect to Spotify
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <header>
                <h1>Welcome to Spotify Wrapped!</h1>
                <p>Your year in music awaits.</p>
                <label>
                    <input 
                        type="checkbox" 
                        checked={isDarkMode}
                        onChange={handleDarkModeToggle}
                    />
                    Dark Mode
                </label>
                <label>
                    <input 
                        type="checkbox"
                        checked={isHarrisonFordMode}
                        onChange={handleHarrisonFordToggle}
                    />
                    Harrison Ford Theme
                </label>
            </header>
            <main>
                <section>
                    <h2>Discover Your Top Tracks</h2>
                    <p>See what you listened to the most this year.</p>
                    <a href="/top-tracks">Get Started</a>
                </section>
                {isHarrisonFordMode && (
                    <div>
                        <img src="/images/harrison_ford.jpg" alt="Harrison Ford" />
                    </div>
                )}

                {/* Display User Data */}
                <section>
                    <h2>{userData?.spotify_profile?.display_name}'s Stats</h2>
                    <p>Account Type: {userData?.spotify_profile?.product}</p>
                    <button
                        onClick={handleRefreshData}
                        disabled={refreshing}
                        className="px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {refreshing ? 'Refreshing...' : 'Refresh Data'}
                    </button>
                    <div className="stats-grid">
                        <div>
                            <h3>Saved Tracks</h3>
                            <p>{userData?.spotify_data?.saved_tracks_count}</p>
                        </div>
                        <div>
                            <h3>Saved Albums</h3>
                            <p>{userData?.spotify_data?.saved_albums_count}</p>
                        </div>
                        <div>
                            <h3>Playlists</h3>
                            <p>{userData?.spotify_data?.playlist_count}</p>
                        </div>
                        <div>
                            <h3>Following</h3>
                            <p>{userData?.spotify_data?.favorite_artists_count}</p>
                        </div>
                    </div>
                </section>

                {/* Top Artists */}
                <section>
                    <h2>Top Artists</h2>
                    <ul>
                        {userData?.spotify_data?.top_artists?.items?.slice(0, 5).map((artist, index) => (
                            <li key={artist.id}>
                                <strong>#{index + 1}</strong> {artist.name}
                                {artist.genres?.length > 0 && (
                                    <span> - {artist.genres.slice(0, 2).join(', ')}</span>
                                )}
                            </li>
                        ))}
                    </ul>
                </section>

                {/* Recently Played */}
                <section>
                    <h2>Recently Played</h2>
                    <ul>
                        {userData?.spotify_data?.recently_played?.items?.slice(0, 5).map((item) => (
                            <li key={`${item.track.id}-${item.played_at}`}>
                                <div>
                                    <strong>{item.track.name}</strong> by {item.track.artists.map(a => a.name).join(', ')}
                                </div>
                                <div>
                                    Played at: {new Date(item.played_at).toLocaleString()}
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>
            </main>
            <footer>
                <section id="share">
                    <h2>Share Your Wrapped!</h2>
                    <a id="twitter-share" href="#" target="_blank" rel="noopener noreferrer">Share on Twitter</a>
                    <a id="linkedin-share" href="#" target="_blank" rel="noopener noreferrer">Share on LinkedIn</a>
                    <a id="facebook-share" href="#" target="_blank" rel="noopener noreferrer">Share on Facebook</a>
                    <a id="instagram-share" href="#" target="_blank" rel="noopener noreferrer">Share on Instagram</a>
                </section>
                <p>&copy; 2024 Spotify Wrapped</p>
            </footer>
        </div>
    );
}