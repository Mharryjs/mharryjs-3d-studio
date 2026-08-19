/*
  Nova Studio — REAL BACKEND + REAL DATABASE + NON-BLOCKING EMAIL NOTIFICATION
*/

const express = require('express');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'db.json');

// ---- Middleware ----
app.use(express.json());
app.use(express.static(__dirname));

// ---- Real database helpers ----
function readDB() {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch {
    return { messages: [] };
  }
}
function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

if (!fs.existsSync(DB_FILE)) writeDB({ messages: [] });

// ---- Nodemailer Transporter Setup ----
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'sswiftsite@gmail.com',
    pass: process.env.EMAIL_PASS
  }
});

// ---- REST API ----
app.get('/api/messages', (req, res) => {
  const db = readDB();
  res.json(db.messages);
});

// POST a new message (Database save first, email runs in background)
app.post('/api/messages', (req, res) => {
  const { name, email, phone, message, type } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'name, email and message are required' });
  }
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(email)) {
    return res.status(400).json({ error: 'invalid email' });
  }
  
  const db = readDB();
  const record = {
    id: Date.now(),
    name, email, phone: phone || '', type: type || 'General',
    message,
    date: new Date().toISOString()
  };
  
  db.messages.unshift(record);
  writeDB(db);

  // Send response immediately so UI doesn't hang ("Sending..." stops instantly)
  res.status(201).json(record);

  // Send Email Notification in the background (Non-blocking)
  setImmediate(async () => {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER || 'sswiftsite@gmail.com',
        to: 'sswiftsite@gmail.com',
        subject: `🚀 New Portfolio Message from ${name} (${type || 'General'})`,
        text: `Aapko aapke 3D Portfolio par naya message mila hai!\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\nType: ${type || 'General'}\n\nMessage:\n${message}`
      };

      await transporter.sendMail(mailOptions);
      console.log('📧 Email notification successfully sent to sswiftsite@gmail.com');
    } catch (emailError) {
      console.error('❌ Background email sending failed (Ignored to keep UI fast):', emailError.message);
    }
  });
});

// DELETE one message
app.delete('/api/messages/:id', (req, res) => {
  const db = readDB();
  const id = Number(req.params.id);
  db.messages = db.messages.filter(m => m.id !== id);
  writeDB(db);
  res.json({ ok: true });
});

// DELETE all messages
app.delete('/api/messages', (req, res) => {
  writeDB({ messages: [] });
  res.json({ ok: true });
});

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Nova Studio running at http://localhost:${PORT}`);
  console.log(`🗄️ Database file: ${DB_FILE}`);
});
