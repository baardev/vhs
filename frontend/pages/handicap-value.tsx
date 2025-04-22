import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';

const HandicapValuePage: NextPage = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHandicap = async () => {
      try {
        const response = await fetch('/api/handicap-calc');
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        console.error('Error fetching handicap data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHandicap();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  
  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Handicap API Result</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      
      {data?.avg_differential !== null && (
        <div style={{ marginTop: '20px' }}>
          <p>Average Differential: {data.avg_differential}</p>
          <p>Handicap Index: {Math.round(data.avg_differential * 0.96 * 10) / 10}</p>
        </div>
      )}
    </div>
  );
};

export default HandicapValuePage; 