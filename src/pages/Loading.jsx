import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';

const API_BASE_URL = "https://bandbooster.liara.run";

const LoadingPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const essayData = JSON.parse(localStorage.getItem("essayData"));
        if (!essayData) {
          alert("No essay data found! Redirecting to home.");
          navigate("/");
          return;
        }

        const requestBody = JSON.stringify({
          question: essayData.topic,
          essay: essayData.essayText
        });

        const fetchOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: requestBody
        };

        const formatRes = await fetch(`${API_BASE_URL}/format-errors`, fetchOptions);
        if (!formatRes.ok) throw new Error("Failed to fetch format errors.");
        const formatData = await formatRes.json();
        localStorage.setItem("formatErrors", JSON.stringify(formatData));

        const updatedRequestBody = JSON.stringify({
          question: essayData.topic,
          essay: formatData.result 
        });

        const updatedFetchOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: updatedRequestBody
        };

        const [scoreRes, feedbackRes, revisedRes] = await Promise.all([
          fetch(`${API_BASE_URL}/score`, fetchOptions),
          fetch(`${API_BASE_URL}/feedback`, updatedFetchOptions), 
          fetch(`${API_BASE_URL}/revised-writing`, fetchOptions)
        ]);

        if (!scoreRes.ok || !feedbackRes.ok || !revisedRes.ok) {
          throw new Error("Failed to fetch all results.");
        }

        const [scoreData, feedbackData, revisedData] = await Promise.all([
          scoreRes.json(),
          feedbackRes.json(),
          revisedRes.json()
        ]);

        localStorage.setItem("scoreData", JSON.stringify(scoreData));
        localStorage.setItem("feedbackData", JSON.stringify(feedbackData));
        localStorage.setItem("revisedWriting", JSON.stringify(revisedData));

        setLoading(false);
        navigate("/results");

      } catch (error) {
        console.error("Error:", error);
        alert("Error fetching results. Redirecting to home.");
        navigate("/");
      }
    };

    fetchResults();
  }, [navigate]);

  return (
    <div className="flex flex-col items-center mt-72">
      <Loader />
      <span className="mt-4 roboto-font text-customBlue text-lg font-medium">
        {loading ? "Analyzing your essay..." : "Redirecting to results..."}
      </span>
    </div>
  );
};

export default LoadingPage;
