// This module handles all AI-related functions using Google Gemini API SDK.

require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

/**
 * Check if we have a valid API key.
 */
const hasValidApiKey = () => {
  return !!(GEMINI_API_KEY &&
         GEMINI_API_KEY !== 'your_gemini_api_key_here' &&
    GEMINI_API_KEY.length > 0);
};

/**
 * Remove markdown code fences to help JSON parsing.
 */
const stripCodeFences = (text = '') => {
  return text
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '')
    .trim();
};

/**
 * Initialize Gemini model once.
 */
const getModel = () => {
  if (!hasValidApiKey()) {
    throw new Error('Missing GEMINI_API_KEY in backend .env');
  }

  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  return genAI.getGenerativeModel({ model: GEMINI_MODEL });
};

/**
 * Call Gemini using SDK and return plain text.
 */
const generateAI = async (prompt) => {
  const model = getModel();
  const result = await model.generateContent(prompt);
  const text = result?.response?.text?.();

  if (!text || !text.trim()) {
    throw new Error('Gemini returned an empty response');
  }

  return text.trim();
};

/**
 * Parse JSON object from LLM response.
 */
const parseJsonFromResponse = (rawText) => {
  const cleaned = stripCodeFences(rawText);

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) {
      throw new Error('AI response is not valid JSON');
    }
    return JSON.parse(match[0]);
  }
};

/**
 * Call Google Gemini API
 * @param {string} prompt - The prompt to send to Gemini
 * @returns {Promise<string>} - The AI response
 */
const callGeminiAPI = async (prompt) => {
  try {
    if (!hasValidApiKey()) {
      throw new Error('GEMINI_API_KEY is missing or invalid');
    }

    return await generateAI(prompt);
  } catch (error) {
    console.error('Error calling Gemini API:', error.message);
    throw error;
  }
};

/**
 * Generate Q&A based on topic and level
 */
const generateQuestions = async (topic, level = 'intermediate') => {
  const prompt = `Generate exactly 3 study questions about "${topic}" at ${level} level.
Return ONLY valid JSON with this exact structure and no markdown:
{
  "questions": [
    {"id": 1, "question": "question text"},
    {"id": 2, "question": "question text"},
    {"id": 3, "question": "question text"}
  ]
}`;

  const response = await callGeminiAPI(prompt);
  const parsed = parseJsonFromResponse(response);

  if (!Array.isArray(parsed.questions) || parsed.questions.length === 0) {
    throw new Error('Gemini did not return questions array');
  }

  return {
    questions: parsed.questions.slice(0, 3).map((item, index) => ({
      id: index + 1,
      question: String(item.question || '').trim()
    })).filter((item) => item.question)
  };
};

/**
 * Generate structured answer to a question
 */
const generateAnswer = async (question) => {
  const prompt = `Provide a clear, well-structured answer to this question: "${question}"
  
  Format the answer with:
  1. A brief introduction (1-2 sentences)
  2. Main points (3-5 bullet points)
  3. A conclusion (1-2 sentences)
  
  Keep it concise and educational.`;

  return await callGeminiAPI(prompt);
};

/**
 * Summarize extracted PDF text
 */
const summarizePDFText = async (pdfText) => {
  const prompt = `Analyze the following text extracted from a PDF and return ONLY valid JSON with this shape:
{
  "shortSummary": "5-6 lines summary",
  "keyPoints": ["point 1", "point 2", "point 3"],
  "importantConcepts": ["concept 1", "concept 2", "concept 3"]
}

Rules:
- Make the explanation beginner-friendly.
- Keep keyPoints and importantConcepts concise.
- Do not include markdown code fences.

Text:
"""
${pdfText.substring(0, 10000)}
"""`;

  const response = await callGeminiAPI(prompt);
  const parsed = parseJsonFromResponse(response);

  return {
    shortSummary: String(parsed.shortSummary || '').trim(),
    keyPoints: Array.isArray(parsed.keyPoints) ? parsed.keyPoints.map((item) => String(item).trim()).filter(Boolean) : [],
    importantConcepts: Array.isArray(parsed.importantConcepts) ? parsed.importantConcepts.map((item) => String(item).trim()).filter(Boolean) : []
  };
};

module.exports = {
  callGeminiAPI,
  generateQuestions,
  generateAnswer,
  summarizePDFText,
  hasValidApiKey
};
