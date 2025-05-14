import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';

/**
 * @component AdminLink
 * @description A component that renders a navigational link to the admin dashboard (`/admin`).
 * The link is only displayed if the current user is identified as an administrator.
 *
 * @remarks
 * This component checks for administrator status by reading `is_admin` from the `userData`
 * object stored in `localStorage`. It initializes this check on mount and then listens for
 * `authChange` and `storage` events on the `window` object to re-evaluate admin status,
 * ensuring the link's visibility is updated if the user's authentication state or stored data changes.
 * If the user is not an admin, the component renders `null` (nothing).
 * It uses `next-i18next` for translating the link text.
 *
 * Called by:
 * - This component is designed to be used in navigational elements, such as a Navbar or Footer,
 *   where a conditional link to the admin section is required.
 *   (Currently, similar logic is duplicated in `frontend/components/common/Navbar.tsx` rather than using this component directly.)
 *
 * Calls:
 * - React Hooks: `useState`, `useEffect`
 * - `next/link`'s `Link` component (for client-side navigation)
 * - `next-i18next`'s `useTranslation` hook (for internationalization)
 * - `localStorage.getItem` (to retrieve `userData`)
 * - `JSON.parse` (to parse `userData`)
 * - `window.addEventListener` (to listen for `authChange` and `storage` events)
 * - `window.removeEventListener` (to clean up event listeners on unmount)
 *
 * @returns {React.FC | null} The rendered Link component to the admin page if the user is an admin, otherwise `null`.
 */
const AdminLink = () => {
  const { t, ready, i18n } = useTranslation('common');
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