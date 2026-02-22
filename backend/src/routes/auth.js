const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

// In-memory OTP store (for production, use Redis or a database)
const otps = new Map();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'muthuvishal.mk@gmail.com',
    pass: process.env.EMAIL_APP_PASSWORD // User needs to set this in .env
  }
});

router.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otps.set(email, { otp, expires: Date.now() + 5 * 60000 }); // 5 mins expiry

  try {
    await transporter.sendMail({
      from: 'muthuvishal.mk@gmail.com',
      to: email,
      subject: 'Blind Builder - Login OTP',
      text: `Your OTP for Blind Builder is: ${otp}. It is valid for 5 minutes.`
    });
    res.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send OTP. Check email configuration.' });
  }
});

router.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  const record = otps.get(email);

  if (!record) return res.status(400).json({ error: 'No OTP requested for this email' });
  if (Date.now() > record.expires) {
    otps.delete(email);
    return res.status(400).json({ error: 'OTP expired' });
  }
  if (record.otp !== otp) return res.status(400).json({ error: 'Invalid OTP' });

  otps.delete(email);
  // Extract username from email (e.g., test@gmail.com -> test)
  const username = email.split('@')[0];
  res.json({ success: true, username });
});

module.exports = router;
