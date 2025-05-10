import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useTranslation } from 'next-i18next';

interface LogoutButtonProps {
  variant?: 'primary' | 'secondary' | 'text';
  className?: string;
}

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