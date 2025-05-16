/**
 * Utility to handle base URL resolution for different environments
 */

// Get the base URL for the current environment
export const getBaseUrl = () => {
  // Check if we're in the browser
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  // In server environment, use environment variables or defaults
  if (process.env.NODE_ENV === 'production') {
    return process.env.NEXT_PUBLIC_APP_URL || 'https://libronico.com';
  }
  
  // For development environment
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
};

// Create a full URL by joining the base URL with a path
export const createUrl = (path) => {
  const baseUrl = getBaseUrl();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
};

// Export a default configuration object
export default {
  getBaseUrl,
  createUrl,
}; 