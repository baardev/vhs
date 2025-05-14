import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useTranslation } from 'next-i18next';

/**
 * @interface LogoutButtonProps
 * @description Defines the props for the LogoutButton component.
 * @property {'primary' | 'secondary' | 'text'} [variant='primary'] - The visual style of the button.
 * @property {string} [className=''] - Additional CSS classes to apply to the button.
 */
interface LogoutButtonProps {
  variant?: 'primary' | 'secondary' | 'text';
  className?: string;
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
 *   - Redirects the user to the `/login` page using `next/router`.
 *   - In case of an error during the API call, it still clears local storage and redirects to ensure the user is logged out client-side.
 * - Supports different visual variants ('primary', 'secondary', 'text') which determine its styling.
 * - Uses `next-i18next` for internationalizing the button text (e.g., "Sign Out", "Logging Out...").
 *
 * Called by:
 * - `frontend/components/common/Navbar.tsx` (in both desktop and mobile views)
 * - `frontend/pages/profile.tsx`
 *
 * Calls:
 * - React Hooks: `useState`
 * - `next/router`: `useRouter` hook (for navigation)
 * - `axios.post` (to call the logout API endpoint)
 * - `next-i18next`: `useTranslation` hook (for internationalization)
 * - `localStorage.getItem`, `localStorage.removeItem` (for token and user data management)
 * - `window.dispatchEvent` (to signal authentication state change)
 *
 * @param {LogoutButtonProps} props - The props for the component.
 * @returns {React.FC<LogoutButtonProps>} The rendered logout button.
 */
const LogoutButton: React.FC<LogoutButtonProps> = ({
  variant = 'primary',
  className = ''
}) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');

      // Make logout request to the backend
      await axios.post('/api/auth/logout', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('userData');

      // Dispatch auth change event to notify other components
      window.dispatchEvent(new Event('authChange'));

      // Redirect to login page
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);

      // Even if the API call fails, clear the local storage and redirect
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      router.push('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Different styles based on variant
  let buttonClasses = '';

  if (variant === 'primary') {
    buttonClasses = 'px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md';
  } else if (variant === 'secondary') {
    buttonClasses = 'px-4 py-2 border border-red-600 text-red-600 hover:bg-red-50 rounded-md';
  } else {
    buttonClasses = 'text-red-600 hover:text-red-700';
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={`${buttonClasses} font-medium transition-colors ${className}`}
    >
      {isLoggingOut ? t('logout.loggingOut', 'Logging Out...') : t('logout.signOut', 'Sign Out')}
    </button>
  );
};

export default LogoutButton;