import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';

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