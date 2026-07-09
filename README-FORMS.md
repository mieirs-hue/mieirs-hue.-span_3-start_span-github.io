Local form submission helper

What I added
- `server.js` : a minimal Express server with POST /api/submit that appends submissions to `submissions.json`.
- `package.json` : dependencies and `npm start` script.

How to run locally (requires Node.js)

1. Install dependencies:

```powershell
cd "C:\Users\Authorized User\OneDrive\Desktop\mywebsite"
npm install
```

2. Start the server:

```powershell
npm start
```

3. Open the site (use Live Server or a static server) and submit the form. If the Formspree submission fails, the client will POST to `http://localhost:3000/api/submit` as a fallback. Submissions are saved to `submissions.json`.

Notes
- This server does not send email. It only provides a reliable server-side endpoint for capturing submissions locally or on a simple VPS. To send email, you can integrate `nodemailer` with SMTP credentials or forward the payload to an email API (SendGrid, Mailgun, etc.).
- Make sure `server.js` is accessible from the browser (CORS is enabled) and that the port (3000) is open.
