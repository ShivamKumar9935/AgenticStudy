# Frontend Application

This folder contains the React frontend for the AI Study Assistant.

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment
copy .env.example .env

# Start development server
npm start
```

App runs on: `http://localhost:3000`

## Folder Structure

- **public/** - Static HTML and assets
  - `index.html` - Main HTML template
- **src/** - React source code
  - `index.js` - React entry point
  - `App.js` - Main app component
  - `App.css` - Main styling
  - `index.css` - Global styles
  - `components/` - React components
    - `QuestionGenerator.js` - Q&A feature
    - `PDFSummarizer.js` - PDF feature
  - `styles/` - Component CSS files

## Components

### App.js
Main component that:
- Manages tab navigation
- Checks backend health
- Shows server status
- Routes to feature components

### QuestionGenerator.js
Features:
- Input topic and difficulty
- Generate study questions
- Select question and get answer
- Chat-like message display
- Loading states and error handling

### PDFSummarizer.js
Features:
- File upload (drag-drop or browse)
- PDF processing indicator
- Summary display with formatting
- Key points extraction
- Concept explanation

## Environment Variables

Create `.env` file with:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Dependencies

- **react** - UI library
- **react-dom** - React rendering
- **axios** - HTTP client
- **react-scripts** - Build tools

## Available Scripts

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Eject configuration (irreversible)
npm run eject
```

## Features

### 1. Question Generator ❓
- Topic input with difficulty selection
- Generates 3 study questions
- Click to get detailed answers
- Chat-like interface
- Real-time loading states

### 2. PDF Summarizer 📄
- Drag-drop or file browse
- Shows file info (name, size)
- Displays formatted summary
- Shows key points as bullets
- Explains important concepts

### 3. Server Status 🟢
- Connects to backend automatically
- Shows connection status
- Falls back to mock responses if offline

## Styling

- **Modern gradient design** with purple/pink theme
- **Responsive layout** for mobile, tablet, desktop
- **Loading animations** for better UX
- **Color-coded messages** (questions, answers, errors)
- **Smooth transitions** and hover effects

## Troubleshooting

**Port 3000 in use?**
```bash
# Terminal will ask if you want to use another port
# Answer 'y' to use port 3001
```

**Dependencies issue?**
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Backend not connecting?**
- Ensure backend runs on `http://localhost:5000`
- Check `REACT_APP_API_URL` in `.env`
- App still works with mock AI responses

**Blank page?**
- Open DevTools (F12)
- Check console for errors
- Ensure index.html has `<div id="root"></div>`

## Build for Production

```bash
# Create optimized production build
npm run build

# Build output in /build folder
# Ready to deploy to hosting service
```

---

For full setup instructions, see the main [README.md](../README.md)
