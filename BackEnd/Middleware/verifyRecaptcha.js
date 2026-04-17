import axios from "axios";

const RECAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";
const SCORE_THRESHOLD = 0.5;

export const verifyRecaptcha = async (req, res, next) => {
  // Skip reCAPTCHA for mobile clients
  if (req.body?.type === "mobile") return next();

  const recaptchaToken = req.body?.recaptchaToken || req.query?.recaptchaToken;

  if (!recaptchaToken) {
    return res.status(400).json({ error: "reCAPTCHA token missing." });
  }

  try {
    const { data } = await axios.post(
      RECAPTCHA_VERIFY_URL,
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: recaptchaToken,
        },
      }
    );

    if (!data.success || data.score < SCORE_THRESHOLD) {
      return res.status(403).json({ error: "reCAPTCHA verification failed. Please try again." });
    }

    next();
  } catch (err) {
    console.error("reCAPTCHA verification error:", err.message);
    return res.status(500).json({ error: "Failed to verify reCAPTCHA. Please try again." });
  }
};
