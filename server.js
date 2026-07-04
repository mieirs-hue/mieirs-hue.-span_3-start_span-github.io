const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const SUBMISSIONS_FILE = path.join(__dirname, 'submissions.json');

app.post('/api/submit', (req, res) => {
  const entry = {
    timestamp: new Date().toISOString(),
    body: req.body
  };

  // Append to submissions file (create if missing)
  fs.readFile(SUBMISSIONS_FILE, 'utf8', (err, data) => {
    let arr = [];
    if (!err && data) {
      try { arr = JSON.parse(data); } catch (e) { arr = []; }
    }
    arr.push(entry);
    fs.writeFile(SUBMISSIONS_FILE, JSON.stringify(arr, null, 2), (werr) => {
      if (werr) {
        console.error('Failed to write submissions file:', werr);
        return res.status(500).json({ ok: false, error: 'write_failed' });
      }
      return res.json({ ok: true });
    });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
