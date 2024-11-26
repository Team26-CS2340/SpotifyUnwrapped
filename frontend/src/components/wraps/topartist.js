// src/wraps/TopArtist.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../Layout';

const TopArtist = () => {
  const navigate = useNavigate();
  const wrapData = JSON.parse(localStorage.getItem('wrapData'));
  const topArtist = wrapData?.data?.top_artist;
  const accessToken = localStorage.getItem('accessToken');

  const [topTrack, setTopTrack] = useState(null);
  const [player, setPlayer] = useState(null);
  const [deviceId, setDeviceId] = useState(null);

  // Fetch the top tracks of the top artist
  useEffect(() => {
    console.log('Attempting to fetch top tracks for artist:', topArtist);
    if (topArtist && accessToken) {
      fetch(
        `https://api.spotify.com/v1/artists/${topArtist.id}/top-tracks?market=US`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
        .then((response) => {
          console.log('Fetch response status:', response.status);
          if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log('Fetched data:', data);
          if (data.tracks && data.tracks.length > 0) {
            const track = data.tracks[0]; // Take the top track
            setTopTrack(track);
            console.log('Top track set:', track);
          } else {
            console.warn('No tracks found for this artist');
          }
        })
        .catch((error) => {
          console.error('Error fetching top tracks:', error);
        });
    } else {
      console.warn('topArtist or accessToken is missing');
    }
  }, [topArtist, accessToken]);

  // Load Spotify Web Playback SDK
  useEffect(() => {
    const script = document.createElement('script');

    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;

    document.body.appendChild(script);

    return () => {
      // Cleanup
      document.body.removeChild(script);
    };
  }, []);

  // Initialize the player when SDK is ready and play the song
  useEffect(() => {
    const initializePlayer = () => {
      if (accessToken && topTrack) {
        const token = accessToken;

        const player = new window.Spotify.Player({
          name: 'My Spotify Player',
          getOAuthToken: (cb) => {
            cb(token);
          },
          volume: 0.5,
        });

        // Error handling
        player.addListener('initialization_error', ({ message }) => {
          console.error(message);
        });
        player.addListener('authentication_error', ({ message }) => {
          console.error(message);
        });
        player.addListener('account_error', ({ message }) => {
          console.error(message);
        });
        player.addListener('playback_error', ({ message }) => {
          console.error(message);
        });

        // Ready
        player.addListener('ready', ({ device_id }) => {
          console.log('Ready with Device ID', device_id);
          setDeviceId(device_id);
          // Transfer playback to our new device and play the song
          transferPlaybackHere(device_id);
          playSong(topTrack.uri);
        });

        // Not Ready
        player.addListener('not_ready', ({ device_id }) => {
          console.log('Device ID has gone offline', device_id);
        });

        // Connect to the player!
        player.connect();

        setPlayer(player);
      }
    };

    if (window.Spotify) {
      initializePlayer();
    } else {
      window.onSpotifyWebPlaybackSDKReady = initializePlayer;
    }

    // Cleanup function
    return () => {
      if (player) {
        player.disconnect();
      }
    };
  }, [accessToken, topTrack]);

  const transferPlaybackHere = (deviceId) => {
    fetch('https://api.spotify.com/v1/me/player', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
         Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        device_ids: [deviceId],
        play: false,
      }),
    });
  };

  const playSong = (spotifyUri) => {
    fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
      method: 'PUT',
      body: JSON.stringify({ uris: [spotifyUri] }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).catch((error) => {
      console.error('Error playing song:', error);
    });
  };

  // Now check for wrapData after Hooks
  if (!wrapData) {
    navigate('/wrap');
    return null;
  }

  // Calculate popularity score visual representation
  const popularityBars = [];
  const totalBars = 20;
  const filledBars = Math.floor(
    ((topArtist?.popularity || 0) * totalBars) / 100
  );

  for (let i = 0; i < totalBars; i++) {
    popularityBars.push(
      <div
        key={i}
        style={{
          width: '12px',
          height: '20px',
          backgroundColor:
            i < filledBars ? '#1DB954' : 'rgba(255, 255, 255, 0.2)',
          margin: '0 2px',
          borderRadius: '2px',
          transition: 'all 0.3s ease',
        }}
      />
    );
  }

  return (
    <Layout>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 'calc(100vh - 90px)',
          padding: '10px',
          marginTop: '20px',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backgroundImage: 'url(/TopArtist.png)',
        }}
      >
        <div
          style={{
            position: 'relative',
            maxWidth: '1200px',
            width: '100%',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '40px',
          }}
        >
          <div
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              padding: '40px',
              borderRadius: '20px',
              color: 'white',
              width: '80%',
              maxWidth: '700px',
              marginBottom: '40px',
              position: 'relative',
            }}
          >
            <h1
              style={{
                color: '#1DB954',
                marginBottom: '10px',
                fontSize: '2.5em',
              }}
            >
              Your Top Artist
            </h1>

            <h2
              style={{
                color: 'white',
                fontSize: '3.5em',
                marginBottom: '20px',
                fontWeight: 'bold',
              }}
            >
              {topArtist?.name || 'Loading...'}
            </h2>

            {/* Genres */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '10px',
                marginBottom: '30px',
              }}
            >
              {topArtist?.genres?.map((genre, index) => (
                <span
                  key={index}
                  style={{
                    backgroundColor: 'rgba(29, 185, 84, 0.3)',
                    padding: '8px 15px',
                    borderRadius: '20px',
                    fontSize: '1em',
                    color: '#ffffff',
                  }}
                >
                  {genre}
                </span>
              ))}
            </div>

            {/* Popularity Score */}
            <div
              style={{
                marginTop: '20px',
              }}
            >
              <h3
                style={{
                  color: '#1DB954',
                  marginBottom: '10px',
                  fontSize: '1.2em',
                }}
              >
                Artist Popularity
              </h3>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '2px',
                  marginBottom: '10px',
                }}
              >
                {popularityBars}
              </div>
              <p
                style={{
                  color: '#b3b3b3',
                  fontSize: '1.1em',
                }}
              >
                {topArtist?.popularity || 0}% Popular on Spotify
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/topalbum')}
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
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
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
};

export default TopArtist;
