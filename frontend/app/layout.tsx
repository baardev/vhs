import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { AuthProvider } from "../src/contexts/AuthContext";
// Import LogViewer commented out since it's not currently used but might be in the future
// import LogViewer from "./components/LogViewer";

/**
 * @constant geistSans 
 * @description Next.js font optimization for Geist Sans font, applied globally via CSS variable.
 */
const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
  preload: true,
});

/**
 * @constant geistMono
 * @description Next.js font optimization for Geist Mono font, applied globally via CSS variable.
 */
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
  preload: true,
});

/**
 * @global
 * @interface Window
 * @description Extends the global Window interface to include a custom `logMessage` function.
 */
if (typeof window !== "undefined") {
  window.logMessage = (msg: string) => {
    console.log(`[LOG]: ${msg}`);
  };
}

/**
 * @constant metadata
 * @description Next.js metadata configuration that defines SEO-related properties.
 * 
 * These values are used by Next.js to generate appropriate meta tags in the HTML head.
 * The metadata affects how the site appears in search results and when shared on
 * social media platforms.
 */
export const metadata = {
  title: "OHS Open Handicap System",
  description: "Track your golf handicap easily",
  alternates: {
    canonical: '/',
  }
};

/**
 * @constant authErrorDetectorScript
 * @description Client-side script that intercepts 401 Unauthorized errors and handles authentication failures.
 * 
 * This script:
 * - Intercepts all XHR requests to detect 401 authentication failures
 * - Clears authentication data from localStorage when a 401 error is detected
 * - Triggers an authChange event for components to respond to auth state changes
 * - Redirects users to the login page when accessing protected routes after auth failure
 * - Preserves the current language preference in redirects
 * 
 * @requires
 * - Browser environment with XMLHttpRequest
 * - localStorage API access
 * - Custom 'authChange' event listeners in relevant components
 */
const authErrorDetectorScript = `
  (function() {
    // Set up XHR interceptor for 401 errors
    const originalXHROpen = XMLHttpRequest.prototype.open;
    const originalXHRSend = XMLHttpRequest.prototype.send;
    
    // Override open method
    XMLHttpRequest.prototype.open = function() {
      this._url = arguments[1];
      return originalXHROpen.apply(this, arguments);
    };
    
    // Override send method
    XMLHttpRequest.prototype.send = function() {
      const originalOnReadyStateChange = this.onreadystatechange;
      
      this.onreadystatechange = function() {
        if (this.readyState === 4) {
          // If status is 401, clear auth and redirect
          if (this.status === 401) {
            console.warn("[Global Error Detector] Caught 401 Unauthorized, clearing auth data");
            // Clear auth data
            localStorage.removeItem('userData');
            localStorage.removeItem('token');
            
            // Dispatch auth change event
            window.dispatchEvent(new Event('authChange'));
            
            // Get language prefix from URL
            const urlPath = window.location.pathname;
            const parts = urlPath.split('/');
            const lang = (parts.length > 1 && parts[1]) ? parts[1] : 'en';
            
            // Force redirect to login if on protected page
            if (urlPath.includes('/admin') || urlPath.includes('/editor')) {
              window.location.href = '/' + lang + '/login';
            }
          }
        }
        
        if (originalOnReadyStateChange) {
          originalOnReadyStateChange.apply(this, arguments);
        }
      };
      
      return originalXHRSend.apply(this, arguments);
    };
    
    console.log("[Global Error Detector] Installed 401 error interceptor");
  })();
`;

/**
 * @component RootLayout
 * @description Root layout component for the entire Open Handicap System application.
 * 
 * This is the top-level layout component that:
 * - Establishes the HTML document structure
 * - Configures global fonts, meta tags, and security policies
 * - Provides the authentication context to all child components
 * - Implements the common layout structure (navbar, main content, footer)
 * - Includes global error handling for authentication failures
 * - Sets up font preloading for performance optimization
 * 
 * In Next.js App Router, this replaces functionality previously split between
 * _app.tsx and _document.tsx in the Pages Router.
 * 
 * @calledBy
 * - Next.js App Router (automatically)
 * - All page routes in the application
 * 
 * @calls
 * - AuthProvider (context provider for authentication)
 * - Navbar (global navigation component)
 * - Footer (global footer component)
 * - Various Next.js font optimization functions
 * 
 * @requires
 * - Next.js App Router configuration
 * - Global CSS styles
 * - Preloaded fonts
 * - AuthProvider context
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render within the layout
 * @returns {JSX.Element} The complete HTML document with app layout
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This flag controls whether to show the LogViewer button
  // When set to true, the button will appear and allow toggling the log viewer
  const displayLogButton = false;
  
  // If we were to implement the LogViewer toggle functionality,
  // we would need something like:
  // const [showLogs, setShowLogs] = useState(false);
  
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Security-Policy" content="default-src 'self' * data:; script-src 'self' 'unsafe-inline' 'unsafe-eval' *; style-src 'self' 'unsafe-inline' *; img-src 'self' data: *; font-src 'self' data: *; connect-src 'self' ws: wss: *;" />
        <base href="/" />
        <link rel="icon" href="/favicon.ico" />
        <link 
          rel="preload" 
          href="/_next/static/media/93f479601ee12b01-s.p.woff2" 
          as="font" 
          type="font/woff2" 
          crossOrigin="anonymous" 
        />
        <link 
          rel="preload" 
          href="/_next/static/media/569ce4b8f30dc480-s.p.woff2" 
          as="font" 
          type="font/woff2" 
          crossOrigin="anonymous" 
        />
        <script dangerouslySetInnerHTML={{ __html: authErrorDetectorScript }} />
      </head>
      <body className="flex flex-col min-h-screen bg-white text-gray-900">
        <AuthProvider>
          {displayLogButton && (
            <button
              className="fixed top-4 right-4 z-50 bg-red-600 text-white px-3 py-2 rounded shadow-lg hover:bg-red-700 flex items-center"
              title="Toggle Log Viewer"
              // onClick={() => setShowLogs(!showLogs)} // Uncomment when implementing
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              LOGS
            </button>
          )}
          
          {/* If we were to display LogViewer, we'd add: */}
          {/* {showLogs && <LogViewer visible={showLogs} onClose={() => setShowLogs(false)} />} */}

          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
} 