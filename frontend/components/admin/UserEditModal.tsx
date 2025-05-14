import { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'next-i18next';

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
 */
interface UserEditModalProps {
  user: User;
  onClose: () => void;
  onSave: () => void;
}

/**
 * @component UserEditModal
 * @description A modal dialog component for editing user details.
 *
 * @remarks
 * This component displays a form pre-filled with the user's current information.
 * It allows modification of various user attributes including username, email, password (optional),
 * name, family name, matricula, handicap, gender, birthday, and admin/editor roles.
 * Form data is validated, and upon submission, an authenticated PUT request is made
 * to the `/api/admin/users/:id` endpoint to update the user's information.
 * The component handles loading states during the API call and displays any errors encountered.
 * It utilizes `next-i18next` for internationalization of labels and messages.
 *
 * Called by:
 * - `frontend/components/admin/UserTable.tsx` (when an admin clicks the "Edit" button for a user)
 *
 * Calls:
 * - `useState` (React hook for managing form data, loading, and error states)
 * - `axios.put` (to send PUT request to `/api/admin/users/:id` for updating user details)
 * - `useTranslation` (from `next-i18next` for internationalization)
 * - `localStorage.getItem` (to retrieve JWT token for API request authorization)
 * - `props.onClose` (when the close button or cancel button is clicked)
 * - `props.onSave` (after a successful API call to update the user)
 *
 * @param {UserEditModalProps} props - The props for the component.
 * @returns {React.FC<UserEditModalProps>} The rendered modal component for editing a user.
 */
const UserEditModal: React.FC<UserEditModalProps> = ({ user, onClose, onSave }) => {
  const { t } = useTranslation('common');
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
        setError((error.response?.data as ErrorResponse)?.error || t('admin.errorUpdatingUser'));
      } else {
        setError(t('admin.errorUpdatingUser'));
      }
      setLoading(false);
    }
  };

  const hasError = error !== null && error !== undefined && error !== '';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-screen overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t('admin.editUser')}
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
                  {t('admin.username')}
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
                  {t('admin.email')}
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
                  {t('admin.password')} <span className="text-xs text-gray-500">({t('admin.leaveBlank')})</span>
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
                  {t('admin.name') || 'First Name'}
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
                  {t('admin.familyName')}
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
                  {t('admin.matricula')}
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
                  {t('admin.handicap')}
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
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">--</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Birthday
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
                  {t('admin.isAdmin')}
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
                  {t('admin.isEditor')}
                </label>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {t('admin.cancel')}
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
                {loading ? t('admin.saving') : t('admin.save')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserEditModal;