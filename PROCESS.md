# Understanding the VHS Application Framework

## Overview of the Framework Architecture

This document outlines how information, requests, and responses flow through the VHS application framework. We'll examine each subsystem and process to provide a clear understanding of the application's architecture.

## Subsystems and Information Flow

### 1. Frontend Architecture
- **Next.js Application Structure**
  - Pages-based routing
  - Component hierarchy
  - Static vs. dynamic rendering
- **State Management**
  - Local component state
  - User authentication state
  - Data fetching patterns
- **Internationalization (i18n)**
  - Translation mechanism
  - Language switching
  - Locale-specific content

### 2. Backend Architecture
- **Express.js Server**
  - Route configuration
  - Middleware pipeline
  - API endpoints organization
- **Database Interaction**
  - PostgreSQL connection pool
  - Query execution
  - Data transformation
- **Authentication System**
  - JWT token handling
  - User sessions
  - Authentication middleware

### 3. Data Flow Processes
- **Client-Side Rendering Flow**
  - Initial page load
  - Data fetching with useEffect
  - Component rendering lifecycle
- **Server-Side Rendering Flow**
  - getServerSideProps execution
  - Data prefetching
  - HTML generation and hydration
- **API Request Flow**
  - Frontend request initiation
  - Backend route handling
  - Response generation and handling

### 4. Specialized Subsystems
- **Handicap Calculator**
  - Data input and validation
  - Calculation algorithm
  - Results display
- **Logging System**
  - Log generation
  - Storage mechanisms
  - Viewing interfaces
- **Error Handling**
  - Client-side error boundaries
  - Server-side error middleware
  - Error logging and reporting

### 5. Docker Containerization
- **Container Architecture**
  - Frontend container
  - Backend container
  - Database container
  - Nginx container
- **Inter-Container Communication**
  - Network configuration
  - Port mapping
  - Volume sharing

## Detailed Request Flow Examples

### Example 1: Handicap Calculator Request Flow
1. User interaction with frontend component
2. Frontend API request formulation
3. Backend route handling and validation
4. Database query execution
5. Calculation processing
6. Response generation
7. Frontend state update and re-rendering

### Example 2: Authentication Flow
1. Login form submission
2. Credentials validation
3. JWT token generation
4. Token storage and management
5. Protected route access
6. Token validation and renewal

### Example 3: Logging System Flow
1. Application event triggering
2. Log message generation
3. Storage mechanism (file/database)
4. Request for logs visualization
5. Log retrieval and display

## Architecture Diagrams
(Note: Diagrams would be added here to visually represent the system architecture and request flows)

## Troubleshooting Guide
- Common issues at each layer
- Debugging techniques
- Log analysis and interpretation

## Performance Considerations
- Caching strategies
- Database optimization
- Network request efficiency

## Security Aspects
- Authentication and authorization
- Data validation and sanitization
- Protection against common vulnerabilities 

# Flow Section

## Complete Request-Response Flow Through the VHS Architecture

This section provides a detailed walkthrough of how a request from an external client flows through the entire VHS system architecture, from initial browser request to the final rendered webpage response.

### 1. Initial Client Request

When a user enters `https://libronico.com/handicap` in their browser:

1. **DNS Resolution**: The domain `libronico.com` is resolved to the server's IP address.
2. **TLS Handshake**: The browser establishes a secure HTTPS connection with the server.
3. **HTTP Request Formation**: The browser creates an HTTP GET request for the path `/handicap`.

### 2. Nginx Handling (Web Server Layer)

The request first reaches the Nginx container:

1. **Request Reception**: Nginx receives the incoming HTTP request on port 443 (HTTPS).
2. **Virtual Host Selection**: Nginx determines which virtual host configuration to use based on the `Host` header.
3. **SSL Termination**: Nginx handles the SSL/TLS encryption, decrypting the incoming request.
4. **Reverse Proxy Decision**: Based on the request path:
   - For static assets: Nginx serves them directly from its cache or static files
   - For dynamic content: Nginx forwards the request to the appropriate internal service
5. **Load Balancing**: If multiple service instances exist, Nginx distributes requests among them.
6. **Request Forwarding**: For our `/handicap` path, Nginx forwards the request to the frontend container on port 3000.

