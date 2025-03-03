// pages/api/submit-email.js
import axios from 'axios';

const submissionCounts = {}; // Store submission count per IP (Resets on server restart)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { email } = req.body;
    const userIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress; // Get user IP
    console.log('User IP:', userIp, 'Email:', email);

    // Initialize count if IP is new
    if (!submissionCounts[userIp]) {
      submissionCounts[userIp] = 0;
    }

    // Block if the user has already submitted twice
    if (submissionCounts[userIp] >= 2) {
      return res.status(429).json({ message: 'You have reached the maximum of 2 submissions.' });
    }

    // Google Apps Script Web App URL
    const scriptUrl =
      'https://script.google.com/macros/s/AKfycbwxv_zHvozVAOfYFajP1O2pTOwreQdbBwgr4pdKHXwMmrFfLSwMppeQ5Z_gApy3ALiQ9g/exec';

    // Send the email to Google Apps Script
    const response = await axios.post(scriptUrl, new URLSearchParams({ email }));

    // If successful, increment the submission count
    if (response.data === 'Success') {
      submissionCounts[userIp] += 1;
      return res.status(200).json({ message: 'Email submitted successfully!' });
    } else {
      return res.status(400).json({ message: 'There was an issue with your submission.' });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      message: 'There was an error submitting your email.',
      error: error?.response?.data || error.message,
    });
  }
}
