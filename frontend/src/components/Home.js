// src/components/Home.js
import React, { useEffect } from 'react';
import '../styles.css';

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