### 3. Next.js Frontend Container (Application Layer)

The request now enters the Next.js frontend application:

1. **Request Reception**: Next.js server receives the forwarded request from Nginx.
2. **Route Resolution**: Next.js router determines which page component should handle `/handicap`.
3. **Rendering Decision**:
   - For static pages: Next.js serves pre-rendered HTML
   - For dynamic pages: Next.js decides between:
     - Server-Side Rendering (SSR)
     - Static Site Generation (SSG)
     - Client-Side Rendering (CSR)
4. **Data Fetching**:
   - For SSR/SSG: `getServerSideProps` or `getStaticProps` executes, potentially making backend API calls
   - For CSR: Initial HTML is served without data, which will be fetched client-side

For our handicap page:
1. The Next.js server locates `handicap.tsx` in the pages directory
2. It executes any applicable data fetching functions
3. If needed, it makes calls to the backend API services

### 4. Backend API Interaction (Service Layer)

When Next.js needs data for the handicap page:

1. **API Request Formation**: Next.js forms an HTTP request to the backend service.
2. **Internal Network Traversal**: The request travels through Docker's internal network to the backend container on port 4000.
3. **Express.js Request Handling**:
   - The backend Express server receives the request
   - Request logging middleware captures the incoming request details
   - CORS middleware validates cross-origin permissions
   - Authentication middleware checks for valid JWT tokens if the route is protected
   - Body parsing middleware processes any request body data
4. **Route Matching**: Express matches the request to the appropriate route handler, in this case `/api/handicap-calc`.
5. **Controller Processing**: The handicap calculator controller:
   - Validates input parameters
   - Prepares database queries
   - Handles business logic

### 5. Database Interaction (Data Layer)

The backend controller interacts with the database:

1. **Connection Acquisition**: The controller acquires a connection from the PostgreSQL connection pool.
2. **Query Execution**:
   - SQL queries are executed against the PostgreSQL database
   - For the handicap calculator, this retrieves the player's round data
3. **Result Processing**:
   - The database returns player_cards data
   - The backend transforms raw data into the appropriate format
   - The controller performs handicap calculation logic on the data
4. **Connection Release**: The database connection is returned to the pool after use.

### 6. Response Journey (Backend to Frontend)

After processing, the response begins its journey back to the client:

1. **Backend Response Formation**:
   - Express controller formats the calculated handicap data as JSON
   - Response headers are set, including cache-control directives
   - The response is sent back to the Next.js server
2. **Frontend Processing**:
   - For SSR: Next.js receives the API response data
   - The data is injected into the React component
   - The complete HTML with data is generated
   - Additional loading of JavaScript bundles is prepared

### 7. HTML Composition and Rendering

The Next.js server builds the complete HTML response:

1. **Component Tree Rendering**: The React component tree for the handicap page is rendered with data.
2. **HTML Generation**: The rendered components are converted to HTML.
3. **Script Injection**: JavaScript bundles and data are injected into the HTML.
4. **Style Inclusion**: CSS styles are included in the HTML head or as separate stylesheets.
5. **Response Preparation**: The completed HTML is prepared for delivery to the client.

### 8. Nginx Response Handling

The response now flows back through Nginx:

1. **Response Reception**: Nginx receives the HTML response from the Next.js server.
2. **Header Modification**: Any needed response headers are added or modified.
3. **Compression**: Response may be compressed using gzip or brotli if configured.
4. **Caching Decisions**: Based on cache headers, Nginx decides whether to cache the response.
5. **SSL Encryption**: The response is encrypted using SSL/TLS.
6. **Transmission**: The encrypted response is sent back to the client browser.

### 9. Browser Processing

Finally, the browser processes the response:

1. **Response Reception**: Browser receives and decrypts the HTTPS response.
2. **HTML Parsing**: The HTML document is parsed into a DOM tree.
3. **Resource Loading**: Browser begins loading additional resources:
   - CSS files are requested and applied
   - JavaScript bundles are downloaded and executed
   - Images and other media are fetched
