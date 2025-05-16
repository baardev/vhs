# App Router Migration Guide

## Introduction

This document outlines the steps needed to complete the migration from the Pages Router to App Router in Next.js.

The initial setup has been created, including:

- Basic directory structure with `/app` and `/app/[lang]`
- Root layout and language-specific layouts
- Internationalization (i18n) infrastructure
- Migration of certain key pages (Home, Login)

## Steps to Complete the Migration

### 1. Move Remaining Pages

For each page in `/pages`, you'll need to create a corresponding page in `/app/[lang]`:

- **Server Components (Default)**: Pages that don't need client-side interactivity
  
  ```tsx
  // app/[lang]/about/page.tsx
  import { getCommonDictionary } from '../dictionaries';
  
  export default async function AboutPage({ params: { lang } }) {
    const dict = await getCommonDictionary(lang);
    
    return (
      <div>
        <h1>{dict.about.title}</h1>
        {/* Page content */}
      </div>
    );
  }
  ```

- **Client Components**: For pages with interactivity (forms, state)
  
  ```tsx
  'use client';
  
  // app/[lang]/profile/page.tsx
  import { useState, useEffect } from 'react';
  import { getCommonDictionary } from '../dictionaries';
  
  export default function ProfilePage({ params: { lang } }) {
    const [dictionary, setDictionary] = useState(null);
    
    useEffect(() => {
      async function loadDictionary() {
        const dict = await getCommonDictionary(lang);
        setDictionary(dict);
      }
      loadDictionary();
    }, [lang]);
    
    if (!dictionary) return <div>Loading...</div>;
    
    return (
      <div>
        <h1>{dictionary.profile.title}</h1>
        {/* Interactive content */}
      </div>
    );
  }
  ```

### 2. Move API Routes

For each API route in `/pages/api`, create a corresponding route handler in `/app/api/[route]/route.ts`:

```typescript
// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  // Authentication logic
  
  return NextResponse.json({ token: '...', user: { /* ... */ } });
}
```

### 3. Update Components

Update components that rely on Pages Router features:

- Change `useRouter` imports from `next/router` to `next/navigation`
- 
Dynamic Route Parameters Explained:
  - A dynamic route parameter is a variable segment in your URL whose value can change. For example, in a file structure like "app/[lang]/profile/page.tsx", "[lang]" indicates a dynamic route parameter where "lang" can be "en", "fr", etc.
  - In Next.js App Router:
    • In server components (the default), dynamic parameters are automatically provided via the "params" prop. For instance, in "app/[lang]/profile/page.tsx", you can access the dynamic segment by destructuring the props: 
      function ProfilePage({ params: { lang } }) { ... }
    • In client components, you can import "useParams" from "next/navigation" to retrieve these values dynamically:
      import { useParams } from 'next/navigation';
      const { lang } = useParams();
  - To convert a static route to use dynamic parameters, rename the file or folder to include square brackets (e.g., change "app/lang/profile/page.tsx" to "app/[lang]/profile/page.tsx"). This tells Next.js that this segment is dynamic and its value will come from the URL.

- Update navigation links to include the language parameter. For example, if you are using anchor tags or another navigation mechanism, change the URL path to include the dynamic language segment, such as: href={`/${lang}/route`}

### 4. Add Support for Nested Routes

For nested routes or pages with layouts:

```
app/[lang]/dashboard/
  ├── layout.tsx         # Layout for all dashboard pages
  ├── page.tsx           # Dashboard home page
  ├── profile/
  │   └── page.tsx       # /dashboard/profile page
  └── settings/
      └── page.tsx       # /dashboard/settings page
```

### 5. Update Configuration

After migrating all pages and API routes:

1. Remove `appDir: true` from `next.config.mjs` (it's the default in Next.js 13+)
2. Update i18n configuration in `next.config.mjs` if needed
3. Test all routes to ensure correct functionality

### 6. Handle Data Fetching

Replace `getServerSideProps` and `getStaticProps` with new App Router data fetching methods:

- For server components, use async/await directly in the component
- For client components, use React's `useEffect` to fetch data on the client side
- For global data needs, consider React Context or state management libraries

### 7. Testing

Ensure all features work correctly after migration, especially:

- Authentication flows
- Dynamic routing
- Internationalization
- Form submissions
- SEO meta tags

## Resources

- [Official Next.js App Router Documentation](https://nextjs.org/docs/app)
- [Next.js App Router Migration Guide](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration)
- [Next.js App Router Internationalization](https://nextjs.org/docs/app/building-your-application/routing/internationalization) 