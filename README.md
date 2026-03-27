# 🎓 AI Study Assistant - Complete Setup Guide

Welcome to the **AI Study Assistant** - a full-stack web application that helps students study smarter using AI!

## 📋 Table of Contents
1. [Features](#features)
2. [Project Structure](#project-structure)
3. [Prerequisites](#prerequisites)
4. [Installation & Setup](#installation--setup)
5. [Running the Application](#running-the-application)
6. [API Documentation](#api-documentation)
7. [Configuration](#configuration)
8. [Troubleshooting](#troubleshooting)

---

## ✨ Features

### 1. **Question Generator** ❓
- Generate study questions on any topic
- Choose difficulty level (Beginner, Intermediate, Advanced)
- Get AI-powered detailed answers
- Chat-like interface for easy interaction

### 2. **PDF Summarizer** 📄
- Upload and process PDF files
- Get AI-generated summaries (5-6 lines)
- Extract key points in bullet format
- Identify and explain important concepts

### 3. **AI Integration** 🤖
- Groq API integration (Free tier - no credit card required!)
- Mock responses as fallback (app works offline)
- Customizable prompts for different use cases
- Comprehensive error handling

### 4. **User-Friendly UI** 🎨
- Clean, modern design
- Responsive layout (mobile, tablet, desktop)
- Loading animations and error handling
- Server status indicator

---

## 📁 Project Structure

```
AgenticStudy/
├── backend/
│   ├── package.json          # Backend dependencies
│   ├── .env.example          # Environment variables template
│   ├── server.js             # Main Express server
│   ├── aiIntegration.js      # AI function module
│   ├── pdfParser.js          # PDF parsing utilities
│   └── node_modules/         # (created after npm install)
│
├── frontend/
│   ├── package.json          # Frontend dependencies
│   ├── .env.example          # Environment variables template
│   ├── public/
│   │   └── index.html        # HTML template
│   ├── src/
│   │   ├── index.js          # React entry point
│   │   ├── App.js            # Main App component
│   │   ├── App.css           # Main styling
│   │   ├── index.css         # Global styles
│   │   ├── components/
│   │   │   ├── QuestionGenerator.js
│   │   │   └── PDFSummarizer.js
│   │   └── styles/
│   │       ├── QuestionGenerator.css
│   │       └── PDFSummarizer.css
│   └── node_modules/         # (created after npm install)
│
└── README.md                 # This file
```

---

## 📋 Prerequisites

### System Requirements
- **Node.js** v14+ (Download from https://nodejs.org/)
- **npm** v6+ (comes with Node.js)
- **Git** (for version control)

### Verify Installation
```bash
node --version    # Should show v14.0.0 or higher
npm --version     # Should show v6.0.0 or higher
```

---

## 🔧 Installation & Setup

### Step 1️⃣: Clone/Download the Project
Navigate to your project folder and open terminal/command prompt.

### Step 2️⃣: Set Up Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file from template
copy .env.example .env          # Windows
# or
cp .env.example .env           # Mac/Linux

# Edit .env file with your API key (optional)
# CLAUDE_API_KEY=your_claude_api_key_here
```

### Step 3️⃣: Set Up Frontend

```bash
# Navigate to frontend directory (from root)
cd frontend

# Install dependencies
npm install

# Create .env file from template
copy .env.example .env          # Windows
# or
cp .env.example .env           # Mac/Linux
```

---

## 🚀 Running the Application

### Option 1: Run Both Servers (Recommended)

**Terminal 1 - Start Backend Server:**
```bash
cd backend
npm start
```
You'll see:
```
✅ Server is running on: http://localhost:5000
```

**Terminal 2 - Start Frontend (new terminal):**
```bash
cd frontend
npm start
```
The app will automatically open at `http://localhost:3000`

### Option 2: Run Individually

**Backend Only:**
```bash
cd backend && npm start
# Runs on http://localhost:5000
```

**Frontend Only:**
```bash
cd frontend && npm start
# Runs on http://localhost:3000
# (Make sure backend is running)
```

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Health Check
**Endpoint:** `GET /api/health`

```bash
curl http://localhost:5000/api/health
```

**Response:**
```json
{
  "status": "ok",
  "message": "AI Study Assistant Backend is running",
  "timestamp": "2024-03-24T10:30:00.000Z"
}
```

### Generate Questions
**Endpoint:** `POST /api/questions`

**Request:**
```json
{
  "topic": "JavaScript",
  "level": "intermediate"
}
```

**Valid Levels:** `beginner`, `intermediate`, `advanced`

**Response:**
```json
{
  "success": true,
  "topic": "JavaScript",
  "level": "intermediate",
  "data": {
    "questions": [
      { "id": 1, "question": "What is a closure?" },
      { "id": 2, "question": "Explain async/await..." }
    ]
  }
}
```

### Generate Answer
**Endpoint:** `POST /api/answer`

**Request:**
```json
{
  "question": "What is a closure?"
}
```

**Response:**
```json
{
  "success": true,
  "question": "What is a closure?",
  "answer": "A closure is a function that has access to..."
}
```

### Summarize PDF
**Endpoint:** `POST /api/summarize-pdf`

**Request:** (Form Data)
```
file: <PDF file>
```

**Example using curl:**
```bash
curl -F "file=@document.pdf" http://localhost:5000/api/summarize-pdf
```

**Response:**
```json
{
  "success": true,
  "fileName": "document.pdf",
  "fileSize": "2.50 MB",
  "extractedtextLength": 5000,
  "summary": "1. SHORT SUMMARY:\n..."
}
```

---

## ⚙️ Configuration

### Backend Configuration (.env)

```env
# Groq API Configuration (Free - No Credit Card Required)
GROQ_API_KEY=your_groq_api_key_here

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL for CORS
FRONTEND_URL=http://localhost:3000
```

**Getting a FREE Groq API Key:**
1. Visit https://console.groq.com/keys
2. Sign up with GitHub, Google, or email
3. Click "Create API Key"
4. Copy the key and paste in `.env` file
5. **No credit card required!**

**Without API Key:** The app works perfectly with mock responses!

### Frontend Configuration (.env)

```env
# Backend API URL
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 🐛 Troubleshooting

### Port Already in Use
If port 5000 or 3000 is occupied:

```bash
# For Backend (change PORT in .env)
PORT=5001 npm start

# For Frontend (will prompt for new port)
# Just answer 'y' when prompted
```

### CORS Errors
- Ensure backend is running on `http://localhost:5000`
- Check `.env` files have correct URLs
- Backend must be started before frontend

### Dependencies Not Installing
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Module Not Found Errors
- Make sure you ran `npm install` in both backend and frontend
- Check that .env files are created correctly
- Ensure file paths are correct (case-sensitive on Mac/Linux)

### PDF Upload Issues
- File must be valid PDF format
- Max file size: 50MB
- Try different PDF files if one fails

### Mock Responses Instead of Real AI
- API key is missing or invalid in `.env`
- See Configuration section for getting API key
- Mock responses demonstrate functionality perfectly

---

## 📚 Code Overview

### Backend Architecture

**server.js** - Main Express server with routes:
- Health check endpoint
- Questions generation endpoint
- Answer generation endpoint
- PDF summarization endpoint

**aiIntegration.js** - AI function module:
- Claude API integration
- Mock response fallback
- Prompt engineering
- Error handling

**pdfParser.js** - PDF utilities:
- Text extraction from PDFs
- File validation
- Size formatting

### Frontend Architecture

**App.js** - Main component:
- Tab navigation
- Server status checking
- Layout management

**QuestionGenerator.js** - Q&A feature:
- Chat-like interface
- Question generation
- Answer display

**PDFSummarizer.js** - PDF feature:
- File upload with drag-drop
- Progress tracking
- Summary display

---

## 🎓 Learning Resources

- **React:** https://react.dev
- **Express:** https://expressjs.com
- **Claude API:** https://docs.anthropic.com
- **pdf-parse:** https://github.com/modesty/pdf-parse

---

## 📝 Example Usage Flow

### Q&A Generator
1. Enter topic: "Python Programming"
2. Select difficulty: "Intermediate"
3. Click "Generate Questions"
4. Review the 3 generated questions
5. Click any question to see detailed answer
6. Answer appears in chat panel

### PDF Summarizer
1. Click "Browse Files" or drag-drop PDF
2. Click "✨ Summarize PDF"
3. Wait for processing
4. View summary with:
   - Short summary (5-6 lines)
   - Key points (bullets)
   - Important concepts
5. Upload another PDF or go back to Q&A

---

## 🚨 Important Notes

- **No API Key?** App works perfectly with mock AI responses
- **First Load?** May take 10-15 seconds as React compiles
- **Chrome DevTools?** Open with F12 to see debug logs
- **Network Issues?** Check if both servers are running

---

## 📞 Support

If you encounter issues:
1. Check the Troubleshooting section above
2. Verify all prerequisites are installed
3. Check console errors (F12 in browser)
4. Ensure both servers are running
5. Try restarting the servers

---

## 📄 License

This project is open source and available for educational purposes.

---

## 🎉 You're All Set!

The AI Study Assistant is now ready to help students study smarter! 

**Happy learning! 📚✨**
