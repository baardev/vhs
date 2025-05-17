/**
 * Utility to handle base URL resolution for different environments
 */

// Get the base URL for the current environment
export const getBaseUrl = () => {
  // Check if we're in the browser
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  // In server environment, use relative URLs
  return '';
};

// Create a full URL by joining the base URL with a path
export const createUrl = (path) => {
  const baseUrl = getBaseUrl();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  // If we're in the browser or have a base URL, use it
  if (baseUrl) {
    return `${baseUrl}${normalizedPath}`;
  }
  
  // Otherwise just return the path (relative URL)
  return normalizedPath;
};

// Export a default configuration object
export default {
  getBaseUrl,
  createUrl,
}; 