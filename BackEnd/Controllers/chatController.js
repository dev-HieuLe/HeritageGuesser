// Controllers/chatController.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// POST /api/chat
export const sendMessage = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Create Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Add conversation context if history exists
    const prompt = history && history.length > 0
      ? `${history.join("\n")}\nUser: ${message}\nAI:`
      : `User: ${message}\nAI:`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    res.json({ reply: response });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "Failed to process chat message" });
  }
};
