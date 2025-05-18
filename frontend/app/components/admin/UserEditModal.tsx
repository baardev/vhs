'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { getCommonDictionary } from '../../dictionaries';

interface User {
  id: number;
  username: string;
  email: string;
  is_admin: boolean;
  is_editor: boolean;
  first_name?: string;
  name?: string;
  family_name?: string;
  matricula?: string;
  handicap?: number;
  gender?: string;
  /**
   * ISO‑8601 date string, e.g. "1990-05-14T00:00:00.000Z". Only the date
   * portion is relevant when editing, so we trim the time part below.
   */
  birthday?: string;
  [key: string]: string | number | boolean | undefined;
}

/**
 * @interface UserEditModalProps
 * @description Defines the props for the UserEditModal component.
 * @property {User} user - The user object to be edited.
 * @property {() => void} onClose - Callback function to close the modal.
 * @property {() => void} onSave - Callback function executed after successful user update.
 * @property {string} locale - The current locale/language.
 */
interface UserEditModalProps {
  user: User;
  onClose: () => void;
  onSave: () => void;
  locale: string;
}

/**
 * @component UserEditModal
 * @description Administrative modal component for editing user accounts in the Open Handicap System.
 * 
 * This component provides a comprehensive form interface for administrators to modify user accounts with:
 * - Core user data fields (username, email, password)
 * - Personal information (name, family name, birthday, gender)
 * - Golf-specific details (handicap, matricula)
 * - Permission management (admin and editor roles)
 * - Form validation and error handling
 * - Loading state management during API requests
 * - Internationalization support through dictionary loading
 * 
 * The modal maintains the current state of all form fields, transforms data appropriately for API submission
 * (e.g., converting string handicap values to numbers), and provides clear feedback throughout the
 * editing workflow. It also handles partial updates, only sending modified fields to the API.
 * 
 * @calledBy
 * - UserManagementPage (admin dashboard)
 * - UserListComponent (admin user table)
 * - UserActionsMenu (dropdown or action buttons for each user)
 * - UserDetailView (when viewing individual user details)
 * 
 * @calls
 * - API: PUT /api/admin/users/{id} (to update user data)
 * - localStorage.getItem() (to retrieve authentication token)
 * - Props callback: onClose() (when canceling or after completion)
 * - Props callback: onSave() (after successful update)
 * 
 * @requires
 * - Authentication token in localStorage
 * - Administrative privileges
 * - Valid User object with all required properties
 * - Proper API endpoint for user updates
 * - Parent component to handle the onSave callback
 */
const UserEditModal: React.FC<UserEditModalProps> = ({ user, onClose, onSave, locale }) => {
  const [dictionary, setDictionary] = useState<any>(null);
  const [formData, setFormData] = useState({
    username: user.username,
    email: user.email,
    password: '',
    name: user.first_name || user.name || '',
    family_name: user.family_name || '',
    matricula: user.matricula || '',
    handicap: user.handicap !== undefined && user.handicap !== null ? user.handicap.toString() : '',
    gender: user.gender || '',
    birthday: user.birthday ? user.birthday.split('T')[0] : '',
    is_admin: user.is_admin,
    is_editor: user.is_editor
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | { message: string } | unknown>('');

  const params = useParams() || {};
  const lang = (params.lang as string) || locale || 'en';

  useEffect(() => {
    const loadDictionary = async () => {
      try {
        const loadedDictionary = await getCommonDictionary(lang);
        setDictionary(loadedDictionary);
      } catch (error) {
        console.error('Error loading dictionary in UserEditModal:', error);
        setDictionary({
          admin: {
            editUser: 'Edit User',
            username: 'Username',
            email: 'Email',
            password: 'Password',
            leaveBlank: 'leave blank to keep current',
            name: 'First Name',
            familyName: 'Last Name',
            matricula: 'Matricula',
            handicap: 'Handicap',
            isAdmin: 'Administrator',
            isEditor: 'Editor',
            cancel: 'Cancel',
            save: 'Save',
            saving: 'Saving...',
            errorUpdatingUser: 'Error updating user',
            gender: 'Gender',
            birthday: 'Birthday',
            selectGender: '-- Select Gender --'
          },
          common: {
            loading: 'Loading...'
          }
        });
      }
    };

    loadDictionary();
  }, [lang]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData({ ...formData, [name]: checkbox.checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Prepare data for API, omitting empty fields
    const dataToSend: Record<string, string | number | boolean> = {};
    Object.entries(formData).forEach(([key, value]) => {
      // Only include password if it's not empty
      if (key === 'password' && !value) {
        return;
      }

      // Convert handicap to number if present
      if (key === 'handicap' && value) {
        dataToSend[key] = parseFloat(value as string);
        return;
      }

      // Include other non-empty values
      if (value !== undefined && value !== null && value !== '') {
        dataToSend[key] = value;
      }
    });

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      await axios.put(`/api/admin/users/${user.id}`, dataToSend, {
        headers: { Authorization: `Bearer ${token}` }
      });

      onSave();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? error.message
        : 'Unknown error';
      console.error('Error updating user:', errorMessage);
      if (axios.isAxiosError(error)) {
        type ErrorResponse = { error: string };
        setError((error.response?.data as ErrorResponse)?.error || dictionary?.admin?.errorUpdatingUser || 'Error updating user');
      } else {
        setError(dictionary?.admin?.errorUpdatingUser || 'Error updating user');
      }
      setLoading(false);
    }
  };

  if (!dictionary) {
    return <div>{dictionary?.common?.loading || 'Loading...'}</div>;
  }

  const hasError = error !== null && error !== undefined && error !== '';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-screen overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {dictionary.admin?.editUser || 'Edit User'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              &times;
            </button>
          </div>

          {hasError && (
            <div className="mb-4 p-2 bg-red-100 text-red-800 rounded">
              {error instanceof Error ? error.message : String(error)}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {dictionary.admin?.username || 'Username'}
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {dictionary.admin?.email || 'Email'}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {dictionary.admin?.password || 'Password'} <span className="text-xs text-gray-500">({dictionary.admin?.leaveBlank || 'leave blank to keep current'})</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {dictionary.admin?.name || 'First Name'}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {dictionary.admin?.familyName || 'Last Name'}
                </label>
                <input
                  type="text"
                  name="family_name"
                  value={formData.family_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {dictionary.admin?.matricula || 'Matricula'}
                </label>
                <input
                  type="text"
                  name="matricula"
                  value={formData.matricula}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {dictionary.admin?.handicap || 'Handicap'}
                </label>
                <input
                  type="number"
                  name="handicap"
                  value={formData.handicap}
                  onChange={handleChange}
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {dictionary.admin?.gender || 'Gender'}
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">{dictionary.admin?.selectGender || '-- Select Gender --'}</option>
                  <option value="male">{dictionary.admin?.male || 'Male'}</option>
                  <option value="female">{dictionary.admin?.female || 'Female'}</option>
                  <option value="other">{dictionary.admin?.other || 'Other'}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {dictionary.admin?.birthday || 'Birthday'}
                </label>
                <input
                  type="date"
                  name="birthday"
                  value={formData.birthday}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_admin"
                  name="is_admin"
                  checked={formData.is_admin}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="is_admin" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  {dictionary.admin?.isAdmin || 'Administrator'}
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_editor"
                  name="is_editor"
                  checked={formData.is_editor}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="is_editor" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  {dictionary.admin?.isEditor || 'Editor'}
                </label>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {dictionary.admin?.cancel || 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white ${
                  loading
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
              >
                {loading ? (dictionary.admin?.saving || 'Saving...') : (dictionary.admin?.save || 'Save')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserEditModal; 