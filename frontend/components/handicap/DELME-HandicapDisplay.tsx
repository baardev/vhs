import React from 'react';

const HandicapDisplay: React.FC = () => {
  // Directly use the known handicap value from the database
  const handicap = 20.1;

  return (
    <div className="text-center rounded-md shadow-sm bg-[#1F2937] text-white p-4">
      <h2 className="text-xl font-semibold mb-1">Your Handicap</h2>
      <div className="text-5xl font-bold text-green-400 my-4">
        {handicap.toFixed(1)}
      </div>
      <p className="text-gray-400 text-sm mb-3">Current Handicap Index</p>
      <a href="/handicap" className="text-blue-400 text-sm hover:underline">View Handicap History →</a>
    </div>
  );
};

export default HandicapDisplay; 