4. **Hydration**: Next.js JavaScript code "hydrates" the server-rendered HTML, attaching event listeners and making the page interactive.
5. **Client-side Routing Setup**: Next.js sets up its client-side routing system for subsequent navigation.
6. **Rendering Completion**: The fully interactive webpage is displayed to the user.

### 10. Logging and Monitoring

Throughout this entire process:

1. **Request Logging**: Nginx, Next.js, and Express all log request details.
2. **Performance Monitoring**: Timing data is collected at various stages.
3. **Error Handling**: Any errors are caught, logged, and possibly reported to monitoring services.
4. **Log Aggregation**: Logs from various containers may be collected in a central location (our `/tmp/backend-debug.log` for backend logs).

This complete flow represents how a single request-response cycle works through our VHS architecture, from initial URL entry to the final rendered webpage.

# Homepage Example:

Using the flow patterns of:
Frontend → Nginx → Backend → Database → Backend → Nginx → Frontend

Show what modules and specific files are accessed, and explain what they do, when a client goes to the homepage of https://libronico.com.

## Detailed Homepage Request Flow

This section provides a specific walkthrough of how a request for the homepage (`/`) flows through the system, identifying the exact files, components, and data transfers involved at each step of the process.

### 1. Initial Request Handling

When a user visits `https://libronico.com/`:

1. **Nginx Processing**:
   - The request is received by the Nginx container listening on port 443
   - Nginx configuration in `nginx/conf.d/default.conf` processes the request
   - The request is proxied to the Next.js frontend container on port 3000

2. **Next.js Route Resolution**:
   - Next.js router maps the `/` path to `frontend/pages/index.tsx`
   - This is the main homepage component file

### 2. Homepage Component Structure

The `frontend/pages/index.tsx` file is the entry point for the homepage and contains:

1. **Page Component Structure**:
   - Imports required libraries: Next.js components, i18n translation hooks
   - Defines the main homepage functional component
   - Implements `getServerSideProps` for server-side data fetching

2. **Component Composition**:
   - Imports and renders multiple sub-components:
     - `GolfNewsHeadlines` from `frontend/components/GolfNewsHeadlines.tsx`
     - `RandomQuote` from `frontend/components/RandomQuote.tsx`
     - Various common UI components from `frontend/components/common/`

### 3. Server-Side Data Fetching

During server-side rendering:

1. **News Data Fetching**:
   - `getServerSideProps` in `index.tsx` calls the backend API
   - Request sent to `/api/news` endpoint
   - Backend route handler in `backend/src/routes/news.ts` processes this request
   - News data is fetched from external sources or database cache
   - Data is returned as props to the page component

2. **Authentication Check**:
   - Auth status is checked via `backend/src/routes/auth.ts`
   - JWT tokens are validated if present in cookies
   - User data is included in props if authenticated

### 4. Component Data Flows

Once the page begins rendering:

1. **GolfNewsHeadlines Component**:
   - Receives pre-fetched news data as props
   - Renders news headlines in a formatted list/grid
   - May perform additional client-side data fetching for updates

2. **RandomQuote Component**:
   - Makes a separate API call to `backend/src/routes/randomQuote.ts`
   - Backend fetches a random golf quote from the database
   - Component receives and displays the quote

3. **Conditional Components**:
   - If user is logged in (determined via auth check):
     - Personalized content is displayed using auth data
     - Recent activity may be shown from user data
   - If not logged in:
     - Login prompts and general information are displayed

### 5. Client-Side Interactions

After initial page load:

1. **Interactive Elements**:
   - Event handlers in the React components process user interactions
   - Client-side routing manages navigation without full page reloads
   - State updates trigger component re-renders

2. **Dynamic Data Updates**:
   - Components may use `useEffect` hooks to refresh data periodically
   - API calls to backend endpoints like `/api/news` fetch updated information
   - React state is updated with new data, causing components to re-render

### 6. Database Queries

The backend handles specific data needs:

1. **News Data**:
   - `backend/src/routes/news.ts` may query cache tables in PostgreSQL
   - Executes queries via the database connection in `backend/src/db.ts`
   - Transforms database results into the format expected by frontend

