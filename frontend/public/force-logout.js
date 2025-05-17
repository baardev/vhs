// Force logout script
// You can load this in the browser console with:
// fetch('/force-logout.js').then(r => r.text()).then(code => eval(code))

(function() {
  console.log('Forcing logout and redirect to login page...');
  
  // Clear all auth data
  localStorage.removeItem('userData');
  localStorage.removeItem('token');
  
  // Get current language from URL
  const urlPath = window.location.pathname;
  const parts = urlPath.split('/');
  const lang = (parts.length > 1 && parts[1]) ? parts[1] : 'en';
  
  // Dispatch event to notify components
  window.dispatchEvent(new Event('authChange'));
  
  // Force redirect to login page
  window.location.href = '/' + lang + '/login';
  
  console.log('Logout triggered, redirecting...');
})(); 