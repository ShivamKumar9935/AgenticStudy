// PDF Summarizer Component
// This component allows users to upload PDF files and get AI-generated summaries
// Features: File upload, text extraction, summarization with key points

import React, { useState, useRef } from 'react';
import '../styles/PDFSummarizer.css';

function PDFSummarizer({ apiUrl }) {
  const API_URL = apiUrl;

  // State management
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState(null);
  const [fileInfo, setFileInfo] = useState(null);
  const fileInputRef = useRef(null);

  /**
   * Handle file selection
   */
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (!selectedFile) return;

    // Validate file type
    if (selectedFile.type !== 'application/pdf') {
      setError('❌ Please select a valid PDF file');
      setFile(null);
      return;
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      setError('❌ File size exceeds 50MB limit');
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setFileName(selectedFile.name);
    setError('');
    setSummary(null);
  };

  /**
   * Handle PDF upload and summarization
   */
  const handleUploadAndSummarize = async (e) => {
    e.preventDefault();

    if (!file) {
      setError('Please select a PDF file');
      return;
    }

    setLoading(true);
    setError('');
    setSummary(null);

    try {
      console.log(`📄 Uploading PDF: ${fileName}`);

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', file);

      // Call backend API
      const response = await fetch(`${API_URL}/summarize-pdf`, {
        method: 'POST',
        body: formData
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData?.message || responseData?.error || 'Failed to process PDF');
      }

      // Store file info and summary
      setFileInfo({
        fileName: responseData.fileName,
        fileSize: responseData.fileSize,
        textLength: responseData.extractedTextLength || 0
      });

      setSummary(responseData.summary);
      console.log('✅ PDF processed successfully');

    } catch (err) {
      const errorMsg = err.message || 'Failed to process PDF';
      setError(errorMsg);
      console.error('Error:', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle button click to open file dialog
   */
  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  /**
   * Parse and format the summary
   */
  const renderSummary = () => {
    if (!summary) return null;

    const { shortSummary = '', keyPoints = [], importantConcepts = [] } = summary;
    
    return (
      <div className="summary-content">
        <div className="summary-section">
          <h3>Short Summary</h3>
          <p>{shortSummary}</p>
        </div>

        <div className="summary-section">
          <h3>Key Points</h3>
          <ul className="bullet-list">
            {keyPoints.map((point, idx) => (
              <li key={idx}>{point}</li>
            ))}
          </ul>
        </div>

        <div className="summary-section">
          <h3>Important Concepts</h3>
          <ul className="bullet-list">
            {importantConcepts.map((concept, idx) => (
              <li key={idx}>{concept}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="pdf-summarizer">
      <div className="ps-container">
        {/* Upload Section */}
        <div className="upload-section">
          <h2>📄 PDF Summarizer</h2>
          <p className="section-subtitle">
            Upload a PDF file to get instant summaries, key points, and important concepts
          </p>

          <form onSubmit={handleUploadAndSummarize} className="ps-form">
            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,application/pdf"
              style={{ display: 'none' }}
            />

            {/* File Upload Area */}
            <div className="upload-area">
              <div
                className={`upload-zone ${file ? 'has-file' : ''}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.add('drag-over');
                }}
                onDragLeave={(e) => {
                  e.currentTarget.classList.remove('drag-over');
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove('drag-over');
                  const droppedFile = e.dataTransfer.files[0];
                  if (droppedFile) {
                    // Simulate file input change
                    const event = {
                      target: {
                        files: e.dataTransfer.files
                      }
                    };
                    handleFileChange(event);
                  }
                }}
              >
                {file ? (
                  <div className="file-selected">
                    <span className="file-icon">✅</span>
                    <span className="file-name">{fileName}</span>
                    <span className="file-size">
                      ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                ) : (
                  <div className="upload-prompt">
                    <span className="upload-icon">📤</span>
                    <p>Drag and drop your PDF here</p>
                    <p className="upload-subtext">or click to browse</p>
                  </div>
                )}
              </div>

              {/* Choose File Button */}
              <button
                type="button"
                onClick={handleChooseFile}
                className="btn-secondary"
                disabled={loading}
              >
                Browse Files
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="alert alert-error">
                <span className="alert-icon">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* File Info */}
            {fileInfo && (
              <div className="alert alert-info">
                <span className="alert-icon">ℹ️</span>
                <div>
                  <strong>{fileInfo.fileName}</strong> ({fileInfo.fileSize})
                  <br />
                  <small>Extracted {fileInfo.textLength} characters of text</small>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!file || loading}
              className={`btn-primary ${loading ? 'loading' : ''}`}
            >
              {loading ? (
                <span className="loading-spinner">⏳ Summarizing...</span>
              ) : (
                <span>✨ Summarize PDF</span>
              )}
            </button>
          </form>
        </div>

        {/* Summary Display Section */}
        {summary && (
          <div className="summary-section-container">
            <h2>📊 Summary & Analysis</h2>
            
            <div className="summary-card">
              {renderSummary()}
            </div>

            {/* Actions */}
            <div className="summary-actions">
              <button
                onClick={() => {
                  setFile(null);
                  setFileName('');
                  setSummary(null);
                  setFileInfo(null);
                  setError('');
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
                className="btn-secondary"
              >
                Upload Another PDF
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!summary && !loading && (
          <div className="empty-state-section">
            <div className="empty-state">
              <span className="empty-icon">📝</span>
              <p>No PDF uploaded yet</p>
              <p className="empty-subtitle">
                Upload a PDF file to generate summaries, extract key points, and discover important concepts.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PDFSummarizer;
