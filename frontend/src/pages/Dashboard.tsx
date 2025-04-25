import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [profileData, setProfileData] = useState<any>(null);

  useEffect(() => {
    async function fetchProfileData() {
      try {
        const response = await fetch('/api/user/profile');
        if (response.ok) {
          const data = await response.json();
          setProfileData(data);
        }
      } catch (err) {
        console.error('Error fetching profile data:', err);
      }
    }
    fetchProfileData();
  }, []);

  if (!user) {
    return <p>Please log in to see your dashboard.</p>;
  }

  return (
    <div>
      <h1>Welcome back {user.username}</h1>
      {profileData ? (
        <div>
          <p>Handicap: {profileData.handicap}</p>
          <p>Player Cards: {profileData.playerCardsCount}</p>
        </div>
      ) : (
        <p>Loading your profile...</p>
      )}
    </div>
  );
};

export default Dashboard; 