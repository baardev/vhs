import { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';

export default function TestStorage() {
  const { } = useTranslation('common');
  const [storageAvailable, setStorageAvailable] = useState<boolean>(false);
  const [testValue, setTestValue] = useState<string>('');
  const [userData, setUserData] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Check if localStorage is available
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      setStorageAvailable(true);

      // Try to read existing userData
      const existingUserData = localStorage.getItem('userData');
      if (existingUserData) {
        setUserData(existingUserData);
      }
    } catch (e) {
      setStorageAvailable(false);
      setError(`localStorage error: ${e instanceof Error ? e.message : String(e)}`);
    }
  }, []);

  const handleSetValue = () => {
    try {
      localStorage.setItem('testValue', 'This is a test value: ' + new Date().toISOString());
      setTestValue(localStorage.getItem('testValue') || '');
    } catch (e) {
      setError(`Error setting value: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  const handleSetAdminData = () => {
    try {
      const adminUser = {
        id: 1,
        username: 'admin',
        email: 'admin@example.com',
        is_admin: true
      };
      localStorage.setItem('userData', JSON.stringify(adminUser));
      localStorage.setItem('token', 'test-token-' + new Date().getTime());
      setUserData(JSON.stringify(adminUser));
    } catch (e) {
      setError(`Error setting admin data: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  const handleClearStorage = () => {
    try {
      localStorage.clear();
      setTestValue('');
      setUserData('');
    } catch (e) {
      setError(`Error clearing storage: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6">LocalStorage Test</h1>

        <div className="mb-6 p-4 bg-gray-100 rounded">
          <p className="font-semibold">Storage Available: {storageAvailable ? '✅ Yes' : '❌ No'}</p>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>

        <div className="space-y-4 mb-6">
          <button
            onClick={handleSetValue}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Set Test Value
          </button>

          <button
            onClick={handleSetAdminData}
            className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Set Admin User Data
          </button>

          <button
            onClick={handleClearStorage}
            className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Clear Storage
          </button>
        </div>

        {testValue && (
          <div className="mb-4 p-4 bg-blue-50 rounded">
            <h2 className="font-semibold mb-2">Test Value:</h2>
            <p className="break-all">{testValue}</p>
          </div>
        )}

        {userData && (
          <div className="p-4 bg-green-50 rounded">
            <h2 className="font-semibold mb-2">User Data:</h2>
            <pre className="whitespace-pre-wrap break-all text-sm">{userData}</pre>
          </div>
        )}

        <div className="mt-6">
          <Link href="/admin" className="text-blue-500 hover:underline">
            Try Admin Page
          </Link>
        </div>
      </div>
    </div>
  );
}

// This function gets called at build time
export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  };
};