import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';

const AdminLink = () => {
  const { t } = useTranslation('common');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if user is admin from localStorage
    const checkAdmin = () => {
      try {
        const userData = localStorage.getItem('userData');
        if (userData) {
          const parsedData = JSON.parse(userData);
          setIsAdmin(!!parsedData.is_admin);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      }
    };

    checkAdmin();

    // Listen for auth changes
    const handleAuthChange = () => {
      checkAdmin();
    };

    window.addEventListener('authChange', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);

    return () => {
      window.removeEventListener('authChange', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  if (!isAdmin) {
    return null;
  }

  return (
    <Link
      href="/admin"
      className="text-gray-700 dark:text-gray-300 hover:text-[#2d6a4f] dark:hover:text-[#4fd1c5]"
    >
      {t('admin.title')}
    </Link>
  );
};

export default AdminLink;