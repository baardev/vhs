'use client';

import React, { createContext, useState, useEffect, FC, ReactNode } from 'react';
import { validateToken, clearAuthData } from '../utils/authUtils';

/**
 * @interface User
 * @description Defines the structure for a user object within the application.
 *
 * @property {string} username - The username of the user.
 * @remarks Additional properties can be added as needed for user data.
 */
export interface User {
  username: string;
  // add additional properties as needed
}

/**
 * @interface AuthContextType
 * @description Defines the shape of the authentication context provided to consumers.
 *
 * @property {User | null} user - The current authenticated user object, or null if no user is logged in.
 * @property {(user: User | null) => void} setUser - Function to set the current user. Updates both state and localStorage.
 * @property {() => void} logout - Function to log out the current user. Clears user data from state and localStorage.
 */
interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

/**
 * @constant AuthContext
 * @description React Context for authentication.
 * Provides an `AuthContextType` object containing the current user,
 * a function to set the user, and a logout function.
 *
 * @remarks
 * Initialized with a default context value where `user` is null and `setUser` and `logout` are no-op functions.
 * This context is used by the `AuthProvider` to make authentication state available throughout the component tree.
 */
export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  logout: () => {},
});

/**
 * @component AuthProvider
 * @description Provides authentication context to its children.
 * Manages user state, initialization from localStorage, and synchronization across tabs/windows via a custom 'authChange' event.
 *
 * @param {object} props - The props for the component.
 * @param {ReactNode} props.children - The child components that will have access to the AuthContext.
 *
 * @example
 * ```tsx
 * // In _app.tsx or a similar top-level component
 * import { AuthProvider } from './contexts/AuthContext';
 *
 * function MyApp({ Component, pageProps }) {
 *   return (
 *     <AuthProvider>
 *       <Component {...pageProps} />
 *     </AuthProvider>
 *   );
 * }
 * ```
 *
 * @remarks
 * - On initial load, it attempts to retrieve user data from `localStorage`.
 * - Provides `setUser` to update authentication state and `logout` to clear it. Both actions also update `localStorage` and dispatch an `authChange` event.
 * - Listens for `authChange` events (e.g., from other tabs or manual dispatches) to keep authentication state consistent.
 * - Displays a "Loading..." message until initialization is complete.
 *
 * Calls:
 * - React Hooks: `useState`, `useEffect`.
 * - `localStorage` API (`getItem`, `setItem`, `removeItem`).
 * - `window.dispatchEvent`, `window.addEventListener` (for 'authChange' event).
 * - `JSON.parse`, `JSON.stringify`.
 *
 * Called by:
 * - Typically wrapped around the main application component (e.g., in `pages/_app.tsx`) to provide global auth state.
 */
export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [initialized, setInitialized] = useState(false);

  /**
   * @function setUser
   * @description Updates the user state and persists it to localStorage.
   * Dispatches an 'authChange' event to notify other parts of the application or other tabs.
   * @param {User | null} newUser - The user object to set, or null to clear the user.
   */
  const setUser = (newUser: User | null) => {
    setUserState(newUser);
    if (newUser) {
      localStorage.setItem('userData', JSON.stringify(newUser));
    } else {
      localStorage.removeItem('userData');
      localStorage.removeItem('token'); // Ensure token is also removed on explicit setUser(null)
    }
    // Dispatch custom event for auth changes
    window.dispatchEvent(new CustomEvent('authChange'));
  };

  /**
   * @function logout
   * @description Clears the user state and removes user data and token from localStorage.
   * Dispatches an 'authChange' event.
   */
  const logout = () => {
    setUserState(null);
    clearAuthData();
    console.log("User logged out, token and userData removed.");
    // Dispatch custom event for auth changes
    window.dispatchEvent(new CustomEvent('authChange'));
  };

  /**
   * @effect
   * @description Initializes the user state from localStorage on component mount and validates the token.
   * This effect runs once after the initial render on the client-side.
   * It retrieves 'userData' from localStorage, parses it, and sets the user state.
   * If parsing fails or data is invalid, it calls `logout()` to ensure a clean state.
   * Sets `initialized` to true after attempting to load user data.
   */
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const initializeAuth = async () => {
        const storedUserData = localStorage.getItem('userData');
        const token = localStorage.getItem('token');
        
        if (storedUserData && token) {
          // Validate token with the backend
          const isTokenValid = await validateToken();
          
          if (!isTokenValid) {
            console.warn('Stored token is invalid. Logging out user.');
            logout();
            setInitialized(true);
            return;
          }
          
          try {
            setUserState(JSON.parse(storedUserData));
          } catch (error) {
            console.error('Error parsing userData from localStorage on init:', error);
            logout(); // Clear invalid stored data
          }
        }
        
        setInitialized(true);
      };
      
      initializeAuth();
    }
  }, []);

  /**
   * @effect
   * @description Listens for 'authChange' custom events on the window.
   * This allows the AuthContext to react to authentication changes triggered by other tabs,
   * browser windows, or manual dispatches of the 'authChange' event.
   * When the event is detected, it re-evaluates the user's authentication status based on
   * 'userData' and 'token' in localStorage.
   * If data is inconsistent or missing, it logs out the user.
   *
   * @remarks
   * Cleans up the event listener on component unmount.
   */
  useEffect(() => {
    const handleAuthChange = () => {
      console.log("AuthContext: Detected authChange event.");
      const storedUserData = localStorage.getItem('userData');
      const token = localStorage.getItem('token');
      if (storedUserData && token) { // Ensure token also exists for a valid session
        try {
          setUserState(JSON.parse(storedUserData));
        } catch (error) {
          console.error('Error parsing userData from localStorage on authChange:', error);
          // If parsing fails or token is missing, treat as logged out
          setUserState(null); 
          localStorage.removeItem('userData');
          localStorage.removeItem('token');
        }
      } else {
        // If no userData or no token, ensure user is set to null
        setUserState(null);
      }
    };

    window.addEventListener('authChange', handleAuthChange);
    return () => {
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  if (!initialized) {
    return <p>Loading...</p>; // Or a proper loading spinner/component
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}; 