const express = require('express');
const Groq = require('groq-sdk');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Groq client
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// API endpoint to generate quiz
app.post('/generate-quiz', async (req, res) => {
  try {
    const { topic, level, numQuestions } = req.body;

    // Validate input
    if (!topic || !level || !numQuestions) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (numQuestions < 1 || numQuestions > 20) {
      return res.status(400).json({ error: 'Number of questions must be between 1 and 20' });
    }

    // Construct the prompt
    const prompt = `
You are an expert quiz creator. Your task is to generate a multiple-choice quiz.

Topic: "${topic}"
Difficulty Level: "${level}"
Number of Questions: ${numQuestions}

Instructions:
1. Generate exactly ${numQuestions} questions.
2. Each question must have 4 options (A, B, C, D).
3. There must be only one correct answer for each question.
4. The questions and options should be appropriate for the specified difficulty level.

CRITICAL: You MUST respond with ONLY a valid JSON array. No explanations, no markdown, no extra text.

The JSON format must be exactly this structure:
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": "Correct option text"
  }
]
    `;

    // Call Groq API
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
    });

    let text = chatCompletion.choices[0]?.message?.content || '';

    // Clean JSON formatting (strip markdown code fences if any)
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    // Parse JSON
    const quizData = JSON.parse(text);

    console.log('Quiz generated successfully:', quizData.length, 'questions');

    if (!Array.isArray(quizData)) {
      throw new Error('Invalid response format from AI');
    }

    // Validate structure of each question
    const validatedQuizData = quizData.map((question, index) => {
      if (!question.question || !question.options || !question.answer) {
        throw new Error(`Invalid question structure at index ${index}`);
      }
      if (!Array.isArray(question.options)) {
        throw new Error(`Options must be an array at index ${index}`);
      }
      return {
        question: question.question,
        options: question.options,
        answer: question.answer
      };
    });

    res.json(validatedQuizData);

  } catch (error) {
    console.error('Error generating quiz:', error.message);

    if (error.status === 429 || (error.message && error.message.includes('429'))) {
      res.status(429).json({ error: 'API rate limit reached. Please wait a moment and try again.' });
    } else if (error.message && error.message.includes('API key')) {
      res.status(500).json({ error: 'Invalid API key. Please check your GROQ_API_KEY in the .env file.' });
    } else if (error.message && error.message.includes('JSON')) {
      res.status(500).json({ error: 'Failed to parse quiz data. Please try again.' });
    } else {
      res.status(500).json({ error: 'Failed to generate quiz. Please try again.' });
    }
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
