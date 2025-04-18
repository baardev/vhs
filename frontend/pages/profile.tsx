import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import { Geist, Geist_Mono } from "next/font/google";
import LogoutButton from '../components/LogoutButton';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

interface User {
  id: number;
  username: string;
  email: string;
  created_at?: string;
  name?: string;
  family_name?: string;
  matricula?: string;
  handicap?: number;
}

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [matricula, setMatricula] = useState('');
  const [handicap, setHandicap] = useState<string>('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProfile = useCallback(async (token: string) => {
    try {
      const response = await axios.get('/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUser(response.data);
      setUsername(response.data.username);
      setEmail(response.data.email);
      setName(response.data.name || '');
      setFamilyName(response.data.family_name || '');
      setMatricula(response.data.matricula || '');
      setHandicap(response.data.handicap !== null && response.data.handicap !== undefined ? response.data.handicap.toString() : '');
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching profile:', err);
      localStorage.removeItem('token');
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchUserProfile(token);
  }, [router, fetchUserProfile]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const handicapValue = handicap.trim() !== '' ? parseFloat(handicap) : null;

      const response = await axios.put(
        '/api/auth/profile',
        {
          username,
          email,
          name: name || null,
          family_name: familyName || null,
          matricula: matricula || null,
          handicap: handicapValue
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUser(response.data);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.error ||
          error.response?.data?.errors?.[0]?.msg ||
          'Failed to update profile.'
        );
      } else {
        setError('Failed to update profile.');
      }
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      await axios.delete('/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });

      localStorage.removeItem('token');
      router.push('/login');
    } catch (error: unknown) {
      console.error('Error deleting account:', error);
      setError('Failed to delete account.');
    }
  };

  if (isLoading) {
    return (
      <div className={`${geistSans.className} ${geistMono.className} min-h-screen flex items-center justify-center bg-[#fafafa] dark:bg-[#111]`}>
        <div className="text-xl font-medium">Loading...</div>
      </div>
    );
  }

  return (
    <div className={`${geistSans.className} ${geistMono.className} min-h-screen bg-[#fafafa] dark:bg-[#111] py-12 px-4 sm:px-6 lg:px-8 relative`}>
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-[#1a1a1a] overflow-hidden shadow rounded-lg">
          <div className="border-b border-gray-200 dark:border-gray-800 px-4 py-5 sm:px-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Your Profile</h1>
              <LogoutButton variant="secondary" className="text-sm" />
            </div>
          </div>

          {error && (
            <div className="px-4 py-5 sm:px-6">
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="px-4 py-5 sm:px-6">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                <p className="text-sm text-green-800 dark:text-green-400">{success}</p>
              </div>
            </div>
          )}

          <div className="px-4 py-5 sm:p-6">
            {isEditing ? (
              <form onSubmit={handleUpdate}>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Username
                    </label>
                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="mt-1 block w-full px-3 py-2 bg-white dark:bg-[#111] border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="mt-1 block w-full px-3 py-2 bg-white dark:bg-[#111] border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 bg-white dark:bg-[#111] border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="familyName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Family Name
                    </label>
                    <input
                      id="familyName"
                      type="text"
                      value={familyName}
                      onChange={(e) => setFamilyName(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 bg-white dark:bg-[#111] border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="matricula" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Matricula
                    </label>
                    <input
                      id="matricula"
                      type="text"
                      value={matricula}
                      onChange={(e) => setMatricula(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 bg-white dark:bg-[#111] border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="handicap" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Handicap
                    </label>
                    <input
                      id="handicap"
                      type="number"
                      step="0.1"
                      value={handicap}
                      onChange={(e) => setHandicap(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 bg-white dark:bg-[#111] border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setUsername(user?.username || '');
                        setEmail(user?.email || '');
                        setName(user?.name || '');
                        setFamilyName(user?.family_name || '');
                        setMatricula(user?.matricula || '');
                        setHandicap(user?.handicap !== undefined && user?.handicap !== null ? user.handicap.toString() : '');
                      }}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Username
                  </h3>
                  <p className="mt-1 text-lg text-gray-900 dark:text-white">{user?.username}</p>
                </div>

                <div>
                  <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Email
                  </h3>
                  <p className="mt-1 text-lg text-gray-900 dark:text-white">{user?.email}</p>
                </div>

                <div>
                  <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Name
                  </h3>
                  <p className="mt-1 text-lg text-gray-900 dark:text-white">{user?.name || '—'}</p>
                </div>

                <div>
                  <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Family Name
                  </h3>
                  <p className="mt-1 text-lg text-gray-900 dark:text-white">{user?.family_name || '—'}</p>
                </div>

                <div>
                  <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Matricula
                  </h3>
                  <p className="mt-1 text-lg text-gray-900 dark:text-white">{user?.matricula || '—'}</p>
                </div>

                <div>
                  <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Handicap
                  </h3>
                  <p className="mt-1 text-lg text-gray-900 dark:text-white">{user?.handicap !== undefined && user?.handicap !== null ? user.handicap.toString() : '—'}</p>
                </div>

                {user?.created_at && (
                  <div>
                    <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Member Since
                    </h3>
                    <p className="mt-1 text-lg text-gray-900 dark:text-white">
                      {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                )}

                <div className="pt-4">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="px-4 py-5 sm:px-6 border-t border-gray-200 dark:border-gray-800">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Account Actions
              </h3>
              <button
                onClick={handleDeleteAccount}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-full text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/20 hover:bg-red-50 dark:hover:bg-red-900/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}