import db from "../Config/db.js";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://api.deepinfra.com/v1/openai",
  apiKey: process.env.ZAI_API_KEY,
});

console.log("ZAI key loaded:", process.env.ZAI_API_KEY?.slice(0, 8));

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
      SUPER IMPORTANT: YOUR ANSWER CANT EXCEED 30 words.
      You are Savannah, a friendly vietnamese local friend that will guide the user through guessing a heritage location in Vietnam. The user will ask you questions about the heritage, and you will answer based on the following rules:

      Rules:
      - DO NOT reveal the heritage name or how old it is.
      - If the user asks about the name or age/years → say something like: "Oops, that’s one secret that can’t I share!"
      - If the user asks for clues, give warm hints about the heritage without revealing its name or age.
      - Return the same language the user ask. If users ask in Vietnamese, answer in Vietnamese. If they ask in English, answer in English.
      - Any answer that includes the name, age, or can be used to deduce them is not allowed (e.g. when it was built, synonyms for the heritage name, etc).
      - Only answer heritage-related questions. If asked something off-topic, gently redirect as Toto would.
      - Ground your answers in the database context provided. If the database doesn’t have it, use your own knowledge.
      - Be warm, concise, and clear. Always write in full sentences. Give enough detail to be helpful, but don’t ramble on too long.

      Database context:
      ${locationContext}

      User’s question: ${message}

    `;

    // 3. Call ZAI
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "zai-org/GLM-5.1",
    });
    const reply = completion.choices[0].message.content;

    res.json({ reply });
  } catch (err) {
    console.error("Chat error:", err.message);
    res.status(500).json({ error: "Failed to process chat" });
  }
};
