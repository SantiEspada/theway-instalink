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

  return isLoggedIn ? (
    <div>
      <pre>
        <code>{JSON.stringify(user)}</code>
      </pre>
    </div>
  ) : (
    <div>hmm</div>
  );
}

export default dynamic(() => Promise.resolve(DashboardIndex), {
  ssr: false,
});
