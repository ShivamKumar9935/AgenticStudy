# Backend Server

This folder contains the Node.js + Express backend server for the AI Study Assistant.

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment
copy .env.example .env

# Start server
npm start
```

Server runs on: `http://localhost:5000`

## Folder Structure

- **server.js** - Main Express application with API routes
- **aiIntegration.js** - Claude API integration and mock responses
- **pdfParser.js** - PDF text extraction utilities
- **package.json** - Node dependencies and scripts

## API Routes

- `GET /api/health` - Server health check
- `POST /api/questions` - Generate study questions
- `POST /api/answer` - Generate answer to question
- `POST /api/summarize-pdf` - Summarize PDF content

## Environment Variables

Create `.env` file with:

```env
CLAUDE_API_KEY=your_claude_api_key_here
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## Dependencies

- **express** - Web framework
- **cors** - Cross-origin requests
- **multer** - File upload handling
- **pdf-parse** - PDF text extraction
- **axios** - HTTP client
- **dotenv** - Environment variables

## Troubleshooting

**Port 5000 already in use?**
```bash
PORT=5001 npm start
```

**Module not found?**
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## Testing API

Use curl or Postman:

```bash
# Health check
curl http://localhost:5000/api/health

# Generate questions
curl -X POST http://localhost:5000/api/questions \
  -H "Content-Type: application/json" \
  -d '{"topic":"JavaScript","level":"beginner"}'

# Get answer
curl -X POST http://localhost:5000/api/answer \
  -H "Content-Type: application/json" \
  -d '{"question":"What is JavaScript?"}'

# Summarize PDF
curl -F "file=@document.pdf" http://localhost:5000/api/summarize-pdf
```

---

For full setup instructions, see the main [README.md](../README.md)
