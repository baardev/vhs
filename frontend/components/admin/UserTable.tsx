import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useTranslation } from 'next-i18next';
import UserEditModal from './UserEditModal';
import UserDeleteModal from './UserDeleteModal';

interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
  is_admin: boolean;
  is_editor: boolean;
  name?: string;
  family_name?: string;
  matricula?: string;
  handicap?: number;
  [key: string]: string | number | boolean | undefined;
}

const UserTable = () => {
  const { t } = useTranslation('common');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalUsers, setTotalUsers] = useState(0);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch users - wrapped in useCallback
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
        params: { limit, offset, sortBy, sortOrder }
      });

      setUsers(response.data.users);
      setTotalUsers(response.data.total);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(t('admin.errorFetchingUsers'));
    } finally {
      setLoading(false);
    }
  }, [limit, offset, sortBy, sortOrder, t]);

  // Initial fetch - remove fetchUsers from dependencies since it's now memoized with useCallback
  useEffect(() => {
    fetchUsers();
  }, [limit, offset, sortBy, sortOrder, fetchUsers]);

  // Handle sort change
  const handleSort = (column: string) => {
    if (sortBy === column) {
      // Toggle sort order
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      // New column, reset to ascending
      setSortBy(column);
      setSortOrder('ASC');
    }
  };

  // Handle pagination
  const handleNextPage = () => {
    if ((offset + limit) < totalUsers) {
      setOffset(offset + limit);
    }
  };

  const handlePrevPage = () => {
    if (offset > 0) {
      setOffset(Math.max(0, offset - limit));
    }
  };

  // Show edit modal
  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowEditModal(true);
  };

  // Show delete modal
  const handleDeleteUser = (user: User) => {
    setDeletingUser(user);
    setShowDeleteModal(true);
  };

  // Handle user update
  const handleUserUpdated = () => {
    setShowEditModal(false);
    setEditingUser(null);
    setSuccessMessage(t('admin.userUpdated'));
    // Clear success message after 3 seconds
    setTimeout(() => setSuccessMessage(''), 3000);
    fetchUsers();
  };

  // Handle user deletion
  const handleUserDeleted = () => {
    setShowDeleteModal(false);
    setDeletingUser(null);
    setSuccessMessage(t('admin.userDeleted'));
    // Clear success message after 3 seconds
    setTimeout(() => setSuccessMessage(''), 3000);
    fetchUsers();
  };

  // Toggle admin status
  const toggleAdminStatus = async (user: User) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      await axios.patch(`/api/admin/users/${user.id}/admin`,
        { is_admin: !user.is_admin },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccessMessage(t('admin.adminStatusChanged'));
      setTimeout(() => setSuccessMessage(''), 3000);
      fetchUsers();
    } catch (error) {
      console.error('Error updating admin status:', error);
      setError(t('admin.errorUpdatingAdmin'));
    }
  };

  // Toggle editor status
  const toggleEditorStatus = async (user: User) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      await axios.patch(`/api/admin/users/${user.id}/editor`,
        { is_editor: !user.is_editor },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccessMessage(t('admin.editorStatusChanged'));
      setTimeout(() => setSuccessMessage(''), 3000);
      fetchUsers();
    } catch (error) {
      console.error('Error updating editor status:', error);
      setError(t('admin.errorUpdatingEditor'));
    }
  };

  // Render loading state
  if (loading && users.length === 0) {
    return (
      <div className="px-4 py-5 sm:p-6">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400">{t('loading')}</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error && users.length === 0) {
    return (
      <div className="px-4 py-5 sm:p-6">
        <div className="text-center text-red-500">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {successMessage && (
        <div className="mx-4 my-2 p-2 bg-green-100 text-green-800 rounded">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="mx-4 my-2 p-2 bg-red-100 text-red-800 rounded">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('id')}
              >
                ID {sortBy === 'id' && (sortOrder === 'ASC' ? '↑' : '↓')}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('username')}
              >
                {t('admin.username')} {sortBy === 'username' && (sortOrder === 'ASC' ? '↑' : '↓')}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('email')}
              >
                {t('admin.email')} {sortBy === 'email' && (sortOrder === 'ASC' ? '↑' : '↓')}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('created_at')}
              >
                {t('admin.created')} {sortBy === 'created_at' && (sortOrder === 'ASC' ? '↑' : '↓')}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('is_admin')}
              >
                {t('admin.isAdmin')} {sortBy === 'is_admin' && (sortOrder === 'ASC' ? '↑' : '↓')}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('is_editor')}
              >
                {t('admin.isEditor')} {sortBy === 'is_editor' && (sortOrder === 'ASC' ? '↑' : '↓')}
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {t('admin.actions')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {user.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {user.username}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  <button
                    onClick={() => toggleAdminStatus(user)}
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      user.is_admin
                        ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {user.is_admin ? t('admin.yes') : t('admin.no')}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  <button
                    onClick={() => toggleEditorStatus(user)}
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      user.is_editor
                        ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {user.is_editor ? t('admin.yes') : t('admin.no')}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEditUser(user)}
                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                  >
                    {t('admin.edit')}
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user)}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  >
                    {t('admin.delete')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={handlePrevPage}
            disabled={offset === 0}
            className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
              offset === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {t('admin.previous')}
          </button>
          <button
            onClick={handleNextPage}
            disabled={(offset + limit) >= totalUsers}
            className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
              (offset + limit) >= totalUsers
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {t('admin.next')}
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {t('admin.showing')} <span className="font-medium">{offset + 1}</span> {t('admin.to')}{' '}
              <span className="font-medium">{Math.min(offset + limit, totalUsers)}</span> {t('admin.of')}{' '}
              <span className="font-medium">{totalUsers}</span> {t('admin.results')}
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={handlePrevPage}
                disabled={offset === 0}
                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600 text-sm font-medium ${
                  offset === 0
                    ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <span className="sr-only">{t('admin.previous')}</span>
                &larr;
              </button>
              <button
                onClick={handleNextPage}
                disabled={(offset + limit) >= totalUsers}
                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600 text-sm font-medium ${
                  (offset + limit) >= totalUsers
                    ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <span className="sr-only">{t('admin.next')}</span>
                &rarr;
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && editingUser && (
        <UserEditModal
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          user={editingUser as any}
          onClose={() => setShowEditModal(false)}
          onSave={handleUserUpdated}
        />
      )}

      {/* Delete Modal */}
      {showDeleteModal && deletingUser && (
        <UserDeleteModal
          user={deletingUser}
          onClose={() => setShowDeleteModal(false)}
          onDelete={handleUserDeleted}
        />
      )}

      {/* Add this near your pagination controls */}
      <div className="mr-4">
        <label htmlFor="limitSelect" className="mr-2 text-sm">
          {t('admin.perPage')}:
        </label>
        <select
          id="limitSelect"
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          className="border border-gray-300 dark:border-gray-600 rounded p-1 text-sm"
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
        </select>
      </div>
    </div>
  );
};

export default UserTable;