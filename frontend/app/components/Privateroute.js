"use client";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '../authContext';

const PrivateRoute = ({ children }) => {
  const router = useRouter();
  const { isLoggedIn, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push('/not-found'); // Redirect to not-found page if not logged in
    }
  }, [isLoggedIn, isLoading, router]);

  if (isLoading) {
    return <div>Loading...</div>; // Optionally, return a loading spinner while verifying
  }

  if (!isLoggedIn) {
    return null; // Return null while redirecting
  }

  return <>{children}</>; // Render children only if logged in
};

export default PrivateRoute;
