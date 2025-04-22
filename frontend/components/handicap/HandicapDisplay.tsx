import React, { useEffect, useState } from 'react';

const HandicapDisplay: React.FC = () => {
  const [avgDifferential, setAvgDifferential] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/handicap')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch handicap');
        }
        return response.json();
      })
      .then((data) => {
        setAvgDifferential(data.avg_differential);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Something went wrong');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading handicap...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm">
      <h2 className="text-xl font-semibold mb-2">User Gold Handicap</h2>
      <div className="text-2xl">
        {avgDifferential !== null ? avgDifferential.toFixed(2) : 'N/A'}
      </div>
    </div>
  );
};

export default HandicapDisplay; 