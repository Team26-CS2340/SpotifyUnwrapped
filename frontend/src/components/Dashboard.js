import React, { useEffect, useState } from 'react';

// Simple SVG Icons
const Icons = {
  Music: () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
    </svg>
  ),
  Album: () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/>
    </svg>
  ),
  Playlist: () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z"/>
    </svg>
  ),
  User: () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
    </svg>
  ),
  Clock: () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
    </svg>
  ),
  Refresh: () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
    </svg>
  )
};

const LoadingSpinner = () => (
  <div className="flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
  </div>
);

const StatCard = ({ icon: Icon, title, value, className }) => (
  <div className={`bg-gray-800/50 backdrop-blur-lg p-6 rounded-xl border border-gray-700/50 transition-all hover:bg-gray-800/70 ${className}`}>
    <div className="flex items-center gap-3 mb-4">
      <div className="text-green-500 bg-green-500/10 p-3 rounded-lg">
        <Icon />
      </div>
      <h2 className="text-lg font-medium text-gray-200">{title}</h2>
    </div>
    <p className="text-3xl font-bold text-white">{value?.toLocaleString() || '0'}</p>
  </div>
);

const ArtistCard = ({ artist, rank }) => (
  <div className="flex items-center gap-4 p-4 bg-gray-800/30 rounded-lg border border-gray-700/50 hover:bg-gray-800/50 transition-all">
    <span className="text-2xl font-bold text-gray-500">#{rank}</span>
    <div>
      <h3 className="font-medium text-white">{artist.name}</h3>
      {artist.genres?.length > 0 && (
        <p className="text-sm text-gray-400">{artist.genres.slice(0, 2).join(', ')}</p>
      )}
    </div>
  </div>
);

const TrackCard = ({ track, playedAt }) => (
  <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg border border-gray-700/50 hover:bg-gray-800/50 transition-all">
    <div className="flex-1">
      <h3 className="font-medium text-white">{track.name}</h3>
      <p className="text-sm text-gray-400">
        {track.artists.map(a => a.name).join(', ')}
      </p>
    </div>
    {playedAt && (
      <div className="text-right">
        <p className="text-xs text-gray-500">
          {new Date(playedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
        <p className="text-xs text-gray-500">
          {new Date(playedAt).toLocaleDateString()}
        </p>
      </div>
    )}
  </div>
);

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <LoadingSpinner />
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              {userData?.spotify_profile?.display_name}'s Dashboard
            </h1>
            <p className="text-gray-400">
              {userData?.spotify_profile?.product} account
            </p>
          </div>
          <button
            onClick={handleRefreshData}
            disabled={refreshing}
            className="px-6 py-3 bg-green-500 hover:bg-green-600 rounded-full transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {refreshing ? <LoadingSpinner /> : <Icons.Refresh />}
            {refreshing ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard 
            icon={Icons.Music}
            title="Saved Tracks"
            value={userData?.spotify_data?.saved_tracks_count}
          />
          <StatCard 
            icon={Icons.Album}
            title="Saved Albums"
            value={userData?.spotify_data?.saved_albums_count}
          />
          <StatCard 
            icon={Icons.Playlist}
            title="Playlists"
            value={userData?.spotify_data?.playlist_count}
          />
          <StatCard 
            icon={Icons.User}
            title="Following"
            value={userData?.spotify_data?.favorite_artists_count}
          />
        </div>

        {/* Top Artists & Recently Played Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-800/30 backdrop-blur-lg p-6 rounded-xl border border-gray-700/50">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Icons.User className="text-green-500" />
              Top Artists
            </h2>
            <div className="space-y-4">
              {userData?.spotify_data?.top_artists?.items?.slice(0, 5).map((artist, index) => (
                <ArtistCard key={artist.id} artist={artist} rank={index + 1} />
              ))}
            </div>
          </div>

          <div className="bg-gray-800/30 backdrop-blur-lg p-6 rounded-xl border border-gray-700/50">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Icons.Clock className="text-green-500" />
              Recently Played
            </h2>
            <div className="space-y-4">
              {userData?.spotify_data?.recently_played?.items?.slice(0, 5).map((item) => (
                <TrackCard 
                  key={`${item.track.id}-${item.played_at}`}
                  track={item.track}
                  playedAt={item.played_at}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}