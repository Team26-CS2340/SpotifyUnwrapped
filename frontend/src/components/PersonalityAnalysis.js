import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoadingSpinner = () => (
  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
);

const SectionCard = ({ title, content }) => (
  <div className="bg-gray-700 p-4 rounded-lg">
    <h3 className="font-semibold text-green-400 mb-3">{title}</h3>
    <div className="space-y-2">
      {content.map((item, index) => (
        <div key={index} className="ml-4">
          <span className="text-green-300 font-medium">{item.subtitle && `${item.subtitle}: `}</span>
          <span className="text-gray-300">{item.text}</span>
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

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Music Personality Analysis</h1>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-full transition"
            >
              Back to Dashboard
            </button>
            <button
              onClick={handleAnalysis}
              disabled={analyzing}
              className={`px-4 py-2 bg-green-500 hover:bg-green-600 rounded-full transition flex items-center gap-2 ${
                analyzing ? 'opacity-50 cursor-not-allowed' : ''
              }`}
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

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-8">
            {error}
          </div>
        )}

        {/* Analysis Content */}
        {analysis && (
          <div className="space-y-8">
            {/* Main Analysis */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
              <h2 className="text-2xl font-bold mb-6 text-green-400 border-b border-gray-700 pb-2">
                Your Music Personality Profile
              </h2>
              <div className="grid gap-6">
                {formatAnalysis(analysis.analysis).map((section, index) => (
                  <div key={index} className="space-y-4">
                    <h3 className="text-xl font-semibold text-white">
                      {section.title}
                    </h3>
                    <SectionCard 
                      content={section.content}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Data Used for Analysis */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
              <h2 className="text-2xl font-bold mb-6 text-green-400 border-b border-gray-700 pb-2">
                Analysis Based On
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3 text-green-400">Top Artists</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {analysis.music_data.top_artists.map((artist, index) => (
                      <li key={index} className="truncate text-gray-300">
                        <span className="text-green-300">{index + 1}.</span> {artist}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3 text-green-400">Common Genres</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {analysis.music_data.top_genres.map((genre, index) => (
                      <li key={index} className="truncate text-gray-300">
                        <span className="text-green-300">{index + 1}.</span> {genre}
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
          <div className="bg-gray-800 p-6 rounded-lg text-center">
            <p className="text-gray-400 mb-4">
              Click the "Analyze My Music Taste" button to get an AI-generated personality profile based on your music preferences.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalityAnalysis;