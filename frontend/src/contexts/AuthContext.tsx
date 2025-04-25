import React, { createContext, useState, useEffect, FC, ReactNode } from 'react';

export interface User {
  username: string;
  // add additional properties as needed
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
});

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('userData');
      if (userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (error) {
          console.error('Error parsing userData from localStorage:', error);
        }
      }
      setInitialized(true);
    }
  }, []);

  // New useEffect: Listen for authChange events to update the user state
  useEffect(() => {
    const handleAuthChange = () => {
      const userData = localStorage.getItem('userData');
      if (userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (error) {
          console.error('Error parsing userData from localStorage:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    window.addEventListener('authChange', handleAuthChange);
    return () => {
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  if (!initialized) {
    return <p>Loading...</p>;
  }

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}; 