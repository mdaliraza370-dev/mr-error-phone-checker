const express = require('express');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));

app.get('/api/scan', async (req, res) => {
  const number = String(req.query.number || '').trim();
  if (!number) return res.status(400).json({ error: 'Phone number is required.' });
  if (!process.env.NUMVERIFY_API_KEY) return res.status(500).json({ error: 'NUMVERIFY_API_KEY is not configured on the server.' });

  try {
    const url = `https://api.apilayer.com/number_verification/validate?number=${encodeURIComponent(number)}`;
    const r = await fetch(url, { headers: { apikey: process.env.NUMVERIFY_API_KEY } });
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: data?.message || 'NumVerify request failed.', details: data });
    res.json(data);
  } catch (err) {
    res.status(502).json({ error: 'Unable to reach NumVerify.', details: err.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`MR ERROR Phone Checker running at http://127.0.0.1:${PORT}`);
});
