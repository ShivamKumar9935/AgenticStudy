// Main Express server for AI Study Assistant Backend
// This server provides APIs for the frontend to interact with AI and PDF processing

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const path = require('path');

// Import our modules
const { generateQuestions, generateAnswer, summarizePDFText, callGeminiAPI } = require('./aiIntegration');
const { extractTextFromPDF, isValidPDF, getFileSizeInMB } = require('./pdfParser');

const app = express();
const PORT = process.env.PORT || 5000;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

const parseISODurationToSeconds = (duration = '') => {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;

  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);
  return hours * 3600 + minutes * 60 + seconds;
};

const parseJsonFromLLM = (text = '') => {
  const cleaned = String(text)
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    const match = cleaned.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
    if (!match) {
      throw new Error('AI response is not valid JSON');
    }
    return JSON.parse(match[0]);
  }
};

const filterVideosByGemini = async (topic, videos) => {
  if (!videos.length) return [];

  const prompt = `From the following video titles, return ONLY those that are strictly about the topic "${topic}".
Remove unrelated or loosely related videos.
Return only best 3 highly relevant educational videos.

Return ONLY valid JSON array of videoIds, for example:
["id1", "id2", "id3"]

Videos:
${videos.map((video, index) => `${index + 1}. ${video.title} (videoId: ${video.videoId})`).join('\n')}`;

  const llmResponse = await callGeminiAPI(prompt);
  const parsed = parseJsonFromLLM(llmResponse);

  const ids = Array.isArray(parsed)
    ? parsed
    : Array.isArray(parsed.videoIds)
      ? parsed.videoIds
      : [];

  const idSet = new Set(ids.map((id) => String(id)));
  return videos.filter((video) => idSet.has(video.videoId)).slice(0, 3);
};

const fetchStudyVideos = async (topic) => {
  if (!YOUTUBE_API_KEY) {
    throw new Error('YOUTUBE_API_KEY is missing. Add it in backend/.env to fetch Study Shorts.');
  }

  const searchQueries = [
    `${topic} explained in 60 seconds`,
    `${topic} concept explained quickly`,
    `${topic} in 1 minute`,
    `${topic} basics short`
  ];

  const searchUrl = 'https://www.googleapis.com/youtube/v3/search';
  const searchResponses = await Promise.all(
    searchQueries.map((q) =>
      axios.get(searchUrl, {
        params: {
          key: YOUTUBE_API_KEY,
          part: 'snippet',
          q,
          maxResults: 10,
          type: 'video',
          videoDuration: 'short',
          videoEmbeddable: 'true',
          safeSearch: 'strict',
          relevanceLanguage: 'en'
        },
        timeout: 20000
      })
    )
  );

  const allItems = searchResponses.flatMap((response) => response.data?.items || []);
  const uniqueItemsById = new Map();
  allItems.forEach((item) => {
    const id = item.id?.videoId;
    if (id && !uniqueItemsById.has(id)) {
      uniqueItemsById.set(id, item);
    }
  });

  const videoIds = Array.from(uniqueItemsById.keys())
    .slice(0, 20)
    .filter(Boolean);

  if (!videoIds.length) {
    return [];
  }

  const detailsUrl = 'https://www.googleapis.com/youtube/v3/videos';
  const detailsResponse = await axios.get(detailsUrl, {
    params: {
      key: YOUTUBE_API_KEY,
      part: 'contentDetails,snippet',
      id: videoIds.join(',')
    },
    timeout: 20000
  });

  const detailedItems = detailsResponse.data?.items || [];

  const strictShortVideos = detailedItems
    .filter((video) => parseISODurationToSeconds(video.contentDetails?.duration) <= 90)
    .map((video) => ({
      title: video.snippet?.title || 'Untitled video',
      videoId: video.id,
      thumbnail: video.snippet?.thumbnails?.high?.url || video.snippet?.thumbnails?.medium?.url || ''
    }))
    .filter((video) => video.videoId && video.title);

  if (!strictShortVideos.length) {
    return [];
  }

  const filtered = await filterVideosByGemini(topic, strictShortVideos);

  return filtered.slice(0, 3);
};

const askHandler = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return res.status(400).json({
        error: 'Invalid question. Please provide a non-empty question string.'
      });
    }

    console.log(`🤖 /ask question: "${question}"`);

    const answer = await generateAnswer(question);

    res.json({
      success: true,
      question,
      answer
    });
  } catch (error) {
    console.error('Error generating answer:', error.message);
    res.status(500).json({
      error: 'Failed to generate answer',
      message: error.message
    });
  }
};

