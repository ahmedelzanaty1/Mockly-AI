import React from "react";

const VoiceWave = ({ isActive }) => {
  return (
    <div className="flex items-center gap-1 h-10">
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className={`w-1 bg-green-400 rounded-full transition-all duration-200 ${
            isActive ? "animate-wave" : "h-2"
          }`}
          style={{
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  );
};

export default VoiceWave;