import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from './Layout';

const SavedWraps = () => {
  const [wraps, setWraps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserWraps();
  }, []);
  const fetchUserWraps = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/wraps/');
      const data = await response.json();
      console.log('Fetched wraps data:', data);
      if (response.ok) {
        setWraps(data);
      } else {
        console.error('Error fetching user wraps:', data);
        setError(`Error fetching user wraps: ${data.error}`);
      }
    } catch (error) {
      console.error('Error fetching user wraps:', error);
      setError('Failed to fetch user wraps');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 90px)' }}>
          <div className="lds-ring">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 90px)' }}>
          <div style={{ color: 'red', fontSize: '1.2rem' }}>Error: {error}</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ padding: '2rem' }}>
        <h1 style={{ color: '#1DB954', marginBottom: '2rem' }}>Your Saved Spotify Wraps</h1>
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 90px)' }}>
            <div className="lds-ring">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        )}
        {error && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 90px)' }}>
            <div style={{ color: 'red', fontSize: '1.2rem' }}>Error: {error}</div>
          </div>
        )}
        {!loading && !error && wraps.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {wraps.map((wrap) => (
              <div
                key={wrap.id}
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  padding: '1.5rem',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onClick={() => navigate(`/wraps/${wrap.id}`)}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <h2 style={{ color: '#1DB954', marginBottom: '0.5rem' }}>{wrap.year} Wrap</h2>
                <p style={{ color: 'white', marginBottom: '0.5rem' }}>Top Artist: {wrap.top_artist.name}</p>
                <p style={{ color: 'white' }}>Created: {new Date(wrap.created_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
        {!loading && !error && wraps.length === 0 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 90px)' }}>
            <div style={{ color: 'white', fontSize: '1.2rem' }}>No saved wraps found.</div>
          </div>
        )}
      </div>
    </Layout>
  );}

export default SavedWraps;