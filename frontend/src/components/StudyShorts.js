import React, { useState } from 'react';
import '../styles/StudyShorts.css';

function StudyShorts({ apiUrl }) {
  const API_BASE = apiUrl.replace('/api', '');
  const [topic, setTopic] = useState('');
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFetchVideos = async (e) => {
    e.preventDefault();

    const cleanTopic = topic.trim();
    if (!cleanTopic) {
      setError('Please enter a topic to fetch videos.');
      return;
    }

    setLoading(true);
    setError('');
    setVideos([]);

    try {
      const response = await fetch(`${API_BASE}/videos?topic=${encodeURIComponent(cleanTopic)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'No short videos found for this topic');
      }

      setVideos(data);
      if (!data.length) {
        setError('No short videos found for this topic');
      }
    } catch (fetchError) {
      setError(fetchError.message || 'Failed to fetch videos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="study-shorts">
      <div className="shorts-header">
        <h2>🎬 Study Shorts</h2>
        <p>Find short educational videos and learn faster.</p>
      </div>

      <form onSubmit={handleFetchVideos} className="shorts-form">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter topic (e.g., JavaScript, Photosynthesis)"
          className="shorts-input"
          disabled={loading}
        />
        <button type="submit" className="shorts-button" disabled={loading}>
          {loading ? 'Fetching videos...' : 'Get Videos'}
        </button>
      </form>

      {error && <div className="shorts-error">{error}</div>}

      {videos.length > 0 && (
        <div className="video-grid">
          {videos.map((video) => (
            <div key={video.videoId} className="video-card">
              <img src={video.thumbnail} alt={video.title} className="video-thumbnail" />
              <div
                style={{
                  width: '300px',
                  height: '500px',
                  overflow: 'hidden',
                  borderRadius: '12px',
                  margin: '0.75rem auto',
                  background: '#000'
                }}
              >
                <iframe
                  title={video.title}
                  src={`https://www.youtube-nocookie.com/embed/${video.videoId}?autoplay=0&mute=0&controls=0&rel=0&modestbranding=1&playsinline=1`}
                  style={{
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'auto',
                    transform: 'scale(1.08)',
                    transformOrigin: 'center'
                  }}
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              </div>
              <h3>{video.title}</h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StudyShorts;
