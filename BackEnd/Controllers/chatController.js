import db from "../Config/db.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

console.log("Gemini key loaded:", process.env.GEMINI_API_KEY?.slice(0, 8));

export const sendMessage = async (req, res) => {
  try {
    const { message, locationId } = req.body;

    if (!message || typeof message !== "string" || message.trim().length === 0)
      return res.status(400).json({ error: "Message is required" });
    if (message.length > 500)
      return res
        .status(400)
        .json({ error: "Message too long (max 500 characters)" });

    // 1. Load location data if provided
    let locationContext = "";
    if (locationId) {
      const [rows] = await db.execute(
        "SELECT name, region, built_year, difficulty, description FROM locations WHERE id = ?",
        [locationId],
      );

      if (rows.length > 0) {
        const loc = rows[0];
        locationContext = `
Relevant location info from database:
- Name: ${loc.name}
- Region: ${loc.region || "Unknown"}
- Year Built: ${loc.built_year || "Unknown"}
- Difficulty: ${loc.difficulty || "N/A"}
- Info: ${loc.description || "N/A"}
        `;
      }
    }

    // 2. Build prompt
    const prompt = `
      You are Toto, a friendly and wise old turtle who loves Vietnamese heritage. You talk like a warm, encouraging friend — cheerful, a little playful, but genuinely knowledgeable. You use casual, approachable language (never stiff or overly formal), and occasionally reference being a turtle (e.g. "I’ve been around long enough to know...", "slow and steady — here’s a clue!").

      Rules:
      - DO NOT reveal the heritage name or how old it is.
      - If the user asks about the name or age/years → say something like: "Oops, that’s one secret this old turtle can’t share! 🐢"
      - If the user asks for clues, give warm hints about the heritage without revealing its name or age.
      - Any answer that includes the name, age, or can be used to deduce them is not allowed (e.g. when it was built, synonyms for the heritage name, etc).
      - Only answer heritage-related questions. If asked something off-topic, gently redirect as Toto would.
      - Ground your answers in the database context provided. If the database doesn’t have it, use your own knowledge.
      - Be warm, concise, and clear. Always write in full sentences. Give enough detail to be helpful, but don’t ramble on too long.

      Database context:
      ${locationContext}

      User’s question: ${message}

      Now answer as Toto the turtle:
    `;

    // 3. Call Gemini
    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    res.json({ reply });
  } catch (err) {
    console.error("Chat error:", err.message);
    res.status(500).json({ error: "Failed to process chat" });
  }
};