2. **Quote Data**:
   - `backend/src/routes/randomQuote.ts` queries the quotes table
   - Selects random entries using SQL's `RANDOM()` function
   - Returns a single formatted quote object

3. **User Data** (if authenticated):
   - `backend/src/routes/auth.ts` retrieves user profile information
   - May join multiple tables for complete user data
   - Returns user object with permissions and preferences

### 7. Response Composition and Delivery

The complete page is assembled and delivered:

1. **HTML Generation**:
   - Next.js renders the complete component tree to HTML
   - Injects all required script tags, style sheets, and data

2. **Hydration Data**:
   - Pre-fetched data is serialized and included as a script tag
   - Client-side JavaScript will use this for hydration without additional API calls

3. **Response Delivery**:
   - Completed HTML is sent back through Nginx
   - Additional headers like cache-control directives are applied
   - Final response is delivered to the client browser

### 8. Performance Optimizations

The homepage implements several performance optimizations:

1. **Image Optimization**:
   - Next.js Image component optimizes images for different viewports
   - Lazy loading defers off-screen images

2. **Code Splitting**:
   - JavaScript bundles are split by route
   - Only code needed for the homepage is loaded initially

3. **Caching Strategies**:
   - API responses include cache headers
   - Static assets are cached at the Nginx level
   - Database queries for common data may use internal caching

This detailed example illustrates how the VHS framework components work together specifically for the homepage request, showing the exact files and data flows involved in serving this particular page to users.

# Extensions

## Understanding File Extensions in the VHS Framework

This section explains the various file extensions used throughout the VHS application framework, their purposes, and how they relate to the JavaScript/TypeScript ecosystem.

### `.cjs` - CommonJS Module

- **Purpose**: Explicitly designates a file as a CommonJS module.
- **Usage in VHS**: 
  - Used for Node.js modules that need to be consumed by the backend Express server
  - Maintains compatibility with older Node.js codebases and libraries
- **Syntax Features**:
  - Uses `module.exports` and `require()` for module definition and importing
  - Example: `module.exports = { myFunction }; const otherModule = require('./other');`
- **When to Use**: 
  - When you need to ensure a file is interpreted as CommonJS regardless of the project settings
  - When interoperating with packages that expect CommonJS modules

### `.cts` - TypeScript CommonJS Module

- **Purpose**: TypeScript files that compile to CommonJS module format.
- **Usage in VHS**:
  - Combines TypeScript's type checking with CommonJS module format
  - Used when you need type safety but want the output in CommonJS format
- **Syntax Features**:
  - Uses TypeScript syntax with CommonJS module patterns
  - Allows for type definitions while targeting CommonJS output
- **When to Use**:
  - When you need type checking for code that must be compatible with CommonJS modules
  - When writing Node.js modules with TypeScript that need to be consumed in CommonJS environments

### `.map` - Source Map File

- **Purpose**: Maps compiled/minified code back to its original source.
- **Usage in VHS**:
  - Generated during the build process for both frontend and backend code
  - Enables debugging in the browser by linking minified production code to original source files
- **How It Works**:
  - Contains JSON that maps each line/character in the compiled code to its original position
  - Allows browsers and debugging tools to show original source even when running optimized code
- **Benefits**:
  - Makes debugging possible in production environments
  - Allows for accurate error reporting with line numbers from original source files
  - Not directly written by developers, but generated during compilation/bundling

### `.mjs` - ECMAScript Module

- **Purpose**: Explicitly designates a file as an ECMAScript module (ES module).
- **Usage in VHS**:
  - Used for modern JavaScript code that leverages ES modules
  - Enables tree-shaking and other optimization techniques
- **Syntax Features**:
  - Uses `import` and `export` statements: `import { something } from './module'; export const myFunction = () => {};`
  - Supports top-level await and other modern JavaScript features
- **When to Use**:
  - When creating modern JavaScript modules that benefit from ES module features
  - When you need to ensure a file is interpreted as an ES module regardless of project settings

### `.ts` - TypeScript File

- **Purpose**: Standard TypeScript file with type annotations.
- **Usage in VHS**:
  - Primary file format for backend code
  - Used for utility files, services, and business logic in both frontend and backend
