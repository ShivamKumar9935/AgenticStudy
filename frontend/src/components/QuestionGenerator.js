// Question Generator Component
// This component generates study questions and answers based on user input
// Features: Input topic, select difficulty level, view questions, get answers

import React, { useState } from 'react';
import axios from 'axios';
import '../styles/QuestionGenerator.css';

function QuestionGenerator({ apiUrl }) {
  const API_BASE = apiUrl.replace('/api', '');

  // State management
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState('intermediate');
  const [chatQuestion, setChatQuestion] = useState('');
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [messages, setMessages] = useState([]); // Chat-like messages

  /**
   * Handle generating questions
   */
  const handleGenerateQuestions = async (e) => {
    e.preventDefault();
    
    // Validate input
    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }

    setLoading(true);
    setError('');
    setSelectedQuestion(null);

    try {
      console.log(`📚 Generating questions for topic: "${topic}"`);
      
      // Add user message to chat
      const userMessage = {
        type: 'user',
        content: `Generate ${level} level questions about: ${topic}`
      };
      setMessages(prev => [...prev, userMessage]);

      // Call backend API
      const response = await axios.post(`${apiUrl}/questions`, {
        topic: topic.trim(),
        level
      });

      // Parse response
      const questionData = response.data.data.questions || [];
      setQuestions(questionData);

      // Add AI response to chat
      const aiMessage = {
        type: 'assistant',
        content: `I've generated ${questionData.length} ${level} questions about "${topic}". Click on any question to get a detailed answer.`
      };
      setMessages(prev => [...prev, aiMessage]);

    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to generate questions';
      setError(errorMsg);
      console.error('Error:', errorMsg);
      
      // Add error message to chat
      const errorMessage = {
        type: 'error',
        content: `Oops! ${errorMsg}`
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle direct question from chat textbox
   */
  const handleAskQuestion = async (e) => {
    e.preventDefault();

    if (!chatQuestion.trim()) {
      setError('Please enter a question');
      return;
    }

    setLoading(true);
    setError('');

    const questionText = chatQuestion.trim();
    setChatQuestion('');

    try {
      const qMessage = {
        type: 'question',
        content: questionText
      };
      setMessages((prev) => [...prev, qMessage]);

      const response = await fetch(`${API_BASE}/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ question: questionText })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || data?.error || 'Failed to get answer');
      }

      const aMessage = {
        type: 'answer',
        content: data.answer
      };
      setMessages((prev) => [...prev, aMessage]);
    } catch (err) {
      const errorMsg = err.message || 'Failed to get answer';
      setError(errorMsg);
      setMessages((prev) => [
        ...prev,
        { type: 'error', content: `Oops! ${errorMsg}` }
      ]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle selecting a question and getting answer
   */
  const handleSelectQuestion = async (question) => {
    setSelectedQuestion(question);
    setLoading(true);
    setError('');

    try {
      console.log(`🤖 Getting answer for: "${question.question}"`);
      
      // Call backend API for answer
      const response = await axios.post(`${apiUrl}/answer`, {
        question: question.question
      });

      const answerText = response.data.answer;

    
      // Add Q&A to chat
      const qMessage = {
        type: 'question',
        content: question.question
      };
      const aMessage = {
        type: 'answer',
        content: answerText
      };
      
      setMessages(prev => [...prev, qMessage, aMessage]);

    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to generate answer';
      setError(errorMsg);
      console.error('Error:', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Clear all messages and reset state
   */
  const handleClear = () => {
    setMessages([]);
    setTopic('');
    setLevel('intermediate');
    setChatQuestion('');
    setQuestions([]);
    setSelectedQuestion(null);
    setError('');
  };

  return (
    <div className="question-generator">
      <div className="qg-container">
        {/* Left Panel - Input and Questions */}
        <div className="qg-left-panel">
          <div className="input-section">
            <h2>📚 Generate Study Questions</h2>
            
            <form onSubmit={handleGenerateQuestions} className="qg-form">
              {/* Topic Input */}
              <div className="form-group">
                <label htmlFor="topic">What topic do you want to study?</label>
                <input
                  type="text"
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., JavaScript, Biology, History"
                  disabled={loading}
                  className="form-input"
                />
              </div>

              {/* Level Selection */}
              <div className="form-group">
                <label htmlFor="level">Difficulty Level</label>
                <select
                  id="level"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  disabled={loading}
                  className="form-input"
                >
                  <option value="beginner">🟢 Beginner</option>
                  <option value="intermediate">🟡 Intermediate</option>
                  <option value="advanced">🔴 Advanced</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`btn-primary ${loading ? 'loading' : ''}`}
              >
                {loading ? (
                  <span className="loading-spinner">⏳ Generating...</span>
                ) : (
                  <span>Generate Questions</span>
                )}
              </button>
            </form>

            {/* Error Message */}
            {error && (
              <div className="alert alert-error">
                <span className="alert-icon">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Generated Questions List */}
            {questions.length > 0 && (
              <div className="questions-list">
                <h3>📋 Generated Questions</h3>
                {questions.map((q) => (
                  <button
                    key={q.id}
                    className={`question-item ${selectedQuestion?.id === q.id ? 'active' : ''}`}
                    onClick={() => handleSelectQuestion(q)}
                    disabled={loading}
                  >
                    <span className="question-number">{q.id}</span>
                    <span className="question-text">{q.question}</span>
                    <span className="question-arrow">→</span>
                  </button>
                ))}
              </div>
            )}

            {/* Clear Button */}
            {messages.length > 0 && (
              <button onClick={handleClear} className="btn-secondary">
                🔄 Clear All
              </button>
            )}
          </div>
        </div>

        {/* Right Panel - Chat and Answer Display */}
        <div className="qg-right-panel">
          <div className="chat-section">
            <h2>💬 Chat & Answers</h2>

            <form onSubmit={handleAskQuestion} className="chat-ask-form">
              <input
                type="text"
                className="chat-question-input"
                value={chatQuestion}
                onChange={(e) => setChatQuestion(e.target.value)}
                placeholder="Ask any study question and get an instant AI answer..."
                disabled={loading}
              />
              <button
                type="submit"
                className="btn-primary"
                disabled={loading || !chatQuestion.trim()}
              >
                {loading ? 'Asking...' : 'Ask'}
              </button>
            </form>
            
            <div className="messages-container">
              {messages.length === 0 ? (
                <div className="empty-state">
                  <p>👋 Welcome! Enter a topic and difficulty level on the left to get started.</p>
                  <p>Then click on any question to see detailed answers.</p>
                </div>
              ) : (
                <div className="messages-list">
                  {messages.map((msg, index) => (
                    <div key={index} className={`message message-${msg.type}`}>
                      <div className="message-icon">
                        {msg.type === 'user' && '🧑'}
                        {msg.type === 'assistant' && '🤖'}
                        {msg.type === 'question' && '❓'}
                        {msg.type === 'answer' && '💡'}
                        {msg.type === 'error' && '⚠️'}
                      </div>
                      <div className="message-content">
                        {msg.type === 'answer' ? (
                          <div className="formatted-answer">
                            {msg.content.split('\n').map((line, i) => (
                              line.trim() && (
                                <p key={i} className="answer-line">
                                  {line}
                                </p>
                              )
                            ))}
                          </div>
                        ) : (
                          <p>{msg.content}</p>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {/* Loading Indicator */}
                  {loading && (
                    <div className="message message-loading">
                      <div className="message-icon">⏳</div>
                      <div className="message-content">
                        <div className="pulse-animation">Thinking...</div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuestionGenerator;
