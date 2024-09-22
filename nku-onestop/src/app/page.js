"use client";

import { useState, useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import { jsPlumb } from "jsplumb";
import coursesData from './data/courses_sample.json';

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [courses] = useState(coursesData);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const containerRef = useRef(null);

  const handleInputChange = (e) => {
    setInputValue(e.target.value.toUpperCase());
  };

  const generateFlowchartData = (courseCode) => {
    const course = courses.find((c) => c.Course_Code && c.Course_Code.toUpperCase() === courseCode);
    setSelectedCourse(course ? course : null);
  };

  const handleSearchClick = () => {
    generateFlowchartData(inputValue.trim());
  };

  useEffect(() => {
    if (selectedCourse && containerRef.current) {
      const instance = jsPlumb.getInstance({
        Container: containerRef.current,
        PaintStyle: { strokeWidth: 2, stroke: '#007bff' },
        Connector: ["Bezier", { curviness: 30 }],
        Endpoint: ["Dot", { radius: 5 }],
        EndpointStyle: { fill: '#007bff' },
        Anchor: ['Left', 'Right'],
        Overlays: [["Arrow", { width: 10, length: 10, location: 1 }]]
      });

      instance.reset(); // Clear previous instances
      containerRef.current.innerHTML = ""; // Clear previous nodes

      // Create and position nodes
      const nodes = {};
      nodes['course'] = createNode(instance, 'course', `${selectedCourse.Course_Code}: ${selectedCourse.Course_Title}`, 300, 50);
      
      selectedCourse.Prerequisites.forEach((prereq, index) => {
        const x = 150 + index * (300 / selectedCourse.Prerequisites.length);
        nodes[`prereq-${index}`] = createNode(instance, `prereq-${index}`, prereq, x, 200);
        instance.connect({ source: 'course', target: `prereq-${index}` });
      });
    }
  }, [selectedCourse]);

  function createNode(instance, id, label, x, y) {
    const node = document.createElement("div");
    node.id = id;
    node.className = "flowchart-node";
    node.innerHTML = `<div class="node-label">${label}</div>`;
    node.style.left = `${x}px`;
    node.style.top = `${y}px`;
    containerRef.current.appendChild(node);
    instance.draggable(node);
    return node;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <img src="https://ih1.redbubble.net/image.3333071584.6429/st,small,507x507-pad,600x600,f8f8f8.jpg" alt="Centered Image"
        style={{ width: "300px", height: "300px" }} className="rounded-2xl" />

      <div className="relative mt-12 w-72">
        <input type="text" placeholder="Enter course code" value={inputValue} onChange={handleInputChange}
          className="w-full border rounded-full pl-4 pr-12 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-[#333] tracking-wide" />
        <button onClick={handleSearchClick}
          className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700">
          <FaSearch />
        </button>
      </div>

      <div ref={containerRef} className="flowchart-container" style={{
        width: '800px', height: '300px', position: 'relative', marginTop: '20px', border: '1px solid #ccc', overflow: 'auto'
      }}></div>
    </div>
  );
}
