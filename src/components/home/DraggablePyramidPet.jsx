import React, { useState, useEffect, useRef } from "react";
import "../../styles/common/pyramid-loader.css";
import "../../styles/home/draggable-pyramid-pet.css";

const GREETINGS = [
  "Hi! Pet triết học 📐",
  "Kéo tớ đi đâu thế? 🐾",
  "Biện chứng hay duy vật? 🧠",
  "Đang ôn Triết à? 📚",
  "Vũ trụ đang quay... 🌌",
  "Nhóm 4 xin chào! 👋",
  "Học bài thôi nào! ✨",
];

const DraggablePyramidPet = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [greeting, setGreeting] = useState(GREETINGS[0]);
  const dragRef = useRef(null);
  const offsetRef = useRef({ x: 0, y: 0 });

  // Initialize position to bottom right of viewport
  useEffect(() => {
    const handleResize = () => {
      // Keep it in bottom-right area initially, taking into account the larger 270px size
      const initialX = window.innerWidth - 300;
      const initialY = window.innerHeight - 320;
      setPosition({ x: initialX, y: initialY });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleStart = (clientX, clientY) => {
    setIsDragging(true);
    offsetRef.current = {
      x: clientX - position.x,
      y: clientY - position.y,
    };
  };

  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Only left click drag
    handleStart(e.clientX, e.clientY);
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  };

  // Change greeting on hover to keep it lively
  const handleMouseEnter = () => {
    const randomIdx = Math.floor(Math.random() * GREETINGS.length);
    setGreeting(GREETINGS[randomIdx]);
  };

  useEffect(() => {
    const handleMove = (clientX, clientY) => {
      if (!isDragging) return;

      let newX = clientX - offsetRef.current.x;
      let newY = clientY - offsetRef.current.y;

      // Keep inside bounds (taking into account 270px container size)
      const minX = 10;
      const minY = 10;
      const maxX = window.innerWidth - 290;
      const maxY = window.innerHeight - 290;

      newX = Math.max(minX, Math.min(newX, maxX));
      newY = Math.max(minY, Math.min(newY, maxY));

      setPosition({ x: newX, y: newY });
    };

    const handleMouseMove = (e) => {
      handleMove(e.clientX, e.clientY);
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleEnd);
      window.addEventListener("touchmove", handleTouchMove, { passive: false });
      window.addEventListener("touchend", handleEnd);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [isDragging, position]);

  return (
    <div
      ref={dragRef}
      className={`pyramid-pet-container ${isDragging ? "dragging" : ""}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        position: "fixed",
        zIndex: 999999,
        cursor: isDragging ? "grabbing" : "grab",
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onMouseEnter={handleMouseEnter}
    >
      <div className="pyramid-pet-bubble">
        <span>{greeting}</span>
      </div>
      <div className="pyramid-loader">
        <div className="pyramid-wrapper">
          <span className="side side1"></span>
          <span className="side side2"></span>
          <span className="side side3"></span>
          <span className="side side4"></span>
          <span className="shadow"></span>
        </div>
      </div>
    </div>
  );
};

export default DraggablePyramidPet;
