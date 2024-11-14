// src/components/Home.js
import React, { useEffect } from 'react';

const Home = () => {
    useEffect(() => {
        // Dark Mode Toggle Logic
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (localStorage.getItem('dark-mode') === 'enabled') {
            document.body.classList.add('dark-mode');
            darkModeToggle.checked = true;
        }

        darkModeToggle.addEventListener('change', () => {
            if (darkModeToggle.checked) {
                document.body.classList.add('dark-mode');
                localStorage.setItem('dark-mode', 'enabled');
            } else {
                document.body.classList.remove('dark-mode');
                localStorage.setItem('dark-mode', 'disabled');
            }
        });

        // Harrison Ford Theme Logic
        const harrisonFordToggle = document.getElementById('harrisonFordToggle');
        const harrisonFordImage = document.getElementById('harrisonFordImage');
        if (localStorage.getItem('harrison-ford-theme') === 'enabled') {
            document.body.classList.add('harrison-ford-theme');
            harrisonFordToggle.checked = true;
            harrisonFordImage.style.display = 'block';
        }

        harrisonFordToggle.addEventListener('change', () => {
            if (harrisonFordToggle.checked) {
                document.body.classList.add('harrison-ford-theme');
                localStorage.setItem('harrison-ford-theme', 'enabled');
                harrisonFordImage.style.display = 'block';
            } else {
                document.body.classList.remove('harrison-ford-theme');
                localStorage.setItem('harrison-ford-theme', 'disabled');
                harrisonFordImage.style.display = 'none';
            }
        });

        return () => {
            darkModeToggle.removeEventListener('change', () => {});
            harrisonFordToggle.removeEventListener('change', () => {});
        };
    }, []);

    useEffect(() => {
        // Sharing Links Logic
        const shareData = {
            title: 'Check out my Spotify Wrapped!',
            text: 'I just discovered my top tracks of the year!',
            url: 'https://yourwebsite.com/user-wrapped',
        };

        document.getElementById('twitter-share').href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(shareData.url)}`;
        document.getElementById('linkedin-share').href = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareData.url)}&title=${encodeURIComponent(shareData.title)}&summary=${encodeURIComponent(shareData.text)}`;
        document.getElementById('facebook-share').href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}`;

        document.getElementById('instagram-share').onclick = function () {
            alert('To share on Instagram, download your Wrapped and upload it to your profile.');
        };
    }, []);

    return (
        <div>
            <header>
                <h1>Welcome to Spotify Wrapped!</h1>
                <p>Your year in music awaits.</p>
                <label>
                    <input type="checkbox" id="darkModeToggle" />
                    Dark Mode
                </label>
                <label>
                    <input type="checkbox" id="harrisonFordToggle" />
                    Harrison Ford Theme
                </label>
            </header>
            <main>
                <section>
                    <h2>Discover Your Top Tracks</h2>
                    <p>See what you listened to the most this year.</p>
                    <a href="/top-tracks">Get Started</a>
                </section>
                <div id="harrisonFordImage" style={{ display: 'none' }}>
                    <img src="/images/harrison_ford.jpg" alt="Harrison Ford" />
                </div>
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
};

export default Home;






MY CODE WORKS FROM HERE




import React, { useState, useEffect } from 'react';

function HomePage() {
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('dark-mode') === 'enabled'
  );
  const [isHarrisonFordTheme, setIsHarrisonFordTheme] = useState(
    localStorage.getItem('harrison-ford-theme') === 'enabled'
  );

  useEffect(() => {
    // Handle dark mode
    if (isDarkMode) {
      document.body.style.backgroundColor = '#333';
      document.body.style.color = '#f8f8f8';
      localStorage.setItem('dark-mode', 'enabled');
    } else {
      document.body.style.backgroundColor = '#f8f8f8';
      document.body.style.color = '#333';
      localStorage.setItem('dark-mode', 'disabled');
    }
  }, [isDarkMode]);

  useEffect(() => {
    // Handle Harrison Ford theme
    if (isHarrisonFordTheme) {
      document.body.style.fontFamily = "'Cursive', sans-serif";
      localStorage.setItem('harrison-ford-theme', 'enabled');
    } else {
      document.body.style.fontFamily = "'Arial', sans-serif";
      localStorage.setItem('harrison-ford-theme', 'disabled');
    }
  }, [isHarrisonFordTheme]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: isDarkMode ? '#333' : '#f8f8f8',
        color: isDarkMode ? '#f8f8f8' : '#333',
        textAlign: 'center',
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: '20px',
          backgroundColor: isDarkMode ? '#444' : '#fff',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h1
          style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: isDarkMode ? '#f8f8f8' : '#5f27cd',
          }}
        >
          Unwrapped
        </h1>
        <h2
          style={{
            fontSize: '1.8rem',
            color: isDarkMode ? '#aaa' : '#7f8c8d',
          }}
        >
          Your Year in Sound. Unwrapped.
        </h2>
        <p
          style={{
            fontSize: '1rem',
            marginTop: '10px',
            color: isDarkMode ? '#ddd' : '#636e72',
          }}
        >
          Welcome to UnWrapped, where every song, beat, and lyric you’ve loved
          creates a unique map of your musical journey.
        </p>
        <div style={{ marginTop: '20px' }}>
          <button
            style={{
              padding: '10px 20px',
              margin: '5px',
              border: 'none',
              borderRadius: '5px',
              fontSize: '1rem',
              backgroundColor: '#5f27cd',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            Get started
          </button>
          <button
            style={{
              padding: '10px 20px',
              margin: '5px',
              border: '1px solid #5f27cd',
              borderRadius: '5px',
              fontSize: '1rem',
              backgroundColor: isDarkMode ? '#444' : '#fff',
              color: isDarkMode ? '#aaa' : '#5f27cd',
              cursor: 'pointer',
            }}
          >
            Sign In
          </button>
        </div>
      </header>

      {/* Main Graphic */}
      <main
        style={{
          flexGrow: 1,
          backgroundImage: 'url(/path-to-your-image.png)', // Replace with the actual graphic path
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      ></main>

      {/* Footer */}
      <footer
        style={{
          padding: '10px',
          backgroundColor: isDarkMode ? '#444' : '#fff',
          boxShadow: '0 -2px 4px rgba(0, 0, 0, 0.1)',
        }}
      >
        <nav
          style={{
            display: 'flex',
            justifyContent: 'space-around',
          }}
        >
          <button
            onClick={() => alert('Home clicked')}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: isDarkMode ? '#888' : '#5f27cd',
              fontSize: '1rem',
              cursor: 'pointer',
            }}
            onMouseOver={(e) => (e.target.style.color = '#ff69b4')}
            onMouseOut={(e) => (e.target.style.color = isDarkMode ? '#888' : '#5f27cd')}
          >
            <i className="fas fa-home"></i> Home
          </button>
          <button
            onClick={() => alert('Settings clicked')}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: isDarkMode ? '#888' : '#5f27cd',
              fontSize: '1rem',
              cursor: 'pointer',
            }}
            onMouseOver={(e) => (e.target.style.color = '#ff69b4')}
            onMouseOut={(e) => (e.target.style.color = isDarkMode ? '#888' : '#5f27cd')}
          >
            <i className="fas fa-cog"></i> Settings
          </button>
          <button
            onClick={() => alert('Share clicked')}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: isDarkMode ? '#888' : '#5f27cd',
              fontSize: '1rem',
              cursor: 'pointer',
            }}
            onMouseOver={(e) => (e.target.style.color = '#ff69b4')}
            onMouseOut={(e) => (e.target.style.color = isDarkMode ? '#888' : '#5f27cd')}
          >
            <i className="fas fa-share-alt"></i> Share
          </button>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: isDarkMode ? '#888' : '#5f27cd',
              fontSize: '1rem',
              cursor: 'pointer',
            }}
            onMouseOver={(e) => (e.target.style.color = '#ff69b4')}
            onMouseOut={(e) => (e.target.style.color = isDarkMode ? '#888' : '#5f27cd')}
          >
            <i className="fas fa-adjust"></i> Mode
          </button>
          <button
            onClick={() => setIsHarrisonFordTheme(!isHarrisonFordTheme)}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: isDarkMode ? '#888' : '#5f27cd',
              fontSize: '1rem',
              cursor: 'pointer',
            }}
            onMouseOver={(e) => (e.target.style.color = '#ff69b4')}
            onMouseOut={(e) => (e.target.style.color = isDarkMode ? '#888' : '#5f27cd')}
          >
            <i className="fas fa-user"></i> Harrison Ford
          </button>
        </nav>
      </footer>
    </div>
  );
}

export default HomePage;








