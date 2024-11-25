// src/components/PersonalityAnalysis.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Layout from './Layout';

const LoadingSpinner = () => (
    <div style={{
        width: '16px',
        height: '16px',
        border: '2px solid #ffffff',
        borderTopColor: 'transparent',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
    }} />
);

const SectionCard = ({ content }) => (
    <div style={{
        backgroundColor: 'var(--bg-tertiary)',
        padding: '16px',
        borderRadius: '8px'
    }}>
        <div style={{ display: 'grid', gap: '8px' }}>
            {content.map((item, index) => (
                <div key={index} style={{ marginLeft: '16px' }}>
                    <span style={{ 
                        color: '#1DB954',
                        fontWeight: '500'
                    }}>
                        {item.subtitle && `${item.subtitle}: `}
                    </span>
                    <span style={{ color: 'var(--text-primary)' }}>
                        {item.text}
                    </span>
                </div>
            ))}
        </div>
    </div>
);

const PersonalityAnalysis = () => {
    const [analysis, setAnalysis] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleAnalysis = async () => {
        try {
            setAnalyzing(true);
            setError(null);
            const response = await axios.get(
                'http://localhost:8000/api/user/personality-analysis/',
                { withCredentials: true }
            );
            setAnalysis(response.data);
        } catch (err) {
            console.error('Error getting personality analysis:', err);
            if (err.response?.status === 401) {
                navigate('/');
            }
            setError(err.response?.data?.message || 'Failed to get analysis');
        } finally {
            setAnalyzing(false);
        }
    };

    const formatAnalysis = (analysisText) => {
        const sections = analysisText.split('**').filter(Boolean);
        const formattedSections = [];
        
        for (let i = 0; i < sections.length; i += 2) {
            const title = sections[i].trim();
            if (sections[i + 1]) {
                const content = sections[i + 1]
                    .split('***')
                    .filter(Boolean)
                    .map(item => {
                        const [subtitle, ...textParts] = item.split(':');
                        return {
                            subtitle: subtitle.trim(),
                            text: textParts.join(':').trim()
                        };
                    });
                
                formattedSections.push({ title, content });
            }
        }
        
        return formattedSections;
    };

    const content = (
        <div style={{ 
            width: '100%',
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '20px 40px',
            boxSizing: 'border-box'
        }}>
            {/* Header Section */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '32px'
            }}>
                <h1 style={{ 
                    color: '#1DB954',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    margin: 0
                }}>
                    Music Personality Analysis
                </h1>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <button
                        onClick={() => navigate('/dashboard')}
                        style={{
                            backgroundColor: 'var(--bg-secondary)',
                            color: 'var(--text-primary)',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '20px',
                            cursor: 'pointer'
                        }}
                    >
                        Back to Dashboard
                    </button>
                    <button
                        onClick={handleAnalysis}
                        disabled={analyzing}
                        style={{
                            backgroundColor: '#1DB954',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '20px',
                            cursor: analyzing ? 'not-allowed' : 'pointer',
                            opacity: analyzing ? 0.7 : 1,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        {analyzing ? (
                            <>
                                <LoadingSpinner />
                                <span>Analyzing...</span>
                            </>
                        ) : (
                            'Analyze My Music Taste'
                        )}
                    </button>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div style={{
                    backgroundColor: 'rgba(255,68,68,0.1)',
                    border: '1px solid #ff4444',
                    color: '#ff4444',
                    padding: '16px',
                    borderRadius: '8px',
                    marginBottom: '32px'
                }}>
                    {error}
                </div>
            )}

            {/* Analysis Content */}
            {analysis && (
                <div style={{ display: 'grid', gap: '32px' }}>
                    {/* Main Analysis Section */}
                    <div style={{
                        backgroundColor: 'var(--bg-secondary)',
                        padding: '24px',
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                        <h2 style={{
                            color: '#1DB954',
                            fontSize: '20px',
                            fontWeight: 'bold',
                            marginTop: 0,
                            marginBottom: '24px',
                            borderBottom: '1px solid var(--border-color)',
                            paddingBottom: '8px'
                        }}>
                            Your Music Personality Profile
                        </h2>
                        <div style={{ display: 'grid', gap: '24px' }}>
                            {formatAnalysis(analysis.analysis).map((section, index) => (
                                <div key={index} style={{ display: 'grid', gap: '16px' }}>
                                    <h3 style={{
                                        fontSize: '18px',
                                        fontWeight: '600',
                                        color: 'var(--text-primary)',
                                        margin: 0
                                    }}>
                                        {section.title}
                                    </h3>
                                    <SectionCard content={section.content} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Analysis Data Section */}
                    <div style={{
                        backgroundColor: 'var(--bg-secondary)',
                        padding: '24px',
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                        <h2 style={{
                            color: '#1DB954',
                            fontSize: '20px',
                            fontWeight: 'bold',
                            marginTop: 0,
                            marginBottom: '24px',
                            borderBottom: '1px solid var(--border-color)',
                            paddingBottom: '8px'
                        }}>
                            Analysis Based On
                        </h2>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                            gap: '24px'
                        }}>
                            {/* Top Artists */}
                            <div style={{
                                backgroundColor: 'var(--bg-tertiary)',
                                padding: '16px',
                                borderRadius: '8px'
                            }}>
                                <h3 style={{
                                    color: '#1DB954',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    marginBottom: '12px'
                                }}>
                                    Top Artists
                                </h3>
                                <ul style={{
                                    listStyle: 'disc',
                                    paddingLeft: '20px',
                                    margin: 0
                                }}>
                                    {analysis.music_data.top_artists.map((artist, index) => (
                                        <li key={index} style={{
                                            color: 'var(--text-primary)',
                                            marginBottom: '4px',
                                            textOverflow: 'ellipsis',
                                            overflow: 'hidden',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            <span style={{ color: '#1DB954' }}>{index + 1}.</span> {artist}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Top Genres */}
                            <div style={{
                                backgroundColor: 'var(--bg-tertiary)',
                                padding: '16px',
                                borderRadius: '8px'
                            }}>
                                <h3 style={{
                                    color: '#1DB954',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    marginBottom: '12px'
                                }}>
                                    Common Genres
                                </h3>
                                <ul style={{
                                    listStyle: 'disc',
                                    paddingLeft: '20px',
                                    margin: 0
                                }}>
                                    {analysis.music_data.top_genres.map((genre, index) => (
                                        <li key={index} style={{
                                            color: 'var(--text-primary)',
                                            marginBottom: '4px',
                                            textOverflow: 'ellipsis',
                                            overflow: 'hidden',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            <span style={{ color: '#1DB954' }}>{index + 1}.</span> {genre}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Initial State */}
            {!analysis && !analyzing && !error && (
                <div style={{
                    backgroundColor: 'var(--bg-secondary)',
                    padding: '24px',
                    borderRadius: '8px',
                    textAlign: 'center'
                }}>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Click the "Analyze My Music Taste" button to get an AI-generated personality profile based on your music preferences.
                    </p>
                </div>
            )}
        </div>
    );

    return <Layout>{content}</Layout>;
};

export default PersonalityAnalysis;