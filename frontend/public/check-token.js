// Token validation checker
// You can load this in the browser console with:
// fetch('/check-token.js').then(r => r.text()).then(code => eval(code))

(async function() {
  console.log('Checking token validity...');
  
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('No token found in localStorage');
    return;
  }
  
  try {
    // Try to fetch user profile to test token
    console.log('Making test request with token...');
    
    // First try the validation endpoint
    try {
      const validateResponse = await fetch('/api/auth/check-session', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Validation response status:', validateResponse.status);
      
      if (validateResponse.ok) {
        const data = await validateResponse.json();
        console.log('Token validation result:', data);
        
        if (data.valid) {
          console.log('✓ TOKEN IS VALID');
        } else {
          console.error('✗ TOKEN IS INVALID');
          console.log('Consider running the force-logout script:');
          console.log("fetch('/force-logout.js').then(r => r.text()).then(code => eval(code))");
        }
      } else {
        console.error('✗ TOKEN VALIDATION FAILED');
        console.log('Server returned:', validateResponse.status);
        console.log('Consider running the force-logout script:');
        console.log("fetch('/force-logout.js').then(r => r.text()).then(code => eval(code))");
      }
    } catch (validationError) {
      console.error('Error during token validation:', validationError);
    }
    
    // Also try an admin endpoint to verify
    try {
      console.log('\nTesting admin access...');
      const adminResponse = await fetch('/api/admin/users?limit=1', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Admin API response status:', adminResponse.status);
      
      if (adminResponse.ok) {
        console.log('✓ ADMIN ACCESS WORKING');
      } else {
        console.error('✗ ADMIN ACCESS FAILED');
        console.log('Consider running the force-logout script:');
        console.log("fetch('/force-logout.js').then(r => r.text()).then(code => eval(code))");
      }
    } catch (adminError) {
      console.error('Error testing admin access:', adminError);
    }
    
  } catch (error) {
    console.error('Error checking token:', error);
  }
})(); 