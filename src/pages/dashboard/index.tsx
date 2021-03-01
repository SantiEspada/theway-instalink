import dynamic from 'next/dynamic';
import { useEffect } from 'react';

import { useAuth } from '../../auth/hooks/useAuth';

export function DashboardIndex() {
  const { isLoggedIn, user } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      window.location.replace('/auth/login');
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) return null;

  return (
    <div>
      <h1>Dashboard</h1>
      <pre>
        <code>{JSON.stringify(user)}</code>
      </pre>
    </div>
  );
}

export default dynamic(() => Promise.resolve(DashboardIndex), {
  ssr: false,
});
