import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';

/**
 * @component EditorLink
 * @description A component that renders a navigational link to the editor dashboard (`/editor`).
 * The link is only displayed if the current user is identified as an editor.
 *
 * @remarks
 * This component checks for editor status by reading `is_editor` from the `userData`
 * object stored in `localStorage`. It initializes this check on mount and then listens for
 * `authChange` and `storage` events on the `window` object to re-evaluate editor status,
 * ensuring the link's visibility is updated if the user's authentication state or stored data changes.
 * If the user is not an editor, the component renders `null` (nothing).
 * It uses `next-i18next` for translating the link text, with a default fallback of 'Editor'.
 *
 * Called by:
 * - This component is designed to be used in navigational elements, such as a Navbar or Footer,
 *   where a conditional link to the editor section is required.
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
 * @returns {React.FC | null} The rendered Link component to the editor page if the user is an editor, otherwise `null`.
 */
const EditorLink = () => {
  const { t } = useTranslation('common');
  const [isEditor, setIsEditor] = useState(false);

  useEffect(() => {
    // Check if user is editor from localStorage
    const checkEditor = () => {
      try {
        const userData = localStorage.getItem('userData');
        if (userData) {
          const parsedData = JSON.parse(userData);
          setIsEditor(!!parsedData.is_editor);
        }
      } catch (error) {
        console.error('Error checking editor status:', error);
        setIsEditor(false);
      }
    };

    checkEditor();

    // Listen for auth changes
    const handleAuthChange = () => {
      checkEditor();
    };

    window.addEventListener('authChange', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);

    return () => {
      window.removeEventListener('authChange', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  if (!isEditor) {
    return null;
  }

  return (
    <Link
      href="/editor"
      className="text-gray-700 dark:text-gray-300 hover:text-[#2d6a4f] dark:hover:text-[#4fd1c5]"
    >
      {t('editor.title', 'Editor')}
    </Link>
  );
};

export default EditorLink; 