import axios from "axios";

const RECAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

export const verifyRecaptchaV2 = async (req, res, next) => {
  const { recaptchaToken } = req.body;

  if (!recaptchaToken) {
    return res.status(400).json({ error: "Please complete the reCAPTCHA." });
  }

  try {
    const { data } = await axios.post(
      RECAPTCHA_VERIFY_URL,
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_V2_SECRET_KEY,
          response: recaptchaToken,
        },
      }
    );

    if (!data.success) {
      return res.status(403).json({ error: "reCAPTCHA verification failed. Please try again." });
    }

    next();
  } catch (err) {
    console.error("reCAPTCHA v2 verification error:", err.message);
    return res.status(500).json({ error: "Failed to verify reCAPTCHA. Please try again." });
  }
};
