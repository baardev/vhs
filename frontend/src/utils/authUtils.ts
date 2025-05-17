/**
 * Authentication utility functions
 */
import axios from 'axios';

/**
 * Validates the current user token with the backend
 * @returns {Promise<boolean>} true if token is valid, false otherwise
 */
export const validateToken = async (): Promise<boolean> => {
  try {
    console.log('[Auth] Starting token validation');
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.log('[Auth] No token found in localStorage');
      return false;
    }
    
    console.log('[Auth] Token found, sending validation request');
    // Use the frontend API route which proxies to the backend
    const response = await fetch('/api/auth/validate-token', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.error(`[Auth] Token validation failed with status: ${response.status}`);
      return false;
    }
    
    const data = await response.json();
    const isValid = data.valid === true;
    console.log(`[Auth] Token validation result: ${isValid ? 'valid' : 'invalid'}`);
    return isValid;
  } catch (error) {
    console.error('[Auth] Error validating token:', error);
    return false;
  }
};

/**
 * Clears authentication data from localStorage
 */
export const clearAuthData = (): void => {
  console.log('[Auth] Clearing authentication data');
  localStorage.removeItem('token');
  localStorage.removeItem('userData');
  
  // Dispatch authChange event to notify components
  window.dispatchEvent(new Event('authChange'));
};

/**
 * Forces a token validation check and redirects to login page if token is invalid
 * Call this function in layout or page components to ensure valid authentication
 * @param {string} lang - The current language code for redirection
 * @param {(url: string) => void} pushFn - The navigation function to use for redirection
 * @returns {Promise<boolean>} true if token is valid and user can stay on the page
 */
export const forceValidateTokenOrLogout = async (
  lang: string, 
  pushFn: (url: string) => void
): Promise<boolean> => {
  console.log('[Auth] Force validating token or logout');
  
  const token = localStorage.getItem('token');
  if (!token) {
    console.log('[Auth] No token found, redirecting to login');
    pushFn(`/${lang}/login`);
    return false;
  }
  
  const isValid = await validateToken();
  if (!isValid) {
    console.log('[Auth] Token is invalid, clearing data and redirecting to login');
    clearAuthData();
    pushFn(`/${lang}/login`);
    return false;
  }
  
  return true;
};

/**
 * Setup Axios interceptor for 401 responses
 * This will automatically handle expired tokens globally
 */
export const setupAxiosInterceptors = (): void => {
  // Response interceptor to handle 401 Unauthorized errors
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        console.warn('[Auth] Intercepted 401 error, clearing auth data');
        clearAuthData();
        
        // Force page reload to trigger redirect
        window.location.href = window.location.pathname.includes('/admin') || 
                               window.location.pathname.includes('/editor')
                             ? `/${window.location.pathname.split('/')[1]}/login` 
                             : '/';
      }
      return Promise.reject(error);
    }
  );
  
  console.log('[Auth] Axios interceptors set up for 401 errors');
};

// Initialize the interceptors immediately
if (typeof window !== 'undefined') {
  setupAxiosInterceptors();
} 