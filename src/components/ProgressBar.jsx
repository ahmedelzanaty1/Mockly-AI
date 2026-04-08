import React from "react";

const ProgressBar = ({ current, total }) => {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full mb-4">
      <div className="flex justify-between text-sm text-gray-400 mb-1">
        <span>Interview Progress</span>
        <span>{current}/{total}</span>
      </div>

      <div className="w-full bg-gray-800 rounded-full h-2">
        <div
          className="bg-green-400 h-2 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;