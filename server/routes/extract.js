import express from 'express';
import multer from 'multer';
import pdfParse from 'pdf-parse';
import fetch from 'node-fetch';
import Tesseract from 'tesseract.js';
import { createWorker } from 'tesseract.js';
import { generatePrompt } from '../utils/prompt.js';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', "application/pdf"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Only JPG, PNG and PDF files are allowed.'));
    }
    cb(null, true);
  }
});

async function extractTextFromBuffer(buffer) {
  const worker = await Tesseract.createWorker('eng');
  const {
    data: { text }
  } = await worker.recognize(buffer);
  await worker.terminate();
  return text;
}

router.post('/', upload.single('extract'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded.' });
    }

    let extractedText = '';
    if (req.file.mimetype === 'application/pdf') {
      const pdfData = await pdfParse(req.file.buffer);
      extractedText = pdfData.text;
    } else {
      extractedText = await extractTextFromBuffer(req.file.buffer);
    }
    const prompt = generatePrompt(extractedText);

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const result = await groqRes.json();

    if (!result.choices) {
      console.error("Groq error response:", result);
      throw new Error('Groq API failed.');
    }

    res.json({
      success: true,
      data: result.choices[0].message.content
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message || 'Failed to process invoice.' });
  }
});

export default router;
