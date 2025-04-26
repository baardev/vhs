import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AdministrationPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Redirecting to admin dashboard...</p>
    </div>
  );
} 