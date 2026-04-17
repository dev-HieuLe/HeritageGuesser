# reCAPTCHA Setup

## Overview
- **Login** uses reCAPTCHA v3 (invisible, score-based)
- **Register** uses reCAPTCHA v2 (checkbox "I'm not a robot")

## Skip reCAPTCHA (Mobile)
Send `"type": "mobile"` in the request body to bypass reCAPTCHA on both login and register.

```json
POST /api/login
{
  "email": "user@example.com",
  "password": "password123",
  "type": "mobile"
}
```

```json
POST /api/register
{
  "name": "User",
  "email": "user@example.com",
  "password": "password123",
  "type": "mobile"
}
```

## Environment Variables

### Frontend (`FrontEnd/.env`)
```
VITE_RECAPTCHA_SITE_KEY=        # v3 site key (used on login)
VITE_RECAPTCHA_V2_SITE_KEY=     # v2 site key (used on register)
```

### Backend (`BackEnd/.env`)
```
RECAPTCHA_SECRET_KEY=           # v3 secret key
RECAPTCHA_V2_SECRET_KEY=        # v2 secret key
```

## Temporarily Disable (for testing)
Comment out the middleware in `BackEnd/Routes/authRoutes.js`:
```js
router.post("/register", /* verifyRecaptchaV2, */ register);
router.post("/login", /* verifyRecaptcha, */ login);
```
And comment out the imports above them.
