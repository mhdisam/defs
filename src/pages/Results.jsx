import React, { useState, useRef } from "react";
import { motion } from "framer-motion";

const ResultsPage = () => {

  const essayData = JSON.parse(localStorage.getItem("essayData")) || {};
  const scoreData = JSON.parse(localStorage.getItem("scoreData")) || {};
  const formatErrors = JSON.parse(localStorage.getItem("formatErrors")) || {};
  const feedbackData = JSON.parse(localStorage.getItem("feedbackData")) || {};
  const revisedWriting = JSON.parse(localStorage.getItem("revisedWriting")) || {};


  const bandScore = scoreData.overall_score || 0;
  const scores = [scoreData.tr, scoreData.cc, scoreData.gr, scoreData.lr].map((s) => s || 0);
  const essayText = formatErrors.result || "";
  const essayTopic = essayData.topic || "No topic provided";
  const correctedEssayText = revisedWriting.result || "";

  const categorizedErrors = { GRA: [], STR: [], VOC: [] };
  if (feedbackData?.grammar) categorizedErrors.GRA = feedbackData.grammar;
  if (feedbackData?.structural) categorizedErrors.STR = feedbackData.structural;
  if (feedbackData?.vocabulary) categorizedErrors.VOC = feedbackData.vocabulary;
  

  const [openSection, setOpenSection] = useState(null);
  const [highlightedError, setHighlightedError] = useState(null);
  const correctionRef = useRef(null);
  const [expandedErrors, setExpandedErrors] = useState({});

  const handleEssayClick = (e) => {
    console.log("Clicked Element:", e.target);
    if (e.target.tagName === "A") {
      e.preventDefault();
    }
    if (
      e.target.classList.contains("grammar") ||
      e.target.classList.contains("structural") ||
      e.target.classList.contains("vocabulary")
    ) {
      const errorType = e.target.classList.contains("grammar")
        ? "GRA"
        : e.target.classList.contains("structural")
        ? "STR"
        : "VOC";

      console.log("Error Type:", errorType, "Error Text:", e.target.innerText);
      handleErrorClick(errorType, e.target.innerText);
    }
  };


  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleErrorClick = (type, incorrect) => {
    setOpenSection(type);
    setHighlightedError(incorrect);
  
    setTimeout(() => {
      if (correctionRef.current) {
        correctionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };
  

  const copyToClipboard = () => {
      navigator.clipboard.writeText(correctedEssayText.replace(/<[^>]+>/g, ""));
      alert("Corrected essay copied to clipboard✨");
    };

  
    const toggleErrorText = (key, index, issue) => {
      const errorKey = `${key}-${index}`;
      const isExpanded = expandedErrors[errorKey];
    
      if (isExpanded) {
        handleErrorClick(key, issue.error);
      } else {
        setExpandedErrors((prev) => ({
          ...prev,
          [errorKey]: true,
        }));
      }
    };
    

  return (
    <div className="mt-10 min-h-screen p-6 flex flex-col items-center justify-start">


      {/* Score */}
      <div className="w-full max-w-7xl flex flex-col md:flex-row gap-6">
        <div className="bg-NavyBlue p-6 rounded-xl shadow-md boxw">
          <div className="bg-customBlue text-white text-center py-6 rounded-xl aspect-square flex flex-col justify-center">
            <p className="text-sm uppercase">Est. Overall Band Score</p>
            <p className="text-6xl font-bold my-10">{bandScore}</p>
            <p className="text-sm">(+/- 0.5)</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            {scores.map((score, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow text-center">
                <p className="text-lg font-medium">{["TR", "CC", "GRA", "LR"][index]}</p>
                <p className="text-2xl font-bold">{score}</p>
              </div>
            ))}
          </div>

          <ul className="list-disc list-outside mt-4 space-y-2 text-gray-700 text-sm">
            <li><b>TR:</b> Task Response</li>
            <li><b>CC:</b> Coherence & Cohesion</li>
            <li><b>GRA:</b> Grammatical Range & Accuracy</li>
            <li><b>LR:</b> Lexical Resource</li>
          </ul>

        </div>


    {/* Essay */}
        <div className="flex flex-col space-y-12">
          <div>
            <p className="mb-4 font-medium text-lg">Essay Topic:</p>
            <div className="border border-gry p-4 rounded-xl bg-white">
              <p className="text-gray-700">{essayTopic}</p>
            </div>
          </div>

          <div>
            <p className="mb-4 font-medium text-lg">Essay Text:</p>
            <div className="border border-gry p-4 rounded-xl bg-white">
            <p className="text-gray-700"
                dangerouslySetInnerHTML={{ __html: essayText || "No essay available" }} 
                onClick={handleEssayClick}
            />
            </div>
          </div>
        </div>
      </div>


      {/* Issues */}
      <div className="w-full max-w-7xl mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
      {[
        ["GRA", "Grammatical Issues", "bg-coralRd", "border-red-500", "text-red-500","bg-red-400", "hover:bg-red-200"],
        ["STR", "Structural Issues", "bg-goldnYll", "border-yellow-500", "text-yellow-500","bg-yellow-400","hover:bg-yellow-200"],
        ["VOC", "Vocabulary Issues", "bg-skyBlue", "border-blue-600", "text-blue-500","bg-blue-400","hover:bg-blue-200"]
      ].map(([key, title, bgColor, borderColor, textColor,bgerror,hoverColor]) => (
        <div key={key} className={`p-4 rounded-xl shadow-md ${bgColor} border-2 ${borderColor}`}>
          <h3 className={`text-xl font-bold mb-4 ${textColor} text-center`}>{title}</h3>
          {categorizedErrors[key].map((issue, index) => {
            const errorKey = `${key}-${index}`;
            const isExpanded = expandedErrors[errorKey];

            const truncateText = (text) => (text.length > 30 ? text.slice(0, 30) + "..." : text);

            const displayError = isExpanded ? issue.error : truncateText(issue.error);
            const displayFix = isExpanded ? issue.fix : truncateText(issue.fix);
            return (
            <p 
              key={index} 
              className={`flex justify-between p-2 rounded-md cursor-pointer ${hoverColor || "hover:bg-gray-200"}`}
              onClick={() => toggleErrorText(key, index, issue)}
            >
              <span className={`${bgerror || "bg-red-400"} px-2 py-1 rounded`}>
                {displayError}
              </span>
              <span className="mx-2">→</span>
              <span className="bg-green-500 px-2 py-1 rounded text-center">
                {displayFix}
              </span>
            </p>
            );
          })}
        </div>
      ))}
    </div>


      {/* Detailed Correction */}
      <div ref={correctionRef} className="mt-16 w-full max-w-7xl flex flex-col">
      <div className="flex gap-4 items-center mb-10">
        <img src="/defs/assets/textalign.svg" alt="textalign-left" className="w-5 h-5 ml-2" />
        <h2 className="text-2xl font-medium ">Detailed Correction</h2>
      </div>


        <div className="w-full space-y-4">
          {Object.entries({ GRA: "Grammar", STR: "Structure", VOC: "Vocabulary" }).map(([key, label]) => (
            <div key={key} className="flex">

              <motion.div
                className={`w-1 bg-${key === "GRA" ? "red-500" : key === "STR" ? "yellow-500" : "blue-500"}`}
                animate={{ height: openSection === key ? "auto" : "64px" }}
                transition={{ duration: 0.3 }}
              ></motion.div>


              <div
                className={`ml-4 bg-${key === "GRA" ? "coralRd" : key === "STR" ? "goldnYll" : "skyBlue"} p-4 w-full rounded-xl cursor-pointer`}
                onClick={() => toggleSection(key)}
              >
                <div className="flex justify-between">
                  <p className={`text-xl ${key === "GRA" ? "text-red-500" : key === "STR" ? "text-yellow-500" : "text-blue-500"}`}>
                    {label}
                  </p>
                  <img src={openSection === key ? "/defs/assets/arrow-up.svg" : "/defs/assets/arrow-down.svg"} alt="toggle" className="w-5 h-5" />
                </div>

                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: openSection === key ? "auto" : 0, opacity: openSection === key ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden mt-2"
                >
                  {categorizedErrors[key].map((issue, index) => (
                    <div
                        key={index}
                        className={`p-2 ${
                          highlightedError === issue.error
                            ? key === "GRA"
                              ? "bg-red-200"
                              : key === "STR"
                              ? "bg-yellow-200"
                              : "bg-blue-200"
                            : ""
                        }`}
                      >
                        <p className="font-semibold">
                          <span className={`${key === "GRA" ? "text-red-500" : key === "STR" ? "text-yellow-500" : "text-blue-500"}`}>{issue.error}</span> →{" "}
                          <span className="text-green-500">{issue.fix}</span>
                        </p>
                        <p>Explanation:</p>
                        <p>{issue.explanation}</p>
                    </div>

                  ))}
                </motion.div>
              </div>
            </div>
          ))}
        </div>
      </div>



      {/* Last */}
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
      <div>
        <h3 className="font-medium text-lg mb-2">Corrected Essay Text:</h3>
        <div className="border-4 border-green-500 p-4 rounded-xl bg-white">
          <p className="text-gray-700" dangerouslySetInnerHTML={{ __html: correctedEssayText }}/>

        </div>
        <button 
            onClick={copyToClipboard} 
            className="flex gap-3 items-center justify-center mt-4 p-4 bg-green-500 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-gray-500">
            <img src="/defs/assets/copy.svg" alt="copy" className="w-6 h-6"/>
            Copy Text
          </button>
        </div>

        <div>
        <h3 className="font-medium text-lg mb-2">Original Essay Text:</h3>
          <div className="border border-gray-500 p-4 rounded-xl bg-white">
            <p className="text-gray-700" dangerouslySetInnerHTML={{ __html: essayText }}
              onClick={handleEssayClick}
            />
          </div>
        </div>

      </div>

      <button 
        onClick={() => window.location.href = "/"} 
        className="flex items-center justify-center text-base w-full max-w-7xl my-12 p-6 bg-customBlue text-white text-larg font-extrabold rounded-lg hover:bg-blue-800 transition delay-90 focus:outline-none focus:ring-2 focus:ring-blue-300">
        Check Another Essay
        <img src="/defs/assets/note.svg" alt="note" className="w-7 h-7 ml-2 " />
      </button>


      
    </div>
  );
};

export default ResultsPage;
