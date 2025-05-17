import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { AuthProvider } from "../src/contexts/AuthContext";

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

export const metadata = {
  title: "VHS Open Handicap System",
  description: "Track your golf handicap easily",
  alternates: {
    canonical: '/',
  }
};

// Global 401 error detector script
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
 * Root layout for the App Router
 * Combines functionality from _app.tsx and _document.tsx
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const displayLogButton = false;

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

          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
} 