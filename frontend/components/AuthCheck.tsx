import { useEffect, useState, ReactNode } from 'react';
// import { useRouter } from 'next/navigation';

/**
 * @interface AuthCheckProps
 * @description Defines the props for the AuthCheck component.
 * @property {ReactNode} children - The content to render if the user is authenticated.
 * @property {ReactNode} [fallback] - Optional content to render if the user is not authenticated.
 */
interface AuthCheckProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * @component AuthCheck
 * @description A component that conditionally renders its children based on user authentication status.
 * It checks for an authentication token in `localStorage` to determine if the user is logged in.
 *
 * @remarks
 * - On mount, it checks `localStorage.getItem('token')`.
 * - If a token exists, `isAuthenticated` state is set to `true`, and the `children` are rendered.
 * - If no token exists, `isAuthenticated` state is set to `false`. If a `fallback` prop is provided, it's rendered; otherwise, `null` is rendered.
 * - While the authentication status is being determined (`isAuthenticated === null`), it renders `null`.
 * - This component does not perform the authentication itself but relies on the presence of a token set by an external authentication process.
 *
 * Called by:
 * - This component is not directly called using `<AuthCheck />` in the current codebase.
 * - However, the pattern of checking `localStorage` for a token to manage UI based on authentication
 *   is implemented in various places, such as:
 *   - `frontend/pages/admin/index.tsx` (for admin dashboard access)
 *   - `frontend/pages/editor/index.tsx` (for editor dashboard access)
 *   - `frontend/components/handicap/HandicapCalculator.tsx` (to show handicap or login prompt)
 *   - `frontend/pages/dashboard.tsx` (for user dashboard access)
 *   - `frontend/pages/change-password.tsx` (to ensure user is logged in before changing password)
 *   - `frontend/src/contexts/AuthContext.tsx` (for initializing and managing global auth state)
 *
 * Calls:
 * - React Hooks: `useState`, `useEffect`
 * - `localStorage.getItem` (to check for the 'token')
 *
 * @param {AuthCheckProps} props - The props for the component.
 * @returns {React.ReactElement | null} The children if authenticated, fallback if not and provided, otherwise null.
 */
const AuthCheck: React.FC<AuthCheckProps> = ({ children, fallback }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  // const router = useRouter();

  useEffect(() => {
    // Check for token in localStorage
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  // Still determining authentication state
  if (isAuthenticated === null) {
    return null;
  }

  return isAuthenticated ? <>{children}</> : <>{fallback || null}</>;
};

export default AuthCheck;