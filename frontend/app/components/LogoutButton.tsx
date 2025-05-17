'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';

/**
 * @interface LogoutButtonProps
 * @description Defines the props for the LogoutButton component.
 * @property {'primary' | 'secondary' | 'text'} [variant='primary'] - The visual style of the button.
 * @property {string} [className=''] - Additional CSS classes to apply to the button.
 * @property {object} dict - The dictionary object for translations.
 */
interface LogoutButtonProps {
  variant?: 'primary' | 'secondary' | 'text';
  className?: string;
  dict: {
    logout?: {
        loggingOut?: string;
        signOut?: string;
    };
  };
}

/**
 * @component LogoutButton
 * @description Renders a button that, when clicked, logs the user out of the application.
 *
 * @remarks
 * - Manages an `isLoggingOut` state to provide visual feedback and disable the button during the logout process.
 * - `handleLogout` function:
 *   - Retrieves the authentication token from `localStorage`.
 *   - Sends a POST request to the `/api/auth/logout` endpoint with the token in the Authorization header.
 *   - Clears `token` and `userData` from `localStorage`.
 *   - Dispatches an `authChange` event on the `window` object to notify other parts of the application about the authentication state change.
 *   - Redirects the user to the `/login` page using `next/navigation`, including the current language.
 *   - In case of an error during the API call, it still clears local storage and redirects to ensure the user is logged out client-side.
 * - Supports different visual variants ('primary', 'secondary', 'text') which determine its styling.
 * - Receives translations via a `dict` prop.
 *
 * Called by:
 * - `frontend/app/components/Navbar.tsx` (in both desktop and mobile views)
 * - `frontend/app/[lang]/profile/page.tsx` (in the profile header)
 *
 * Calls:
 * - React Hooks: `useState`
 * - `next/navigation`: `useRouter`, `useParams` hooks (for navigation and language)
 * - `axios.post` (to call the logout API endpoint)
 * - `localStorage.getItem`, `localStorage.removeItem` (for token and user data management)
 * - `window.dispatchEvent` (to signal authentication state change)
 *
 * @param {LogoutButtonProps} props - The props for the component.
 * @returns {React.FC<LogoutButtonProps>} The rendered logout button.
 */
const LogoutButton: React.FC<LogoutButtonProps> = ({
  variant = 'primary',
  className = '',
  dict,
}) => {
  const router = useRouter();
  const params = useParams() || {};
  const lang = (params.lang as string) || 'en';
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/auth/logout', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      window.dispatchEvent(new Event('authChange'));
      router.push(`/${lang}/login`);
      setIsLoggingOut(false);
    }
  };

  let buttonClasses = '';
  if (variant === 'primary') {
    buttonClasses = 'px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md';
  } else if (variant === 'secondary') {
    buttonClasses = 'px-4 py-2 border border-red-600 text-red-600 hover:bg-red-50 rounded-md';
  } else {
    buttonClasses = 'text-red-600 hover:text-red-700';
  }

  const loggingOutText = dict?.logout?.loggingOut || 'Logging Out...';
  const signOutText = dict?.logout?.signOut || 'Sign Out';

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={`${buttonClasses} font-medium transition-colors ${className}`}
    >
      {isLoggingOut ? loggingOutText : signOutText}
    </button>
  );
};

export default LogoutButton; 