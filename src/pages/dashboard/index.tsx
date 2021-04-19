import dynamic from 'next/dynamic';
import { useEffect } from 'react';

import { useAuth } from '../../auth/hooks/useAuth';
import { copyToClipboard } from '../../common/utils/copyToClipboard';

export function DashboardIndex() {
  const { isLoggedIn, token, user } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      window.location.replace('/auth/login');
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) return null;

  async function handleCopyToken() {
    try {
      await copyToClipboard(token);
      alert('Token copied to clipboard');
    } catch(err) {
      alert('Token failed to be copied to clipboard. Check the console for more details.');
      console.error(err);
    }
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <pre>
        <label>
          Auth token:
          <input type="text" name="token" value={token} readOnly onClick={handleCopyToken} />
        </label>
        <code>{JSON.stringify(user)}</code>
      </pre>
    </div>
  );
}

export default dynamic(() => Promise.resolve(DashboardIndex), {
  ssr: false,
});
