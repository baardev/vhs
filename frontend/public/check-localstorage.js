// Check localStorage and display userData values
(function() {
  console.log("Checking localStorage...");
  
  // Check if token exists
  const token = localStorage.getItem('token');
  console.log("Token exists:", !!token);
  
  // Check userData
  const userData = localStorage.getItem('userData');
  console.log("userData exists:", !!userData);
  
  if (userData) {
    try {
      // Try to parse the userData
      const parsed = JSON.parse(userData);
      console.log("userData parsed successfully:", parsed);
      
      // Check if is_admin and is_editor are present
      console.log("is_admin:", parsed.is_admin);
      console.log("is_editor:", parsed.is_editor);
      
      // Offer to fix
      if (parsed.is_admin && !parsed.is_editor) {
        console.log("Would you like to fix this user to have editor rights? Type fixEditor() to fix");
        window.fixEditor = function() {
          parsed.is_editor = true;
          localStorage.setItem('userData', JSON.stringify(parsed));
          console.log("Updated userData:", JSON.parse(localStorage.getItem('userData')));
          window.dispatchEvent(new Event('authChange'));
          console.log("Refresh the page to see changes");
        };
      }
    } catch (error) {
      console.error("Error parsing userData:", error);
      
      // If userData is not valid JSON, offer to fix it
      console.log("userData is not valid JSON. Type fixUserData() to reset it");
      window.fixUserData = function() {
        // Try to extract JSON from string
        try {
          const extractedJson = userData.match(/{.*}/);
          if (extractedJson) {
            const fixedData = JSON.parse(extractedJson[0]);
            localStorage.setItem('userData', JSON.stringify(fixedData));
            console.log("Fixed userData:", JSON.parse(localStorage.getItem('userData')));
            window.dispatchEvent(new Event('authChange'));
          } else {
            console.error("Could not extract JSON from userData");
          }
        } catch (e) {
          console.error("Failed to fix userData:", e);
        }
      };
    }
  } else {
    console.log("No userData found. Please log in again.");
  }
})(); 