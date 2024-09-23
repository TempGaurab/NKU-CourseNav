"use client";

import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import Tree from 'react-d3-tree';  // Import the react-d3-tree library
import coursesData from './data/courses_sample.json'; // Assuming JSON file is available

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [courses] = useState(coursesData);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [otherPreReqInfo, setOtherPreReqInfo] = useState(""); // Store the other pre-req information
  const [error, setError] = useState(""); // To handle validation errors

  // Helper to check if course code exists
  const courseCodeExists = (courseCode, data) => {
    courseCode = courseCode.toUpperCase().trim();
    return data.some(course => course.Course_Code === courseCode);
  };

  // Function to structure the tree with course, prerequisites, and co-requisites (excluding other pre-req)
  const getHierarchy = (course) => {
    const courseCode = course.Course_Code;
    const prereqs = course.Prerequisites || [];
    const coReq = course.Coreq.length > 0 ? [{ name: `Coreq: ${course.Coreq.join(", ")}` }] : [];

    // Create the tree structure with the main course as parent and prerequisites and co-requisites as children
    const hierarchy = {
      name: `${courseCode} - ${course.Course_Title}`,
      children: [
        ...prereqs.map(prereq => ({ name: `Prereq: ${prereq}` })),  // Display each prerequisite
        ...coReq                                                     // Display co-requisites
      ]
    };
    return hierarchy;
  };

  // Function to handle display of Other Pre-req at the rightmost part of the screen
  const handleNotifications = (course) => {
    const otherPreReq = course["Other_Pre-req"];
    if (otherPreReq) {
      setOtherPreReqInfo(otherPreReq); // Set the other pre-req information to display
    } else {
      setOtherPreReqInfo(""); // Clear other pre-req if not available
    }
  };

  // Generate the hierarchy when a course is selected
  const generateHierarchyData = (courseCode) => {
    const trimmedCode = courseCode.toUpperCase().trim();

    if (!courseCodeExists(trimmedCode, courses)) {
      setError("Course code not found. Please enter a valid course code.");
      setSelectedCourse(null);
      setOtherPreReqInfo(""); // Clear the other pre-req info on error
      return;
    }

    const course = courses.find(c => c.Course_Code && c.Course_Code.toUpperCase() === trimmedCode);
    
    if (!course) {
      setError("Course not found or invalid Course_Code.");
      setSelectedCourse(null);
      setOtherPreReqInfo(""); // Clear the other pre-req info on error
      return;
    }

    const hierarchy = getHierarchy(course);
    setSelectedCourse(hierarchy);
    setError(""); // Clear any previous errors

    // Show Other Pre-req notification
    handleNotifications(course);
  };

  const handleSearchClick = () => {
    generateHierarchyData(inputValue.trim());
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white overflow-auto">
      {/* Top Left Logo */}
      <img 
        src="https://ih1.redbubble.net/image.3333071584.6429/st,small,507x507-pad,600x600,f8f8f8.jpg" 
        alt="Logo"
        className="absolute top-0 left-0 m-4 w-20 h-20 rounded-full" 
      />

      {/* Main Image */}
      <img src="https://i.imgur.com/IuI4ewf.png" border="0" className="mt-8"></img>

      {/* Search Input and Button */}
      <div className="relative mt-12 w-72">
        <input
          type="text"
          placeholder="Enter course code"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setError(""); // Clear error on new input
          }}
          className="w-full border-animated rounded-full pl-4 pr-12 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-[#333] tracking-wide relative z-10"
        />
        <button onClick={handleSearchClick} className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 z-10">
          <FaSearch />
        </button>
      </div>

      {/* Error Handling */}
      {error && <p className="text-red-500 mt-4">{error}</p>}

      {/* Other Pre-req Notification at the rightmost part of the screen */}
      {otherPreReqInfo && (
        <div className="other-prereq-notification mt-24">
          <strong>Other Pre-req:</strong> {otherPreReqInfo}
        </div>
      )}

      {/* Hierarchy Diagram */}
      {selectedCourse && (
        <div className="tree-container" style={{ width: '100%', height: '600px', marginTop: '20px', border: '1px solid #ccc', display: 'flex', justifyContent: 'center' }}>
          <Tree 
            data={selectedCourse} 
            orientation="vertical" 
            pathFunc="straight"   // Use straight paths for readability
            translate={{ x: 400, y: 50 }} 
            zoomable={false}       // Disable zooming
            separation={{ siblings: 1.5, nonSiblings: 2 }} // Add space between nodes
            collapsible={false}    // Disable node collapsing
          /> {/* Render hierarchy */}
        </div>
      )}

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
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .tree-container {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        /* Notification styling */
        .other-prereq-notification {
          position: absolute;
          top: 100px;  /* Adjust the top value as per the desired position */
          right: 20px; /* Rightmost part of the screen */
          background-color: black; /* Black background */
          color: #e8d031;  /* Yellow text */
          padding: 10px;
          border-radius: 8px;
          max-width: 300px;
          font-size: 16px;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
}
