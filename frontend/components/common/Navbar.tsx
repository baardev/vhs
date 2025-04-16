import Link from 'next/link';
import { useTranslation } from 'next-i18next';
// import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import LogoutButton from '../LogoutButton';

const Navbar = () => {
  const { t } = useTranslation('common');
//   const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    // Update login state when storage changes
    const handleStorageChange = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };

    window.addEventListener('storage', handleStorageChange);

    // Custom event for logout from other components
    const handleAuthChange = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };

    window.addEventListener('authChange', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  return (
    <nav className="w-full bg-white dark:bg-gray-900 shadow-sm py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center text-[#2d6a4f] dark:text-[#4fd1c5]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <path d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.802-.48-.743-.95l.337-2.698a.99.99 0 0 0-.278-.83l-1.566-1.566a.997.997 0 0 1 0-1.414L18.285 6.3a.997.997 0 0 1 1.414 0l.707.707a.997.997 0 0 1 .289.707l-1.046 2.175"></path>
                <path d="M11.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.802-.48-.743-.95l.337-2.698a.99.99 0 0 0-.278-.83l-1.566-1.566a.997.997 0 0 1 0-1.414L10.285 6.3a.997.997 0 0 1 1.414 0l.707.707a.997.997 0 0 1 .289.707l-1.046 2.175"></path>
                <circle cx="3.5" cy="12" r="2.5"></circle>
              </svg>
              <span className="text-xl font-bold">VHS</span>
            </Link>
          </div>

          <div className="flex space-x-6">
            <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-[#2d6a4f] dark:hover:text-[#4fd1c5]">
              {t('home')}
            </Link>
            <Link href="/courses" className="text-gray-700 dark:text-gray-300 hover:text-[#2d6a4f] dark:hover:text-[#4fd1c5]">
              {t('courses')}
            </Link>
            {isLoggedIn ? (
              <>
                <Link href="/profile" className="text-gray-700 dark:text-gray-300 hover:text-[#2d6a4f] dark:hover:text-[#4fd1c5]">
                  {t('profile.yourProfile')}
                </Link>
                <LogoutButton
                  variant="text"
                  className="text-gray-700 dark:text-gray-300 hover:text-[#2d6a4f] dark:hover:text-[#4fd1c5]"
                />
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-700 dark:text-gray-300 hover:text-[#2d6a4f] dark:hover:text-[#4fd1c5]">
                  {t('signIn')}
                </Link>
                <Link href="/register" className="text-gray-700 dark:text-gray-300 hover:text-[#2d6a4f] dark:hover:text-[#4fd1c5]">
                  {t('createAccount')}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;