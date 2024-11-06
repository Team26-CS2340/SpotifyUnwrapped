import React, { useState } from 'react';

function SpotifyWrap() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [wrapData, setWrapData] = useState(null);

    // Function to get CSRF token from cookies
    function getCookie(name) {
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

    const createWrap = async () => {
        setLoading(true);
        try {
            const csrfToken = getCookie('csrftoken');
            console.log('CSRF Token:', csrfToken); // Debug log

            const response = await fetch('http://localhost:8000/api/wraps/create/', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken,
                }
            });
            
            // Log the raw response
            const responseText = await response.text();
            console.log('Response status:', response.status);
            console.log('Raw response:', responseText);
            
            try {
                const data = JSON.parse(responseText);
                console.log('Parsed data:', data);
                setWrapData(data);
            } catch (parseError) {
                console.error('Parse error:', parseError);
                setError('Failed to parse server response');
            }
        } catch (err) {
            console.error('Network error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Spotify Wrap</h1>
            <button onClick={createWrap} disabled={loading}>
                {loading ? 'Creating...' : 'Create Wrap'}
            </button>

            {error && (
                <div style={{color: 'red', marginTop: '10px'}}>
                    Error: {error}
                </div>
            )}

            {wrapData && (
                <div>
                    <h2>Wrap Data:</h2>
                    <pre>{JSON.stringify(wrapData, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}

export default SpotifyWrap;