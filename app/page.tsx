"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";

export default function HomePage() {
  const [showPopup, setShowPopup] = useState(false);
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [body, setBody] = useState<Row[]>([]);
  const [header, setHeader] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null); // Track selected content
  const [selectedTitle, setSelectedTitle] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]); // Track selected categories
  const [categories, setCategories] = useState<string[]>([]); // Track available categories

  type Row = {
  category: string;
  title: string;
  content: string;
  // Add other fields as needed, like: id: number; name: string;
  };

  // Fetch data from Google Sheets API
  const fetchData = async () => {
    try {
      const response = await axios.get('/api/sheet-data');

      // Assume response.data.body is Row[]
      const body: Row[] = response.data.body;

      setHeader(response.data.header);
      setBody(body);

      const uniqueCategories = [
        ...new Set(body.map((row: Row) => row.category))
      ];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error fetching data", error);
      }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Handle row click to display content details
  const handleRowClick = (row: Row) => {
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
    await axios.post("/api/send-submission", { email, category, title, content });

    setMessage("Your content has been submitted successfully. Site admin will review and publish soon! (pop-up closing in 5 seconds)");
    
    // Clear form fields
    setEmail("");
    setCategory("");
    setTitle("");  
    setContent("");

    // Keep the modal open for 5 seconds, then close it
    setTimeout(() => {
      setShowPopup(false);
      setMessage(""); // Clear message after closing modal
    }, 5000);
  } catch (error) {
    console.error("Error", error);
    setError("Failed to submit content. Please try again.");
    
    setTimeout(() => {
      setError("");
    }, 5000);
  } finally {
    setIsSubmitting(false);
  }
};

  // Filter the data based on selected categories
  const filteredBody = body.filter((row: Row) =>
    selectedCategories.length === 0 || selectedCategories.includes(row.category)
  );

  // Handle category checkbox changes
  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(category)
        ? prevSelected.filter((cat) => cat !== category) // Remove if already selected
        : [...prevSelected, category] // Add if not selected
    );
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

      {/* Modal Pop-up */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-[#112D4E] p-6 rounded-xl shadow-lg w-[90%] max-w-md">
            <h2 className="text-2xl font-bold text-white mb-4">Submit Your Content</h2>

            {message ? (
              <div className="text-green-400 text-center font-semibold">
                {message}
              </div>
            ) : (
              <form onSubmit={handleContentSubmit} className="space-y-4">
                <input
                  type="email"
                  placeholder="Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none disabled:opacity-50"
                />

                {/* Category Dropdown */}
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none disabled:opacity-50"
                >
                  <option value="" disabled>Select a category</option>
                  {[...categories, "Other, specify in the title"].sort().map((cat, index) => (
                    <option key={index} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none disabled:opacity-50"
                />

                <textarea
                  placeholder="Content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="w-full p-3 h-32 rounded-lg bg-gray-800 text-white focus:outline-none disabled:opacity-50"
                ></textarea>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setShowPopup(false)}
                    className="bg-gray-500 px-4 py-2 rounded-lg text-white hover:bg-gray-700"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#E31837] px-4 py-2 rounded-lg text-white hover:bg-[#B81B29] disabled:opacity-50"
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}


      {/* Hero Section */}
      <header className="flex flex-col items-center text-center py-16 px-6">
        <h2 className="text-5xl font-bold text-[#F2F2F2] mb-4">Welcome to Perk Referrals Community!</h2>
        <p className="text-lg text-gray-300 max-w-3xl">
          A community-powered forum for the Greater Toronto Area where locals share trusted vendors, flag bad experiences, and help each other make informed choices.
          Contribute and earn up to 80% of the revenue generated from your referrals and insights.
        </p>
      </header>

      {/* Category Filter Section */}
      <section className="container mx-auto px-6 py-6">
        <h3 className="text-xl font-semibold text-[#F2F2F2] mb-4">Filter by Category</h3>
        <div className="space-x-4">
          {categories.map((category, index) => (
            <label key={index} className="text-lg text-gray-300 mr-4">
              <input
                type="checkbox"
                value={category}
                onChange={handleCategoryChange}
                checked={selectedCategories.includes(category)}
                className="mr-2"
              />
              {category}
            </label>
          ))}
        </div>
      </section>

      {/* Data Table Section */}
      <section className="container mx-auto px-6 py-10">
        <h3 className="text-2xl font-semibold text-[#F2F2F2] mb-4">Submitted Content</h3>

        <div className="overflow-x-auto bg-[#112D4E] shadow-lg rounded-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1B3A57] text-[#F2F2F2] uppercase text-sm font-semibold">
                {header.map((column, index) =>
                  column !== 'Content' && (
                    <th key={index} className="px-6 py-4 border-b border-gray-600">
                      {column}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody>
              {filteredBody.map((row, index) => (
                <tr
                  key={index}
                  onClick={() => handleRowClick(row)}
                  className="cursor-pointer transition hover:bg-[#1B3A57] even:bg-[#0F2A47]"
                >
                  {Object.keys(row).map(
                    (key, i) =>
                      key !== 'content' && (
                        <td key={i} className="px-6 py-4 border-b border-gray-700 text-gray-300">
                          {row[key]}
                        </td>
                      )
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Display selected content */}
        {selectedContent && (
          <div className="mt-6 bg-[#1B3A57] p-6 rounded-xl shadow-md border border-gray-700">
            <h3 className="text-2xl font-semibold text-[#F2F2F2]">{selectedTitle}</h3>
            <p className="text-lg text-gray-300 mt-2">{selectedContent}</p>
            <button onClick={() => setSelectedContent(null)} className="mt-4 bg-red-500 px-4 py-2 rounded-lg">
              Close
            </button>
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
