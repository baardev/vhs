import { useEffect, useState, ReactNode } from 'react';
// import { useRouter } from 'next/router';

interface AuthCheckProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Component that renders its children only if the user is authenticated
 * Optional fallback component to render when user is not authenticated
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