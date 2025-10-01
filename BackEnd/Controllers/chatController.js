import db from "../Config/db.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

/**
 * Chat with AI using user message + optional location data
 */
export const sendMessage = async (req, res) => {
  try {
    const { message, locationId } = req.body;

    // 1. Load location data if provided
    let locationContext = "";
    if (locationId) {
      const [rows] = await db.execute(
        "SELECT name, region, built_year, difficulty, description FROM locations WHERE id = ?",
        [locationId]
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
      You are a heritage assistant. 
      Rules:
      - DO NOT reveal the heritage name or how old it is.  
      - If the user asks about name or age/years → respond: "Sorry, I can’t tell you that." 
      - If the user asks for clues, provide hints about the heritage without giving away its name or age.
      - Any answer that include name and age or can be used to deduce them is not allowed.(example when was the heritage build or synonyms to the heritage name, etc) 
      - Only answer heritage-related questions.  
      - Ground your answers in the database context provided. If database not provide it, answer from your own knowledge.
      - Be concise, factual, and clear.  Always answer full sentence and be supportive. If user need information, provide it detailsly. Though dont make it too long.

      Database context:
      ${locationContext}

      User’s question: ${message}

      Now answer the user’s question accordingly:
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
