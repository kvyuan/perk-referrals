import { Resend } from 'resend';
import type { NextApiRequest, NextApiResponse } from 'next';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse
  ) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { email, category, title, content } = req.body;

  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'kenny.hyuan@gmail.com', // Change to your email
      subject: `New Post Submission: ${category}`,
      text: `Email: ${email}\nCategory: ${category}\nTitle: ${title}\nContent: ${content}`,
    });

    res.status(200).json({ message: 'Post submitted successfully!' });
  } catch (error) {
    console.error("Error", error);
    res.status(500).json({ error: 'Failed to send email' });
  }
}