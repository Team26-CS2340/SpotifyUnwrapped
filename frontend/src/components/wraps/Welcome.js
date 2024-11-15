import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../Layout';

const Welcome = () => {
    const navigate = useNavigate();
    return (
        <Layout>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: 'calc(100vh - 90px)',
                    marginTop: '20px',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Dark background
                }}
            >
                <div
                    style={{
                        maxWidth: '1200px',
                        width: '100%',
                        height: '80vh', // Ensures the container is large
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'flex-end', // Align content towards the bottom
                        borderRadius: '15px',
                        backgroundImage: 'url(/welcome.png)', // Set the background image
                        backgroundSize: 'cover', // Ensures the image fills the container
                        backgroundPosition: 'center', // Center the image
                        backgroundRepeat: 'no-repeat', // Prevent tiling
                        boxShadow: '0 4px 6px rgba(0,0,0,0.5)', // Optional: Add a shadow for emphasis
                        overflow: 'hidden',
                    }}
                >
                    <button
                        onClick={() => navigate('/topsong')}
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
                            marginBottom: '30px', // Adjust this value to move the button down
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

export default Welcome;


