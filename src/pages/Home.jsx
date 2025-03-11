import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import star from "../../public/assets/star.svg";

const HomePage = () => {
  const [topic, setTopic] = useState('');
  const [essayText, setEssayText] = useState('');
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (!topic || !essayText) {
      alert("Please fill in both fields.");
      return;
    }

    localStorage.setItem("essayData", JSON.stringify({ topic, essayText }));

    navigate('/loading');
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-7xl p-6 rounded-xl">
          <div className="mb-4">
            <label className="font-semibold block text-left text-gray-700 mb-2">Essay Topic:</label>
            <textarea
              value={topic}
              onChange={(e) => {
                setTopic(e.target.value);
                e.target.style.height = "auto"; 
                e.target.style.height = `${e.target.scrollHeight}px`; 
              }}
              placeholder="What is your essay about?"
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            />

          </div>
          <div className="mb-6 md:mb-20">
            <label className="font-semibold block text-left text-gray-700 mb-2">Essay Text:</label>
            <textarea
              value={essayText}
              onChange={(e) => setEssayText(e.target.value)}
              placeholder="Paste or type your essay here"
              rows="10"
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            onClick={handleSubmit}
            className="w-full flex items-center justify-center bg-customBlue text-white text-base font-medium p-5 rounded-lg shadow-md hover:bg-blue-800 transition delay-90">
            Check My Essay
            <img src={star} alt="star" className="w-5 h-5 ml-2 " />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
