// This module handles PDF file parsing and text extraction

const pdf = require('pdf-parse');
const fs = require('fs');

/**
 * Extract text from PDF buffer
 * @param {Buffer} pdfBuffer - The PDF file buffer
 * @returns {Promise<string>} - Extracted text from PDF
 */
const extractTextFromPDF = async (pdfBuffer) => {
  try {
    const data = await pdf(pdfBuffer);
    
    // Extract text from all pages
    let extractedText = '';
    
    if (data.text) {
      extractedText = data.text;
    } else if (data.pages && Array.isArray(data.pages)) {
      extractedText = data.pages
        .map(page => page.content || page.text || '')
        .join('\n');
    }
    
    // Clean up the text
    extractedText = extractedText
      .replace(/\r\n/g, '\n')
      .replace(/\s+/g, ' ')
      .trim();
    
    console.log(`✅ Extracted ${extractedText.length} characters from PDF (${data.numpages} pages)`);
    
    return extractedText;
  } catch (error) {
    console.error('Error extracting PDF text:', error.message);
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
};

/**
 * Validate PDF file
 * @param {Object} file - Express multer file object
 * @returns {boolean} - True if file is valid PDF
 */
const isValidPDF = (file) => {
  if (!file) return false;
  
  const validMimeTypes = [
    'application/pdf',
    'application/x-pdf',
    'application/octet-stream',
  ];
  
  const hasValidMimeType = validMimeTypes.includes(file.mimetype || '');
  const hasValidExtension = file.originalname.toLowerCase().endsWith('.pdf');
  const hasContent = typeof file.size !== 'number' || file.size > 0;
  
  // Accept when extension is .pdf even if browser reports a generic mime type.
  return (hasValidMimeType || hasValidExtension) && hasContent;
};

/**
 * Get file size in MB
 */
const getFileSizeInMB = (sizeInBytes) => {
  return (sizeInBytes / (1024 * 1024)).toFixed(2);
};

module.exports = {
  extractTextFromPDF,
  isValidPDF,
  getFileSizeInMB
};
