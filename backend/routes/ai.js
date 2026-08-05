const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { protect } = require('../middleware/auth');
const { validate, aiSuggestSchema } = require('../middleware/validate');
const getMockSuggestions = (title, description) => {
  return [
    { text: `Define objectives and constraints for "${title}"`, completed: false },
    { text: `Prepare setup and configure required tools`, completed: false },
    { text: `Execute initial implementation of "${title}"`, completed: false },
    { text: `Test all edge cases and verify functionality`, completed: false },
    { text: `Document results and clean up workspace`, completed: false }
  ];
};

router.post('/suggest', protect, validate(aiSuggestSchema), async (req, res) => {
  const { title, description } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;
  console.log("Gemini Key Loaded:", !!apiKey);
  if (!apiKey || apiKey.startsWith('your_') || apiKey.startsWith('dummy_')) {
    const suggestions = getMockSuggestions(title, description);
    return res.json({ suggestions });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are an expert task assistant. Generate 3 to 5 clear, actionable subtasks for a primary task.
Primary Task Title: "${title}"
Primary Task Description: "${description || 'No description provided'}"

Return ONLY a raw JSON array of strings representing the subtasks, e.g. ["Research details", "Write test script", "Deploy"]. Do not include markdown code block fences (like \`\`\`json) or any other text.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();
    let sanitizedText = responseText;
    if (sanitizedText.startsWith('```')) {
      sanitizedText = sanitizedText
        .replace(/^```(?:json)?/i, '')
        .replace(/```$/i, '')
        .trim();
    }

    try {
      const parsedArray = JSON.parse(sanitizedText);
      if (Array.isArray(parsedArray)) {
        const suggestions = parsedArray.map((item) => ({
          text: String(item).trim(),
          completed: false
        }));
        return res.json({ suggestions });
      }
      throw new Error('Response was not a valid array');
    } catch (parseError) {
      console.error('Failed to parse AI suggestions response:', parseError.message, sanitizedText);
      const suggestions = getMockSuggestions(title, description);
      return res.json({ suggestions });
    }
  } catch (error) {
    console.error('AI Suggestion API error:', error.message || error);
    const suggestions = getMockSuggestions(title, description);
    return res.json({ suggestions });
  }
});

module.exports = router;
