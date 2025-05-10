import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { email, category, title, content } = req.body;

  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'kenny.hyuan@gmail.com', // Change to your email
      subject: `New Post Submission: ${category}`,
      text: `Email: ${email}\nCategory: ${category}\nTitile: ${title}\nContent: ${content}`,
    });

    res.status(200).json({ message: 'Post submitted successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send email' });
  }
}