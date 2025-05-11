import React, { createContext, useState, useEffect, FC, ReactNode } from 'react';

export interface User {
  username: string;
  // add additional properties as needed
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  logout: () => {},
});

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Function to update user state and localStorage
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

  // Logout function
  const logout = () => {
    setUserState(null);
    localStorage.removeItem('userData');
    localStorage.removeItem('token');
    console.log("User logged out, token and userData removed.");
    // Dispatch custom event for auth changes
    window.dispatchEvent(new CustomEvent('authChange'));
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUserData = localStorage.getItem('userData');
      if (storedUserData) {
        try {
          setUserState(JSON.parse(storedUserData));
        } catch (error) {
          console.error('Error parsing userData from localStorage on init:', error);
          logout(); // Clear invalid stored data
        }
      }
      setInitialized(true);
    }
  }, []);

  // Listen for authChange events from other tabs/windows or manual calls
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