'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { getCommonDictionary } from '../../dictionaries';

/**
 * @interface User
 * @description Defines the structure for a user object passed to the modal.
 * @property {number} id - The unique identifier of the user.
 * @property {string} username - The username of the user.
 * @property {string} email - The email address of the user.
 */
interface User {
  id: number;
  username: string;
  email: string;
}

/**
 * @interface UserDeleteModalProps
 * @description Defines the props for the UserDeleteModal component.
 * @property {User} user - The user object to be deleted.
 * @property {() => void} onClose - Callback function to close the modal.
 * @property {() => void} onDelete - Callback function executed after successful deletion.
 * @property {string} locale - The current locale/language.
 */
interface UserDeleteModalProps {
  user: User;
  onClose: () => void;
  onDelete: () => void;
  locale: string;
}

/**
 * @component UserDeleteModal
 * @description Administrative modal component for user account deletion in the Open Handicap System.
 * 
 * This component provides a confirmation dialog for admins to safely delete user accounts with:
 * - Clear identification of the user being deleted (username display)
 * - Explicit warning about the permanent nature of the action
 * - Error handling for failed deletion attempts
 * - Loading state management during the API request
 * - Internationalization support through dictionary loading
 * - Accessible UI with proper focus management
 * 
 * The modal implements a two-step confirmation process (open modal + confirm button)
 * to prevent accidental deletions, and provides clear feedback throughout the
 * deletion workflow.
 * 
 * @calledBy
 * - UserManagementPage (admin dashboard)
 * - UserListComponent (admin user table)
 * - UserActionsMenu (dropdown or action buttons for each user)
 * - UserDetailView (when viewing individual user details)
 * 
 * @calls
 * - API: DELETE /api/admin/users/{id} (to perform the actual user deletion)
 * - localStorage.getItem() (to retrieve authentication token)
 * - Props callback: onClose() (when canceling or after completion)
 * - Props callback: onDelete() (after successful deletion)
 * 
 * @requires
 * - Authentication token in localStorage
 * - Administrative privileges
 * - Valid User object with id, username, and email
 * - Proper API endpoint for user deletion
 * - Parent component to handle the onDelete callback
 */
const UserDeleteModal: React.FC<UserDeleteModalProps> = ({ user, onClose, onDelete, locale }) => {
  const [dictionary, setDictionary] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const params = useParams() || {};
  const lang = (params.lang as string) || locale || 'en';

  useEffect(() => {
    const loadDictionary = async () => {
      try {
        const loadedDictionary = await getCommonDictionary(lang);
        setDictionary(loadedDictionary);
      } catch (error) {
        console.error('Error loading dictionary in UserDeleteModal:', error);
        setDictionary({
          admin: {
            confirmDelete: 'Confirm Delete',
            deleteConfirmation: 'Are you sure you want to delete the user {{username}}?',
            deleteWarning: 'This action cannot be undone. All user data will be permanently deleted.',
            cancel: 'Cancel',
            delete: 'Delete',
            deleting: 'Deleting...',
            errorDeletingUser: 'Error deleting user'
          },
          common: {
            loading: 'Loading...'
          }
        });
      }
    };

    loadDictionary();
  }, [lang]);

  const handleDelete = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      await axios.delete(`/api/admin/users/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      onDelete();
    } catch (error) {
      console.error('Error deleting user:', error);
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.error || dictionary?.admin?.errorDeletingUser || 'Error deleting user');
      } else {
        setError(dictionary?.admin?.errorDeletingUser || 'Error deleting user');
      }
      setLoading(false);
    }
  };

  if (!dictionary) {
    return <div>Loading...</div>;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {dictionary.admin?.confirmDelete || 'Confirm Delete'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            &times;
          </button>
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-800 rounded">
            {error}
          </div>
        )}

        <p className="mb-4 text-sm text-gray-700 dark:text-gray-300">
          {dictionary.admin?.deleteConfirmation || `Are you sure you want to delete the user "${user.username}"?`}
        </p>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          {dictionary.admin?.deleteWarning || 'This action cannot be undone.'}
        </p>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {dictionary.admin?.cancel || 'Cancel'}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className={`px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white ${
              loading
                ? 'bg-red-400 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
            }`}
          >
            {loading ? (dictionary.admin?.deleting || 'Deleting...') : (dictionary.admin?.delete || 'Delete')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDeleteModal; 