- **Syntax Features**:
  - Adds static typing to JavaScript: `function add(a: number, b: number): number { return a + b; }`
  - Interfaces, type definitions, generics, and other advanced typing features
  - Compiles to regular JavaScript (.js) files
- **When to Use**:
  - For most application logic where type safety is beneficial
  - When you want better tooling, auto-completion, and error checking during development

### `.tsx` - TypeScript with JSX

- **Purpose**: TypeScript files that include JSX syntax for React components.
- **Usage in VHS**:
  - Primary file format for frontend React components
  - Used for all Next.js pages and components
- **Syntax Features**:
  - Combines TypeScript typing with JSX syntax for React
  - Example: `const Component: React.FC<Props> = ({ name }) => <div>{name}</div>;`
  - Enables type checking for component props, state, and events
- **When to Use**:
  - When creating React components with TypeScript
  - For all UI components and pages in the Next.js frontend

## How Extensions Affect the Build Process

The VHS build system processes these files differently:

1. **Development Flow**:
   - `.ts` and `.tsx` files are transpiled on-the-fly during development
   - Source maps (`.map` files) are generated automatically for debugging
   - TypeScript type-checking runs in a separate process for faster development

2. **Production Build**:
   - TypeScript files are compiled to JavaScript
   - Modules are bundled according to their format (CommonJS or ES Modules)
   - Code is minified and optimized
   - Source maps are generated for production debugging

3. **Module Resolution**:
   - The extension affects how the module is imported and resolved
   - Node.js and Next.js use different strategies for resolving imports based on the file extension
   - The TypeScript compiler uses the extension to determine the output format

Understanding these extensions is crucial for effective development in the VHS framework, as they determine how code is processed, compiled, and executed across the application's technology stack.


# Locations:

When adding a React component with a UI element, for example, a page that accepts uploaded images and will appear in the NavBar, three files will me affected:
```sh
./frontend/pages/upload-scorecard.tsx  # new
./frontend/components/GolfCardUploader.tsx # new
./frontend/components/common/Navbar.tsx #updated
```

The files that are updates when i18n is applies are:
```sh
./frontend/public/locales/zh/common.json
./frontend/public/locales/ru/common.json
./frontend/public/locales/he/common.json
./frontend/public/locales/es/common.json
./frontend/public/locales/en/common.json
./frontend/pages/upload-scorecard.tsx
./frontend/components/GolfCardUploader.tsx
./frontend/components/common/Navbar.tsx

```

Files that were affected when I made the logger a global:
```sh
./utils/logger.js
./frontend/pages/_app.tsx
```

# Utilities
## Global Logger
The logger can be used in tewo ways:

**Option 1: Using the Global Function**
• Advantage: Since the function is attached to the window object via _app.tsx, it’s available everywhere without needing to import anything explicitly.
• Disadvantage: Relying on a global function means it’s less obvious from reading a single file where the function comes from, which can make your code harder to maintain or test. It also "pollutes" the global namespace, potentially increasing the risk of name conflicts in larger projects.

```js
// In any React component file
import { useEffect } from 'react';

function MyComponent() {
  useEffect(() => {
    // Call the global logMessage function which was attached to window
    if (typeof window !== 'undefined' && window.logMessage) {
      window.logMessage('MyComponent has been mounted!');
    }
  }, []);

  return <div>Component Content</div>;
}

export default MyComponent;
```

**Option 2: Using the Utility Function**
• Advantage: Importing the logging function explicitly (from utils/logger.js) makes its dependency clear in each module. This improves modularity and code clarity and is easier to test because you can mock or replace the function in isolated tests.
• Disadvantage: This method requires you to add an import statement wherever you need functionality, which might feel slightly more verbose if you have many files that use logging.
```js
// AnotherComponent.tsx
import { logMessage } from '../utils/logger'; // Adjust the path if needed

function AnotherComponent() {
  const handleClick = () => {
    // Use the utility function to log a message
    logMessage('AnotherComponent button clicked!');
  };

  return (
    <div>
      <button onClick={handleClick}>Send Log</button>
    </div>
  );
}

export default AnotherComponent;

```