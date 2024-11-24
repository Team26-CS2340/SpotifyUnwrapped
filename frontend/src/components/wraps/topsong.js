import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../Layout';

const TopSong = () => {
    const navigate = useNavigate();
    const wrapData = JSON.parse(localStorage.getItem('wrapData'))?.data;

    if (!wrapData) {
        navigate('/wrap');
        return null;
    }

    const themeColors = {
        buttonBg: 'var(--accent-color)',
        buttonTextColor: '#FFFFFF',
        buttonHoverBg: '#5b54d9',
        background: 'var(--bg-primary)',
        textPrimary: 'var(--text-primary)',
        accent: 'var(--accent-color)'
    };

    return (
        <Layout>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: 'calc(100vh - 90px)',
                padding: '10px',
                marginTop: '20px',
                backgroundColor: themeColors.background,
                backgroundImage: 'url(/TopSong.png)',

            }}>
                <div style={{
                    maxWidth: '1200px',
                    width: '100%',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '40px'
                }}>
                    <div style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        padding: '40px',
                        borderRadius: '20px',
                        width: '80%',
                        maxWidth: '600px',
                        marginBottom: '40px'
                    }}>
                        <h1 style={{
                            color: themeColors.accent,
                            marginBottom: '20px',
                            fontSize: '2.5em'
                        }}>
                            Your Top Track
                        </h1>
                        <h2 style={{
                            color: themeColors.textPrimary,
                            marginBottom: '15px',
                            fontSize: '2em'
                        }}>
                            {wrapData?.top_track?.name}
                        </h2>
                        <p style={{
                            color: '#b3b3b3',
                            fontSize: '1.5em'
                        }}>
                            by {wrapData?.top_track?.artists?.join(', ')}
                        </p>
                    </div>

                    <button
                        onClick={() => navigate('/top5songs')}
                        style={{
                            backgroundColor: themeColors.buttonBg,
                            color: themeColors.buttonTextColor,
                            border: 'none',
                            padding: '15px 40px',
                            borderRadius: '25px',
                            fontSize: '18px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0px 6px 12px rgba(0, 0, 0, 0.2)';
                            e.currentTarget.style.backgroundColor = themeColors.buttonHoverBg;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.2)';
                            e.currentTarget.style.backgroundColor = themeColors.buttonBg;
                        }}
                    >
                        Next →
                    </button>
                </div>
            </div>
        </Layout>
    );
};

export default TopSong;