const summarizeHandler = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded. Please provide a PDF file.'
      });
    }

    const fileName = req.file.originalname;
    const fileSize = getFileSizeInMB(req.file.size);

    console.log(`📄 /summarize file: ${fileName} (${fileSize} MB)`);

    const extractedText = await extractTextFromPDF(req.file.buffer);

    if (extractedText.length < 50) {
      return res.status(400).json({
        error: 'PDF appears to be empty or unreadable',
        message: 'The PDF file did not contain enough readable text.'
      });
    }

    const summary = await summarizePDFText(extractedText);

    res.json({
      success: true,
      fileName,
      fileSize: `${fileSize} MB`,
      extractedTextLength: extractedText.length,
      summary
    });
  } catch (error) {
    console.error('Error processing PDF:', error.message);
    res.status(500).json({
      error: 'Failed to process PDF',
      message: error.message
    });
  }
};

const videosHandler = async (req, res) => {
  try {
    const topic = String(req.query.topic || '').trim();
    if (!topic) {
      return res.status(400).json({
        error: 'Topic is required. Example: /videos?topic=javascript'
      });
    }

    console.log(`🎬 Fetching study shorts for topic: ${topic}`);
    const videos = await fetchStudyVideos(topic);

    if (!videos.length) {
      return res.status(404).json({
        error: 'No short videos found for this topic'
      });
    }

    return res.json(videos);
  } catch (error) {
    console.error('Error fetching videos:', error.message);
    return res.status(500).json({
      error: 'Failed to fetch videos',
      message: error.message
    });
  }
};

// ========================
// Middleware Setup
// ========================

// Enable CORS for frontend communication
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Parse JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure file upload
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    if (isValidPDF(file)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid PDF file'));
    }
  }
});

// ========================
// API Routes
// ========================

/**
 * Health check endpoint
 * GET /api/health
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'AI Study Assistant Backend is running',
    timestamp: new Date().toISOString()
  });
});

/**
 * Study Shorts videos
 * GET /videos?topic=javascript
 */
app.get('/videos', videosHandler);
app.get('/api/videos', videosHandler);

/**
 * Generate study questions
 * POST /api/questions
 * 
 * Request body:
 * {
 *   "topic": "JavaScript",
 *   "level": "beginner" | "intermediate" | "advanced"
 * }
 */
app.post('/api/questions', async (req, res) => {
  try {
    const { topic, level = 'intermediate' } = req.body;
    
    // Validate input
    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      return res.status(400).json({
        error: 'Invalid topic. Please provide a non-empty topic string.'
      });
    }
    
    // Validate level
    const validLevels = ['beginner', 'intermediate', 'advanced'];
    const selectedLevel = validLevels.includes(level) ? level : 'intermediate';
    
    console.log(`📚 Generating questions for topic: "${topic}" (${selectedLevel})`);
    
    const questions = await generateQuestions(topic, selectedLevel);
    
    res.json({
      success: true,
      topic,
      level: selectedLevel,
      data: questions
    });
  } catch (error) {
    console.error('Error generating questions:', error.message);
    res.status(500).json({
      error: 'Failed to generate questions',
      message: error.message
    });
  }
});

// Primary routes requested by the frontend task
app.post('/ask', askHandler);
app.post('/summarize', upload.single('file'), summarizeHandler);

/**
 * Generate answer to a question
 * POST /api/answer
 * 
 * Request body:
 * {
 *   "question": "What is JavaScript?"
 * }
 */
app.post('/api/answer', askHandler);

/**
 * Summarize PDF content
 * POST /api/summarize-pdf
 * 
 * Form data:
 * - file: PDF file upload
 */
app.post('/api/summarize-pdf', upload.single('file'), summarizeHandler);

// ========================
// Error Handling
// ========================

// Handle multer errors
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({
      error: 'File upload error',
      message: error.message
    });
  }
  
  if (error.message === 'Invalid PDF file') {
    return res.status(400).json({
      error: 'Invalid file type',
      message: 'Please upload a valid PDF file.'
    });
  }
  
  next(error);
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: `The route ${req.method} ${req.path} does not exist.`
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: error.message || 'An unexpected error occurred'
  });
});

// ========================
// Start Server
// ========================

app.listen(PORT, () => {
  console.log('');
  console.log('╔════════════════════════════════════════════════╗');
  console.log('║     🎓 AI Study Assistant Backend Server       ║');
  console.log('║          Powered by Google Gemini             ║');
  console.log('╚════════════════════════════════════════════════╝');
  console.log('');
  console.log(`✅ Server is running on: http://localhost:${PORT}`);
  console.log(`📍 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log('');
  console.log('Available endpoints:');
  console.log('  GET  /api/health           - Server health check');
  console.log('  GET  /videos?topic=...     - Study shorts videos');
  console.log('  POST /ask                  - Ask AI chatbot');
  console.log('  POST /summarize            - Summarize uploaded PDF');
  console.log('  POST /api/questions         - Generate study questions');
  console.log('  POST /api/answer            - Generate answer to question');
  console.log('  POST /api/summarize-pdf     - Summarize PDF content');
  console.log('');
  console.log('💡 Get free Gemini API key: https://makersuite.google.com/app/apikey');
  console.log('');
});

module.exports = app;
