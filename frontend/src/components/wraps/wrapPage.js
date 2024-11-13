// src/components/wraps/wrapPage.js
import React, { useState, useEffect } from 'react';
import WrapCard from './WrapCard';
import './wrapPage.css';

// Example API response (mock data)
const mockData = {
  topArtists: ['Artist 1', 'Artist 2', 'Artist 3', 'Artist 4', 'Artist 5'],
  recentlyPlayed: [
    'Song 1 - Artist',
    'Song 2 - Artist',
    'Song 3 - Artist',
    'Song 4 - Artist',
    'Song 5 - Artist',
  ],
  topGenres: ['Genre 1', 'Genre 2', 'Genre 3', 'Genre 4', 'Genre 5'],
  totalMinutesListened: 10500,
};

const WrapPage = () => {
  const [data, setData] = useState(null);

  // Simulate fetching data (replace with actual API fetch in real app)
  useEffect(() => {
    setTimeout(() => {
      setData(mockData); // Replace this with API call
    }, 1000);
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="your-wrap">
      <header>
        <h1>Your Music Wrap</h1>
        <p>Here's a look at your top artists, genres, and listening stats!</p>
      </header>

      <section className="wrap-container">
        <WrapCard title="Top Artists" content={data.topArtists} />
        <WrapCard title="Recently Played" content={data.recentlyPlayed} />
        <WrapCard title="Top Genres" content={data.topGenres} />
        <WrapCard title="Total Minutes Listened" content={data.totalMinutesListened} />
      </section>

      <footer>
        <p>Powered by Your Music Service</p>
      </footer>
    </div>
  );
};

export default WrapPage;
