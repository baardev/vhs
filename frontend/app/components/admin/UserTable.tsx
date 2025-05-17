'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import UserEditModal from './UserEditModal';
import UserDeleteModal from './UserDeleteModal';

interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
  is_admin: boolean;
  is_editor: boolean;
  first_name?: string;
  name?: string;
  family_name?: string;
  matricula?: string;
  handicap?: number;
  [key: string]: string | number | boolean | undefined;
}

interface UserTableProps {
  locale: string;
}

/**
 * @component UserTable
 * @description Displays a sortable and paginated table of users with administrative actions.
 */
const UserTable: React.FC<UserTableProps> = ({ locale }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dictionary, setDictionary] = useState<any>(null);
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

  // Load dictionary
  useEffect(() => {
    const loadDictionary = async () => {
      try {
        // In a real implementation, we would load the dictionary from a JSON file
        // For now, we'll use a simple fallback
        const dictionaryData = {
          loading: 'Loading...',
          admin: {
            dashboard: 'Admin Dashboard',
            userManagement: 'User Management',
            showing: 'Showing',
            to: 'to',
            of: 'of',
            results: 'results',
            previous: 'Previous',
            next: 'Next',
            perPage: 'Per Page',
            username: 'Username',
            email: 'Email',
            created: 'Created',
            isAdmin: 'Admin',
            isEditor: 'Editor',
            actions: 'Actions',
            edit: 'Edit',
            delete: 'Delete',
            yes: 'Yes',
            no: 'No',
            adminStatusChanged: 'Admin status changed',
            editorStatusChanged: 'Editor status changed',
            errorUpdatingAdmin: 'Error updating admin status',
            errorUpdatingEditor: 'Error updating editor status',
            errorFetchingUsers: 'Error fetching users',
            userUpdated: 'User updated successfully',
            userDeleted: 'User deleted successfully'
          }
        };
        setDictionary(dictionaryData);
      } catch (error) {
        console.error('Error loading dictionary:', error);
      }
    };

    loadDictionary();
  }, [locale]);

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
      setError(dictionary?.admin?.errorFetchingUsers || 'Error fetching users');
    } finally {
      setLoading(false);
    }
  }, [limit, offset, sortBy, sortOrder, dictionary]);

  // Initial fetch - remove fetchUsers from dependencies since it's now memoized with useCallback
  useEffect(() => {
    if (dictionary) {
      fetchUsers();
    }
  }, [limit, offset, sortBy, sortOrder, fetchUsers, dictionary]);

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
    setSuccessMessage(dictionary?.admin?.userUpdated || 'User updated successfully');
    // Clear success message after 3 seconds
    setTimeout(() => setSuccessMessage(''), 3000);
    fetchUsers();
  };

  // Handle user deletion
  const handleUserDeleted = () => {
    setShowDeleteModal(false);
    setDeletingUser(null);
    setSuccessMessage(dictionary?.admin?.userDeleted || 'User deleted successfully');
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

      setSuccessMessage(dictionary?.admin?.adminStatusChanged || 'Admin status changed');
      setTimeout(() => setSuccessMessage(''), 3000);
      fetchUsers();
    } catch (error) {
      console.error('Error updating admin status:', error);
      setError(dictionary?.admin?.errorUpdatingAdmin || 'Error updating admin status');
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

      setSuccessMessage(dictionary?.admin?.editorStatusChanged || 'Editor status changed');
      setTimeout(() => setSuccessMessage(''), 3000);
      fetchUsers();
    } catch (error) {
      console.error('Error updating editor status:', error);
      setError(dictionary?.admin?.errorUpdatingEditor || 'Error updating editor status');
    }
  };

  // Render loading state
  if (!dictionary || (loading && users.length === 0)) {
    return (
      <div className="px-4 py-5 sm:p-6">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400">{dictionary?.loading || 'Loading...'}</p>
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
                {dictionary?.admin?.username || 'Username'} {sortBy === 'username' && (sortOrder === 'ASC' ? '↑' : '↓')}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('email')}
              >
                {dictionary?.admin?.email || 'Email'} {sortBy === 'email' && (sortOrder === 'ASC' ? '↑' : '↓')}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('created_at')}
              >
                {dictionary?.admin?.created || 'Created'} {sortBy === 'created_at' && (sortOrder === 'ASC' ? '↑' : '↓')}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('is_admin')}
              >
                {dictionary?.admin?.isAdmin || 'Admin'} {sortBy === 'is_admin' && (sortOrder === 'ASC' ? '↑' : '↓')}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('is_editor')}
              >
                {dictionary?.admin?.isEditor || 'Editor'} {sortBy === 'is_editor' && (sortOrder === 'ASC' ? '↑' : '↓')}
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {dictionary?.admin?.actions || 'Actions'}
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
                    {user.is_admin ? dictionary?.admin?.yes || 'Yes' : dictionary?.admin?.no || 'No'}
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
                    {user.is_editor ? dictionary?.admin?.yes || 'Yes' : dictionary?.admin?.no || 'No'}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEditUser(user)}
                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                  >
                    {dictionary?.admin?.edit || 'Edit'}
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user)}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  >
                    {dictionary?.admin?.delete || 'Delete'}
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
            {dictionary?.admin?.previous || 'Previous'}
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
            {dictionary?.admin?.next || 'Next'}
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {dictionary?.admin?.showing || 'Showing'} <span className="font-medium">{offset + 1}</span> {dictionary?.admin?.to || 'to'}{' '}
              <span className="font-medium">{Math.min(offset + limit, totalUsers)}</span> {dictionary?.admin?.of || 'of'}{' '}
              <span className="font-medium">{totalUsers}</span> {dictionary?.admin?.results || 'results'}
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
                <span className="sr-only">{dictionary?.admin?.previous || 'Previous'}</span>
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
                <span className="sr-only">{dictionary?.admin?.next || 'Next'}</span>
                &rarr;
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && editingUser && (
        <UserEditModal
          user={editingUser}
          onClose={() => setShowEditModal(false)}
          onSave={handleUserUpdated}
          locale={locale}
        />
      )}

      {/* Delete Modal */}
      {showDeleteModal && deletingUser && (
        <UserDeleteModal
          user={deletingUser}
          onClose={() => setShowDeleteModal(false)}
          onDelete={handleUserDeleted}
          locale={locale}
        />
      )}

      {/* Rows per page selector */}
      <div className="px-4 py-3 flex justify-end">
        <div>
          <label htmlFor="limitSelect" className="mr-2 text-sm">
            {dictionary?.admin?.perPage || 'Per Page'}:
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
    </div>
  );
};

export default UserTable; 