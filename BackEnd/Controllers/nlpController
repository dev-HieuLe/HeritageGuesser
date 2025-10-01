import axios from "axios";

export const checkHeritageName = async (req, res) => {
  const { guess } = req.body;
  try {
    const response = await axios.post("http://localhost:8000/match-heritage", {
      query: guess,
    });
    res.json(response.data);
  } catch (err) {
    console.error("Error calling FastAPI:", err.message);
    res.status(500).json({ error: "Failed to match heritage" });
  }
};
