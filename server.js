/*
  Nova Studio — REAL BACKEND + REAL DATABASE + NODEMAILER EMAIL NOTIFICATION
  ------------------------------------------------------------------------
  - Express server serves the frontend (index.html)
  - REST API stores messages in a real on-disk database (db.json)
  - Sends an email notification to sswiftsite@gmail.com on every new message
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
app.use(express.static(__dirname)); // serves index.html + assets

// ---- Real database helpers (file-based, persisted on disk) ----
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

// Make sure the DB file exists on startup
if (!fs.existsSync(DB_FILE)) writeDB({ messages: [] });

// ---- Nodemailer Transporter Setup ----
// Yeh aapke Gmail account se connect karega. 
// Railway variables mein EMAIL_USER aur EMAIL_PASS set karna zaroori hai.
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'sswiftsite@gmail.com', // Aapka email
    pass: process.env.EMAIL_PASS  // Gmail App Password yahan aayega
  }
});

// ---- REST API (the real backend) ----
// GET all messages
app.get('/api/messages', (req, res) => {
  const db = readDB();
  res.json(db.messages);
});

// POST a new message  (real database INSERT + Email Notification)
app.post('/api/messages', async (req, res) => {
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

  // Send Email Notification to sswiftsite@gmail.com
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'sswiftsite@gmail.com',
      to: 'sswiftsite@gmail.com', // Aapka inbox email
      subject: `🚀 New Portfolio Message from ${name} (${type || 'General'})`,
      text: `Aapko aapke 3D Portfolio par naya message mila hai!

Name: ${name}
Email: ${email}
Phone: ${phone || 'N/A'}
Type: ${type || 'General'}

Message:
${message}

Date: new Date().toLocaleString()
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('📧 Email notification successfully sent to sswiftsite@gmail.com');
  } catch (emailError) {
    console.error('❌ Email sending failed:', emailError);
  }

  res.status(201).json(record);
});

// DELETE one message (real database DELETE)
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

// SPA fallback (so /contact etc. still load index.html)
app.get('*', (req, res) => {
     res.sendFile(path.join(__dirname, 'index.html'));
        });

app.listen(PORT, () => {
  console.log(`✅ Nova Studio running at http://localhost:${PORT}`);
  console.log(`🗄️  Database file: ${DB_FILE}`);
     });