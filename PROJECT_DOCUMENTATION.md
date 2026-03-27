# 📚 AI Study Assistant - Project Documentation

## 🎯 Project Overview

**AI Study Assistant** is a full-stack web application that leverages Claude Haiku AI to help students:
1. Generate study questions on any topic
2. Get detailed answers to questions
3. Summarize PDF documents
4. Extract key points and concepts

Built with React (frontend) and Node.js/Express (backend).

---

## 🏗️ Architecture

### Frontend Architecture (React)

```
                    ┌─────────────────────┐
                    │   Browser (3000)    │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │      App.js         │
                    │  (Main Component)   │
                    └──────────┬──────────┘
                               │
                ┌──────────────┼──────────────┐
                │              │              │
        ┌───────▼────────┐    │    ┌─────────▼────────┐
        │ Question       │    │    │ PDF              │
        │ Generator      │    │    │ Summarizer       │
        └────────────────┘────┼─────────────────────
                              │
                         Backend API
                         (localhost:5000)
```

### Backend Architecture (Express + Node.js)

```
              ┌───────────────────┐
              │   Express Server  │
              │   (Port 5000)     │
              └─────────┬─────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
    ┌───▼────┐   ┌─────▼────┐   ┌─────▼────┐
    │ Routes │   │    AI     │   │   PDF    │
    │        │   │Integration│   │ Parser   │
    │ - /api/│   │           │   │          │
    │health  │   │ - Claude  │   │ - Extract│
    │        │   │   API     │   │   Text   │
    └────────┘   │           │   │ - Validate
                 │ - Mock   │   │   Files  │
                 │   Fallback   └──────────┘
                 └───────────┘
                      │
                   Claude API
               (api.anthropic.com)
```

---

## 📝 File Descriptions

### Backend Files

#### `server.js` (Main Server)
**Purpose:** Set up Express server and define API routes

**Key Functions:**
- CORS middleware configuration
- File upload configuration (multer)
- Health check endpoint
- Questions generation endpoint
- Answer generation endpoint
- PDF summarization endpoint

**Dependencies:** express, cors, multer

#### `aiIntegration.js` (AI Module)
**Purpose:** Handle all AI interactions with Claude API

**Key Functions:**
- `callClaudeAPI()` - Main function to call Claude API
- `generateQuestions()` - Create study questions
- `generateAnswer()` - Generate detailed answers
- `summarizePDFText()` - Summarize document content
- `getMockResponse()` - Fallback mock AI responses

**Features:**
- API key validation
- Error handling with fallback
- Customizable prompts
- Mock responses if no API key

#### `pdfParser.js` (PDF Utilities)
**Purpose:** Handle PDF file processing

**Key Functions:**
- `extractTextFromPDF()` - Extract text from PDF files
- `isValidPDF()` - Validate PDF file format
- `getFileSizeInMB()` - Format file size

**Dependencies:** pdf-parse

### Frontend Files

#### `App.js` (Main Component)
**Purpose:** Root component managing overall layout

**Features:**
- Tab navigation (Questions/PDF)
- Server health check
- Server status indicator
- Route management

**State:**
- `activeTab` - Current active tab
- `serverStatus` - Backend connection status

#### `QuestionGenerator.js` (Q&A Component)
**Purpose:** Implement question generation and answer feature

**Features:**
- Topic input field
- Difficulty level selector (Beginner/Intermediate/Advanced)
- Generate questions button
- Question list display
- Answer display with formatting
- Chat-like message interface
- Error handling
- Loading states

**State:**
- `topic` - User input topic
- `level` - Selected difficulty
- `questions` - Generated questions array
- `selectedQuestion` - Currently selected question
- `answer` - Generated answer text
- `messages` - Chat history
- `loading` - Loading state
- `error` - Error messages

**API Calls:**
- `POST /api/questions` - Generate questions
- `POST /api/answer` - Generate answer

#### `PDFSummarizer.js` (PDF Component)
**Purpose:** Handle PDF upload and summarization

**Features:**
- File upload (drag-drop + browse)
- File validation
- PDF processing
- Summary display with sections
- Key points extraction
- Concept explanation
- Loading states
- Error handling

**State:**
- `file` - Selected PDF file
- `fileName` - File name
- `loading` - Processing state
- `error` - Error messages
- `summary` - Generated summary
- `fileInfo` - File metadata

**API Calls:**
- `POST /api/summarize-pdf` - Process PDF

### CSS Files

#### `App.css`
- Header styling with gradient
- Tab navigation styles
- Server status indicator
- Footer styling
- Responsive layout

#### `QuestionGenerator.css`
- Two-column layout (left: input, right: chat)
- Form input styling
- Question list styling
- Message bubble styling
- Chat interface styling
- Loading animations

#### `PDFSummarizer.css`
- Upload zone with drag-drop
- File selection display
- Summary card formatting
- Bullet point styling
- Empty state styling
- Print-friendly styles

#### `index.css`
- Global typography
- Color scheme
- Scrollbar styling
- Reset styles

---

## 🔄 Data Flow

### Question Generation Flow
```
1. User enters topic + level in UI
2. Frontend calls POST /api/questions
3. Backend:
   - Validates input
   - Creates prompt for Claude
   - Calls Claude API (or mock)
   - Parses response
   - Returns questions array
4. Frontend displays questions in list
5. User clicks question
6. Frontend calls POST /api/answer
7. Backend:
   - Creates prompt for Claude
   - Calls Claude API (or mock)
   - Returns formatted answer
8. Frontend displays answer in chat
```

