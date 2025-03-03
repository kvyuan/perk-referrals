'use client'

import { useState } from 'react';
//import Link from 'next/link';
import axios from 'axios';

export default function Page() {
  const [showForm, setShowForm] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false); // New state for toggling explanation
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  // Handle email submission
  const handleEmailSubmit = async (event) => {
    event.preventDefault();

    try {
      // POST the email to Google Apps Script Web App URL
      const response = await axios.post('/api/submit-email', { email });

      // Handle success
      setMessage('Email submitted successfully!');
      console.log(response)
      setEmail('');  // Clear the email input field
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'An unexpected error occurred.';
      setMessage(errorMessage);
      console.error('Submission error:', errorMessage);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0A2342] p-6">
      <div className="max-w-2xl text-center bg-[#112D4E] p-10 rounded-2xl shadow-lg text-white border border-gray-700">
        <h1 className="text-4xl font-bold text-[#F2F2F2] mb-4">Perk Referrals: Share Your Experience & Get Rewarded!</h1>
        <p className="text-lg text-gray-300 mb-6">
          Have you recently hired a vendor or service professional? Join our forum and share your review to earn exclusive rewards!
        </p>
        <p className="text-lg text-gray-300 mb-6">
          Are you in search of a vendor or service professional? Join our forum and find trusted professionals recommended by peers!
        </p>
        <div className="flex justify-center gap-4">
          <button 
            onClick={() => setShowForm(true)} 
            className="bg-[#E31837] text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-md hover:bg-[#B81B29] transition"
          >
            Yes, I am Interested
          </button>
          <button 
            onClick={() => setShowExplanation(!showExplanation)} // Toggle the explanation visibility
            className="bg-[#6C757D] text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-md hover:bg-[#5A6268] transition"
          >
            Tell Me More
          </button>
        </div>
        
        {showForm && (
          <div className="mt-6 p-4 bg-[#0A2342] rounded-lg border border-gray-600">
            <p className="text-lg text-gray-300 mb-2">Enter your email to receive Beta release announcement:</p>
            <form onSubmit={handleEmailSubmit}>
              <input 
                type="email" 
                placeholder="Your Email" 
                className="w-full p-2 rounded-lg text-white mb-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button 
                type="submit"
                className="w-full bg-[#E31837] text-white px-4 py-2 rounded-lg shadow-md hover:bg-[#B81B29] transition"
              >
                Submit
              </button>
            </form>
            {message && <p className="mt-4 text-lg text-gray-300">{message}</p>}
          </div>
        )}

        {/* Explanation text box */}
        {showExplanation && (
          <div className="mt-6 p-4 bg-[#0A2342] rounded-lg border border-gray-600">
            <h3 className="text-2xl font-semibold text-[#F2F2F2] mb-4">How It Works:</h3>
            <p className="text-lg text-gray-300">
              Finding a reliable local vendor or service provider should be easy! You can find trusted professionals including home services, mortgage brokers, financial planners, etc. through our forum, based on reviews and recommendations 
              from other users. If you have a professional you trust, you will ll earn rewards by sharing here. 
               Perk Referrals is a community-driven platform aimed at connecting you with the best professionals.
            </p>
            <p className="text-lg text-gray-300">
              Each month, your profile score will be calculated by the popularity and quality of the recommendations you make. 
              Your score will then be compared with your peers, determining your share of the reward pool!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
