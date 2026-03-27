// Main App Component
// This component serves as the main container for the AI Study Assistant
// It manages the overall layout and tabs between different features

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QuestionGenerator from './components/QuestionGenerator';
import PDFSummarizer from './components/PDFSummarizer';
import StudyShorts from './components/StudyShorts';
import './App.css';

function App() {
  // State management
  const [activeTab, setActiveTab] = useState('questions'); // 'questions' | 'pdf' | 'videos'
  const [serverStatus, setServerStatus] = useState('checking'); // 'checking', 'connected', 'error'
  
  // Get API URL from environment or use default
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // Check if backend server is running on component mount
  useEffect(() => {
    checkServerHealth();
  }, []);

  /**
   * Check if backend server is running and accessible
   */
  const checkServerHealth = async () => {
    try {
      const response = await axios.get(`${API_URL.replace('/api', '')}/api/health`, {
        timeout: 5000
      });
      
      if (response.data.status === 'ok') {
        setServerStatus('connected');
        console.log('✅ Backend server is connected');
      }
    } catch (error) {
      setServerStatus('error');
      console.error('❌ Backend server is not accessible:', error.message);
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <h1>🎓 AI Study Assistant</h1>
          <p>Your personalized learning companion powered by AI</p>
          
          {/* Server Status Indicator */}
          <div className={`server-status ${serverStatus}`}>
            <span className={`status-dot ${serverStatus}`}></span>
            {serverStatus === 'checking' && <span>Checking server...</span>}
            {serverStatus === 'connected' && <span>Backend Connected</span>}
            {serverStatus === 'error' && <span>Backend Offline</span>}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main">
        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button
            className={`tab-button ${activeTab === 'questions' ? 'active' : ''}`}
            onClick={() => setActiveTab('questions')}
          >
            <span className="tab-icon">❓</span>
            <span>Question Generator</span>
          </button>
          <button
            className={`tab-button ${activeTab === 'pdf' ? 'active' : ''}`}
            onClick={() => setActiveTab('pdf')}
          >
            <span className="tab-icon">📄</span>
            <span>PDF Summarizer</span>
          </button>
          <button
            className={`tab-button ${activeTab === 'videos' ? 'active' : ''}`}
            onClick={() => setActiveTab('videos')}
          >
            <span className="tab-icon">🎬</span>
            <span>Study Shorts</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'questions' && (
            <QuestionGenerator apiUrl={API_URL} />
          )}
          {activeTab === 'pdf' && (
            <PDFSummarizer apiUrl={API_URL} />
          )}
          {activeTab === 'videos' && (
            <StudyShorts apiUrl={API_URL} />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>AI Study Assistant v1.0 | Powered by Google Gemini API</p>
        <p>For setup instructions, check the README.md file</p>
      </footer>
    </div>
  );
}

export default App;