### PDF Summarization Flow
```
1. User selects PDF file
2. Frontend validates file
3. User clicks "Summarize PDF"
4. Frontend:
   - Creates FormData with file
   - Sends POST /api/summarize-pdf
5. Backend:
   - Receives file via multer
   - Validates PDF format
   - Extracts text using pdf-parse
   - Creates summarization prompt
   - Calls Claude API (or mock)
   - Returns formatted summary
6. Frontend displays summary with sections
```

---

## 🎨 UI Components

### Tab Navigation
- Two buttons: "Question Generator" and "PDF Summarizer"
- Active state styling with gradient
- Icon indicators

### Question Generator UI
**Left Panel:**
- Topic input field
- Difficulty dropdown
- Generate button
- Questions list (clickable)
- Clear button

**Right Panel:**
- Chat-style messages
- User messages (blue)
- Assistant messages (gray)
- Questions (yellow)
- Answers (green)
- Error messages (red)
- Loading indicator

### PDF Summarizer UI
- Upload zone (drag-drop area)
- Browse button
- File info display
- Summary card
- Formatted sections (bullets, headings)
- Upload another button

---

## 🚀 API Endpoints Reference

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/health` | Check server status |
| POST | `/api/questions` | Generate study questions |
| POST | `/api/answer` | Generate answer to question |
| POST | `/api/summarize-pdf` | Summarize PDF content |

---

## 🔐 Security Features

1. **CORS Configuration** - Only accept requests from frontend URL
2. **File Validation** - Validate PDF files before processing
3. **File Size Limits** - Max 50MB to prevent abuse
4. **Input Validation** - Validate all user inputs
5. **Error Handling** - Don't expose sensitive error details
6. **Environment Variables** - Keep API key secure in .env

---

## 📊 State Management

### Frontend State

**App Component:**
- `activeTab` - Current view
- `serverStatus` - Backend health

**QuestionGenerator:**
- `topic`, `level` - User inputs
- `questions` - Generated questions
- `selectedQuestion` - Current question
- `answer` - Current answer
- `messages` - Chat history
- `loading`, `error` - UI states

**PDFSummarizer:**
- `file`, `fileName` - File data
- `summary` - Generated summary
- `fileInfo` - File metadata
- `loading`, `error` - UI states

---

## 🛠️ Tech Stack Details

### Backend
- **Express.js** - Web framework
- **Multer** - File upload middleware
- **pdf-parse** - PDF text extraction
- **Axios** - HTTP client for Claude API
- **CORS** - Cross-origin support
- **Dotenv** - Environment configuration

### Frontend
- **React 18** - UI library
- **Axios** - HTTP client
- **CSS3** - Styling (no external framework)
- **React Scripts** - Build tools

---

## 🎯 Performance Considerations

1. **Lazy Loading** - Components load only when visible
2. **Optimized Re-renders** - useState manages component state efficiently
3. **Error Boundaries** - Graceful error handling
4. **Loading States** - User feedback during API calls
5. **Mock Fallback** - Works without network
6. **File Size Limits** - Prevents large file processing
7. **CSS Optimization** - No unused styles

---

## 🔄 Deployment Considerations

### Backend Deployment
- Set `NODE_ENV=production` in .env
- Use proper logging service
- Configure CORS for production domain
- Use environment-based API key
- Set production PORT

### Frontend Deployment
- Run `npm run build` for optimization
- Update `REACT_APP_API_URL` to production backend
- Deploy build folder to hosting (Vercel, Netlify, etc.)
- Configure CORS headers in backend

---

## 📚 Code Quality

### Code Standards
- Comments on all major functions
- Clear variable naming
- Modular function design
- Consistent error handling
- Responsive design

### Best Practices
- Separation of concerns
- Reusable functions
- Environment-based configuration
- Graceful degradation (mock fallback)
- User-friendly error messages

---

## 🔧 Maintenance & Extension

### Adding New Features

1. **New AI Feature:**
   - Add function in `aiIntegration.js`
   - Create route in `server.js`
   - Create React component
   - Add tab navigation

2. **New PDF Features:**
   - Add method in `pdfParser.js`
   - Update summarization logic
   - Update UI in `PDFSummarizer.js`

3. **Styling Updates:**
   - Modify CSS files
   - Test responsive designs
   - Update color scheme consistently

---

## 📖 Learning Resources

For developers wanting to understand or extend this project:

- **React** - https://react.dev/learn
- **Express.js** - https://expressjs.com/starter/basic-routing.html
- **Claude API** - https://docs.anthropic.com/
- **Web APIs** - https://developer.mozilla.org/en-US/docs/Web/API
- **File Uploads** - https://github.com/expressjs/multer

---

## 🎓 Project Accomplishments

✅ Full-stack web application with React + Node.js
✅ AI integration with Claude Haiku API
✅ Mock response fallback for offline functionality
✅ File upload with PDF text extraction
✅ Chat-like user interface
✅ Responsive design (mobile, tablet, desktop)
✅ Complete error handling
✅ Loading states and animations
✅ Clean, well-commented code
✅ Comprehensive documentation

---

**Created:** March 24, 2026
**Version:** 1.0.0
**Status:** Ready for Production ✨
