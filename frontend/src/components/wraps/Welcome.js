import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../Layout';

const Welcome = () => {
    const navigate = useNavigate();

    const themeColors = {
        buttonBg: 'var(--accent-color)',
        buttonTextColor: '#FFFFFF',
        buttonHoverBg: '#5b54d9', // Slightly lighter green hover color
        background: 'var(--bg-primary)',
        textPrimary: 'var(--text-primary)',
        accent: 'var(--accent-color)'
    };

    return (
        <Layout>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                    minHeight: 'calc(100vh - 90px)',
                    backgroundImage: 'url(/welcome.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    margin: '20px'
                }}
            >
                <button
                    onClick={() => navigate('/topsong')}
                    onMouseEnter={e => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0px 6px 12px rgba(0, 0, 0, 0.2)';
                        e.currentTarget.style.backgroundColor = themeColors.buttonHoverBg; // Use the updated hover color
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.2)';
                        e.currentTarget.style.backgroundColor = themeColors.buttonBg;
                    }}
                    style={{
                        backgroundColor: themeColors.buttonBg,
                        color: themeColors.buttonTextColor,
                        border: 'none',
                        padding: '16px 32px',
                        borderRadius: '30px',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
                        marginBottom: '30px',
                        fontFamily: 'Quicksand, sans-serif',
                        letterSpacing: '0.5px'
                    }}
                >
                    Next →
                </button>
            </div>
        </Layout>
    );
};

export default Welcome;
