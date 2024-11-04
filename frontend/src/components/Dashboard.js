import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Icons = {
  Spotify: () => (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
    </svg>
  ),
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
  )
};

const LoadingSpinner = () => (
  <div className="flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
  </div>
);

const StatCard = ({ icon: Icon, title, value }) => (
  <div className="bg-gray-800 p-6 rounded-lg">
    <div className="flex items-center gap-3 mb-4">
      <div className="text-green-500">
        <Icon />
      </div>
      <h2 className="text-lg font-semibold">{title}</h2>
    </div>
    <p className="text-3xl font-bold">{value || '0'}</p>
  </div>
);

const formatDate = (dateString) => {
  if (!dateString) return 'Never';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUserData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/user/data/', {
        withCredentials: true
      });
      setUserData(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError(err.response?.data?.message || 'Failed to load user data');
      if (err.response?.status === 401) {
        window.location.href = 'http://localhost:8000/api/spotify/login/';
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
      await axios.post('http://localhost:8000/api/spotify/refresh-data/', {}, {
        withCredentials: true
      });
      await fetchUserData();
    } catch (err) {
      console.error('Error refreshing data:', err);
      setError(err.response?.data?.message || 'Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.href = 'http://localhost:8000/api/spotify/login/'}
            className="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600"
          >
            Reconnect to Spotify
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
              <Icons.Spotify />
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                {userData?.spotify_profile?.display_name || 'Spotify User'}
              </h1>
              <p className="text-gray-400">
                {userData?.spotify_profile?.product || 'free'} account
              </p>
            </div>
          </div>
          <button
            onClick={handleRefreshData}
            disabled={refreshing}
            className={`px-4 py-2 bg-green-500 hover:bg-green-600 rounded-full transition flex items-center gap-2 ${
              refreshing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {refreshing ? (
              <>
                <LoadingSpinner />
                <span>Refreshing...</span>
              </>
            ) : (
              'Refresh Data'
            )}
          </button>
        </div>

        {/* Last Updated */}
        <p className="text-gray-400 mb-8">
          Last updated: {formatDate(userData?.metadata?.last_updated)}
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
        </div>

        {/* Top Artists */}
        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-bold mb-4">Top Artists</h2>
          {userData?.spotify_data?.top_artists?.items?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userData.spotify_data.top_artists.items.map((artist, index) => (
                <div key={artist.id} className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
                  <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                  <div>
                    <p className="font-semibold">{artist.name}</p>
                    <p className="text-sm text-gray-400">
                      {artist.genres?.slice(0, 2).join(', ')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No top artists data available</p>
          )}
        </div>

        {/* Recently Played */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Recently Played</h2>
          {userData?.spotify_data?.recently_played?.items?.length > 0 ? (
            <div className="space-y-4">
              {userData.spotify_data.recently_played.items.slice(0, 5).map((item) => (
                <div key={item.played_at} className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
                  <div>
                    <p className="font-semibold">{item.track.name}</p>
                    <p className="text-sm text-gray-400">
                      {item.track.artists.map(a => a.name).join(', ')}
                    </p>
                    <p className="text-xs text-gray-500">
                      Played: {formatDate(item.played_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No recently played tracks available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;