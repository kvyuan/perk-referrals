"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";

export default function HomePage() {
  const [showPopup, setShowPopup] = useState(false);
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [body, setBody] = useState([]);
  const [header, setHeader] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null); // Track selected content
  const [selectedTitle, setSelectedTitle] = useState(null);

  // Fetch data from Google Sheets API
  const fetchData = async () => {
    try {
      const response = await axios.get('/api/sheet-data');
      setHeader(response.data.header); // Assuming header comes in response.data.header
      setBody(response.data.body); // Assuming data comes in response.data.body
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const handleRowClick = (row) => {
    setSelectedContent(row.content);
    setSelectedTitle(row.title); // Store the content and title for the selected row
  };

  // Handle content submission
  const handleContentSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    setIsSubmitting(true);

    try {
      await axios.post("/api/send-submission", { email, category, content });
      setMessage("Your content has been submitted successfully.");
      setEmail("");
      setCategory("");
      setContent("");

      setTimeout(() => {
        setMessage("");
      }, 5000);
    } catch (error) {
      setError("Failed to submit content. Please try again.");
      setTimeout(() => {
        setError("");
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0A2342] text-white">
      {/* Navigation Bar */}
      <nav className="bg-[#112D4E] p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#F2F2F2]">Perk Referrals</h1>
          <div className="space-x-6">
            <Link href="/" className="text-lg hover:text-gray-300 transition">
              Home
            </Link>
            <Link href="/about" className="text-lg hover:text-gray-300 transition">
              About
            </Link>
            <Link href="/contact" className="text-lg hover:text-gray-300 transition">
              Contact Us
            </Link>
            <button
              onClick={() => setShowPopup(true)}
              className="bg-[#E31837] px-4 py-2 rounded-lg text-lg font-semibold shadow-md hover:bg-[#B81B29] transition"
            >
              POST CONTENT
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="flex flex-col items-center text-center py-16 px-6">
        <h2 className="text-5xl font-bold text-[#F2F2F2] mb-4">Welcome to Perk Referrals Community!</h2>
        <p className="text-lg text-gray-300 max-w-3xl">
          A community-driven forum where members share recommendations and experiences with trusted vendors and service professionals.
          Earn rewards for your contributions and discover highly-rated professionals recommended by peers.
        </p>
      </header>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-10 grid md:grid-cols-2 gap-8">
        <div className="bg-[#112D4E] p-6 rounded-xl shadow-md border border-gray-700">
          <h3 className="text-2xl font-semibold text-[#F2F2F2]">💬 Engage with the Community</h3>
          <p className="text-lg text-gray-300 mt-2">
            Join discussions, ask for recommendations, and find trusted professionals based on real experiences.
          </p>
        </div>
        <div className="bg-[#112D4E] p-6 rounded-xl shadow-md border border-gray-700">
          <h3 className="text-2xl font-semibold text-[#F2F2F2]">🏆 Earn Rewards</h3>
          <p className="text-lg text-gray-300 mt-2">
            Share your experiences and receive rewards based on the quality and popularity of your recommendations.
          </p>
        </div>
      </section>

      {/* Data Table Section */}
      <section className="container mx-auto px-6 py-10">
        <h3 className="text-2xl font-semibold text-[#F2F2F2] mb-4">Submitted Content</h3>
        <table className="min-w-full table-auto text-[#F2F2F2] text-left">
          <thead>
            <tr>
              {header.map((column, index) => (
                // Show all columns except "Content"
                column !== 'Content' && (
                  <th key={index} className="px-4 py-2">{column}</th>
                )
              ))}
            </tr>
          </thead>
          <tbody>
            {body.map((row, index) => (
              <tr
                key={index}
                onClick={() => handleRowClick(row)}
                className="cursor-pointer hover:bg-[#112D4E] transition"
              >
                {Object.keys(row).map((key, i) => (
                  // Exclude the "content" column from the table
                  key !== 'content' && (
                    <td key={i} className="px-4 py-2">{row[key]}</td>
                  )
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {selectedContent && (
          <div className="mt-10 bg-[#112D4E] p-6 rounded-xl shadow-md border border-gray-700">
            <h3 className="text-2xl font-semibold text-[#F2F2F2]">{selectedTitle}</h3>
            <p className="text-lg text-gray-300 mt-2">{selectedContent}</p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-[#112D4E] text-center py-6 mt-auto">
        <p className="text-gray-400">&copy; {new Date().getFullYear()} Perk Referrals. All rights reserved.</p>
      </footer>
    </div>
  );
}
