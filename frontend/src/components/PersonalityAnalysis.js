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
                    {/* Profile Title */}
                    <h2 style={{ 
                        color: '#1DB954',
                        fontSize: '20px',
                        fontWeight: 'bold',
                        margin: '0 0 12px 0'
                    }}>
                        {analysis.profile_title}
                    </h2>

                    {/* Personality Traits */}
                    <div style={{
                        backgroundColor: 'var(--bg-secondary)',
                        padding: '24px',
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                        <h3 style={{
                            color: '#1DB954',
                            fontSize: '18px',
                            fontWeight: 'bold',
                            marginTop: 0,
                            marginBottom: '16px'
                        }}>
                            1. Personality Traits and General Vibe:
                        </h3>
                        <p style={{ color: 'var(--text-primary)', lineHeight: '1.6' }}>
                            {analysis.personality_traits}
                        </p>
                    </div>

                    {/* Fashion Style */}
                    <div style={{
                        backgroundColor: 'var(--bg-secondary)',
                        padding: '24px',
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                        <h3 style={{
                            color: '#1DB954',
                            fontSize: '18px',
                            fontWeight: 'bold',
                            marginTop: 0,
                            marginBottom: '16px'
                        }}>
                            2. Fashion Style and Aesthetic Preferences:
                        </h3>
                        <p style={{ color: 'var(--text-primary)', lineHeight: '1.6' }}>
                            {analysis.fashion_style}
                        </p>
                    </div>

                    {/* Hobbies and Interests */}
                    <div style={{
                        backgroundColor: 'var(--bg-secondary)',
                        padding: '24px',
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                        <h3 style={{
                            color: '#1DB954',
                            fontSize: '18px',
                            fontWeight: 'bold',
                            marginTop: 0,
                            marginBottom: '16px'
                        }}>
                            3. Potential Hobbies and Interests:
                        </h3>
                        <p style={{ color: 'var(--text-primary)', lineHeight: '1.6' }}>
                            {analysis.hobbies_interests}
                        </p>
                    </div>

                    {/* Social Characteristics */}
                    <div style={{
                        backgroundColor: 'var(--bg-secondary)',
                        padding: '24px',
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                        <h3 style={{
                            color: '#1DB954',
                            fontSize: '18px',
                            fontWeight: 'bold',
                            marginTop: 0,
                            marginBottom: '16px'
                        }}>
                            4. Social Characteristics and Friend Group Dynamics:
                        </h3>
                        <p style={{ color: 'var(--text-primary)', lineHeight: '1.6' }}>
                            {analysis.social_characteristics}
                        </p>
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