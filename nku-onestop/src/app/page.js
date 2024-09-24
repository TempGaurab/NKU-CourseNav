"use client";

import { useState, useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import Tree from 'react-d3-tree';
import Draggable from 'react-draggable'; // Import Draggable component
import coursesData from './data/courses_sample.json';

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [courses] = useState(coursesData);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [otherPreReqInfo, setOtherPreReqInfo] = useState("");
  const [error, setError] = useState("");
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });
  const treeContainerRef = useRef(null); // Reference to tree container

  useEffect(() => {
    // Set container size dynamically based on viewport size
    if (treeContainerRef.current) {
      const { offsetWidth, offsetHeight } = treeContainerRef.current;
      setContainerSize({ width: offsetWidth, height: offsetHeight });
    }
  }, []);

  const courseCodeExists = (courseCode, data) => {
    courseCode = courseCode.toUpperCase().trim();
    return data.some(course => course.Course_Code === courseCode);
  };

  const getHierarchy = (course) => {
    const courseCode = course.Course_Code;
    const prereqs = course.Prerequisites || [];
    const coReq = course.Coreq.length > 0 ? [{ name: `Coreq: ${course.Coreq.join(", ")}` }] : [];

    const hierarchy = {
      name: `${courseCode} - ${course.Course_Title}`,
      children: [
        ...prereqs.map(prereq => ({ name: `Prereq: ${prereq}` })),
        ...coReq
      ]
    };
    return hierarchy;
  };

  const handleNotifications = (course) => {
    const otherPreReq = course["Other_Pre-req"];
    if (otherPreReq) {
      setOtherPreReqInfo(otherPreReq);
    } else {
      setOtherPreReqInfo("");
    }
  };

  const generateHierarchyData = (courseCode) => {
    const trimmedCode = courseCode.toUpperCase().trim();

    if (!courseCodeExists(trimmedCode, courses)) {
      setError("Course code not found. Please enter a valid course code.");
      setSelectedCourse(null);
      setOtherPreReqInfo("");
      return;
    }

    const course = courses.find(c => c.Course_Code && c.Course_Code.toUpperCase() === trimmedCode);
    
    if (!course) {
      setError("Course not found or invalid Course_Code.");
      setSelectedCourse(null);
      setOtherPreReqInfo("");
      return;
    }

    const hierarchy = getHierarchy(course);
    setSelectedCourse(hierarchy);
    setError("");

    handleNotifications(course);
  };

  const handleSearchClick = () => {
    generateHierarchyData(inputValue.trim());
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white overflow-auto">
      {/* Image container to handle space between images */}
      <div className="flex flex-col items-center sm:flex-row sm:space-x-8 mt-8">
        <img 
          src="https://ih1.redbubble.net/image.3333071584.6429/st,small,507x507-pad,600x600,f8f8f8.jpg" 
          alt="Logo"
          className="w-32 h-32 rounded-full" 
        />

        <img 
          src="https://i.imgur.com/IuI4ewf.png" 
          alt="Main" 
          className="mt-4 sm:mt-0 w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl" 
        />
      </div>

      <div className="relative mt-12 w-72 md:w-96">
        <input
          type="text"
          placeholder="Enter course code"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setError("");
          }}
          className="w-full border-animated rounded-full pl-4 pr-12 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-[#333] tracking-wide"
        />
        <button onClick={handleSearchClick} className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700">
          <FaSearch />
        </button>
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {/* Tree and notification container */}
      <div className="flex flex-col-reverse md:flex-row items-center justify-center w-full mt-8">
        {/* Notification Popup */}
        {otherPreReqInfo && (
          <div className="other-prereq-notification md:ml-8 mb-4 md:mb-0">
            <strong>Other Pre-req:</strong> {otherPreReqInfo}
          </div>
        )}

        {/* Flowchart */}
        <div ref={treeContainerRef} className="relative w-full h-[600px] lg:h-[800px] overflow-hidden">
          {selectedCourse && (
            <Draggable bounds="parent">
              <div style={{ width: containerSize.width, height: containerSize.height }}>
                <Tree 
                  data={selectedCourse} 
                  orientation="vertical" 
                  pathFunc="straight"
                  translate={{ x: containerSize.width / 2, y: 100 }} // Center the tree
                  zoomable={true}
                  initialZoom={0.7} // Adjust the initial zoom
                  separation={{ siblings: 1.5, nonSiblings: 2 }}
                  collapsible={false}
                />
              </div>
            </Draggable>
          )}
        </div>
      </div>

      <style jsx>{`
        .border-animated {
          border: 2px solid transparent;
          border-radius: 50px;
          padding: 5px;
          background: linear-gradient(white, white) padding-box, 
                      linear-gradient(60deg, #f79533, #f37055, #ef4e7b, #a166ab, #5073b8, #1098ad, #07b39b, #6fba82) border-box;
          background-size: 300% 300%;
          animation: gradient-animation 3s ease alternate infinite;
        }

        @keyframes gradient-animation {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .other-prereq-notification {
          background-color: black;
          color: #e8d031;
          padding: 10px;
          border-radius: 8px;
          max-width: 300px;
          font-size: 16px;
          font-weight: bold;
          text-align: center;
        }
      `}</style>
    </div>
  );
}
