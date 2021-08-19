import { useAuth } from '../../auth/hooks/useAuth';
import { useAuthGuard } from '../../auth/hooks/useAuthGuard';
import { copyToClipboard } from '../../common/utils/copyToClipboard';
import { withoutSsr } from '../../common/utils/withoutSsr';

export function BackstageIndex() {
  const { token, user } = useAuth();
  const { authGuard } = useAuthGuard();

  async function handleCopyToken() {
    try {
      await copyToClipboard(token);
      alert('Token copied to clipboard');
    } catch (err) {
      alert(
        'Token failed to be copied to clipboard. Check the console for more details.'
      );
      console.error(err);
    }
  }

  return authGuard(
    <div>
      <h1>Backstage</h1>
      <pre>
        <label>
          Auth token:
          <input
            type="text"
            name="token"
            value={token}
            readOnly
            onClick={handleCopyToken}
          />
        </label>
        <code>{JSON.stringify(user)}</code>
      </pre>
    </div>
  );
}

export default withoutSsr(BackstageIndex);
