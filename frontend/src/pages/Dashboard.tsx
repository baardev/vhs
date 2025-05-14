import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';

/**
 * @page Dashboard
 * @description A Next.js page component that serves as the user's personalized dashboard.
 * It displays a welcome message and user-specific information like handicap and player card count.
 * If the user is not logged in, it prompts them to log in.
 *
 * @remarks
 * - **Authentication**: Uses `AuthContext` to get the current user's information.
 * - **Data Fetching**: Fetches profile data (handicap, player card count) from the `/api/user/profile` endpoint using `useEffect` and `fetch`.
 * - **State Management**: Uses `useState` to store `profileData`.
 * - **Conditional Rendering**: Shows a login prompt if no user is authenticated, a loading message while profile data is being fetched, and the dashboard content once data is available.
 *
 * Called by:
 * - Next.js routing system when a user navigates to the dashboard route (e.g., `/dashboard`).
 *
 * Calls:
 * - React Hooks: `useContext` (with `AuthContext`), `useEffect`, `useState`.
 * - `fetch` API (to GET `/api/user/profile`).
 * - `AuthContext` (imported from `../contexts/AuthContext`).
 *
 * @returns {JSX.Element} The rendered dashboard page or a login prompt.
 */
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